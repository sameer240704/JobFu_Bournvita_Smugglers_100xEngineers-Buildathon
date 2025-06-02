from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import os
from groq import Groq
from dotenv import load_dotenv
import uvicorn

# Load environment variables
load_dotenv()

app = FastAPI(title="Candidate Comparison API", version="1.0.0")

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Pydantic models
class ComparisonRequest(BaseModel):
    candidate_oids: List[str]
    comparison_focus: Optional[str] = "general"  # general, technical, experience, education

class CandidateProfile(BaseModel):
    candidate_oid: str
    candidate_name: str
    parameters: List[Dict[str, Any]]  # List of parameter evaluations

class ComparisonResponse(BaseModel):
    candidate_profiles: List[CandidateProfile]
    parameter_names: List[str]  # Standardized parameter names for table headers
    overall_summary: str
    recommendation: Optional[str] = None

# Global variable to store candidates data
candidates_data = {}

# Standardized parameters for consistent comparison
STANDARD_PARAMETERS = [
    "Technical Skills Depth",
    "Programming Languages Proficiency", 
    "Project Complexity & Impact",
    "Professional Experience Quality",
    "Technology Stack Breadth",
    "Problem Solving Ability",
    "Educational Foundation",
    "Industry Exposure",
    "Communication & Leadership",
    "Career Growth Potential"
]

def load_candidates_data():
    """Load candidates data from JSON file"""
    global candidates_data
    try:
        with open('full_candidate.json', 'r') as file:
            data = json.load(file)
            # Convert to dictionary with OID as key for faster lookup
            if isinstance(data, list):
                candidates_data = {candidate['_id']['$oid']: candidate for candidate in data}
            else:
                candidates_data = {data['_id']['$oid']: data}
            print(f"Loaded {len(candidates_data)} candidates")
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Candidates data file not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid JSON in candidates data file")

def extract_candidate_summary(candidate: Dict) -> str:
    """Extract key information from candidate for AI analysis"""
    summary = f"""
    Name: {candidate.get('candidate_name', 'N/A')}
    Location: {candidate.get('contact_information', {}).get('location', 'N/A')}
    
    Education:
    """
    
    for edu in candidate.get('education', []):
        summary += f"- {edu.get('degree', 'N/A')} from {edu.get('institution', 'N/A')}, GPA: {edu.get('gpa_cgpa', 'N/A')}\n"
        if edu.get('additional_info'):
            summary += f"  Coursework: {edu.get('additional_info', '')}\n"
    
    summary += "\nExperience:\n"
    for exp in candidate.get('experience', []):
        summary += f"- {exp.get('position', 'N/A')} at {exp.get('company', 'N/A')} ({exp.get('duration', 'N/A')})\n"
        summary += f"  {exp.get('description', 'N/A')}\n"
        if exp.get('technologies_used'):
            summary += f"  Technologies: {', '.join(exp.get('technologies_used', []))}\n"
    
    summary += "\nProjects:\n"
    for project in candidate.get('projects', [])[:3]:  # Limit to first 3 projects
        summary += f"- {project.get('name', 'N/A')}: {project.get('description', 'N/A')}\n"
        if project.get('technologies'):
            summary += f"  Technologies: {', '.join(project.get('technologies', []))}\n"
    
    summary += "\nSkills:\n"
    skills = candidate.get('skills', {})
    for category, skill_list in skills.items():
        if isinstance(skill_list, list) and skill_list:
            summary += f"- {category}: {', '.join(skill_list)}\n"
    
    return summary

