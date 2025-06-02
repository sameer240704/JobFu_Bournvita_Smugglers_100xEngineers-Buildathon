import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from neo4j import GraphDatabase
from groq import Groq
import json
from typing import List, Dict, Any, Set, Tuple, Optional
import re
import math
from collections import defaultdict, Counter
from difflib import SequenceMatcher
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer
import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Download required NLTK data (run once)
nltk.download('punkt_tab')
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('punkt')
    nltk.download('stopwords')

# FastAPI app
app = FastAPI(
    title="Advanced Candidate Search and Comparison API",
    description="Industry-standard candidate search and comparison system with comprehensive ranking algorithms",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for Search
class SearchRequest(BaseModel):
    query: str
    top_k: Optional[int] = 20
    location_filter: Optional[str] = None

class SearchResponse(BaseModel):
    success: bool
    message: str
    total_candidates: int
    ranked_candidates: List[Dict[str, Any]]
    query_analysis: Dict[str, Any]

class CandidateProfileResponse(BaseModel):
    success: bool
    candidate: Dict[str, Any]

# Pydantic models for Comparison
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

# Global variable to store candidates data for comparison
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

class AdvancedCandidateSystem:
    """
    Enhanced candidate search and comparison system using industry-standard information retrieval techniques
    """
    
    def __init__(self):
        # Neo4j configuration
        self.neo4j_uri = os.getenv("NEO4J_URI", "neo4j+s://4e1be7d1.databases.neo4j.io")
        self.neo4j_username = os.getenv("NEO4J_USERNAME", "neo4j")
        self.neo4j_password = os.getenv("NEO4J_PASSWORD", "JmNzZQpC5fn-McE111oF-axC9q1dsw6B9TTuRTBl3j8")
        self.neo4j_database = os.getenv("NEO4J_DATABASE", "neo4j")
        self.driver = GraphDatabase.driver(
            self.neo4j_uri,
            auth=(self.neo4j_username, self.neo4j_password)
        )
        
        # Groq configuration
        self.groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.llm_model = os.getenv("LLM_MODEL", "llama3-8b-8192")
        
        # Initialize NLP components
        self.stemmer = PorterStemmer()
        self.stop_words = set(stopwords.words('english'))
        
        # Industry-standard parameters for BM25
        self.k1 = 1.5  # Term frequency saturation parameter
        self.b = 0.75  # Length normalization parameter
        
        # Comprehensive technology and skill synonyms
        self.tech_synonyms = {
            'javascript': ['js', 'node.js', 'nodejs', 'react', 'angular', 'vue'],
            'python': ['django', 'flask', 'fastapi', 'pandas', 'numpy'],
            'java': ['spring', 'hibernate', 'jsp', 'servlet'],
            'machine learning': ['ml', 'ai', 'artificial intelligence', 'deep learning', 'neural networks'],
            'database': ['sql', 'mysql', 'postgresql', 'mongodb', 'redis'],
            'cloud': ['aws', 'azure', 'gcp', 'google cloud', 'amazon web services'],
            'devops': ['docker', 'kubernetes', 'jenkins', 'ci/cd', 'terraform'],
            'frontend': ['react', 'angular', 'vue', 'html', 'css', 'javascript'],
            'backend': ['api', 'server', 'database', 'microservices'],
            'mobile': ['android', 'ios', 'react native', 'flutter', 'swift', 'kotlin']
        }
        
    def close(self):
        self.driver.close()
    
    def preprocess_text(self, text: str) -> List[str]:
        """Advanced text preprocessing with stemming and stop word removal"""
        if not text:
            return []
        
        # Convert to lowercase and tokenize
        tokens = word_tokenize(text.lower())
        
        # Remove stopwords and apply stemming
        processed_tokens = []
        for token in tokens:
            if token.isalnum() and token not in self.stop_words and len(token) > 2:
                stemmed = self.stemmer.stem(token)
                processed_tokens.append(stemmed)
        
        return processed_tokens
    
    def expand_query_terms(self, query_terms: List[str]) -> Set[str]:
        """Expand query terms with synonyms and related technologies"""
        expanded_terms = set(query_terms)
        
        for term in query_terms:
            term_lower = term.lower()
            
            # Add exact matches and partial matches from synonyms
            for main_tech, synonyms in self.tech_synonyms.items():
                if term_lower in main_tech or main_tech in term_lower:
                    expanded_terms.update(synonyms)
                    expanded_terms.add(main_tech)
                elif term_lower in synonyms:
                    expanded_terms.add(main_tech)
                    expanded_terms.update(synonyms)
        
        return expanded_terms
    
    def fuzzy_string_similarity(self, s1: str, s2: str) -> float:
        """Calculate fuzzy string similarity using multiple algorithms"""
        if not s1 or not s2:
            return 0.0
        
        s1_lower = s1.lower().strip()
        s2_lower = s2.lower().strip()
        
        # Exact match
        if s1_lower == s2_lower:
            return 1.0
        
        # Substring match
        if s1_lower in s2_lower or s2_lower in s1_lower:
            return 0.8
        
        # Sequence matcher similarity
        seq_similarity = SequenceMatcher(None, s1_lower, s2_lower).ratio()
        
        # Token-based similarity
        tokens1 = set(s1_lower.split())
        tokens2 = set(s2_lower.split())
        
        if tokens1 and tokens2:
            token_similarity = len(tokens1.intersection(tokens2)) / len(tokens1.union(tokens2))
        else:
            token_similarity = 0.0
        
        # Return maximum similarity
        return max(seq_similarity, token_similarity)
    
    def extract_all_candidates_comprehensive(self, location_filter: str = None) -> List[Dict[str, Any]]:
        """Extract ALL candidates with comprehensive information (no limits)"""
        logger.info("Extracting all candidates comprehensively...")
        
        with self.driver.session(database=self.neo4j_database) as session:
            # Comprehensive query to get ALL candidate data
            query = """
                MATCH (c:Candidate)
                OPTIONAL MATCH (c)-[:HAS_SKILL]->(s:Skill)
                OPTIONAL MATCH (c)-[:HAS_EXPERIENCE_WITH]->(t:Technology)
                OPTIONAL MATCH (c)-[:WORKED_AT]->(co:Company)
                OPTIONAL MATCH (c)-[:WORKED_ON]->(p:Project)
                OPTIONAL MATCH (c)-[:PUBLISHED]->(pub:Publication)
                OPTIONAL MATCH (c)-[:ACHIEVED]->(a:Achievement)
                OPTIONAL MATCH (c)-[:COMPLETED]->(course:Course)
                OPTIONAL MATCH (c)-[:LOCATED_IN]->(l:Location)
                OPTIONAL MATCH (c)-[edu_rel]->(edu)
                WHERE (edu:Institution OR edu:University OR edu:College OR edu:School OR edu:Education)
                
                WITH c,
                     COLLECT(DISTINCT s.name) AS skills,
                     COLLECT(DISTINCT t.name) AS technologies,
                     COLLECT(DISTINCT {name: co.name, role: 'company'}) AS companies,
                     COLLECT(DISTINCT {name: p.name, description: p.description, technologies: p.technologies}) AS projects,
                     COLLECT(DISTINCT {title: pub.title, description: pub.description, keywords: pub.keywords}) AS publications,
                     COLLECT(DISTINCT {title: a.title, description: a.description}) AS achievements,
                     COLLECT(DISTINCT course.name) AS courses,
                     COLLECT(DISTINCT l.name) AS locations,
                     COLLECT(DISTINCT edu.name) AS education
                
                RETURN 
                    c.candidate_id AS candidate_id,
                    c.name AS name,
                    c.email AS email,
                    c.phone AS phone,
                    c.linkedin AS linkedin,
                    c.github AS github,
                    c.description AS description,
                    c.summary AS summary,
                    skills,
                    technologies,
                    companies,
                    projects,
                    publications,
                    achievements,
                    courses,
                    locations,
                    education
            """
            
            if location_filter:
                # Add location filter to the query
                query = """
                    MATCH (c:Candidate)-[:LOCATED_IN]->(l:Location)
                    WHERE toLower(l.name) CONTAINS toLower($location_filter)
                    OPTIONAL MATCH (c)-[:HAS_SKILL]->(s:Skill)
                    OPTIONAL MATCH (c)-[:HAS_EXPERIENCE_WITH]->(t:Technology)
                    OPTIONAL MATCH (c)-[:WORKED_AT]->(co:Company)
                    OPTIONAL MATCH (c)-[:WORKED_ON]->(p:Project)
                    OPTIONAL MATCH (c)-[:PUBLISHED]->(pub:Publication)
                    OPTIONAL MATCH (c)-[:ACHIEVED]->(a:Achievement)
                    OPTIONAL MATCH (c)-[:COMPLETED]->(course:Course)
                    OPTIONAL MATCH (c)-[edu_rel]->(edu)
                    WHERE (edu:Institution OR edu:University OR edu:College OR edu:School OR edu:Education)
                    
                    WITH c,
                         COLLECT(DISTINCT s.name) AS skills,
                         COLLECT(DISTINCT t.name) AS technologies,
                         COLLECT(DISTINCT {name: co.name, role: 'company'}) AS companies,
                         COLLECT(DISTINCT {name: p.name, description: p.description, technologies: p.technologies}) AS projects,
                         COLLECT(DISTINCT {title: pub.title, description: pub.description, keywords: pub.keywords}) AS publications,
                         COLLECT(DISTINCT {title: a.title, description: a.description}) AS achievements,
                         COLLECT(DISTINCT course.name) AS courses,
                         COLLECT(DISTINCT l.name) AS locations,
                         COLLECT(DISTINCT edu.name) AS education
                    
                    RETURN 
                        c.candidate_id AS candidate_id,
                        c.name AS name,
                        c.email AS email,
                        c.phone AS phone,
                        c.linkedin AS linkedin,
                        c.github AS github,
                        c.description AS description,
                        c.summary AS summary,
                        skills,
                        technologies,
                        companies,
                        projects,
                        publications,
                        achievements,
                        courses,
                        locations,
                        education
                """
            
            result = session.run(query, location_filter=location_filter) if location_filter else session.run(query)
            candidates = []
            
            for record in result:
                candidate = dict(record)
                
                # Create comprehensive text corpus for each candidate
                text_corpus = []
                
                # Add all textual information
                if candidate.get('name'):
                    text_corpus.append(candidate['name'])
                if candidate.get('description'):
                    text_corpus.append(candidate['description'])
                if candidate.get('summary'):
                    text_corpus.append(candidate['summary'])
                
                # Add skills and technologies
                all_skills = (candidate.get('skills', []) or []) + (candidate.get('technologies', []) or [])
                text_corpus.extend(all_skills)
                
                # Add company information
                for company in (candidate.get('companies', []) or []):
                    if isinstance(company, dict) and company.get('name'):
                        text_corpus.append(company['name'])
                    elif isinstance(company, str):
                        text_corpus.append(company)
                
                # Add project information
                for project in (candidate.get('projects', []) or []):
                    if isinstance(project, dict):
                        if project.get('name'):
                            text_corpus.append(project['name'])
                        if project.get('description'):
                            text_corpus.append(project['description'])
                        if project.get('technologies'):
                            if isinstance(project['technologies'], list):
                                text_corpus.extend(project['technologies'])
                            else:
                                text_corpus.append(str(project['technologies']))
                
                # Add publication information
                for pub in (candidate.get('publications', []) or []):
                    if isinstance(pub, dict):
                        if pub.get('title'):
                            text_corpus.append(pub['title'])
                        if pub.get('description'):
                            text_corpus.append(pub['description'])
                        if pub.get('keywords'):
                            text_corpus.append(pub['keywords'])
                
                # Add achievement information
                for achievement in (candidate.get('achievements', []) or []):
                    if isinstance(achievement, dict):
                        if achievement.get('title'):
                            text_corpus.append(achievement['title'])
                        if achievement.get('description'):
                            text_corpus.append(achievement['description'])
                
                # Add courses and education
                text_corpus.extend(candidate.get('courses', []) or [])
                text_corpus.extend(candidate.get('education', []) or [])
                text_corpus.extend(candidate.get('locations', []) or [])
                
                # Store processed text corpus
                candidate['text_corpus'] = ' '.join(filter(None, text_corpus))
                candidate['processed_tokens'] = self.preprocess_text(candidate['text_corpus'])
                
                candidates.append(candidate)
            
            logger.info(f"Extracted {len(candidates)} candidates comprehensively")
            return candidates
    
    def calculate_tf_idf_scores(self, candidates: List[Dict[str, Any]], query_terms: Set[str]) -> Dict[str, float]:
        """Calculate TF-IDF scores for candidates"""
        logger.info("Calculating TF-IDF scores...")
        
        # Calculate document frequencies
        df = Counter()
        total_docs = len(candidates)
        
        for candidate in candidates:
            unique_terms = set(candidate['processed_tokens'])
            for term in unique_terms:
                df[term] += 1
        
        # Calculate TF-IDF scores for each candidate
        tfidf_scores = {}
        
        for candidate in candidates:
            candidate_id = candidate['candidate_id']
            doc_tokens = candidate['processed_tokens']
            doc_length = len(doc_tokens)
            
            if doc_length == 0:
                tfidf_scores[candidate_id] = 0.0
                continue
            
            # Calculate TF-IDF for query terms
            score = 0.0
            tf = Counter(doc_tokens)
            
            for term in query_terms:
                processed_term = self.stemmer.stem(term.lower())
                
                if processed_term in tf:
                    # Calculate TF with log normalization
                    term_freq = 1 + math.log(tf[processed_term])
                    
                    # Calculate IDF
                    doc_freq = df.get(processed_term, 0)
                    if doc_freq > 0:
                        inverse_doc_freq = math.log(total_docs / doc_freq)
                        score += term_freq * inverse_doc_freq
            
            tfidf_scores[candidate_id] = score
        
        return tfidf_scores
    
    def calculate_bm25_scores(self, candidates: List[Dict[str, Any]], query_terms: Set[str]) -> Dict[str, float]:
        """Calculate BM25 scores using industry-standard algorithm"""
        logger.info("Calculating BM25 scores...")
        
        # Calculate average document length
        total_length = sum(len(candidate['processed_tokens']) for candidate in candidates)
        avg_doc_length = total_length / len(candidates) if candidates else 0
        
        # Calculate document frequencies
        df = Counter()
        total_docs = len(candidates)
        
        for candidate in candidates:
            unique_terms = set(candidate['processed_tokens'])
            for term in unique_terms:
                df[term] += 1
        
        # Calculate BM25 scores
        bm25_scores = {}
        
        for candidate in candidates:
            candidate_id = candidate['candidate_id']
            doc_tokens = candidate['processed_tokens']
            doc_length = len(doc_tokens)
            
            if doc_length == 0:
                bm25_scores[candidate_id] = 0.0
                continue
            
            score = 0.0
            tf = Counter(doc_tokens)
            
            for term in query_terms:
                processed_term = self.stemmer.stem(term.lower())
                
                if processed_term in tf:
                    # BM25 formula
                    term_freq = tf[processed_term]
                    doc_freq = df.get(processed_term, 0)
                    
                    if doc_freq > 0:
                        # IDF component
                        idf = math.log((total_docs - doc_freq + 0.5) / (doc_freq + 0.5))
                        
                        # TF component with BM25 normalization
                        tf_component = (term_freq * (self.k1 + 1)) / (
                            term_freq + self.k1 * (1 - self.b + self.b * (doc_length / avg_doc_length))
                        )
                        
                        score += idf * tf_component
            
            bm25_scores[candidate_id] = score
        
        return bm25_scores
    
    def calculate_semantic_similarity_scores(self, candidates: List[Dict[str, Any]], query: str) -> Dict[str, float]:
        """Calculate semantic similarity scores using fuzzy matching"""
        logger.info("Calculating semantic similarity scores...")
        
        similarity_scores = {}
        query_lower = query.lower()
        
        for candidate in candidates:
            candidate_id = candidate['candidate_id']
            max_similarity = 0.0
            
            # Check similarity with all text fields
            text_fields = [
                candidate.get('name', ''),
                candidate.get('description', ''),
                candidate.get('summary', ''),
                candidate.get('text_corpus', '')
            ]
            
            for field in text_fields:
                if field:
                    similarity = self.fuzzy_string_similarity(query_lower, field)
                    max_similarity = max(max_similarity, similarity)
            
            # Check specific field matches
            for skill in (candidate.get('skills', []) or []):
                similarity = self.fuzzy_string_similarity(query_lower, skill)
                max_similarity = max(max_similarity, similarity)
            
            for tech in (candidate.get('technologies', []) or []):
                similarity = self.fuzzy_string_similarity(query_lower, tech)
                max_similarity = max(max_similarity, similarity)
            
            similarity_scores[candidate_id] = max_similarity
        
        return similarity_scores
    
    def calculate_exact_match_bonus(self, candidates: List[Dict[str, Any]], query_terms: Set[str]) -> Dict[str, float]:
        """Calculate bonus scores for exact matches"""
        logger.info("Calculating exact match bonuses...")
        
        exact_match_scores = {}
        
        for candidate in candidates:
            candidate_id = candidate['candidate_id']
            bonus_score = 0.0
            
            text_corpus_lower = candidate.get('text_corpus', '').lower()
            
            for term in query_terms:
                term_lower = term.lower()
                
                # Top priority: Exact location match
                location_lower = candidate.get('locations', [''])[0].lower() if candidate.get('locations') else ''
                if term_lower == location_lower and location_lower:
                    bonus_score += 10.0  # Highest priority

                # Exact word match bonus
                if f' {term_lower} ' in f' {text_corpus_lower} ':
                    bonus_score += 2.0
                
                # Partial match bonus
                elif term_lower in text_corpus_lower:
                    bonus_score += 1.0
            
            exact_match_scores[candidate_id] = bonus_score
        
        return exact_match_scores
    
    def parse_query_with_llm(self, natural_language_query: str) -> Dict[str, Any]:
        """Enhanced query parsing with LLM"""
        prompt = f"""
        You are an expert at extracting search parameters from natural language queries for candidate search.
        
        Extract the following information from the query and return as JSON:
        - "skills": Array of technical skills, technologies, programming languages
        - "locations": Array of geographic locations, cities, countries (return ONLY the locations mentioned in the query)
        - "companies": Array of company names (handle variations and abbreviations)
        - "institutions": Array of educational institutions (handle abbreviations like MIT, IIT, etc.)
        - "roles": Array of job roles or positions
        - "experience_level": String indicating experience level (junior, senior, etc.)
        - "key_terms": Array of all important terms from the query
        
        IMPORTANT: 
        - If the query mentions a specific location (e.g., "USA", "New York"), include ONLY that location in the locations array
        - Handle common abbreviations and variations intelligently (e.g., "US" → "USA", "NY" → "New York")
        
        Query: "{natural_language_query}"
        
        Return only valid JSON:
        """
        
        try:
            chat_completion = self.groq_client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=self.llm_model,
                temperature=0.2,
                max_tokens=512,
                response_format={"type": "json_object"}
            )
            
            response = chat_completion.choices[0].message.content
            parsed_query = json.loads(response)
            
            # Expand key terms with synonyms
            key_terms = parsed_query.get('key_terms', [])
            all_terms = set(key_terms)
            
            # Add all other extracted terms
            for field in ['skills', 'locations', 'companies', 'institutions', 'roles']:
                all_terms.update(parsed_query.get(field, []))
            
            # Expand with synonyms
            expanded_terms = self.expand_query_terms(list(all_terms))
            parsed_query['expanded_terms'] = list(expanded_terms)
            
            return parsed_query
        
        except Exception as e:
            logger.error(f"Error parsing query with LLM: {e}")
            return {
                "skills": [],
                "locations": [],
                "companies": [],
                "institutions": [],
                "roles": [],
                "key_terms": natural_language_query.split(),
                "expanded_terms": natural_language_query.split()
            }
    
    def search_candidates_advanced(self, natural_language_query: str, top_k: int = 50) -> List[Dict[str, Any]]:
        """Advanced candidate search with comprehensive ranking"""
        logger.info(f"Starting advanced search for: {natural_language_query}")
        
        # Parse query
        query_params = self.parse_query_with_llm(natural_language_query)
        logger.info(f"Parsed query parameters: {query_params}")
        
        # Check if location filter should be applied
        location_filter = None
        if query_params.get('locations'):
            location_filter = query_params['locations'][0]  # Use the first location mentioned
            logger.info(f"Applying location filter: {location_filter}")
        
        # Get all candidates (with location filter if specified)
        all_candidates = self.extract_all_candidates_comprehensive(location_filter)
        logger.info(f"Total candidates in database after location filter: {len(all_candidates)}")
        
        if not all_candidates:
            return []
        
        # Get expanded query terms
        query_terms = set(query_params.get('expanded_terms', []))
        
        # Calculate multiple scoring components
        tfidf_scores = self.calculate_tf_idf_scores(all_candidates, query_terms)
        bm25_scores = self.calculate_bm25_scores(all_candidates, query_terms)
        similarity_scores = self.calculate_semantic_similarity_scores(all_candidates, natural_language_query)
        exact_match_scores = self.calculate_exact_match_bonus(all_candidates, query_terms)
        
        # Normalize scores to 0-1 range
        def normalize_scores(scores: Dict[str, float]) -> Dict[str, float]:
            if not scores:
                return scores
            
            max_score = max(scores.values()) if scores.values() else 1
            min_score = min(scores.values()) if scores.values() else 0
            
            if max_score == min_score:
                return {k: 1.0 for k in scores.keys()}
            
            return {
                k: (v - min_score) / (max_score - min_score) 
                for k, v in scores.items()
            }
        
        normalized_tfidf = normalize_scores(tfidf_scores)
        normalized_bm25 = normalize_scores(bm25_scores)
        normalized_similarity = normalize_scores(similarity_scores)
        normalized_exact = normalize_scores(exact_match_scores)
        
        # Calculate composite scores with industry-standard weights
        composite_scores = {}
        
        for candidate in all_candidates:
            candidate_id = candidate['candidate_id']
            
            # Weighted combination of multiple ranking signals
            composite_score = (
                0.35 * normalized_bm25.get(candidate_id, 0) +      # BM25 (primary relevance)
                0.25 * normalized_tfidf.get(candidate_id, 0) +     # TF-IDF (term importance)
                0.25 * normalized_similarity.get(candidate_id, 0) + # Semantic similarity
                0.15 * normalized_exact.get(candidate_id, 0)       # Exact match bonus
            )
            
            composite_scores[candidate_id] = composite_score
            candidate['relevance_score'] = composite_score
            
            # Add detailed scoring breakdown for transparency
            candidate['score_breakdown'] = {
                'bm25': normalized_bm25.get(candidate_id, 0),
                'tfidf': normalized_tfidf.get(candidate_id, 0),
                'similarity': normalized_similarity.get(candidate_id, 0),
                'exact_match': normalized_exact.get(candidate_id, 0),
                'composite': composite_score
            }
        
        # Sort by composite score and return top candidates
        ranked_candidates = sorted(
            all_candidates, 
            key=lambda x: x['relevance_score'], 
            reverse=True
        )
        
        logger.info(f"Returning top {min(top_k, len(ranked_candidates))} candidates")
        return ranked_candidates[:top_k]
    
    def get_candidate_by_id(self, candidate_id: str) -> Optional[Dict[str, Any]]:
        """Get a candidate by ID with all details"""
        logger.info(f"Fetching candidate with ID: {candidate_id}")
        
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
                OPTIONAL MATCH (c)-[edu_rel]->(edu)
                WHERE (edu:Institution OR edu:University OR edu:College OR edu:School OR edu:Education)
                
                RETURN 
                    c.candidate_id AS candidate_id,
                    c.name AS name,
                    c.email AS email,
                    c.phone AS phone,
                    c.linkedin AS linkedin,
                    c.github AS github,
                    c.description AS description,
                    c.summary AS summary,
                    COLLECT(DISTINCT s.name) AS skills,
                    COLLECT(DISTINCT t.name) AS technologies,
                    COLLECT(DISTINCT {name: co.name, role: 'company'}) AS companies,
                    COLLECT(DISTINCT {name: p.name, description: p.description, technologies: p.technologies}) AS projects,
                    COLLECT(DISTINCT {title: pub.title, description: pub.description, keywords: pub.keywords}) AS publications,
                    COLLECT(DISTINCT {title: a.title, description: a.description}) AS achievements,
                    COLLECT(DISTINCT course.name) AS courses,
                    COLLECT(DISTINCT l.name) AS locations,
                    COLLECT(DISTINCT edu.name) AS education
            """
            
            result = session.run(query, candidate_id=candidate_id)
            record = result.single()
            
            if record:
                candidate = dict(record)
                
                # Create comprehensive text corpus for the candidate
                text_corpus = []
                
                # Add all textual information
                if candidate.get('name'):
                    text_corpus.append(candidate['name'])
                if candidate.get('description'):
                    text_corpus.append(candidate['description'])
                if candidate.get('summary'):
                    text_corpus.append(candidate['summary'])
                
                # Add skills and technologies
                all_skills = (candidate.get('skills', []) or []) + (candidate.get('technologies', []) or [])
                text_corpus.extend(all_skills)
                
                # Add company information
                for company in (candidate.get('companies', []) or []):
                    if isinstance(company, dict) and company.get('name'):
                        text_corpus.append(company['name'])
                    elif isinstance(company, str):
                        text_corpus.append(company)
                
                # Add project information
                for project in (candidate.get('projects', []) or []):
                    if isinstance(project, dict):
                        if project.get('name'):
                            text_corpus.append(project['name'])
                        if project.get('description'):
                            text_corpus.append(project['description'])
                        if project.get('technologies'):
                            if isinstance(project['technologies'], list):
                                text_corpus.extend(project['technologies'])
                            else:
                                text_corpus.append(str(project['technologies']))
                
                # Add publication information
                for pub in (candidate.get('publications', []) or []):
                    if isinstance(pub, dict):
                        if pub.get('title'):
                            text_corpus.append(pub['title'])
                        if pub.get('description'):
                            text_corpus.append(pub['description'])
                        if pub.get('keywords'):
                            text_corpus.append(pub['keywords'])
                
                # Add achievement information
                for achievement in (candidate.get('achievements', []) or []):
                    if isinstance(achievement, dict):
                        if achievement.get('title'):
                            text_corpus.append(achievement['title'])
                        if achievement.get('description'):
                            text_corpus.append(achievement['description'])
                
                # Add courses and education
                text_corpus.extend(candidate.get('courses', []) or [])
                text_corpus.extend(candidate.get('education', []) or [])
                text_corpus.extend(candidate.get('locations', []) or [])
                
                # Store processed text corpus
                candidate['text_corpus'] = ' '.join(filter(None, text_corpus))
                candidate['processed_tokens'] = self.preprocess_text(candidate['text_corpus'])
                
                return candidate
            
            return None
    
    def load_candidates_data(self):
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
                logger.info(f"Loaded {len(candidates_data)} candidates")
        except FileNotFoundError:
            raise HTTPException(status_code=500, detail="Candidates data file not found")
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Invalid JSON in candidates data file")
    
    def extract_candidate_summary(self, candidate: Dict) -> str:
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
    
    def analyze_single_candidate(self, candidate: Dict, focus: str = "general") -> List[Dict[str, Any]]:
        """Analyze a single candidate and return standardized parameter evaluations"""
        
        candidate_summary = self.extract_candidate_summary(candidate)
        
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
            chat_completion = self.groq_client.chat.completions.create(
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
                logger.error(f"JSON parsing failed: {parse_error}")
                # Fallback: create default parameter structure
                return self.create_default_parameters(candidate)
                
        except Exception as e:
            logger.error(f"AI analysis failed: {str(e)}")
            return self.create_default_parameters(candidate)
    
    def create_default_parameters(self, candidate: Dict) -> List[Dict[str, Any]]:
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
    
    def generate_overall_summary(self, candidate_profiles: List[CandidateProfile]) -> str:
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
            chat_completion = self.groq_client.chat.completions.create(
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

# Initialize the system
candidate_system = AdvancedCandidateSystem()

# API endpoints
@app.on_event("startup")
async def startup_event():
    """Load candidates data on startup"""
    candidate_system.load_candidates_data()

@app.on_event("shutdown")
async def shutdown_event():
    candidate_system.close()
    logger.info("Advanced Candidate System shutdown")

@app.get("/")
async def root():
    return {
        "message": "Advanced Candidate Search and Comparison API",
        "total_candidates": len(candidates_data),
        "endpoints": {
            "search": "/search",
            "candidate_profile": "/candidate/{candidate_id}",
            "compare": "/compare",
            "quick_compare": "/quick-compare",
            "all_candidates": "/candidates",
            "parameters": "/parameters",
            "health": "/health"
        }
    }

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

@app.get("/candidate/{candidate_id}")
async def get_candidate_profile(candidate_id: str):
    """
    Get detailed profile for a specific candidate by ID
    
    Parameters:
    - candidate_id: The unique ID of the candidate
    
    Returns:
    - Complete candidate profile with all details
    """
    try:
        candidate = candidate_system.get_candidate_by_id(candidate_id)
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate not found")
        
        return {
            "success": True,
            "candidate": candidate
        }
    
    except Exception as e:
        logger.error(f"Error fetching candidate profile: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/search", response_model=SearchResponse)
async def search_candidates(request: SearchRequest):
    """
    Perform an advanced candidate search with comprehensive ranking
    
    Parameters:
    - query: Natural language search query (e.g., "Python developers in New York")
    - top_k: Number of top candidates to return (default: 20)
    - location_filter: Optional location filter to apply
    
    Returns:
    - Ranked list of candidates with detailed scoring information
    """
    try:
        if not request.query:
            raise HTTPException(status_code=400, detail="Query cannot be empty")
        
        logger.info(f"Processing API search request: {request.query}")
        
        # Parse the query with LLM
        query_params = candidate_system.parse_query_with_llm(request.query)
        
        # Perform the search
        candidates = candidate_system.search_candidates_advanced(
            request.query,
            top_k=request.top_k
        )
        
        # Prepare the response
        response = {
            "success": True,
            "message": "Search completed successfully",
            "total_candidates": len(candidates),
            "ranked_candidates": candidates,
            "query_analysis": query_params
        }
        
        return response
    
    except Exception as e:
        logger.error(f"API search error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

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
        parameters = candidate_system.analyze_single_candidate(candidate, request.comparison_focus)
        
        candidate_profiles.append(CandidateProfile(
            candidate_oid=oid,
            candidate_name=candidate_name,
            parameters=parameters
        ))
    
    # Generate overall summary
    overall_summary = candidate_system.generate_overall_summary(candidate_profiles)
    
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