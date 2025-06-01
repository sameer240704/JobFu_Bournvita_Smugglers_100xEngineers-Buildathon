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
        # Neo4j configuration - hardcoded as requested
        self.neo4j_uri = "neo4j+s://4e1be7d1.databases.neo4j.io"
        self.neo4j_username = "neo4j"
        self.neo4j_password = "JmNzZQpC5fn-McE111oF-axC9q1dsw6B9TTuRTBl3j8"
        self.neo4j_database = "neo4j"
        self.driver = GraphDatabase.driver(
            self.neo4j_uri,
            auth=(self.neo4j_username, self.neo4j_password)
        )
        
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

    def fuzzy_match_institution(self, institution_name: str, search_term: str) -> bool:
        """Check if search term matches institution name with fuzzy logic"""
        # Convert both to lowercase for comparison
        institution_lower = institution_name.lower()
        search_lower = search_term.lower()
        
        # Direct substring match
        if search_lower in institution_lower:
            return True
        
        # Split institution name into parts and check each part
        institution_parts = re.split(r'[^a-zA-Z0-9]', institution_lower)
        search_parts = re.split(r'[^a-zA-Z0-9]', search_lower)
        
        # Check if all search parts appear in institution parts
        if all(any(sp in ip for ip in institution_parts) for sp in search_parts if sp):
            return True
        
        # Handle common abbreviations and variations
        abbreviation_map = {
            'dj sanghvi': ['dwarkadas', 'sanghvi'],
            'stanford': ['stanford university'],
            'mit': ['massachusetts institute of technology'],
            'iit': ['indian institute of technology'],
            'iim': ['indian institute of management'],
            'bits': ['birla institute of technology'],
            'nit': ['national institute of technology'],
            'vjti': ['veermata jijabai technological institute'],
            'coep': ['college of engineering pune'],
            'spit': ['sardar patel institute of technology'],
            'kjsce': ['k j somaiya college of engineering'],
            'ves': ['vivekanand education society'],
        }
        
        # Check if search term is a known abbreviation
        for abbrev, full_names in abbreviation_map.items():
            if search_lower == abbrev:
                return any(name.lower() in institution_lower for name in full_names)
            elif any(name.lower() in search_lower for name in full_names):
                return abbrev in institution_lower or any(name.lower() in institution_lower for name in full_names)
        
        # Check if institution contains the abbreviation when searching for full name
        for abbrev, full_names in abbreviation_map.items():
            if any(name.lower() in search_lower for name in full_names):
                return abbrev in institution_lower
        
        return False

    def fuzzy_match_company(self, company_name: str, search_term: str) -> bool:
        """Check if search term matches company name with fuzzy logic"""
        company_parts = re.split(r'[^a-zA-Z0-9]', company_name.lower())
        search_parts = re.split(r'[^a-zA-Z0-9]', search_term.lower())
        
        # Check if all search parts appear in company parts
        return all(any(sp in cp for cp in company_parts) for sp in search_parts)

    def get_all_locations(self) -> List[str]:
        """Get all locations from the database"""
        with self.driver.session(database=self.neo4j_database) as session:
            result = session.run("MATCH (l:Location) RETURN l.name AS location")
            return [record["location"] for record in result]

    def get_all_institutions(self) -> List[str]:
        """Get all educational institutions from the database"""
        with self.driver.session(database=self.neo4j_database) as session:
            # Try different possible relationship names for education
            possible_queries = [
                "MATCH (i:Institution) RETURN i.name AS institution",
                "MATCH (i:University) RETURN i.name AS institution", 
                "MATCH (i:College) RETURN i.name AS institution",
                "MATCH (i:School) RETURN i.name AS institution",
                "MATCH (i:Education) RETURN i.name AS institution"
            ]
            
            institutions = []
            for query in possible_queries:
                try:
                    result = session.run(query)
                    institutions.extend([record["institution"] for record in result])
                except:
                    continue
            
            return list(set(institutions))  # Remove duplicates

    def query_llm_for_cypher(self, natural_language_query: str) -> Dict[str, Any]:
        """Use LLM to convert natural language query to structured parameters"""
        # Get all locations and institutions from database to provide context to LLM
        all_locations = self.get_all_locations()
        all_institutions = self.get_all_institutions()
        
        prompt = f"""
        You are an expert at converting natural language queries about candidates into structured parameters for a Neo4j database.
        The database contains candidate information with skills, technologies, locations, work experience, and educational background.

        Available locations in the database include (but are not limited to):
        {', '.join(all_locations[:20])}{'...' if len(all_locations) > 20 else ''}

        Available educational institutions in the database include (but are not limited to):
        {', '.join(all_institutions[:20])}{'...' if len(all_institutions) > 20 else ''}

        The output should always be a JSON object with these fields:
        - "skills": An array of relevant technical skills/technologies
        - "location": A single location (empty string if no location specified)
        - "companies": An array of company names or partial names
        - "institutions": An array of educational institution names or partial names

        Important rules for company matching:
        - If a company is named "@infiheal healthtech", matches should include "infiheal", "healthtech", or "infiheal healthtech"
        - If a company is named "FMX Proptech Pvt. Ltd.", matches should include "fmx", "proptech", or "fmx proptech"

        Important rules for institution matching:
        - "stanford" should match "Stanford University"
        - "dj sanghvi" should match "Dwarkadas J. Sanghvi College of Engineering"
        - "mit" should match "Massachusetts Institute of Technology"
        - "iit" should match any "Indian Institute of Technology"
        - Common abbreviations should be recognized and expanded

        Important rules for location matching:
        - You should use your geographical knowledge to match locations
        - "rawalpindi" should match "pakistan" and vice versa
        - Country names should match their cities (e.g., "australia" should match "melbourne")
        - Be smart about recognizing cities, states, and countries

        Example queries and outputs:
        
        Input: "Python developers from stanford with AWS experience"
        Output: {{"skills": ["Python", "AWS"], "location": "", "companies": [], "institutions": ["stanford"]}}
        
        Input: "Frontend engineers at fmx proptech who studied at dj sanghvi"
        Output: {{"skills": ["React", "Frontend"], "location": "", "companies": ["fmx proptech"], "institutions": ["dj sanghvi"]}}
        
        Input: "AI engineers from iit in india"
        Output: {{"skills": ["AI", "Machine Learning"], "location": "india", "companies": [], "institutions": ["iit"]}}
        
        Input: "candidates who studied from mit"
        Output: {{"skills": [], "location": "", "companies": [], "institutions": ["mit"]}}
        
        Input: "LangChain developers from stanford university in USA"
        Output: {{"skills": ["LangChain"], "location": "USA", "companies": [], "institutions": ["stanford university"]}}
        
        Input: "candidates from australia who worked at google"
        Output: {{"skills": [], "location": "australia", "companies": ["google"], "institutions": []}}
        
        Now process this query:
        Input: "{natural_language_query}"
        Output: 
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
            return json.loads(response)
        
        except Exception as e:
            print(f"Error querying LLM: {e}")
            return {"skills": [], "location": "", "companies": [], "institutions": []}

    def search_candidates(self, natural_language_query: str) -> List[Dict[str, Any]]:
        """Search candidates using natural language query"""
        # First get structured parameters from LLM
        query_params = self.query_llm_for_cypher(natural_language_query)
        print(f"Query parameters: {query_params}")  # Debug output
        
        with self.driver.session(database=self.neo4j_database) as session:
            # Query for companies first if specified
            company_filters = []
            if query_params.get('companies'):
                company_result = session.run("""
                    MATCH (co:Company)
                    RETURN co.name AS company_name
                """)
                
                all_companies = [record['company_name'] for record in company_result]
                
                # Find companies that fuzzy match any of the search terms
                matched_companies = [
                    company for company in all_companies
                    if any(
                        self.fuzzy_match_company(company, search_term)
                        for search_term in query_params['companies']
                    )
                ]
                
                if matched_companies:
                    company_filters = matched_companies

            # Query for institutions if specified
            institution_filters = []
            if query_params.get('institutions'):
                # Try different possible node labels for educational institutions
                institution_queries = [
                    "MATCH (i:Institution) RETURN i.name AS institution_name",
                    "MATCH (i:University) RETURN i.name AS institution_name",
                    "MATCH (i:College) RETURN i.name AS institution_name",
                    "MATCH (i:School) RETURN i.name AS institution_name",
                    "MATCH (i:Education) RETURN i.name AS institution_name"
                ]
                
                all_institutions = []
                for inst_query in institution_queries:
                    try:
                        institution_result = session.run(inst_query)
                        all_institutions.extend([record['institution_name'] for record in institution_result])
                    except:
                        continue
                
                # Remove duplicates
                all_institutions = list(set(all_institutions))
                
                # Find institutions that fuzzy match any of the search terms
                matched_institutions = [
                    institution for institution in all_institutions
                    if any(
                        self.fuzzy_match_institution(institution, search_term)
                        for search_term in query_params['institutions']
                    )
                ]
                
                if matched_institutions:
                    institution_filters = matched_institutions
            
            # Prepare location filter - convert to list for consistency
            location_filter = query_params.get('location', '')
            location_filters = [location_filter] if location_filter else []
            
            # Build the main candidate query with education support
            cypher_query = """
                MATCH (c:Candidate)
                WHERE (
                    size($location_filters) = 0 OR 
                    EXISTS {
                        MATCH (c)-[:LOCATED_IN]->(l:Location)
                        WHERE ANY(loc_filter IN $location_filters WHERE 
                            l.name =~ ('(?i).*' + loc_filter + '.*') OR
                            loc_filter =~ ('(?i).*' + l.name + '.*')
                        )
                    }
                )
                AND (
                    size($company_filters) = 0 OR
                    EXISTS {
                        MATCH (c)-[:WORKED_AT]->(co:Company)
                        WHERE co.name IN $company_filters
                    }
                )
                AND (
                    size($institution_filters) = 0 OR
                    EXISTS {
                        MATCH (c)-[r]->(i)
                        WHERE (i:Institution OR i:University OR i:College OR i:School OR i:Education)
                        AND i.name IN $institution_filters
                        AND (type(r) IN ['STUDIED_AT', 'GRADUATED_FROM', 'ATTENDED', 'EDUCATED_AT'] OR r.type CONTAINS 'EDUCAT')
                    }
                )
                OPTIONAL MATCH (c)-[:HAS_SKILL]->(s:Skill)
                OPTIONAL MATCH (c)-[:HAS_EXPERIENCE_WITH]->(t:Technology)
                WITH c, 
                     COLLECT(DISTINCT s.name) AS skills,
                     COLLECT(DISTINCT t.name) AS technologies,
                     [(c)-[:LOCATED_IN]->(l) | l.name] AS locations,
                     [(c)-[:WORKED_AT]->(co) | co.name] AS companies,
                     [(c)-[r]->(i) WHERE (i:Institution OR i:University OR i:College OR i:School OR i:Education) | i.name] AS institutions
                WHERE size($skills) = 0 OR 
                      ANY(skill IN $skills WHERE skill IN skills + technologies)
                RETURN c.candidate_id AS candidate_id,
                       c.name AS name, 
                       c.email AS email,
                       c.phone AS phone,
                       c.linkedin AS linkedin,
                       c.github AS github,
                       c.description AS description,
                       locations,
                       companies,
                       institutions,
                       skills + technologies AS all_skills,
                       [(c)-[:WORKED_AT]->(co) | {company: co.name}] AS experience,
                       [(c)-[:WORKED_ON]->(p) | {project: p.name, description: p.description}] AS projects
                ORDER BY 
                    CASE 
                        WHEN size($institution_filters) > 0 AND ANY(institution IN institutions WHERE institution IN $institution_filters) THEN 0
                        WHEN size($company_filters) > 0 AND ANY(company IN companies WHERE company IN $company_filters) THEN 1
                        ELSE 2
                    END,
                    size([skill IN $skills WHERE skill IN skills + technologies]) DESC, 
                    c.name
                LIMIT 50
            """
            
            result = session.run(cypher_query, 
                skills=query_params.get('skills', []), 
                location_filters=location_filters,
                company_filters=company_filters,
                institution_filters=institution_filters)
            
            return [dict(record) for record in result]

    def format_candidate_results(self, candidates: List[Dict[str, Any]]) -> str:
        """Format candidate results for display"""
        if not candidates:
            return "No candidates found matching your criteria."
        
        result = []
        for candidate in candidates:
            candidate_str = f"Candidate ID: {candidate['candidate_id']}\n"
            candidate_str += f"Name: {candidate['name']}\n"
            
            candidate_str += "-" * 50
            result.append(candidate_str)
        
        return "\n\n".join(result)

    def interactive_search(self):
        """Run an interactive search session"""
        print("Candidate Search System (using Llama3 and Neo4j)")
        print("Enhanced with Education/Institution Support")
        print("Type 'exit' to quit\n")
        print("Example queries:")
        print("- 'Python developers from Stanford'")
        print("- 'AI engineers who studied at IIT'")
        print("- 'Frontend developers from DJ Sanghvi working at Google'")
        print("- 'candidates from MIT with machine learning experience'")
        
        while True:
            try:
                query = input("\nEnter your search query: ")
                if query.lower() == 'exit':
                    break
                
                print("\nProcessing your query...")
                
                # Get candidates
                candidates = self.search_candidates(query)
                
                # Format and display results
                print(f"\nFound {len(candidates)} candidates:")
                print(self.format_candidate_results(candidates))
                
            except KeyboardInterrupt:
                print("\nExiting...")
                break
            except Exception as e:
                print(f"\nError: {e}")
                import traceback
                traceback.print_exc()

if __name__ == "__main__":
    manager = Neo4jCandidateManager()
    
    try:
        # Run interactive search
        manager.interactive_search()
    
    finally:
        manager.close()