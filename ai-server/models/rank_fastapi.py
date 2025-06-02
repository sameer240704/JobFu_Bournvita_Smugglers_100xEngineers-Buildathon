print("Loading candidate_search.py for Advanced Candidate Search System")

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Set, Optional
import os
from dotenv import load_dotenv
from neo4j import GraphDatabase
from groq import Groq
import json
import math
from collections import defaultdict, Counter
from difflib import SequenceMatcher
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer
import logging
import uuid

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
logger.info(f"GROQ_API_KEY loaded: {bool(os.getenv('GROQ_API_KEY'))}")

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('punkt')
    nltk.download('stopwords')

# FastAPI app
app = FastAPI(title="Advanced Candidate Search System", description="A comprehensive candidate search system using industry-standard information retrieval techniques.")

# Pydantic models for request and response
class SearchQuery(BaseModel):
    query: str
    top_k: int = 20

class CandidateResponse(BaseModel):
    candidate_id: str
    name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    linkedin: Optional[str]
    github: Optional[str]
    description: Optional[str]
    summary: Optional[str]
    skills: List[str]
    technologies: List[str]
    companies: List[Dict[str, Any]]
    projects: List[Dict[str, Any]]
    publications: List[Dict[str, Any]]
    achievements: List[Dict[str, Any]]
    courses: List[str]
    locations: List[str]
    education: List[str]
    institutions: List[Dict[str, Any]]
    relevance_score: float
    score_breakdown: Dict[str, float]