def analyze_single_candidate(candidate: Dict, focus: str = "general") -> List[Dict[str, Any]]:
    """Analyze a single candidate and return standardized parameter evaluations"""
    
    candidate_summary = extract_candidate_summary(candidate)
    
    focus_descriptions = {
        "general": "overall suitability for software development roles",
        "technical": "technical skills, project complexity, and technology expertise", 
        "experience": "work experience, internships, and professional achievements",
        "education": "educational background, academic performance, and relevant coursework"
    }
    
    prompt = f"""
    You are an expert technical recruiter. Analyze this candidate based on {focus_descriptions.get(focus, focus)}.
    
    CANDIDATE DETAILS:
    {candidate_summary}
    
    Evaluate this candidate on these EXACT 10 parameters (use these exact parameter names):
    1. Technical Skills Depth
    2. Programming Languages Proficiency
    3. Project Complexity & Impact
    4. Professional Experience Quality
    5. Technology Stack Breadth
    6. Problem Solving Ability
    7. Educational Foundation
    8. Industry Exposure
    9. Communication & Leadership
    10. Career Growth Potential
    
    For each parameter, provide:
    - A score out of 10 (integer)
    - A brief 1-2 sentence explanation
    - Key highlights or concerns
    
    IMPORTANT: Return ONLY a valid JSON array with exactly 10 objects, one for each parameter in the exact order listed above.
    
    Format:
    [
        {{
            "parameter": "Technical Skills Depth",
            "score": 8,
            "explanation": "Strong foundation in AI/ML with practical implementation experience.",
            "highlights": "Experience with Python, TensorFlow, and real-world AI projects"
        }},
        {{
            "parameter": "Programming Languages Proficiency", 
            "score": 7,
            "explanation": "Proficient in multiple languages with focus on Python and JavaScript.",
            "highlights": "Python, JavaScript, HTML/CSS demonstrated through projects"
        }}
    ]
    
    Ensure all 10 parameters are evaluated in the exact order specified.
    """
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama-3.1-8b-instant",
            temperature=0.3,
            max_tokens=1500
        )
        
        response_text = chat_completion.choices[0].message.content.strip()
        
        # Try to extract JSON array from the response
        try:
            # Find JSON array in the response
            start_idx = response_text.find('[')
            end_idx = response_text.rfind(']') + 1
            if start_idx != -1 and end_idx != 0:
                json_str = response_text[start_idx:end_idx]
                parameters = json.loads(json_str)
                
                # Ensure we have exactly 10 parameters
                if len(parameters) == 10:
                    return parameters
                else:
                    raise ValueError("Incorrect number of parameters")
            else:
                raise ValueError("No JSON array found")
                
        except Exception as parse_error:
            print(f"JSON parsing failed: {parse_error}")
            # Fallback: create default parameter structure
            return create_default_parameters(candidate)
            
    except Exception as e:
        print(f"AI analysis failed: {str(e)}")
        return create_default_parameters(candidate)

def create_default_parameters(candidate: Dict) -> List[Dict[str, Any]]:
    """Create default parameter evaluations when AI analysis fails"""
    default_params = []
    
    for param_name in STANDARD_PARAMETERS:
        default_params.append({
            "parameter": param_name,
            "score": 5,
            "explanation": f"Analysis needed for {param_name.lower()}",
            "highlights": "Manual review required"
        })
    
    return default_params

def generate_overall_summary(candidate_profiles: List[CandidateProfile]) -> str:
    """Generate an overall comparison summary"""
    
    candidates_info = []
    for profile in candidate_profiles:
        avg_score = sum([param.get('score', 0) for param in profile.parameters]) / len(profile.parameters)
        candidates_info.append(f"{profile.candidate_name}: {avg_score:.1f}/10 average")
    
    summary_prompt = f"""
    Provide a brief 2-3 sentence summary comparing these candidates:
    {'; '.join(candidates_info)}
    
    Focus on key differentiators and overall recommendations.
    """
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user", 
                    "content": summary_prompt
                }
            ],
            model="llama-3.1-8b-instant",
            temperature=0.3,
            max_tokens=300
        )
        
        return chat_completion.choices[0].message.content.strip()
        
    except Exception as e:
        return f"Candidates analyzed successfully. Average scores: {'; '.join(candidates_info)}"

@app.on_event("startup")
async def startup_event():
    """Load candidates data on startup"""
    load_candidates_data()

@app.get("/")
async def root():
    return {"message": "Candidate Comparison API", "total_candidates": len(candidates_data)}

