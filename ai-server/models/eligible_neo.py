from neo4j import GraphDatabase
import json
from typing import List, Dict, Any
import re

class Neo4jCandidateDatabase:
    def __init__(self):
        self.uri = "neo4j+s://4e1be7d1.databases.neo4j.io"
        self.username = "neo4j"
        self.password = "JmNzZQpC5fn-McE111oF-axC9q1dsw6B9TTuRTBl3j8"
        self.database = "neo4j"
        self.driver = GraphDatabase.driver(self.uri, auth=(self.username, self.password))
        
        # Location mapping for standardizing locations
        self.location_mapping = {
            'mumbai': 'Mumbai, Maharashtra, India',
            'new york': 'New York, NY, USA',
            'melbourne': 'Melbourne, Victoria, Australia',
            'adelaide': 'Adelaide, South Australia, Australia',
            'bangalore': 'Bangalore, Karnataka, India',
            'pune': 'Pune, Maharashtra, India',
            'troy': 'Troy, NY, USA',
            'são paulo': 'São Paulo, SP, Brazil',
            'bangkok': 'Bangkok, Bangkok, Thailand',
            'remote': 'Remote, Remote, Remote',
            'bengaluru': 'Bangalore, Karnataka, India',
            'new delhi': 'New Delhi, Delhi, India',
            'delhi': 'New Delhi, Delhi, India',
            'chennai': 'Chennai, Tamil Nadu, India',
            'hyderabad': 'Hyderabad, Telangana, India',
            'kolkata': 'Kolkata, West Bengal, India',
            'ahmedabad': 'Ahmedabad, Gujarat, India',
            'jaipur': 'Jaipur, Rajasthan, India',
            'lucknow': 'Lucknow, Uttar Pradesh, India',
            'kanpur': 'Kanpur, Uttar Pradesh, India',
            'nagpur': 'Nagpur, Maharashtra, India',
            'indore': 'Indore, Madhya Pradesh, India',
            'thane': 'Thane, Maharashtra, India',
            'bhopal': 'Bhopal, Madhya Pradesh, India',
            'visakhapatnam': 'Visakhapatnam, Andhra Pradesh, India',
            'pimpri chinchwad': 'Pimpri Chinchwad, Maharashtra, India',
            'patna': 'Patna, Bihar, India',
            'vadodara': 'Vadodara, Gujarat, India',
            'ghaziabad': 'Ghaziabad, Uttar Pradesh, India',
            'ludhiana': 'Ludhiana, Punjab, India',
            'coimbatore': 'Coimbatore, Tamil Nadu, India',
            'kochi': 'Kochi, Kerala, India',
            'thiruvananthapuram': 'Thiruvananthapuram, Kerala, India',
            'sydney': 'Sydney, New South Wales, Australia',
            'brisbane': 'Brisbane, Queensland, Australia',
            'perth': 'Perth, Western Australia, Australia',
            'darwin': 'Darwin, Northern Territory, Australia',
            'hobart': 'Hobart, Tasmania, Australia',
            'canberra': 'Canberra, ACT, Australia',
            'los angeles': 'Los Angeles, CA, USA',
            'chicago': 'Chicago, IL, USA',
            'houston': 'Houston, TX, USA',
            'philadelphia': 'Philadelphia, PA, USA',
            'phoenix': 'Phoenix, AZ, USA',
            'san antonio': 'San Antonio, TX, USA',
            'san diego': 'San Diego, CA, USA',
            'dallas': 'Dallas, TX, USA',
            'san jose': 'San Jose, CA, USA',
            'austin': 'Austin, TX, USA',
            'jacksonville': 'Jacksonville, FL, USA',
            'san francisco': 'San Francisco, CA, USA',
            'columbus': 'Columbus, OH, USA',
            'fort worth': 'Fort Worth, TX, USA',
            'charlotte': 'Charlotte, NC, USA',
            'seattle': 'Seattle, WA, USA',
            'denver': 'Denver, CO, USA',
            'washington': 'Washington, DC, USA',
            'boston': 'Boston, MA, USA',
            'rio de janeiro': 'Rio de Janeiro, RJ, Brazil',
            'brasília': 'Brasília, DF, Brazil',
            'salvador': 'Salvador, BA, Brazil',
            'fortaleza': 'Fortaleza, CE, Brazil',
            'belo horizonte': 'Belo Horizonte, MG, Brazil',
            'manaus': 'Manaus, AM, Brazil',
            'curitiba': 'Curitiba, PR, Brazil',
            'recife': 'Recife, PE, Brazil',
            'porto alegre': 'Porto Alegre, RS, Brazil',
            'chiang mai': 'Chiang Mai, Chiang Mai, Thailand',
            'phuket': 'Phuket, Phuket, Thailand',
            'pattaya': 'Pattaya, Chonburi, Thailand',
            'hat yai': 'Hat Yai, Songkhla, Thailand'
        }

    def close(self):
        self.driver.close()

    def clear_database(self):
        with self.driver.session(database=self.database) as session:
            session.run("MATCH (n) DETACH DELETE n")

    def create_constraints(self):
        with self.driver.session(database=self.database) as session:
            # Create uniqueness constraints
            session.run("CREATE CONSTRAINT candidate_id IF NOT EXISTS FOR (c:Candidate) REQUIRE c.candidate_id IS UNIQUE")
            session.run("CREATE CONSTRAINT skill_name IF NOT EXISTS FOR (s:Skill) REQUIRE s.name IS UNIQUE")
            session.run("CREATE CONSTRAINT location_name IF NOT EXISTS FOR (l:Location) REQUIRE l.name IS UNIQUE")
            session.run("CREATE CONSTRAINT project_name IF NOT EXISTS FOR (p:Project) REQUIRE p.name IS UNIQUE")
            session.run("CREATE CONSTRAINT company_name IF NOT EXISTS FOR (c:Company) REQUIRE c.name IS UNIQUE")
            session.run("CREATE CONSTRAINT institution_name IF NOT EXISTS FOR (i:Institution) REQUIRE i.name IS UNIQUE")
            session.run("CREATE CONSTRAINT technology_name IF NOT EXISTS FOR (t:Technology) REQUIRE t.name IS UNIQUE")

    def parse_and_load_candidates(self, json_file_path: str):
        with open(json_file_path, 'r', encoding='utf-8') as file:
            candidates_data = json.load(file)
        
        with self.driver.session(database=self.database) as session:
            for candidate in candidates_data:
                self._create_candidate_node(session, candidate)
    
    def _safe_value(self, value):
        """Return value if not None/empty, otherwise return empty string"""
        if value is None or value == "":
            return ""
        return str(value).strip()
    
    def _safe_list(self, value):
        """Return list if not None, otherwise return empty list"""
        if value is None:
            return []
        if isinstance(value, list):
            return value
        return []
    
    def _safe_dict(self, value):
        """Return dict if not None, otherwise return empty dict"""
        if value is None:
            return {}
        if isinstance(value, dict):
            return value
        return {}
    
    def _standardize_location(self, location_str: str) -> str:
        """Standardize location to 'City, State, Country' format"""
        if not location_str:
            return None
        
        location_clean = str(location_str).strip().lower()
        
        # Direct mapping lookup
        if location_clean in self.location_mapping:
            return self.location_mapping[location_clean]
        
        # Try to parse existing location strings
        location_parts = [part.strip() for part in str(location_str).split(',')]
        
        if len(location_parts) >= 3:
            # Already in City, State, Country format
            return ', '.join([part.strip() for part in location_parts[:3]])
        elif len(location_parts) == 2:
            # Might be City, Country - try to add state/region
            city = location_parts[0].strip().lower()
            country = location_parts[1].strip().lower()
            
            # Look up in mapping
            city_key = city.lower()
            if city_key in self.location_mapping:
                return self.location_mapping[city_key]
            
            # Default handling for two-part locations
            if 'india' in country or 'in' == country:
                return f"{location_parts[0].strip()}, Unknown State, India"
            elif 'usa' in country or 'us' == country or 'united states' in country:
                return f"{location_parts[0].strip()}, Unknown State, USA"
            elif 'australia' in country or 'au' == country:
                return f"{location_parts[0].strip()}, Unknown State, Australia"
            elif 'brazil' in country or 'br' == country:
                return f"{location_parts[0].strip()}, Unknown State, Brazil"
            elif 'thailand' in country or 'th' == country:
                return f"{location_parts[0].strip()}, Unknown Province, Thailand"
            else:
                return f"{location_parts[0].strip()}, Unknown State, {location_parts[1].strip()}"
        else:
            # Single part - try to match with mapping
            single_location = location_clean.strip()
            if single_location in self.location_mapping:
                return self.location_mapping[single_location]
            
            # Try partial matching
            for key, value in self.location_mapping.items():
                if key in single_location or single_location in key:
                    return value
            
            # Default fallback
            return f"{location_str.strip()}, Unknown State, Unknown Country"
    
    def _create_candidate_node(self, session, candidate: Dict[str, Any]):
        # Create Candidate node
        candidate_id = candidate.get('_id', {}).get('$oid', '')
        if not candidate_id:
            print(f"Warning: Candidate without ID found, skipping...")
            return
            
        candidate_name = candidate.get('candidate_name', 'Unknown')
        
        # Create or update Candidate node
        contact_info = self._safe_dict(candidate.get('contact_information'))
        
        session.run("""
            MERGE (c:Candidate {candidate_id: $candidate_id})
            SET c.name = $name,
                c.email = $email,
                c.phone = $phone,
                c.linkedin = $linkedin,
                c.github = $github,
                c.description = $description
        """, 
        candidate_id=candidate_id,
        name=candidate_name,
        email=self._safe_value(contact_info.get('email')),
        phone=self._safe_value(contact_info.get('phone')),
        linkedin=self._safe_value(contact_info.get('linkedin')),
        github=self._safe_value(contact_info.get('github')),
        description=self._safe_value(candidate.get('candidate_description')))
        
        # Process location with standardized format
        location = contact_info.get('location')
        if location:
            standardized_location = self._standardize_location(location)
            if standardized_location:
                # Parse city, state, country from standardized location
                location_parts = [part.strip() for part in standardized_location.split(',')]
                city = location_parts[0] if len(location_parts) > 0 else ""
                state = location_parts[1] if len(location_parts) > 1 else ""
                country = location_parts[2] if len(location_parts) > 2 else ""
                
                session.run("""
                    MERGE (l:Location {name: $location})
                    SET l.city = $city,
                        l.state = $state,
                        l.country = $country
                    MERGE (c:Candidate {candidate_id: $candidate_id})
                    MERGE (c)-[:LOCATED_IN]->(l)
                """, 
                location=standardized_location, 
                city=city,
                state=state,
                country=country,
                candidate_id=candidate_id)
        
        # Process education
        education_list = self._safe_list(candidate.get('education'))
        for edu in education_list:
            edu_dict = self._safe_dict(edu)
            institution = edu_dict.get('institution')
            if institution:
                # Create relationship with safe values
                session.run("""
                    MERGE (i:Institution {name: $institution})
                    MERGE (c:Candidate {candidate_id: $candidate_id})
                    MERGE (c)-[r:STUDIED_AT]->(i)
                    SET r.degree = $degree,
                        r.duration = $duration,
                        r.gpa = $gpa
                """, 
                institution=institution, 
                candidate_id=candidate_id,
                degree=self._safe_value(edu_dict.get('degree')),
                duration=self._safe_value(edu_dict.get('duration')),
                gpa=self._safe_value(edu_dict.get('gpa_cgpa')))
        
        # Process experience
        experience_list = self._safe_list(candidate.get('experience'))
        for exp in experience_list:
            exp_dict = self._safe_dict(exp)
            company = exp_dict.get('company')
            if company:
                # Create company and work relationship
                session.run("""
                    MERGE (co:Company {name: $company})
                    MERGE (c:Candidate {candidate_id: $candidate_id})
                    MERGE (c)-[r:WORKED_AT]->(co)
                    SET r.position = $position,
                        r.duration = $duration,
                        r.description = $description
                """, 
                company=company, 
                candidate_id=candidate_id,
                position=self._safe_value(exp_dict.get('position')),
                duration=self._safe_value(exp_dict.get('duration')),
                description=self._safe_value(exp_dict.get('description')))
                
                # Connect technologies used to candidate
                technologies_used = self._safe_list(exp_dict.get('technologies_used'))
                for tech in technologies_used:
                    if tech and str(tech).strip():
                        tech_clean = str(tech).strip()
                        session.run("""
                            MERGE (t:Technology {name: $tech})
                            MERGE (c:Candidate {candidate_id: $candidate_id})
                            MERGE (c)-[:HAS_EXPERIENCE_WITH {context: 'work', company: $company}]->(t)
                        """, 
                        tech=tech_clean, 
                        candidate_id=candidate_id,
                        company=company)
        
        # Process projects
        projects_list = self._safe_list(candidate.get('projects'))
        for proj in projects_list:
            proj_dict = self._safe_dict(proj)
            project_name = proj_dict.get('name')
            if project_name:
                # Create project node first
                session.run("""
                    MERGE (p:Project {name: $project_name})
                    SET p.description = $description
                """, 
                project_name=project_name,
                description=self._safe_value(proj_dict.get('description')))
                
                # Create relationship between candidate and project
                session.run("""
                    MERGE (c:Candidate {candidate_id: $candidate_id})
                    MERGE (p:Project {name: $project_name})
                    MERGE (c)-[r:WORKED_ON]->(p)
                    SET r.duration = $duration,
                        r.achievements = $achievements
                """, 
                candidate_id=candidate_id,
                project_name=project_name,
                duration=self._safe_value(proj_dict.get('duration')),
                achievements=self._safe_value(proj_dict.get('achievements')))
                
                # Connect project technologies
                project_technologies = self._safe_list(proj_dict.get('technologies'))
                for tech in project_technologies:
                    if tech and str(tech).strip():
                        tech_clean = str(tech).strip()
                        session.run("""
                            MERGE (t:Technology {name: $tech})
                            MERGE (p:Project {name: $project_name})
                            MERGE (c:Candidate {candidate_id: $candidate_id})
                            MERGE (p)-[:USES_TECH]->(t)
                            MERGE (c)-[:HAS_EXPERIENCE_WITH {context: 'project', project: $project_name}]->(t)
                        """, 
                        tech=tech_clean, 
                        project_name=project_name,
                        candidate_id=candidate_id)
        
        # Process skills - Fixed approach to avoid constraint conflicts
        skills_dict = self._safe_dict(candidate.get('skills'))
        tech_skills = self._safe_dict(skills_dict.get('technical_skills'))
        
        # Helper function to create skill with category
        def create_skill_with_category(session, skill_name: str, category: str, candidate_id: str):
            if skill_name and str(skill_name).strip():
                skill_clean = str(skill_name).strip()
                session.run("""
                    MERGE (s:Skill {name: $skill_name})
                    SET s.category = $category
                    WITH s
                    MERGE (c:Candidate {candidate_id: $candidate_id})
                    MERGE (c)-[:HAS_SKILL]->(s)
                """, 
                skill_name=skill_clean, 
                category=category,
                candidate_id=candidate_id)
        
        # Programming Languages
        programming_languages = self._safe_list(tech_skills.get('programming_languages'))
        for lang in programming_languages:
            create_skill_with_category(session, lang, 'Programming', candidate_id)
        
        # Frameworks/Libraries
        frameworks_libraries = self._safe_list(tech_skills.get('frameworks_libraries'))
        for framework in frameworks_libraries:
            create_skill_with_category(session, framework, 'Framework', candidate_id)
        
        # Databases
        databases = self._safe_list(tech_skills.get('databases'))
        for db in databases:
            create_skill_with_category(session, db, 'Database', candidate_id)
        
        # Tools/Software
        tools_software = self._safe_list(tech_skills.get('tools_software'))
        for tool in tools_software:
            create_skill_with_category(session, tool, 'Tool', candidate_id)
        
        # Cloud Platforms
        cloud_platforms = self._safe_list(tech_skills.get('cloud_platforms'))
        for cloud in cloud_platforms:
            create_skill_with_category(session, cloud, 'Cloud', candidate_id)
        
        # Data Science
        data_science = self._safe_list(tech_skills.get('data_science'))
        for ds in data_science:
            create_skill_with_category(session, ds, 'DataScience', candidate_id)
        
        # Other Technical Skills
        other_technical = self._safe_list(tech_skills.get('other_technical'))
        for other in other_technical:
            create_skill_with_category(session, other, 'Technical', candidate_id)
        
        # Soft Skills
        soft_skills = self._safe_list(skills_dict.get('soft_skills'))
        for soft in soft_skills:
            create_skill_with_category(session, soft, 'Soft', candidate_id)

    def query_candidates(self, query_text: str) -> List[Dict[str, Any]]:
        """Query candidates based on natural language text"""
        # Parse the query to extract skills and locations
        parsed_query = self._parse_query(query_text)
        
        # Build and execute Cypher query
        with self.driver.session(database=self.database) as session:
            # Updated query to handle both Skills and Technologies with location filtering
            if parsed_query['location']:
                # If specific location is requested, filter by it
                location_filter = """
                    AND EXISTS {
                        MATCH (c)-[:LOCATED_IN]->(l:Location)
                        WHERE l.name CONTAINS $location_filter OR 
                              l.city CONTAINS $location_filter OR
                              l.state CONTAINS $location_filter OR
                              l.country CONTAINS $location_filter
                    }
                """
            else:
                location_filter = ""
            
            query = f"""
                MATCH (c:Candidate)
                WHERE 1=1 {location_filter}
                OPTIONAL MATCH (c)-[:HAS_SKILL]->(s:Skill)
                OPTIONAL MATCH (c)-[:HAS_EXPERIENCE_WITH]->(t:Technology)
                WITH c, 
                     COLLECT(DISTINCT s.name) AS skills,
                     COLLECT(DISTINCT t.name) AS technologies,
                     [(c)-[:LOCATED_IN]->(l) | l.name] AS locations
                WHERE size($skills) = 0 OR 
                      ANY(skill IN $skills WHERE skill IN skills + technologies)
                RETURN c.name AS name, 
                       c.email AS email,
                       c.phone AS phone,
                       c.linkedin AS linkedin,
                       c.github AS github,
                       locations,
                       skills + technologies AS all_skills,
                       [(c)-[:WORKED_AT]->(co) | {{company: co.name}}] AS experience,
                       [(c)-[:WORKED_ON]->(p) | {{project: p.name, description: p.description}}] AS projects
                ORDER BY size([skill IN $skills WHERE skill IN skills + technologies]) DESC, c.name
                LIMIT 50
            """
            
            result = session.run(query, 
                skills=parsed_query['skills'], 
                location_filter=parsed_query['location'] if parsed_query['location'] else "")
            
            return [dict(record) for record in result]
    
    def _parse_query(self, query_text: str) -> Dict[str, Any]:
        """Parse natural language query to extract skills and location"""
        # This is a simplified version - you might want to use NLP for more complex parsing
        query_text = query_text.lower()
        
        # Known locations - updated to work with full location format
        locations = {
            'mumbai': 'Mumbai',
            'new york': 'New York',
            'melbourne': 'Melbourne',
            'adelaide': 'Adelaide',
            'bangalore': 'Bangalore',
            'bengaluru': 'Bangalore',
            'pune': 'Pune',
            'troy': 'Troy',
            'são paulo': 'São Paulo',
            'bangkok': 'Bangkok',
            'remote': 'Remote',
            'australia': 'Australia',
            'usa': 'USA',
            'united states': 'USA',
            'brazil': 'Brazil',
            'india': 'India',
            'thailand': 'Thailand',
            'maharashtra': 'Maharashtra',
            'karnataka': 'Karnataka',
            'delhi': 'Delhi',
            'tamil nadu': 'Tamil Nadu',
            'telangana': 'Telangana',
            'west bengal': 'West Bengal',
            'gujarat': 'Gujarat',
            'rajasthan': 'Rajasthan',
            'uttar pradesh': 'Uttar Pradesh',
            'madhya pradesh': 'Madhya Pradesh',
            'andhra pradesh': 'Andhra Pradesh',
            'bihar': 'Bihar',
            'punjab': 'Punjab',
            'kerala': 'Kerala'
        }
        
        # Known skill categories
        skill_categories = {
            'frontend': ['HTML', 'CSS', 'JavaScript', 'React', 'Angular', 'Vue', 'Bootstrap', 'Tailwind CSS'],
            'backend': ['Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'Java', 'Python', 'C#', 'PHP'],
            'database': ['MySQL', 'PostgreSQL', 'MongoDB', 'SQL', 'Oracle', 'Firebase', 'Redis'],
            'ai': ['AI', 'Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn'],
            'ml': ['Machine Learning', 'ML', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy'],
            'gen-ai': ['Generative AI', 'LLM', 'LangChain', 'GPT', 'Gemini', 'Hugging Face', 'OpenAI'],
            'cloud': ['AWS', 'Azure', 'Google Cloud', 'GCP', 'Cloud Computing', 'EC2', 'S3'],
            'devops': ['Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'DevOps', 'Terraform', 'Ansible']
        }
        
        # Extract location
        found_location = ''
        for loc_key, loc_value in locations.items():
            if loc_key in query_text:
                found_location = loc_value
                break
        
        # Extract skills
        found_skills = []
        
        # First check for skill categories
        for category, skills in skill_categories.items():
            if category in query_text or category.replace('-', ' ') in query_text:
                found_skills.extend(skills)
        
        # Then look for specific technologies (case insensitive)
        specific_techs = [
            'LangChain', 'React', 'Python', 'Java', 'JavaScript', 'TypeScript', 
            'TensorFlow', 'PyTorch', 'Docker', 'Kubernetes', 'AWS', 'Azure',
            'MongoDB', 'PostgreSQL', 'MySQL', 'Node.js', 'Express.js',
            'Django', 'Flask', 'Spring Boot', 'Angular', 'Vue.js'
        ]
        for tech in specific_techs:
            if tech.lower() in query_text:
                found_skills.append(tech)
        
        # If no specific skills found, try to extract from the query
        if not found_skills:
            # Simple tokenization - in a real app you'd use NLP
            tokens = re.findall(r'\b\w+\b', query_text)
            potential_skills = [token.capitalize() for token in tokens if len(token) > 2 and token not in ['the', 'and', 'with', 'for', 'developer', 'engineer']]
            found_skills = potential_skills[:5]  # Limit to 5 potential skills
        
        return {
            'skills': list(set(found_skills)),  # Remove duplicates
            'location': found_location
        }

    def get_candidate_details(self, candidate_id: str) -> Dict[str, Any]:
        """Get detailed information for a specific candidate"""
        with self.driver.session(database=self.database) as session:
            result = session.run("""
                MATCH (c:Candidate {candidate_id: $candidate_id})
                OPTIONAL MATCH (c)-[loc:LOCATED_IN]->(l:Location)
                OPTIONAL MATCH (c)-[edu:STUDIED_AT]->(i:Institution)
                OPTIONAL MATCH (c)-[exp:WORKED_AT]->(co:Company)
                OPTIONAL MATCH (c)-[proj:WORKED_ON]->(p:Project)
                OPTIONAL MATCH (c)-[skill:HAS_SKILL]->(s:Skill)
                OPTIONAL MATCH (c)-[tech_exp:HAS_EXPERIENCE_WITH]->(t:Technology)
                RETURN c.name AS name,
                       c.email AS email,
                       c.phone AS phone,
                       c.linkedin AS linkedin,
                       c.github AS github,
                       c.description AS description,
                       COLLECT(DISTINCT {type: 'location', name: l.name, city: l.city, state: l.state, country: l.country}) AS locations,
                       COLLECT(DISTINCT {type: 'education', institution: i.name, degree: edu.degree, duration: edu.duration, gpa: edu.gpa}) AS education,
                       COLLECT(DISTINCT {type: 'experience', company: co.name, position: exp.position, duration: exp.duration, description: exp.description}) AS experience,
                       COLLECT(DISTINCT {type: 'project', name: p.name, description: p.description, duration: proj.duration, achievements: proj.achievements}) AS projects,
                       COLLECT(DISTINCT {type: 'skill', name: s.name, category: s.category}) AS skills,
                       COLLECT(DISTINCT {type: 'technology', name: t.name, context: tech_exp.context}) AS technologies
            """, candidate_id=candidate_id)
            
            record = result.single()
            if record:
                return dict(record)
            return None

    def get_statistics(self):
        """Get database statistics"""
        with self.driver.session(database=self.database) as session:
            result = session.run("""
                MATCH (c:Candidate) 
                OPTIONAL MATCH (s:Skill)
                OPTIONAL MATCH (t:Technology)
                OPTIONAL MATCH (l:Location)
                OPTIONAL MATCH (co:Company)
                OPTIONAL MATCH (p:Project)
                RETURN COUNT(DISTINCT c) AS candidates,
                       COUNT(DISTINCT s) AS skills,
                       COUNT(DISTINCT t) AS technologies,
                       COUNT(DISTINCT l) AS locations,
                       COUNT(DISTINCT co) AS companies,
                       COUNT(DISTINCT p) AS projects
            """)
            
            record = result.single()
            if record:
                return dict(record)
            return {}

    def get_location_breakdown(self):
        """Get breakdown of candidates by location"""
        with self.driver.session(database=self.database) as session:
            result = session.run("""
                MATCH (c:Candidate)-[:LOCATED_IN]->(l:Location)
                RETURN l.name AS location, 
                       l.city AS city,
                       l.state AS state,
                       l.country AS country,
                       COUNT(c) AS candidate_count
                ORDER BY candidate_count DESC
            """)
            
            return [dict(record) for record in result]

# Example usage
if __name__ == "__main__":
    db = Neo4jCandidateDatabase()
    
    try:
        print("Initializing database...")
        
        # Clear existing data (optional)
        db.clear_database()
        print("Database cleared.")
        
        # Create constraints
        db.create_constraints()
        print("Constraints created.")
        
        # Load candidates from JSON file
        print("Loading candidates from JSON...")
        db.parse_and_load_candidates("candidates1.json")
        print("Candidates loaded successfully!")
        
        # Print statistics
        stats = db.get_statistics()
        print(f"\nDatabase Statistics:")
        print(f"- Candidates: {stats.get('candidates', 0)}")
        print(f"- Skills: {stats.get('skills', 0)}")
        print(f"- Technologies: {stats.get('technologies', 0)}")
        print(f"- Locations: {stats.get('locations', 0)}")
        print(f"- Companies: {stats.get('companies', 0)}")
        print(f"- Projects: {stats.get('projects', 0)}")
        
        # Example queries
        print("\n" + "="*50)
        print("EXAMPLE QUERIES")
        print("="*50)
        
        print("\nGen-AI LangChain developers in Mumbai:")
        candidates = db.query_candidates("gen-ai langchain developer in mumbai")
        for candidate in candidates[:3]:  # Show first 3
            print(f"\n{candidate['name']}")
            print(f"Email: {candidate['email']}")
            skills = candidate['all_skills'] if candidate['all_skills'] else []
            print(f"Skills: {', '.join(skills[:10])}{'...' if len(skills) > 10 else ''}")
            locations = candidate['locations'] if candidate['locations'] else []
            print(f"Locations: {', '.join(locations)}")
        
        print("\nPython developers with cloud experience:")
        candidates = db.query_candidates("python developer with cloud experience")
        for candidate in candidates[:3]:  # Show first 3
            print(f"\n{candidate['name']}")
            print(f"Email: {candidate['email']}")
            skills = candidate['all_skills'] if candidate['all_skills'] else []
            print(f"Skills: {', '.join(skills[:10])}{'...' if len(skills) > 10 else ''}")
        
        print("\nFrontend developers in Australia:")
        candidates = db.query_candidates("frontend developer in australia")
        for candidate in candidates[:3]:  # Show first 3
            print(f"\n{candidate['name']}")
            print(f"Email: {candidate['email']}")
            locations = candidate['locations'] if candidate['locations'] else []
            print(f"Locations: {', '.join(locations)}")
        
        print(f"\nTotal queries completed successfully!")
    
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    
    finally:
        db.close()
        print("Database connection closed.")