class AdvancedCandidateSearchSystem:
    def __init__(self):
        # Neo4j configuration
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
        
        # Initialize NLP components
        self.stemmer = PorterStemmer()
        self.stop_words = set(stopwords.words('english'))
        
        # Industry-standard parameters for BM25
        self.k1 = 1.5
        self.b = 0.75
        
        # Technology and skill synonyms
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
        
        # Institution synonyms
        self.institution_synonyms = {
            'mit': ['massachusetts institute of technology'],
            'iit': ['indian institute of technology'],
            'stanford': ['stanford university'],
            'harvard': ['harvard university'],
            'caltech': ['california institute of technology'],
            'oxford': ['university of oxford'],
            'cambridge': ['university of cambridge']
        }
    
    def close(self):
        self.driver.close()
    
    def preprocess_text(self, text: str) -> List[str]:
        if not text:
            return []
        tokens = word_tokenize(text.lower())
        processed_tokens = [
            self.stemmer.stem(token) for token in tokens
            if token.isalnum() and token not in self.stop_words and len(token) > 2
        ]
        return processed_tokens
    
    def expand_query_terms(self, query_terms: List[str]) -> Set[str]:
        expanded_terms = set(query_terms)
        for term in query_terms:
            term_lower = term.lower()
            for main_tech, synonyms in self.tech_synonyms.items():
                if term_lower in main_tech or main_tech in term_lower or term_lower in synonyms:
                    expanded_terms.update(synonyms)
                    expanded_terms.add(main_tech)
            for main_inst, synonyms in self.institution_synonyms.items():
                if term_lower == main_inst or term_lower in synonyms or any(term_lower in inst for inst in synonyms):
                    expanded_terms.add(main_inst)
                    expanded_terms.update(synonyms)
        return expanded_terms
    
    def fuzzy_string_similarity(self, s1: str, s2: str) -> float:
        if not s1 or not s2:
            return 0.0
        s1_lower, s2_lower = s1.lower().strip(), s2.lower().strip()
        if s1_lower == s2_lower:
            return 1.0
        if s1_lower in s2_lower or s2_lower in s1_lower:
            return 0.8
        seq_similarity = SequenceMatcher(None, s1_lower, s2_lower).ratio()
        tokens1, tokens2 = set(s1_lower.split()), set(s2_lower.split())
        token_similarity = len(tokens1.intersection(tokens2)) / len(tokens1.union(tokens2)) if tokens1 and tokens2 else 0.0
        return max(seq_similarity, token_similarity)
    
    def extract_all_candidates_comprehensive(self, location_filter: str = None) -> List[Dict[str, Any]]:
        logger.info("Extracting all candidates comprehensively...")
        with self.driver.session(database=self.neo4j_database) as session:
            query = """
                MATCH (c:Candidate)
                Optional MATCH (c)-[:HAS_SKILL]->(s:Skill)
                Optional MATCH (c)-[:HAS_EXPERIENCE_WITH]->(t:Technology)
                Optional MATCH (c)-[:WORKED_AT]->(co:Company)
                Optional MATCH (c)-[:WORKED_ON]->(p:Project)
                Optional MATCH (c)-[:PUBLISHED]->(pub:Publication)
                Optional MATCH (c)-[:ACHIEVED]->(a:Achievement)
                Optional MATCH (c)-[:COMPLETED]->(course:Course)
                Optional MATCH (c)-[:LOCATED_IN]->(l:Location)
                Optional MATCH (c)-[edu_rel]->(edu)
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
                     COLLECT(DISTINCT edu.name) AS education,
                     COLLECT(DISTINCT {name: edu.name, type: labels(edu)[0]}) AS institutions
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
                    education,
                    institutions
            """
            if location_filter:
                query = query.replace("MATCH (c:Candidate)", 
                    "MATCH (c:Candidate)-[:LOCATED_IN]->(l:Location) WHERE toLower(l.name) CONTAINS toLower($location_filter)")
            result = session.run(query, location_filter=location_filter) if location_filter else session.run(query)
            candidates = []
            for record in result:
                candidate = dict(record)
                text_corpus = []
                for field in ['name', 'description', 'summary']:
                    if candidate.get(field):
                        text_corpus.append(candidate[field])
                text_corpus.extend((candidate.get('skills', []) or []) + (candidate.get('technologies', []) or []))
                for company in (candidate.get('companies', []) or []):
                    if isinstance(company, dict) and company.get('name'):
                        text_corpus.append(company['name'])
                    elif isinstance(company, str):
                        text_corpus.append(company)
                for project in (candidate.get('projects', []) or []):
                    if isinstance(project, dict):
                        if project.get('name'):
                            text_corpus.append(project['name'])
                        if project.get('description'):
                            text_corpus.append(project['description'])
                        if project.get('technologies'):
                            text_corpus.extend(project['technologies'] if isinstance(project['technologies'], list) else [str(project['technologies'])])
                for pub in (candidate.get('publications', []) or []):
                    if isinstance(pub, dict):
                        for field in ['title', 'description', 'keywords']:
                            if pub.get(field):
                                text_corpus.append(pub[field])
                for achievement in (candidate.get('achievements', []) or []):
                    if isinstance(achievement, dict):
                        for field in ['title', 'description']:
                            if achievement.get(field):
                                text_corpus.append(achievement[field])
                text_corpus.extend((candidate.get('courses', []) or []) + (candidate.get('education', []) or []) + (candidate.get('locations', []) or []))
                for institution in (candidate.get('institutions', []) or []):
                    if isinstance(institution, dict) and institution.get('name'):
                        text_corpus.append(institution['name'])
                    elif isinstance(institution, str):
                        text_corpus.append(institution)
                candidate['text_corpus'] = ' '.join(filter(None, text_corpus))
                candidate['processed_tokens'] = self.preprocess_text(candidate['text_corpus'])
                candidates.append(candidate)
            logger.info(f"Extracted {len(candidates)} candidates comprehensively")
            return candidates
    
    def calculate_tf_idf_scores(self, candidates: List[Dict[str, Any]], query_terms: Set[str]) -> Dict[str, float]:
        logger.info("Calculating TF-IDF scores...")
        df = Counter()
        total_docs = len(candidates)
        for candidate in candidates:
            unique_terms = set(candidate['processed_tokens'])
            for term in unique_terms:
                df[term] += 1
        tfidf_scores = {}
        for candidate in candidates:
            candidate_id = candidate['candidate_id']
            doc_tokens = candidate['processed_tokens']
            doc_length = len(doc_tokens)
            if doc_length == 0:
                tfidf_scores[candidate_id] = 0.0
                continue
            score = 0.0
            tf = Counter(doc_tokens)
            for term in query_terms:
                processed_term = self.stemmer.stem(term.lower())
                if processed_term in tf:
                    term_freq = 1 + math.log(tf[processed_term])
                    doc_freq = df.get(processed_term, 0)
                    if doc_freq > 0:
                        inverse_doc_freq = math.log(total_docs / doc_freq)
                        score += term_freq * inverse_doc_freq
            tfidf_scores[candidate_id] = score
        return tfidf_scores
    
    def calculate_bm25_scores(self, candidates: List[Dict[str, Any]], query_terms: Set[str]) -> Dict[str, float]:
        logger.info("Calculating BM25 scores...")
        total_length = sum(len(candidate['processed_tokens']) for candidate in candidates)
        avg_doc_length = total_length / len(candidates) if candidates else 0
        df = Counter()
        total_docs = len(candidates)
        for candidate in candidates:
            unique_terms = set(candidate['processed_tokens'])
            for term in unique_terms:
                df[term] += 1
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
                    term_freq = tf[processed_term]
                    doc_freq = df.get(processed_term, 0)
                    if doc_freq > 0:
                        idf = math.log((total_docs - doc_freq + 0.5) / (doc_freq + 0.5))
                        tf_component = (term_freq * (self.k1 + 1)) / (
                            term_freq + self.k1 * (1 - self.b + self.b * (doc_length / avg_doc_length))
                        )
                        score += idf * tf_component
            bm25_scores[candidate_id] = score
        return bm25_scores
    
    def calculate_semantic_similarity_scores(self, candidates: List[Dict[str, Any]], query: str) -> Dict[str, float]:
        logger.info("Calculating semantic similarity scores...")
        similarity_scores = {}
        query_lower = query.lower()
        for candidate in candidates:
            candidate_id = candidate['candidate_id']
            max_similarity = 0.0
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
            for skill in (candidate.get('skills', []) or []):
                similarity = self.fuzzy_string_similarity(query_lower, skill)
                max_similarity = max(max_similarity, similarity)
            for tech in (candidate.get('technologies', []) or []):
                similarity = self.fuzzy_string_similarity(query_lower, tech)
                max_similarity = max(max_similarity, similarity)
            for institution in (candidate.get('institutions', []) or []):
                institution_name = institution.get('name', '') if isinstance(institution, dict) else institution
                similarity = self.fuzzy_string_similarity(query_lower, institution_name)
                max_similarity = max(max_similarity, similarity)
            similarity_scores[candidate_id] = max_similarity
        return similarity_scores
    
    def calculate_exact_match_bonus(self, candidates: List[Dict[str, Any]], query_terms: Set[str]) -> Dict[str, float]:
        logger.info("Calculating exact match bonuses...")
        exact_match_scores = {}
        for candidate in candidates:
            candidate_id = candidate['candidate_id']
            bonus_score = 0.0
            text_corpus_lower = candidate.get('text_corpus', '').lower()
            for term in query_terms:
                term_lower = term.lower()
                location_lower = candidate.get('locations', [''])[0].lower() if candidate.get('locations') else ''
                if term_lower == location_lower and location_lower:
                    bonus_score += 10.0
                for institution in (candidate.get('institutions', []) or []):
                    institution_name = institution.get('name', '').lower() if isinstance(institution, dict) else institution.lower()
                    if term_lower == institution_name and institution_name:
                        bonus_score += 8.0
                if f' {term_lower} ' in f' {text_corpus_lower} ':
                    bonus_score += 2.0
                elif term_lower in text_corpus_lower:
                    bonus_score += 1.0
            exact_match_scores[candidate_id] = bonus_score
        return exact_match_scores
    
    def parse_query_with_llm(self, natural_language_query: str) -> Dict[str, Any]:
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
        - For institutions, recognize common abbreviations (e.g., "MIT" → "Massachusetts Institute of Technology")
        - Include all relevant institutions mentioned in the query
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
            key_terms = parsed_query.get('key_terms', [])
            all_terms = set(key_terms)
            for field in ['skills', 'locations', 'companies', 'institutions', 'roles']:
                all_terms.update(parsed_query.get(field, []))
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
        logger.info(f"Starting advanced search for: {natural_language_query}")
        query_params = self.parse_query_with_llm(natural_language_query)
        logger.info(f"Parsed query parameters: {query_params}")
        location_filter = query_params.get('locations', [None])[0]
        logger.info(f"Applying location filter: {location_filter}")
        all_candidates = self.extract_all_candidates_comprehensive(location_filter)
        logger.info(f"Total candidates in database after location filter: {len(all_candidates)}")
        if not all_candidates:
            return []
        query_terms = set(query_params.get('expanded_terms', []))
        tfidf_scores = self.calculate_tf_idf_scores(all_candidates, query_terms)
        bm25_scores = self.calculate_bm25_scores(all_candidates, query_terms)
        similarity_scores = self.calculate_semantic_similarity_scores(all_candidates, natural_language_query)
        exact_match_scores = self.calculate_exact_match_bonus(all_candidates, query_terms)
        
        def normalize_scores(scores: Dict[str, float]) -> Dict[str, float]:
            if not scores:
                return scores
            max_score = max(scores.values()) if scores.values() else 1
            min_score = min(scores.values()) if scores.values() else 0
            if max_score == min_score:
                return {k: 1.0 for k in scores.keys()}
            return {k: (v - min_score) / (max_score - min_score) for k, v in scores.items()}
        
        normalized_tfidf = normalize_scores(tfidf_scores)
        normalized_bm25 = normalize_scores(bm25_scores)
        normalized_similarity = normalize_scores(similarity_scores)
        normalized_exact = normalize_scores(exact_match_scores)
        
        composite_scores = {}
        for candidate in all_candidates:
            candidate_id = candidate['candidate_id']
            composite_score = (
                0.35 * normalized_bm25.get(candidate_id, 0) +
                0.25 * normalized_tfidf.get(candidate_id, 0) +
                0.25 * normalized_similarity.get(candidate_id, 0) +
                0.15 * normalized_exact.get(candidate_id, 0)
            )
            composite_scores[candidate_id] = composite_score
            candidate['relevance_score'] = composite_score
            candidate['score_breakdown'] = {
                'bm25': normalized_bm25.get(candidate_id, 0),
                'tfidf': normalized_tfidf.get(candidate_id, 0),
                'similarity': normalized_similarity.get(candidate_id, 0),
                'exact_match': normalized_exact.get(candidate_id, 0),
                'composite': composite_score
            }
        
        ranked_candidates = sorted(all_candidates, key=lambda x: x['relevance_score'], reverse=True)
        logger.info(f"Returning top {min(top_k, len(ranked_candidates))} candidates")
        return ranked_candidates[:top_k]
    
    def format_detailed_results(self, candidates: List[Dict[str, Any]]) -> str:
        if not candidates:
            return "No candidates found matching your criteria."
        result = [
            "=" * 80,
            "ADVANCED CANDIDATE SEARCH RESULTS",
            "=" * 80,
            f"Total candidates found: {len(candidates)}",
            ""
        ]
        for i, candidate in enumerate(candidates, 1):
            candidate_str = f"RANK #{i}\n"
            candidate_str += f"Candidate ID: {candidate['candidate_id']}\n"
            candidate_str += f"Name: {candidate.get('name', 'N/A')}\n"
            candidate_str += f"Overall Relevance Score: {candidate.get('relevance_score', 0):.3f}\n"
            breakdown = candidate.get('score_breakdown', {})
            candidate_str += f"Score Breakdown:\n"
            candidate_str += f"  • BM25 (Relevance): {breakdown.get('bm25', 0):.3f}\n"
            candidate_str += f"  • TF-IDF (Term Importance): {breakdown.get('tfidf', 0):.3f}\n"
            candidate_str += f"  • Semantic Similarity: {breakdown.get('similarity', 0):.3f}\n"
            candidate_str += f"  • Exact Match Bonus: {breakdown.get('exact_match', 0):.3f}\n"
            if candidate.get('email') or candidate.get('phone'):
                candidate_str += f"Contact: "
                if candidate.get('email'):
                    candidate_str += f"Email: {candidate['email']} "
                if candidate.get('phone'):
                    candidate_str += f"Phone: {candidate['phone']}"
                candidate_str += "\n"
            all_skills = list(set((candidate.get('skills', []) or []) + (candidate.get('technologies', []) or [])))
            if all_skills:
                candidate_str += f"Skills & Technologies: {', '.join(all_skills[:15])}"
                if len(all_skills) > 15:
                    candidate_str += f" (+{len(all_skills)-15} more)"
                candidate_str += "\n"
            companies = candidate.get('companies', []) or []
            if companies:
                company_names = [company['name'] if isinstance(company, dict) and company.get('name') else company for company in companies]
                candidate_str += f"Experience: {', '.join(company_names[:5])}"
                if len(company_names) > 5:
                    candidate_str += f" (+{len(company_names)-5} more)"
                candidate_str += "\n"
            institutions = candidate.get('institutions', []) or []
            if institutions:
                institution_names = [f"{inst['name']} ({inst.get('type', 'Institution')})" if isinstance(inst, dict) else inst for inst in institutions]
                candidate_str += f"Institutions: {', '.join(institution_names[:3])}"
                if len(institution_names) > 3:
                    candidate_str += f" (+{len(institution_names)-3} more)"
                candidate_str += "\n"
            education = candidate.get('education', []) or []
            if education:
                candidate_str += f"Education: {', '.join(education[:3])}"
                if len(education) > 3:
                    candidate_str += f" (+{len(education)-3} more)"
                candidate_str += "\n"
            projects = candidate.get('projects', []) or []
            if projects:
                candidate_str += f"Notable Projects: {len(projects)} project(s)\n"
            publications = candidate.get('publications', []) or []
            if publications:
                candidate_str += f"Publications: {len(publications)} publication(s)\n"
            achievements = candidate.get('achievements', []) or []
            if achievements:
                candidate_str += f"Achievements: {len(achievements)} achievement(s)\n"
            locations = candidate.get('locations', []) or []
            if locations:
                candidate_str += f"Location: {', '.join(locations)}\n"
            candidate_str += "-" * 80
            result.append(candidate_str)
        return "\n".join(result)
    
    def show_detailed_candidate_profile(self, candidate_id: str, candidates: List[Dict[str, Any]]) -> str:
        candidate = next((c for c in candidates if c['candidate_id'] == candidate_id), None)
        if not candidate:
            raise HTTPException(status_code=404, detail=f"Candidate with ID '{candidate_id}' not found in current results.")
        result = [
            "="*80,
            "DETAILED CANDIDATE PROFILE",
            "="*80,
            f"Candidate ID: {candidate['candidate_id']}",
            f"Name: {candidate.get('name', 'N/A')}",
            f"Relevance Score: {candidate.get('relevance_score', 0):.3f}"
        ]
        for field in ['email', 'phone', 'linkedin', 'github']:
            if candidate.get(field):
                result.append(f"{field.capitalize()}: {candidate[field]}")
        for field in ['description', 'summary']:
            if candidate.get(field):
                result.append(f"\n{field.capitalize()}:\n{candidate[field]}")
        all_skills = list(set((candidate.get('skills', []) or []) + (candidate.get('technologies', []) or [])))
        if all_skills:
            result.append(f"\nSkills & Technologies ({len(all_skills)}):")
            for i, skill in enumerate(all_skills, 1):
                result.append(f"  {i}. {skill}")
        companies = candidate.get('companies', []) or []
        if companies:
            result.append(f"\nWork Experience ({len(companies)}):")
            for i, company in enumerate(companies, 1):
                result.append(f"  {i}. {company.get('name', 'Unknown') if isinstance(company, dict) else company}")
        institutions = candidate.get('institutions', []) or []
        if institutions:
            result.append(f"\nInstitutions ({len(institutions)}):")
            for i, inst in enumerate(institutions, 1):
                result.append(f"  {i}. {inst.get('name', 'Unknown')} ({inst.get('type', 'Institution')})" if isinstance(inst, dict) else f"  {i}. {inst}")
        education = candidate.get('education', []) or []
        if education:
            result.append(f"\nEducation ({len(education)}):")
            for i, edu in enumerate(education, 1):
                result.append(f"  {i}. {edu}")
        projects = candidate.get('projects', []) or []
        if projects:
            result.append(f"\nProjects ({len(projects)}):")
            for i, project in enumerate(projects, 1):
                result.append(f"  {i}. {project.get('name', 'Unnamed Project')}")
                if isinstance(project, dict):
                    if project.get('description'):
                        result.append(f"     Description: {project['description']}")
                    if project.get('technologies'):
                        result.append(f"     Technologies: {project['technologies']}")
        publications = candidate.get('publications', []) or []
        if publications:
            result.append(f"\nPublications ({len(publications)}):")
            for i, pub in enumerate(publications, 1):
                result.append(f"  {i}. {pub.get('title', 'Untitled Publication')}")
                if isinstance(pub, dict):
                    if pub.get('description'):
                        result.append(f"     Description: {pub['description']}")
                    if pub.get('keywords'):
                        result.append(f"     Keywords: {pub['keywords']}")
        achievements = candidate.get('achievements', []) or []
        if achievements:
            result.append(f"\nAchievements ({len(achievements)}):")
            for i, achievement in enumerate(achievements, 1):
                result.append(f"  {i}. {achievement.get('title', 'Untitled Achievement')}")
                if isinstance(achievement, dict) and achievement.get('description'):
                    result.append(f"     Description: {achievement['description']}")
        courses = candidate.get('courses', []) or []
        if courses:
            result.append(f"\nCourses ({len(courses)}):")
            for i, course in enumerate(courses, 1):
                result.append(f"  {i}. {course}")
        locations = candidate.get('locations', []) or []
        if locations:
            result.append(f"\nLocation(s): {', '.join(locations)}")
        result.append("="*80)
        return "\n".join(result)
    
    def explain_ranking_algorithm(self) -> str:
        return "\n".join([
            "="*80,
            "ADVANCED RANKING ALGORITHM EXPLANATION",
            "="*80,
            "Our system uses a multi-dimensional ranking approach combining:",
            "",
            "1. BM25 (Best Matching 25):",
            "   - Industry-standard probabilistic retrieval model",
            "   - Considers term frequency and document length normalization",
            "   - Parameters: k1=1.5 (term frequency scaling), b=0.75 (length normalization)",
            "",
            "2. TF-IDF (Term Frequency-Inverse Document Frequency):",
            "   - Measures term importance in document vs. corpus",
            "   - Rewards terms that are frequent in document but rare in corpus",
            "",
            "3. Semantic Similarity:",
            "   - Fuzzy string matching across all candidate fields",
            "   - Handles variations in terminology and abbreviations",
            "   - Includes institution matching for educational background",
            "",
            "4. Exact Match Bonus:",
            "   - Extra weight for exact matches of key terms",
            "   - Special bonus for location and institution matches",
            "",
            "5. Query Expansion:",
            "   - Automatically includes synonyms and related technologies",
            "   - Handles common abbreviations (e.g., 'JS' → 'JavaScript', 'MIT' → 'Massachusetts Institute of Technology')",
            "",
            "Final scores are weighted combinations of these factors:",
            "   - 35% BM25, 25% TF-IDF, 25% Semantic Similarity, 15% Exact Match",
            "="*80
        ])

# Global instance of the search system
search_system = AdvancedCandidateSearchSystem()

# FastAPI endpoints
@app.on_event("shutdown")
def shutdown_event():
    search_system.close()

@app.get("/explain")
async def explain_ranking():
    return {"explanation": search_system.explain_ranking_algorithm()}

@app.post("/search", response_model=List[CandidateResponse])
async def search_candidates(query: SearchQuery):
    print(f"Received search query: {query.query} with top_k={query.top_k}")
    try:
        candidates = search_system.search_candidates_advanced(query.query, query.top_k)
        return candidates
    except Exception as e:
        logger.error(f"Error during search: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/candidate/{candidate_id}")
async def get_candidate_details(candidate_id: str, query: str):
    try:
        candidates = search_system.search_candidates_advanced(query, top_k=50)
        result = search_system.show_detailed_candidate_profile(candidate_id, candidates)
        return {"details": result}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error retrieving candidate details: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/results")
async def get_formatted_results(query: str, top_k: int = 20):
    try:
        candidates = search_system.search_candidates_advanced(query, top_k)
        formatted_results = search_system.format_detailed_results(candidates)
        return {"results": formatted_results}
    except Exception as e:
        logger.error(f"Error formatting results: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)