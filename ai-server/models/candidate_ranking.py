import os
from dotenv import load_dotenv
from neo4j import GraphDatabase
from groq import Groq
import json
from typing import List, Dict, Any, Tuple
import re
import math
from collections import Counter, defaultdict
from difflib import SequenceMatcher
import numpy as np

# Load environment variables
load_dotenv()

class EnhancedCandidateRanker:
    def __init__(self):
        """Initialize the enhanced candidate ranking system"""
        # Ranking weights for different sections (should sum to 1.0)
        self.weights = {
            'skills': 0.35,      # Technical skills are most important
            'projects': 0.25,    # Projects show practical application
            'experience': 0.20,  # Work experience matters
            'achievements': 0.10, # Achievements show excellence
            'publications': 0.05, # Publications show thought leadership
            'location': 0.05     # Location bonus for exact matches
        }
        
        # Skill importance multipliers
        self.skill_importance = {
            # High-demand technologies
            'python': 1.3, 'javascript': 1.3, 'react': 1.2, 'nodejs': 1.2,
            'aws': 1.3, 'docker': 1.2, 'kubernetes': 1.2, 'tensorflow': 1.3,
            'pytorch': 1.3, 'machine learning': 1.4, 'ai': 1.4, 'deep learning': 1.4,
            'data science': 1.3, 'big data': 1.2, 'spark': 1.2, 'kafka': 1.2,
            'microservices': 1.2, 'devops': 1.2, 'ci/cd': 1.1, 'agile': 1.1,
            # Emerging technologies
            'blockchain': 1.2, 'web3': 1.2, 'langchain': 1.3, 'llm': 1.4,
            'generative ai': 1.4, 'nlp': 1.3, 'computer vision': 1.3,
            # Cloud platforms
            'azure': 1.2, 'gcp': 1.2, 'google cloud': 1.2,
            # Programming languages
            'java': 1.1, 'go': 1.2, 'rust': 1.3, 'typescript': 1.2,
        }

    def calculate_text_similarity(self, text1: str, text2: str) -> float:
        """Calculate similarity between two text strings using multiple methods"""
        if not text1 or not text2:
            return 0.0
        
        text1_lower = text1.lower()
        text2_lower = text2.lower()
        
        # Exact match
        if text1_lower == text2_lower:
            return 1.0
        
        # Substring match
        if text2_lower in text1_lower or text1_lower in text2_lower:
            return 0.8
        
        # Sequence matcher for fuzzy matching
        seq_similarity = SequenceMatcher(None, text1_lower, text2_lower).ratio()
        
        # Word overlap
        words1 = set(re.findall(r'\b\w+\b', text1_lower))
        words2 = set(re.findall(r'\b\w+\b', text2_lower))
        
        if words1 and words2:
            word_overlap = len(words1.intersection(words2)) / len(words1.union(words2))
        else:
            word_overlap = 0.0
        
        # Return the maximum of sequence similarity and word overlap
        return max(seq_similarity, word_overlap)

    def calculate_skills_score(self, candidate_skills: List[str], query_skills: List[str]) -> float:
        """Calculate skills matching score with TF-IDF weighting"""
        if not query_skills or not candidate_skills:
            return 0.0
        
        total_score = 0.0
        matched_skills = 0
        
        for query_skill in query_skills:
            best_match_score = 0.0
            
            for candidate_skill in candidate_skills:
                similarity = self.calculate_text_similarity(candidate_skill, query_skill)
                
                if similarity > 0.6:  # Threshold for considering it a match
                    # Apply importance multiplier
                    importance = self.skill_importance.get(query_skill.lower(), 1.0)
                    skill_score = similarity * importance
                    best_match_score = max(best_match_score, skill_score)
            
            if best_match_score > 0:
                total_score += best_match_score
                matched_skills += 1
        
        if not query_skills:
            return 0.0
        
        # Normalize by query skills count and add bonus for skill diversity
        base_score = total_score / len(query_skills)
        diversity_bonus = min(len(set(candidate_skills)) / 10, 0.2)  # Max 20% bonus
        
        return min(base_score + diversity_bonus, 1.0)

    def calculate_projects_score(self, projects: List[Dict], query_skills: List[str], query_text: str) -> float:
        """Calculate projects relevance score"""
        if not projects:
            return 0.0
        
        project_scores = []
        
        for project in projects:
            project_name = project.get('project', '')
            project_desc = project.get('description', '')
            project_text = f"{project_name} {project_desc}".lower()
            
            # Score based on query skills mentioned in projects
            skill_mentions = 0
            for skill in query_skills:
                if skill.lower() in project_text:
                    skill_mentions += 1
            
            # Score based on overall query relevance
            query_relevance = self.calculate_text_similarity(project_text, query_text.lower())
            
            # Project complexity indicators
            complexity_keywords = ['microservices', 'distributed', 'scalable', 'real-time', 
                                 'production', 'enterprise', 'system design', 'architecture']
            complexity_score = sum(1 for keyword in complexity_keywords if keyword in project_text) / len(complexity_keywords)
            
            # Combine scores
            if query_skills:
                skill_score = skill_mentions / len(query_skills)
            else:
                skill_score = 0
            
            project_score = (skill_score * 0.5 + query_relevance * 0.3 + complexity_score * 0.2)
            project_scores.append(project_score)
        
        # Return average of top projects (weight recent/better projects more)
        if project_scores:
            project_scores.sort(reverse=True)
            # Weight top 3 projects more heavily
            weighted_scores = []
            for i, score in enumerate(project_scores[:3]):
                weight = 1.0 - (i * 0.2)  # First project gets full weight, second 80%, third 60%
                weighted_scores.append(score * weight)
            
            return sum(weighted_scores) / len(weighted_scores) if weighted_scores else 0.0
        
        return 0.0

    def calculate_experience_score(self, companies: List[str], query_companies: List[str], 
                                 experience_details: List[Dict]) -> float:
        """Calculate work experience relevance score"""
        if not companies and not experience_details:
            return 0.0
        
        company_score = 0.0
        if query_companies and companies:
            for query_company in query_companies:
                for company in companies:
                    similarity = self.calculate_text_similarity(company, query_company)
                    company_score = max(company_score, similarity)
        
        # Company tier scoring (bonus for top-tier companies)
        tier_1_companies = ['google', 'microsoft', 'amazon', 'apple', 'meta', 'netflix', 
                           'tesla', 'nvidia', 'openai', 'anthropic']
        tier_2_companies = ['uber', 'airbnb', 'spotify', 'twitter', 'linkedin', 'salesforce',
                           'adobe', 'intel', 'oracle', 'ibm']
        
        tier_bonus = 0.0
        for company in companies:
            company_lower = company.lower()
            if any(t1 in company_lower for t1 in tier_1_companies):
                tier_bonus = max(tier_bonus, 0.3)
            elif any(t2 in company_lower for t2 in tier_2_companies):
                tier_bonus = max(tier_bonus, 0.15)
        
        # Experience diversity and seniority
        experience_years = len(companies)  # Approximate based on number of companies
        seniority_score = min(experience_years / 5, 1.0)  # Normalize to max 5 years
        
        return min(company_score + tier_bonus + (seniority_score * 0.2), 1.0)

    def calculate_achievements_score(self, achievements: List[str], query_text: str) -> float:
        """Calculate achievements relevance score"""
        if not achievements:
            return 0.0
        
        achievement_keywords = ['award', 'winner', 'champion', 'first place', 'recognition',
                              'patent', 'published', 'speaker', 'mentor', 'lead', 'founded']
        
        relevance_scores = []
        for achievement in achievements:
            achievement_lower = achievement.lower()
            
            # Check for achievement indicators
            keyword_score = sum(1 for keyword in achievement_keywords if keyword in achievement_lower)
            keyword_score = min(keyword_score / len(achievement_keywords), 1.0)
            
            # Check relevance to query
            query_relevance = self.calculate_text_similarity(achievement, query_text)
            
            combined_score = (keyword_score * 0.6 + query_relevance * 0.4)
            relevance_scores.append(combined_score)
        
        return sum(relevance_scores) / len(relevance_scores) if relevance_scores else 0.0

    def calculate_publications_score(self, publications: List[str], query_skills: List[str]) -> float:
        """Calculate publications relevance score"""
        if not publications:
            return 0.0
        
        publication_scores = []
        
        for publication in publications:
            pub_text = publication.lower()
            
            # Check for high-impact venues
            high_impact_venues = ['nature', 'science', 'acm', 'ieee', 'neurips', 'icml', 
                                'aaai', 'ijcai', 'arxiv', 'journal']
            venue_score = sum(1 for venue in high_impact_venues if venue in pub_text) / len(high_impact_venues)
            
            # Check skill relevance
            skill_relevance = 0.0
            if query_skills:
                skill_matches = sum(1 for skill in query_skills if skill.lower() in pub_text)
                skill_relevance = skill_matches / len(query_skills)
            
            pub_score = (venue_score * 0.4 + skill_relevance * 0.6)
            publication_scores.append(pub_score)
        
        return sum(publication_scores) / len(publication_scores) if publication_scores else 0.0

    def calculate_location_score(self, candidate_locations: List[str], query_location: str) -> float:
        """Calculate location matching score"""
        if not query_location or not candidate_locations:
            return 0.0
        
        best_location_score = 0.0
        
        for location in candidate_locations:
            similarity = self.calculate_text_similarity(location, query_location)
            
            # Geographic proximity bonus (simplified)
            location_lower = location.lower()
            query_lower = query_location.lower()
            
            # Country-level matching
            if any(country in location_lower and country in query_lower 
                   for country in ['india', 'usa', 'canada', 'uk', 'australia', 'germany']):
                similarity = max(similarity, 0.6)
            
            # City-state-country hierarchy
            if query_lower in location_lower or location_lower in query_lower:
                similarity = max(similarity, 0.8)
            
            best_location_score = max(best_location_score, similarity)
        
        return best_location_score

    def calculate_composite_score(self, candidate: Dict[str, Any], query_params: Dict[str, Any], 
                                query_text: str) -> Tuple[float, Dict[str, float]]:
        """Calculate composite ranking score for a candidate"""
        
        # Extract candidate data
        candidate_skills = candidate.get('all_skills', [])
        projects = candidate.get('projects', [])
        companies = candidate.get('companies', [])
        locations = candidate.get('locations', [])
        experience = candidate.get('experience', [])
        
        # For achievements and publications, we'll try to extract from description or other fields
        description = candidate.get('description', '')
        achievements = self.extract_achievements_from_text(description)
        publications = self.extract_publications_from_text(description)
        
        # Calculate individual scores
        skills_score = self.calculate_skills_score(candidate_skills, query_params.get('skills', []))
        projects_score = self.calculate_projects_score(projects, query_params.get('skills', []), query_text)
        experience_score = self.calculate_experience_score(companies, query_params.get('companies', []), experience)
        achievements_score = self.calculate_achievements_score(achievements, query_text)
        publications_score = self.calculate_publications_score(publications, query_params.get('skills', []))
        location_score = self.calculate_location_score(locations, query_params.get('location', ''))
        
        # Calculate weighted composite score
        composite_score = (
            skills_score * self.weights['skills'] +
            projects_score * self.weights['projects'] +
            experience_score * self.weights['experience'] +
            achievements_score * self.weights['achievements'] +
            publications_score * self.weights['publications'] +
            location_score * self.weights['location']
        )
        
        # Score breakdown for transparency
        score_breakdown = {
            'skills': skills_score,
            'projects': projects_score,
            'experience': experience_score,
            'achievements': achievements_score,
            'publications': publications_score,
            'location': location_score,
            'composite': composite_score
        }
        
        return composite_score, score_breakdown

    def extract_achievements_from_text(self, text: str) -> List[str]:
        """Extract achievements from candidate description"""
        if not text:
            return []
        
        achievement_patterns = [
            r'(?i)award[^.]*\.',
            r'(?i)winner[^.]*\.',
            r'(?i)recognition[^.]*\.',
            r'(?i)patent[^.]*\.',
            r'(?i)founded[^.]*\.',
            r'(?i)led team[^.]*\.',
            r'(?i)mentored[^.]*\.',
        ]
        
        achievements = []
        for pattern in achievement_patterns:
            matches = re.findall(pattern, text)
            achievements.extend(matches)
        
        return achievements[:5]  # Limit to top 5 achievements

    def extract_publications_from_text(self, text: str) -> List[str]:
        """Extract publications from candidate description"""
        if not text:
            return []
        
        publication_patterns = [
            r'(?i)published[^.]*\.',
            r'(?i)paper[^.]*\.',
            r'(?i)journal[^.]*\.',
            r'(?i)conference[^.]*\.',
            r'(?i)arxiv[^.]*\.',
        ]
        
        publications = []
        for pattern in publication_patterns:
            matches = re.findall(pattern, text)
            publications.extend(matches)
        
        return publications[:3]  # Limit to top 3 publications


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
        
        # Initialize the ranker
        self.ranker = EnhancedCandidateRanker()

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
        """Search candidates using natural language query with enhanced ranking"""
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
            
            # Build the main candidate query with enhanced data retrieval
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
                OPTIONAL MATCH (c)-[:HAS_ACHIEVEMENT]->(a:Achievement)
                OPTIONAL MATCH (c)-[:PUBLISHED]->(pub:Publication)
                WITH c, 
                     COLLECT(DISTINCT s.name) AS skills,
                     COLLECT(DISTINCT t.name) AS technologies,
                     COLLECT(DISTINCT a.description) AS achievements,
                     COLLECT(DISTINCT pub.title) AS publications,
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
                       achievements,
                       publications,
                       [(c)-[:WORKED_AT]->(co) | {company: co.name, role: co.role, duration: co.duration}] AS experience,
                       [(c)-[:WORKED_ON]->(p) | {project: p.name, description: p.description, technologies: p.technologies}] AS projects
                LIMIT 100
            """
            
            result = session.run(cypher_query, 
                skills=query_params.get('skills', []), 
                location_filters=location_filters,
                company_filters=company_filters,
                institution_filters=institution_filters)
            
            candidates = [dict(record) for record in result]
            
            # Now rank the candidates using our enhanced ranking system
            ranked_candidates = []
            
            for candidate in candidates:
                composite_score, score_breakdown = self.ranker.calculate_composite_score(
                    candidate, query_params, natural_language_query
                )
                
                candidate['ranking_score'] = composite_score
                candidate['score_breakdown'] = score_breakdown
                ranked_candidates.append(candidate)
            
            # Sort by ranking score (descending)
            ranked_candidates.sort(key=lambda x: x['ranking_score'], reverse=True)
            
            return ranked_candidates[:50]  # Return top 50 candidates

    def format_candidate_results(self, candidates: List[Dict[str, Any]], show_detailed_ranking: bool = False) -> str:
        """Format candidate results for display with ranking information"""
        if not candidates:
            return "No candidates found matching your criteria."
        
        result = []
        for i, candidate in enumerate(candidates, 1):
            candidate_str = f"🏆 RANK #{i}\n"
            candidate_str += f"📊 OVERALL SCORE: {candidate['ranking_score']:.3f}\n"
            candidate_str += f"👤 Name: {candidate['name']}\n"
            candidate_str += f"🆔 ID: {candidate['candidate_id']}\n"
            
            # Add contact info if available
            if candidate.get('email'):
                candidate_str += f"📧 Email: {candidate['email']}\n"
            if candidate.get('phone'):
                candidate_str += f"📱 Phone: {candidate['phone']}\n"
            if candidate.get('linkedin'):
                candidate_str += f"💼 LinkedIn: {candidate['linkedin']}\n"
            if candidate.get('github'):
                candidate_str += f"💻 GitHub: {candidate['github']}\n"
            
            # Add location info
            if candidate.get('locations'):
                candidate_str += f"📍 Location: {', '.join(candidate['locations'])}\n"
            
            # Add skills
            if candidate.get('all_skills'):
                top_skills = candidate['all_skills'][:8]  # Show top 8 skills
                candidate_str += f"🛠️  Skills: {', '.join(top_skills)}\n"
                if len(candidate['all_skills']) > 8:
                    candidate_str += f"   ... and {len(candidate['all_skills']) - 8} more\n"
            
            # Add companies
            if candidate.get('companies'):
                candidate_str += f"🏢 Companies: {', '.join(candidate['companies'])}\n"
            
            # Add institutions
            if candidate.get('institutions'):
                candidate_str += f"🎓 Education: {', '.join(candidate['institutions'])}\n"
            
            # Add projects count
            if candidate.get('projects'):
                candidate_str += f"🚀 Projects: {len(candidate['projects'])} projects\n"
            
            # Show detailed ranking breakdown if requested
            if show_detailed_ranking and candidate.get('score_breakdown'):
                breakdown = candidate['score_breakdown']
                candidate_str += f"\n📈 SCORE BREAKDOWN:\n"
                candidate_str += f"   • Skills: {breakdown['skills']:.3f}\n"
                candidate_str += f"   • Projects: {breakdown['projects']:.3f}\n"
                candidate_str += f"   • Experience: {breakdown['experience']:.3f}\n"
                candidate_str += f"   • Achievements: {breakdown['achievements']:.3f}\n"
                candidate_str += f"   • Publications: {breakdown['publications']:.3f}\n"
                candidate_str += f"   • Location: {breakdown['location']:.3f}\n"
            
            # Add description if available (truncated)
            if candidate.get('description'):
                desc = candidate['description'][:200]
                if len(candidate['description']) > 200:
                    desc += "..."
                candidate_str += f"\n📝 Description: {desc}\n"
            
            candidate_str += "=" * 80
            result.append(candidate_str)
        
        return "\n\n".join(result)

    def get_ranking_statistics(self, candidates: List[Dict[str, Any]]) -> str:
        """Generate ranking statistics for the search results"""
        if not candidates:
            return "No candidates to analyze."
        
        scores = [c['ranking_score'] for c in candidates]
        
        stats = f"""