@app.get("/candidates")
async def get_all_candidates():
    """Get all candidate names and OIDs"""
    candidate_list = []
    for oid, candidate in candidates_data.items():
        candidate_list.append({
            "oid": oid,
            "name": candidate.get('candidate_name', 'Unknown'),
            "location": candidate.get('contact_information', {}).get('location', 'N/A')
        })
    return {"candidates": candidate_list, "total": len(candidate_list)}

@app.get("/candidate/{oid}")
async def get_candidate(oid: str):
    """Get specific candidate details"""
    if oid not in candidates_data:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidates_data[oid]

@app.post("/compare", response_model=ComparisonResponse)
async def compare_candidates(request: ComparisonRequest):
    """Compare multiple candidates using AI - returns individual profiles with same parameters"""
    
    if len(request.candidate_oids) < 2:
        raise HTTPException(status_code=400, detail="At least 2 candidates required for comparison")
    
    if len(request.candidate_oids) > 6:
        raise HTTPException(status_code=400, detail="Maximum 6 candidates can be compared at once")
    
    # Validate all OIDs exist
    missing_oids = [oid for oid in request.candidate_oids if oid not in candidates_data]
    if missing_oids:
        raise HTTPException(status_code=404, detail=f"Candidates not found: {missing_oids}")
    
    # Analyze each candidate individually
    candidate_profiles = []
    
    for oid in request.candidate_oids:
        candidate = candidates_data[oid]
        candidate_name = candidate.get('candidate_name', 'Unknown')
        
        # Get AI analysis for this candidate
        parameters = analyze_single_candidate(candidate, request.comparison_focus)
        
        candidate_profiles.append(CandidateProfile(
            candidate_oid=oid,
            candidate_name=candidate_name,
            parameters=parameters
        ))
    
    # Generate overall summary
    overall_summary = generate_overall_summary(candidate_profiles)
    
    # Determine recommendation (highest average score)
    best_candidate = None
    highest_avg = 0
    
    for profile in candidate_profiles:
        avg_score = sum([param.get('score', 0) for param in profile.parameters]) / len(profile.parameters)
        if avg_score > highest_avg:
            highest_avg = avg_score
            best_candidate = profile.candidate_name
    
    recommendation = f"Recommended: {best_candidate} (Average Score: {highest_avg:.1f}/10)" if best_candidate else None
    
    return ComparisonResponse(
        candidate_profiles=candidate_profiles,
        parameter_names=STANDARD_PARAMETERS,
        overall_summary=overall_summary,
        recommendation=recommendation
    )

@app.post("/quick-compare")
async def quick_compare():
    """Interactive endpoint that guides through candidate selection"""
    candidate_list = []
    for oid, candidate in candidates_data.items():
        candidate_list.append({
            "oid": oid,
            "name": candidate.get('candidate_name', 'Unknown'),
            "location": candidate.get('contact_information', {}).get('location', 'N/A'),
            "experience_count": len(candidate.get('experience', [])),
            "project_count": len(candidate.get('projects', []))
        })
    
    return {
        "message": "Select candidates for comparison",
        "available_candidates": candidate_list,
        "standard_parameters": STANDARD_PARAMETERS,
        "instructions": {
            "step1": "Choose 2-6 candidates from the list above",
            "step2": "Send POST request to /compare with candidate_oids",
            "step3": "Optional: specify comparison_focus (general, technical, experience, education)"
        },
        "example_request": {
            "candidate_oids": ["oid1", "oid2", "oid3"],
            "comparison_focus": "technical"
        },
        "response_format": {
            "description": "Each candidate gets evaluated on the same 10 parameters",
            "parameters": STANDARD_PARAMETERS
        }
    }

@app.get("/parameters")
async def get_standard_parameters():
    """Get the list of standard parameters used for comparison"""
    return {
        "standard_parameters": STANDARD_PARAMETERS,
        "description": "These 10 parameters are used consistently for all candidate evaluations",
        "usage": "Perfect for creating comparison tables in frontend applications"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "candidates_loaded": len(candidates_data),
        "groq_api_configured": bool(os.getenv("GROQ_API_KEY")),
        "standard_parameters_count": len(STANDARD_PARAMETERS)
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)