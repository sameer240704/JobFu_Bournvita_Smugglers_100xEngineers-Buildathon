import os
import json
import random
from groq import Groq
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
load_dotenv()

def generate_ai_summary(candidate_data):
    """Generate a 5-point AI summary using Groq API with varied structures"""
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    
    # Define varied sentence structures and approaches for each point
    prompt_variations = [
        # Variation 1 - Direct approach
        """
        Analyze this candidate profile and create exactly 5 distinct summary points. Each point must be a single sentence with different structures:

        1. Work Experience: Start with their most impressive role or achievement
        2. Projects: Highlight their most notable project or technical accomplishment  
        3. Skills: Focus on their strongest technical or professional capabilities
        4. Domain Expertise: Identify their industry knowledge or specialization
        5. Candidate Strength: Conclude with their overall value proposition

        Requirements:
        - Each point must be exactly ONE sentence
        - Vary sentence beginnings (avoid repetitive "Has/Worked/Experienced" starts)
        - Use different sentence structures (simple, compound, descriptive)
        - Be specific and impactful
        - Return as clean JSON with keys: point1, point2, point3, point4, point5
        """,
        
        # Variation 2 - Achievement-focused
        """
        Create a 5-point candidate summary with exactly one sentence per point. Use varied sentence structures:

        1. Career Highlight: Lead with their most significant professional achievement
        2. Technical Contribution: Showcase their best project or technical work
        3. Core Competencies: Emphasize their key skills or expertise areas
        4. Industry Focus: Describe their domain knowledge or sector experience
        5. Overall Assessment: Summarize what makes them a strong candidate

        Guidelines:
        - Single sentence per point only
        - Mix sentence types: declarative, descriptive, action-oriented
        - Avoid repetitive phrasing patterns
        - Focus on concrete achievements and capabilities
        - Format as JSON: point1, point2, point3, point4, point5
        """,
        
        # Variation 3 - Story-driven
        """
        Develop 5 summary points about this candidate, each as one impactful sentence with different styles:

        1. Professional Journey: Begin with their career progression or key role
        2. Innovation/Projects: Feature their most interesting technical work
        3. Skill Portfolio: Present their technical or professional strengths  
        4. Sector Knowledge: Cover their industry understanding or niche expertise
        5. Candidate Value: End with their unique selling point or strength

        Standards:
        - Exactly one sentence per point
        - Diversify sentence openings and structures
        - Avoid formulaic language patterns
        - Emphasize measurable achievements where possible
        - Output clean JSON format: point1, point2, point3, point4, point5
        """
    ]
    
    # Randomly select a prompt variation
    selected_prompt = random.choice(prompt_variations)
    
    # Add the candidate data to the prompt
    full_prompt = f"""
    {selected_prompt}
    
    Candidate Data:
    {json.dumps(candidate_data, indent=2)}
    """
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system", 
                    "content": "You are an expert HR analyst who creates concise, varied, and impactful candidate summaries. Always follow the exact format requested and ensure each point is a single, well-crafted sentence with different structures."
                },
                {
                    "role": "user",
                    "content": full_prompt
                }
            ],
            model="llama3-8b-8192",
            temperature=0.7,  # Increased for more variation
            max_tokens=1024,
            response_format={"type": "json_object"}
        )
        
        summary = json.loads(chat_completion.choices[0].message.content)
        
        # Validate that we have exactly 5 points
        if len(summary) != 5:
            print(f"Warning: Expected 5 points, got {len(summary)}")
        
        # Ensure all points are present
        required_keys = ['point1', 'point2', 'point3', 'point4', 'point5']
        for key in required_keys:
            if key not in summary:
                print(f"Warning: Missing {key} in summary")
        
        return summary
        
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        return None
    except Exception as e:
        print(f"Error generating summary: {e}")
        return None