📊 RANKING STATISTICS
{'='*50}
📈 Total Candidates Ranked: {len(candidates)}
🏆 Highest Score: {max(scores):.3f}
📉 Lowest Score: {min(scores):.3f}
📊 Average Score: {sum(scores)/len(scores):.3f}
🎯 Median Score: {sorted(scores)[len(scores)//2]:.3f}

🔝 SCORE DISTRIBUTION:
• Excellent (0.8+): {len([s for s in scores if s >= 0.8])} candidates
• Good (0.6-0.8): {len([s for s in scores if 0.6 <= s < 0.8])} candidates  
• Fair (0.4-0.6): {len([s for s in scores if 0.4 <= s < 0.6])} candidates
• Below Average (<0.4): {len([s for s in scores if s < 0.4])} candidates

💡 TIP: Candidates with scores above 0.6 are highly relevant to your query.
"""
        return stats

    def interactive_search(self):
        """Run an enhanced interactive search session with ranking"""
        print("🚀 ENHANCED CANDIDATE SEARCH SYSTEM")
        print("🤖 Powered by Llama3, Neo4j & Advanced Ranking Algorithm")
        print("🎓 Enhanced with Education/Institution Support & Multi-Criteria Ranking")
        print("=" * 80)
        print("Type 'exit' to quit")
        print("Type 'stats' after a search to see ranking statistics")
        print("Type 'detailed' after a search to see detailed ranking breakdown\n")
        
        print("📝 EXAMPLE QUERIES:")
        print("• 'Python developers from Stanford with machine learning experience'")
        print("• 'AI engineers who studied at IIT and worked at Google'")
        print("• 'Frontend developers from DJ Sanghvi with React and AWS skills'")
        print("• 'Data scientists from MIT with publications in machine learning'")
        print("• 'Full-stack developers in India with startup experience'")
        
        last_results = []
        
        while True:
            try:
                query = input("\n🔍 Enter your search query: ").strip()
                
                if query.lower() == 'exit':
                    print("👋 Goodbye!")
                    break
                
                if query.lower() == 'stats':
                    if last_results:
                        print(self.get_ranking_statistics(last_results))
                    else:
                        print("❌ No previous search results to analyze. Please run a search first.")
                    continue
                
                if query.lower() == 'detailed':
                    if last_results:
                        print("\n" + "="*80)
                        print("🔍 DETAILED RANKING BREAKDOWN")
                        print("="*80)
                        print(self.format_candidate_results(last_results[:10], show_detailed_ranking=True))
                    else:
                        print("❌ No previous search results to show. Please run a search first.")
                    continue
                
                if not query:
                    print("❌ Please enter a valid search query.")
                    continue
                
                print(f"\n🔄 Processing your query: '{query}'...")
                print("⏳ This may take a few seconds...")
                
                # Get ranked candidates
                candidates = self.search_candidates(query)
                last_results = candidates
                
                if not candidates:
                    print("❌ No candidates found matching your criteria.")
                    print("💡 Try broadening your search terms or check spelling.")
                    continue
                
                print(f"\n✅ Found and ranked {len(candidates)} candidates!")
                print("🏆 Showing top results sorted by relevance score:")
                print("=" * 80)
                
                # Show top 10 results by default
                print(self.format_candidate_results(candidates[:10]))
                
                # Show quick statistics
                if len(candidates) > 10:
                    print(f"\n📋 Showing top 10 of {len(candidates)} candidates.")
                    print("💡 Type 'stats' to see ranking statistics")
                    print("💡 Type 'detailed' to see detailed ranking breakdown")
                
                print(f"\n🎯 Average relevance score: {sum(c['ranking_score'] for c in candidates)/len(candidates):.3f}")
                
            except KeyboardInterrupt:
                print("\n👋 Exiting...")
                break
            except Exception as e:
                print(f"\n❌ Error: {e}")
                import traceback
                print("🔧 Technical details:")
                traceback.print_exc()

    def batch_search(self, queries: List[str]) -> Dict[str, List[Dict[str, Any]]]:
        """Perform batch search for multiple queries"""
        results = {}
        
        print(f"🔄 Processing {len(queries)} queries...")
        
        for i, query in enumerate(queries, 1):
            print(f"📝 Processing query {i}/{len(queries)}: {query}")
            try:
                candidates = self.search_candidates(query)
                results[query] = candidates
                print(f"✅ Found {len(candidates)} candidates")
            except Exception as e:
                print(f"❌ Error processing query '{query}': {e}")
                results[query] = []
        
        return results

    def export_results_to_json(self, candidates: List[Dict[str, Any]], filename: str = "candidate_results.json"):
        """Export search results to JSON file"""
        try:
            # Clean up candidates data for JSON export
            export_data = []
            for candidate in candidates:
                clean_candidate = {
                    'candidate_id': candidate.get('candidate_id'),
                    'name': candidate.get('name'),
                    'email': candidate.get('email'),
                    'phone': candidate.get('phone'),
                    'linkedin': candidate.get('linkedin'),
                    'github': candidate.get('github'),
                    'ranking_score': round(candidate.get('ranking_score', 0), 4),
                    'score_breakdown': {k: round(v, 4) for k, v in candidate.get('score_breakdown', {}).items()},
                    'locations': candidate.get('locations', []),
                    'companies': candidate.get('companies', []),
                    'institutions': candidate.get('institutions', []),
                    'skills': candidate.get('all_skills', []),
                    'projects_count': len(candidate.get('projects', [])),
                    'description': candidate.get('description', '')[:500]  # Truncate long descriptions
                }
                export_data.append(clean_candidate)
            
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(export_data, f, indent=2, ensure_ascii=False)
            
            print(f"✅ Results exported to {filename}")
            return True
            
        except Exception as e:
            print(f"❌ Error exporting results: {e}")
            return False


if __name__ == "__main__":
    manager = Neo4jCandidateManager()
    
    try:
        # Run interactive search with enhanced ranking
        manager.interactive_search()
    
    finally:
        manager.close()