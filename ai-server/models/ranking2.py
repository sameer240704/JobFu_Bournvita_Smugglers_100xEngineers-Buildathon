import os
from dotenv import load_dotenv
from neo4j import GraphDatabase
from groq import Groq
import json
from typing import List, Dict, Any
import re

# Load environment variables
load_dotenv()

class Neo4jCandidateManager:
    def __init__(self):
        # Neo4j configuration
        self.neo4j_uri = "neo4j+s://4e1be7d1.databases.neo4j.io"
        self.neo4j_username = "neo4j"
        self.neo4j_password = "JmNzZQpC5fn-McE111oF-axC9q1dsw6B9TTuRTBl3j8"
        self.neo4j_database = "neo4j"
        self.driver = GraphDatabase.driver(
            self.neo4j_uri,
            auth=(self.neo4j_username, self.neo4j_password))
        
        # Groq configuration
        self.groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.llm_model = "llama3-8b-8192"

    def close(self):
        self.driver.close()

    def normalize_text(self, text: str) -> str:
        """Normalize text for comparison"""
        if not text:
            return ""
        return re.sub(r'[^a-z0-9]', '', text.lower())

    def fuzzy_match(self, source_text: str, search_term: str) -> bool:
        """Check if search term matches with fuzzy logic"""
        source = source_text.lower()
        search = search_term.lower()
        
        if search in source:
            return True
        
        source_parts = re.split(r'[^a-zA-Z0-9]', source)
        search_parts = re.split(r'[^a-zA-Z0-9]', search)
        
        return all(any(sp in part for part in source_parts) for sp in search_parts)

    def get_all_locations(self) -> List[str]:
        """Get all locations from the database"""
        with self.driver.session(database=self.neo4j_database) as session:
            result = session.run("MATCH (l:Location) RETURN l.name AS location")
            return [record["location"] for record in result]

    def get_all_institutions(self) -> List[str]:
        """Get all educational institutions from the database"""
        with self.driver.session(database=self.neo4j_database) as session:
            possible_labels = ["Institution", "University", "College", "School", "Education"]
            institutions = set()
            
            for label in possible_labels:
                try:
                    result = session.run(f"MATCH (i:{label}) RETURN i.name AS institution")
                    institutions.update(record["institution"] for record in result)
                except Exception as e:
                    # Skip if label doesn't exist
                    continue
            
            return list(institutions)

    def query_llm_for_cypher(self, natural_language_query: str) -> Dict[str, Any]:
        """Use LLM to convert natural language query to structured parameters"""
        all_locations = self.get_all_locations()
        all_institutions = self.get_all_institutions()
        
        prompt = f"""
        Analyze this job candidate search query and extract the following parameters:
        - Required skills/technologies
        - Preferred location
        - Target companies
        - Target educational institutions
        
        Available locations: {', '.join(all_locations[:20])}{'...' if len(all_locations) > 20 else ''}
        Available institutions: {', '.join(all_institutions[:20])}{'...' if len(all_institutions) > 20 else ''}
        
        Return JSON with these fields:
        {{
            "skills": ["list", "of", "skills"],
            "location": "preferred location",
            "companies": ["list", "of", "companies"],
            "institutions": ["list", "of", "institutions"],
            "keywords": ["other", "important", "keywords"]
        }}
        
        Examples:
        - "Python developers from Stanford with AWS experience" => 
          {{
            "skills": ["Python", "AWS"],
            "location": "",
            "companies": [],
            "institutions": ["Stanford"],
            "keywords": []
          }}
        - "AI researchers who won hackathons" =>
          {{
            "skills": ["AI"],
            "location": "",
            "companies": [],
            "institutions": [],
            "keywords": ["hackathon", "winner"]
          }}
          
        Query: "{natural_language_query}"
        """
        
        try:
            chat_completion = self.groq_client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=self.llm_model,
                temperature=0.3,
                max_tokens=256,
                response_format={"type": "json_object"}
            )
            
            response = chat_completion.choices[0].message.content
            if isinstance(response, str):
                return json.loads(response)
            return response
        except Exception as e:
            print(f"Error querying LLM: {e}")
            return {
                "skills": [], 
                "location": "", 
                "companies": [], 
                "institutions": [], 
                "keywords": []
            }

    def get_full_candidate_profile(self, candidate_id: str) -> Dict[str, Any]:
        """Get complete profile for a candidate including all relevant information"""
        with self.driver.session(database=self.neo4j_database) as session:
            query = """
                MATCH (c:Candidate {candidate_id: $candidate_id})
                OPTIONAL MATCH (c)-[:HAS_SKILL]->(s:Skill)
                OPTIONAL MATCH (c)-[:HAS_EXPERIENCE_WITH]->(t:Technology)
                OPTIONAL MATCH (c)-[:WORKED_AT]->(co:Company)
                OPTIONAL MATCH (c)-[:WORKED_ON]->(p:Project)
                OPTIONAL MATCH (c)-[:PUBLISHED]->(pub:Publication)
                OPTIONAL MATCH (c)-[:ACHIEVED]->(a:Achievement)
                OPTIONAL MATCH (c)-[:COMPLETED]->(course:Course)
                OPTIONAL MATCH (c)-[:LOCATED_IN]->(l:Location)
                OPTIONAL MATCH (c)-[r]->(edu)
                WHERE (edu:Institution OR edu:University OR edu:College OR edu:School OR edu:Education)
                RETURN 
                    c.candidate_id AS candidate_id,
                    c.name AS name,
                    c.description AS description,
                    COLLECT(DISTINCT s.name) + COLLECT(DISTINCT t.name) AS skills,
                    COLLECT(DISTINCT co.name) AS companies,
                    COLLECT(DISTINCT p.name) AS projects,
                    COLLECT(DISTINCT pub.title) AS publications,
                    COLLECT(DISTINCT a.title) AS achievements,
                    COLLECT(DISTINCT course.name) AS courses,
                    COLLECT(DISTINCT l.name) AS locations,
                    COLLECT(DISTINCT edu.name) AS education,
                    [(c)-[:WORKED_ON]->(p) | {name: p.name, description: p.description}] AS project_details,
                    [(c)-[:ACHIEVED]->(a) | {title: a.title, description: a.description}] AS achievement_details
            """
            result = session.run(query, candidate_id=candidate_id)
            record = result.single()
            return record.data() if record else {}

    def rank_candidates(self, candidates: List[Dict[str, Any]], query_params: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Rank candidates based on their fit for the query using LLM"""
        if not candidates:
            return []
        
        # Prepare candidate profiles for ranking
        candidate_profiles = []
        for candidate in candidates:
            full_profile = self.get_full_candidate_profile(candidate['candidate_id'])
            if not full_profile:
                continue
                
            candidate_profiles.append({
                "id": candidate['candidate_id'],
                "name": candidate['name'],
                "profile": full_profile
            })
        
        if not candidate_profiles:
            return []
        
        # Prepare ranking prompt for LLM
        prompt = f"""
        Analyze these candidates and rank them based on how well they match this search:
        
        Search Parameters:
        - Required Skills: {query_params.get('skills', [])}
        - Preferred Location: {query_params.get('location', '')}
        - Target Companies: {query_params.get('companies', [])}
        - Target Institutions: {query_params.get('institutions', [])}
        - Keywords: {query_params.get('keywords', [])}
        
        Ranking Criteria:
        1. Skill matches (weight: 40%)
        2. Experience at target companies (weight: 20%)
        3. Education at target institutions (weight: 15%)
        4. Location match (weight: 10%)
        5. Projects, achievements, and keywords in profile (weight: 15%)
        
        For each candidate, analyze their entire profile including:
        - Skills and technologies
        - Work experience
        - Education
        - Projects and their descriptions
        - Achievements and awards
        - Profile description
        - Any other relevant information
        
        Return JSON with candidate IDs as keys and their scores (1-100) as values.
        
        Candidates:
        {json.dumps(candidate_profiles, indent=2)}
        
        Return only the JSON scores, nothing else.
        """
        
        try:
            chat_completion = self.groq_client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=self.llm_model,
                temperature=0.1,
                max_tokens=1024,
                response_format={"type": "json_object"}
            )
            
            response = chat_completion.choices[0].message.content
            scores = json.loads(response) if isinstance(response, str) else response
            
            # Add scores to candidates and sort
            for candidate in candidates:
                candidate['match_score'] = scores.get(candidate['candidate_id'], 0)
                candidate['match_details'] = self.get_match_details(candidate, query_params)
            
            return sorted(candidates, key=lambda x: x['match_score'], reverse=True)
        
        except Exception as e:
            print(f"Error ranking candidates: {e}")
            return candidates

    def get_match_details(self, candidate: Dict[str, Any], query_params: Dict[str, Any]) -> str:
        """Generate human-readable match details"""
        details = []
        
        # Check skills
        candidate_skills = set(candidate.get('skills', []))
        query_skills = set(query_params.get('skills', []))
        matched_skills = candidate_skills.intersection(query_skills)
        if matched_skills:
            details.append(f"Skills: {', '.join(matched_skills)}")
        
        # Check companies
        candidate_companies = set(candidate.get('companies', []))
        query_companies = set(query_params.get('companies', []))
        for qc in query_companies:
            for cc in candidate_companies:
                if self.fuzzy_match(cc, qc):
                    details.append(f"Company: {cc}")
                    break
        
        # Check institutions
        candidate_institutions = set(candidate.get('education', []))
        query_institutions = set(query_params.get('institutions', []))
        for qi in query_institutions:
            for ci in candidate_institutions:
                if self.fuzzy_match(ci, qi):
                    details.append(f"Institution: {ci}")
                    break
        
        # Check keywords in description and projects
        description = candidate.get('description', '').lower()
        projects = ' '.join([p.get('description', '') for p in candidate.get('project_details', [])]).lower()
        achievements = ' '.join([a.get('title', '') + ' ' + a.get('description', '') for a in candidate.get('achievement_details', [])]).lower()
        full_text = ' '.join([description, projects, achievements])
        
        for keyword in query_params.get('keywords', []):
            if keyword.lower() in full_text:
                details.append(f"Keyword: {keyword}")
        
        return ' | '.join(details) if details else "Partial match"

    def search_candidates(self, natural_language_query: str) -> Dict[str, Any]:
        """Search candidates using natural language query"""
        print(f"\nSearch Query: {natural_language_query}")
        
        # First get structured parameters from LLM
        query_params = self.query_llm_for_cypher(natural_language_query)
        print("\nQuery Parameters:")
        print(json.dumps(query_params, indent=2))
        
        with self.driver.session(database=self.neo4j_database) as session:
            # Build base query to find eligible candidates
            cypher_query = """
                MATCH (c:Candidate)
                OPTIONAL MATCH (c)-[:HAS_SKILL]->(s:Skill)
                OPTIONAL MATCH (c)-[:HAS_EXPERIENCE_WITH]->(t:Technology)
                OPTIONAL MATCH (c)-[:WORKED_AT]->(co:Company)
                OPTIONAL MATCH (c)-[r]->(edu)
                WHERE (edu:Institution OR edu:University OR edu:College OR edu:School OR edu:Education)
                OPTIONAL MATCH (c)-[:LOCATED_IN]->(loc:Location)
                WITH c, 
                     COLLECT(DISTINCT s.name) + COLLECT(DISTINCT t.name) AS skills,
                     COLLECT(DISTINCT co.name) AS companies,
                     COLLECT(DISTINCT edu.name) AS institutions,
                     COLLECT(DISTINCT loc.name) AS locations
                WHERE (
                    (size($skills) = 0 OR 
                    ANY(skill IN $skills WHERE 
                        ANY(cs IN skills WHERE cs =~ ('(?i).*' + skill + '.*')))
                    OR
                    (size($companies) = 0 OR 
                    ANY(company IN $companies WHERE 
                        ANY(cc IN companies WHERE cc =~ ('(?i).*' + company + '.*'))))
                    OR
                    (size($institutions) = 0 OR 
                    ANY(institution IN $institutions WHERE 
                        ANY(ci IN institutions WHERE ci =~ ('(?i).*' + institution + '.*'))))
                    OR
                    (size($location) = 0 OR 
                    ANY(location IN $location WHERE 
                        ANY(cl IN locations WHERE cl =~ ('(?i).*' + location + '.*'))))
                RETURN DISTINCT c.candidate_id AS candidate_id,
                       c.name AS name
                LIMIT 100
            """
            
            result = session.run(cypher_query, 
                skills=query_params.get('skills', []),
                companies=query_params.get('companies', []),
                institutions=query_params.get('institutions', []),
                location=[query_params.get('location', '')] if query_params.get('location') else [])
            
            eligible_candidates = [dict(record) for record in result]
            print(f"\nFound {len(eligible_candidates)} eligible candidates")
            
            # Get full profiles for ranking
            candidates_with_profiles = []
            for candidate in eligible_candidates:
                profile = self.get_full_candidate_profile(candidate['candidate_id'])
                if profile:
                    candidates_with_profiles.append({
                        'candidate_id': candidate['candidate_id'],
                        'name': candidate['name'],
                        **profile
                    })
            
            # Rank candidates
            ranked_candidates = self.rank_candidates(candidates_with_profiles, query_params)
            
            return {
                'query': natural_language_query,
                'query_params': query_params,
                'eligible_candidates': eligible_candidates,
                'ranked_candidates': ranked_candidates
            }

    def format_results(self, search_results: Dict[str, Any]) -> str:
        """Format search results for display"""
        output = []
        
        output.append(f"\nSearch Query: {search_results['query']}")
        output.append("\nQuery Parameters:")
        output.append(json.dumps(search_results['query_params'], indent=2))
        
        output.append(f"\nEligible Candidates ({len(search_results['eligible_candidates'])}):")
        for candidate in search_results['eligible_candidates']:
            output.append(f"- {candidate['name']} (ID: {candidate['candidate_id']})")
        
        output.append("\nRanked Candidates (by match score):")
        for candidate in search_results.get('ranked_candidates', []):
            output.append(f"\n{candidate['name']} (Score: {candidate.get('match_score', 'N/A')})")
            output.append(f"Match Details: {candidate.get('match_details', '')}")
            
            # Display key information
            if candidate.get('skills'):
                skills = ', '.join(candidate['skills'][:10])
                output.append(f"Skills: {skills}{'...' if len(candidate['skills']) > 10 else ''}")
            
            if candidate.get('companies'):
                companies = ', '.join(candidate['companies'][:3])
                output.append(f"Companies: {companies}{'...' if len(candidate['companies']) > 3 else ''}")
            
            if candidate.get('education'):
                institutions = ', '.join(candidate['education'][:2])
                output.append(f"Education: {institutions}{'...' if len(candidate['education']) > 2 else ''}")
            
            if candidate.get('project_details'):
                projects = ', '.join([p['name'] for p in candidate.get('project_details', [])][:2])
                output.append(f"Projects: {projects}{'...' if len(candidate['project_details']) > 2 else ''}")
            
            if candidate.get('achievement_details'):
                achievements = ', '.join([a['title'] for a in candidate.get('achievement_details', [])][:2])
                output.append(f"Achievements: {achievements}{'...' if len(candidate['achievement_details']) > 2 else ''}")
            
            output.append("-" * 50)
        
        return "\n".join(output)

    def interactive_search(self):
        """Run an interactive search session"""
        print("Candidate Search System (using Llama3 and Neo4j)")
        print("Enhanced with Comprehensive Profile Analysis")
        print("Type 'exit' to quit\n")
        print("Example queries:")
        print("- 'computational finance experience'")
        print("- 'AI research with hackathon wins'")
        print("- 'LangChain developers from top universities'")
        print("- 'FinTech hackathon winners with Python skills'")
        
        while True:
            try:
                query = input("\nEnter your search query: ")
                if query.lower() == 'exit':
                    break
                
                print("\nProcessing your query...")
                
                # Get and rank candidates
                search_results = self.search_candidates(query)
                
                # Format and display results
                print(self.format_results(search_results))
                
            except KeyboardInterrupt:
                print("\nExiting...")
                break
            except Exception as e:
                print(f"\nError: {e}")

if __name__ == "__main__":
    manager = Neo4jCandidateManager()
    
    try:
        manager.interactive_search()
    finally:
        manager.close()