def analyze_profile_depth(candidate_data):
    """Analyze the depth and breadth of candidate profile data"""
    analysis = {
        "work_experience": [],
        "projects": [],
        "skills": [],
        "domains": [],
        "education": [],
        "certifications": [],
        "other_sections": []
    }
    
    # Recursively search through the data structure
    def extract_info(data, path=""):
        if isinstance(data, dict):
            for key, value in data.items():
                current_path = f"{path}.{key}" if path else key
                key_lower = key.lower()
                
                # Categorize based on key names
                if any(term in key_lower for term in ['experience', 'work', 'employment', 'job', 'career']):
                    analysis["work_experience"].append(current_path)
                elif any(term in key_lower for term in ['project', 'portfolio', 'work']):
                    analysis["projects"].append(current_path)
                elif any(term in key_lower for term in ['skill', 'technical', 'programming', 'language', 'framework']):
                    analysis["skills"].append(current_path)
                elif any(term in key_lower for term in ['domain', 'industry', 'sector', 'field']):
                    analysis["domains"].append(current_path)
                elif any(term in key_lower for term in ['education', 'degree', 'university', 'college']):
                    analysis["education"].append(current_path)
                elif any(term in key_lower for term in ['certification', 'certificate', 'credential']):
                    analysis["certifications"].append(current_path)
                else:
                    analysis["other_sections"].append(current_path)
                
                extract_info(value, current_path)
        elif isinstance(data, list):
            for i, item in enumerate(data):
                extract_info(item, f"{path}[{i}]")
    
    extract_info(candidate_data)
    return analysis

def process_candidate_files():
    """Process all candidate files and generate summaries"""
    # Create output directory if it doesn't exist
    output_dir = "candidate_summaries"
    os.makedirs(output_dir, exist_ok=True)
    
    # Also create analysis directory
    analysis_dir = "profile_analysis"
    os.makedirs(analysis_dir, exist_ok=True)
    
    # Process each JSON file in the candidate_data directory
    input_dir = "candidate_data"
    
    if not os.path.exists(input_dir):
        print(f"Input directory '{input_dir}' not found. Please create it and add candidate JSON files.")
        return
    
    processed_count = 0
    
    for filename in os.listdir(input_dir):
        if filename.endswith(".json"):
            input_path = os.path.join(input_dir, filename)
            output_path = os.path.join(output_dir, f"summary_{filename}")
            analysis_path = os.path.join(analysis_dir, f"analysis_{filename}")
            
            print(f"Processing: {filename}")
            
            try:
                # Load candidate data
                with open(input_path, 'r', encoding='utf-8') as f:
                    candidate_data = json.load(f)
                
                # Analyze profile structure
                profile_analysis = analyze_profile_depth(candidate_data)
                
                # Generate AI summary
                summary = generate_ai_summary(candidate_data)
                
                if summary:
                    # Create comprehensive output
                    output_data = {
                        "candidate_file": filename,
                        "summary": summary,
                        "profile_analysis": profile_analysis,
                        "processing_notes": {
                            "total_sections_found": sum(len(v) for v in profile_analysis.values()),
                            "data_richness": "high" if sum(len(v) for v in profile_analysis.values()) > 10 else "medium" if sum(len(v) for v in profile_analysis.values()) > 5 else "low"
                        }
                    }
                    
                    # Save the comprehensive summary
                    with open(output_path, 'w', encoding='utf-8') as f:
                        json.dump(output_data, f, indent=2, ensure_ascii=False)
                    
                    # Save just the 5-point summary for easy access
                    summary_only_path = os.path.join(output_dir, f"clean_summary_{filename}")
                    with open(summary_only_path, 'w', encoding='utf-8') as f:
                        json.dump(summary, f, indent=2, ensure_ascii=False)
                    
                    print(f"✓ Saved summary: {output_path}")
                    print(f"✓ Saved clean summary: {summary_only_path}")
                    processed_count += 1
                else:
                    print(f"✗ Failed to generate summary for {filename}")
                    
            except json.JSONDecodeError as e:
                print(f"✗ JSON parsing error in {filename}: {e}")
            except Exception as e:
                print(f"✗ Error processing {filename}: {e}")
    
    print(f"\nProcessing complete! Successfully processed {processed_count} files.")
    print(f"Summaries saved in: {output_dir}")
    print(f"Analysis saved in: {analysis_dir}")

if __name__ == "__main__":
    # Check if API key is available
    if not os.environ.get("GROQ_API_KEY"):
        print("❌ Error: GROQ_API_KEY not found in environment variables")
        print("Please set it in your .env file or environment variables")
        print("\nExample .env file:")
        print("GROQ_API_KEY=your_api_key_here")
    else:
        print("🚀 Starting candidate summary generation...")
        process_candidate_files()