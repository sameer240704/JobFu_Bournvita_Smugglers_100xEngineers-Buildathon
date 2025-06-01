import os
from dotenv import load_dotenv
from neo4j import GraphDatabase
from groq import Groq
import json
from typing import List, Dict, Any, Set, Tuple
import re
import math
from collections import defaultdict, Counter
from difflib import SequenceMatcher
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Download required NLTK data (run once)
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('punkt')
    nltk.download('stopwords')

class AdvancedCandidateSearchSystem:
    """
    Enhanced candidate search system using industry-standard information retrieval techniques:
    
    1. TF-IDF (Term Frequency-Inverse Document Frequency) for semantic matching
    2. BM25 ranking algorithm for relevance scoring
    3. Fuzzy string matching for handling variations
    4. Multi-dimensional scoring with weighted components
    5. Query expansion for comprehensive matching
    
    This system ensures no deserving candidate is missed by:
    - Comprehensive data extraction without node limits
    - Multi-field semantic search across all candidate attributes
    - Advanced fuzzy matching for institutions and companies
    - Industry-standard ranking algorithms
    - Query expansion and synonym handling
    """
    
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
        
        # Common institution synonyms and abbreviations
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
        """Expand query terms with synonyms and related technologies and institutions"""
        expanded_terms = set(query_terms)
        
        for term in query_terms:
            term_lower = term.lower()
            
            # Add exact matches and partial matches from technology synonyms
            for main_tech, synonyms in self.tech_synonyms.items():
                if term_lower in main_tech or main_tech in term_lower:
                    expanded_terms.update(synonyms)
                    expanded_terms.add(main_tech)
                elif term_lower in synonyms:
                    expanded_terms.add(main_tech)
                    expanded_terms.update(synonyms)
            
            # Add institution synonyms
            for main_inst, synonyms in self.institution_synonyms.items():
                if term_lower == main_inst or term_lower in synonyms:
                    expanded_terms.add(main_inst)
                    expanded_terms.update(synonyms)
                elif any(term_lower in inst for inst in synonyms):
                    expanded_terms.add(main_inst)
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
        """Extract ALL candidates with comprehensive information including institutions (no limits)"""
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
                
                # Add institution information
                for institution in (candidate.get('institutions', []) or []):
                    if isinstance(institution, dict) and institution.get('name'):
                        text_corpus.append(institution['name'])
                    elif isinstance(institution, str):
                        text_corpus.append(institution)
                
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
            
            for institution in (candidate.get('institutions', []) or []):
                if isinstance(institution, dict) and institution.get('name'):
                    similarity = self.fuzzy_string_similarity(query_lower, institution['name'])
                    max_similarity = max(max_similarity, similarity)
                elif isinstance(institution, str):
                    similarity = self.fuzzy_string_similarity(query_lower, institution)
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
                
                # Exact institution match
                for institution in (candidate.get('institutions', []) or []):
                    institution_name = institution.get('name', '').lower() if isinstance(institution, dict) else institution.lower()
                    if term_lower == institution_name and institution_name:
                        bonus_score += 8.0  # High priority for institution match
                
                # Exact word match bonus
                if f' {term_lower} ' in f' {text_corpus_lower} ':
                    bonus_score += 2.0
                
                # Partial match bonus
                elif term_lower in text_corpus_lower:
                    bonus_score += 1.0
            
            exact_match_scores[candidate_id] = bonus_score
        
        return exact_match_scores
    
    def parse_query_with_llm(self, natural_language_query: str) -> Dict[str, Any]:
        """Enhanced query parsing with LLM, including institutions"""
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
    
    def format_detailed_results(self, candidates: List[Dict[str, Any]]) -> str:
        """Format detailed results with scoring transparency"""
        if not candidates:
            return "No candidates found matching your criteria."
        
        result = []
        result.append("=" * 80)
        result.append("ADVANCED CANDIDATE SEARCH RESULTS")
        result.append("=" * 80)
        result.append(f"Total candidates found: {len(candidates)}")
        result.append("")
        
        for i, candidate in enumerate(candidates, 1):
            candidate_str = f"RANK #{i}\n"
            candidate_str += f"Candidate ID: {candidate['candidate_id']}\n"
            candidate_str += f"Name: {candidate.get('name', 'N/A')}\n"
            candidate_str += f"Overall Relevance Score: {candidate.get('relevance_score', 0):.3f}\n"
            
            # Score breakdown
            breakdown = candidate.get('score_breakdown', {})
            candidate_str += f"Score Breakdown:\n"
            candidate_str += f"  • BM25 (Relevance): {breakdown.get('bm25', 0):.3f}\n"
            candidate_str += f"  • TF-IDF (Term Importance): {breakdown.get('tfidf', 0):.3f}\n"
            candidate_str += f"  • Semantic Similarity: {breakdown.get('similarity', 0):.3f}\n"
            candidate_str += f"  • Exact Match Bonus: {breakdown.get('exact_match', 0):.3f}\n"
            
            # Contact information
            if candidate.get('email') or candidate.get('phone'):
                candidate_str += f"Contact: "
                if candidate.get('email'):
                    candidate_str += f"Email: {candidate['email']} "
                if candidate.get('phone'):
                    candidate_str += f"Phone: {candidate['phone']}"
                candidate_str += "\n"
            
            # Skills and technologies
            all_skills = list(set((candidate.get('skills', []) or []) + (candidate.get('technologies', []) or [])))
            if all_skills:
                candidate_str += f"Skills & Technologies: {', '.join(all_skills[:15])}"
                if len(all_skills) > 15:
                    candidate_str += f" (+{len(all_skills)-15} more)"
                candidate_str += "\n"
            
            # Experience
            companies = candidate.get('companies', []) or []
            if companies:
                company_names = []
                for company in companies:
                    if isinstance(company, dict) and company.get('name'):
                        company_names.append(company['name'])
                    elif isinstance(company, str):
                        company_names.append(company)
                
                if company_names:
                    candidate_str += f"Experience: {', '.join(company_names[:5])}"
                    if len(company_names) > 5:
                        candidate_str += f" (+{len(company_names)-5} more)"
                    candidate_str += "\n"
            
            # Institutions
            institutions = candidate.get('institutions', []) or []
            if institutions:
                institution_names = []
                for inst in institutions:
                    if isinstance(inst, dict) and inst.get('name'):
                        institution_names.append(f"{inst['name']} ({inst.get('type', 'Institution')})")
                    elif isinstance(inst, str):
                        institution_names.append(inst)
                
                if institution_names:
                    candidate_str += f"Institutions: {', '.join(institution_names[:3])}"
                    if len(institution_names) > 3:
                        candidate_str += f" (+{len(institution_names)-3} more)"
                    candidate_str += "\n"
            
            # Education
            education = candidate.get('education', []) or []
            if education:
                candidate_str += f"Education: {', '.join(education[:3])}"
                if len(education) > 3:
                    candidate_str += f" (+{len(education)-3} more)"
                candidate_str += "\n"
            
            # Projects
            projects = candidate.get('projects', []) or []
            if projects and len(projects) > 0:
                candidate_str += f"Notable Projects: {len(projects)} project(s)\n"
            
            # Publications
            publications = candidate.get('publications', []) or []
            if publications and len(publications) > 0:
                candidate_str += f"Publications: {len(publications)} publication(s)\n"
            
            # Achievements
            achievements = candidate.get('achievements', []) or []
            if achievements and len(achievements) > 0:
                candidate_str += f"Achievements: {len(achievements)} achievement(s)\n"
            
            # Location
            locations = candidate.get('locations', []) or []
            if locations:
                candidate_str += f"Location: {', '.join(locations)}\n"
            
            candidate_str += "-" * 80
            result.append(candidate_str)
        
        return "\n".join(result)
    
    def interactive_search_enhanced(self):
        """Enhanced interactive search with detailed explanations"""
        print("🚀 ADVANCED CANDIDATE SEARCH SYSTEM")
        print("=" * 60)
        print("Powered by Industry-Standard Ranking Algorithms:")
        print("• BM25 (Best Matching 25) - Gold standard for relevance ranking")
        print("• TF-IDF (Term Frequency-Inverse Document Frequency)")
        print("• Semantic Similarity Matching")
        print("• Comprehensive Data Extraction (No Limits)")
        print("• Multi-dimensional Scoring")
        print("=" * 60)
        print()
        print("Example queries:")
        print("• 'Python machine learning engineers from Stanford'")
        print("• 'Frontend developers with React experience at Google'")
        print("• 'AI researchers who published papers on deep learning'")
        print("• 'Full stack developers from IIT with startup experience'")
        print("• 'Data scientists with AWS cloud experience'")
        print()
        print("Type 'exit' to quit, 'explain' for algorithm details\n")
        
        while True:
            try:
                query = input("🔍 Enter your search query: ").strip()
                
                if query.lower() == 'exit':
                    print("Thank you for using the Advanced Candidate Search System!")
                    break
                
                if query.lower() == 'explain':
                    self.explain_ranking_algorithm()
                    continue
                
                if not query:
                    print("Please enter a valid search query.")
                    continue
                
                print(f"\n🔄 Processing query: '{query}'...")
                print("⚡ Applying advanced ranking algorithms...")
                
                # Perform advanced search
                candidates = self.search_candidates_advanced(query, top_k=20)
                
                # Display results
                print(f"\n✅ Search completed! Found {len(candidates)} relevant candidates.")
                print(self.format_detailed_results(candidates))
                
                # Ask if user wants to see more details
                if candidates:
                    while True:
                        action = input("\n📋 Actions: [m]ore details, [n]ew search, [e]xit: ").lower().strip()
                        if action in ['n', 'new']:
                            break
                        elif action in ['e', 'exit']:
                            return
                        elif action in ['m', 'more']:
                            candidate_id = input("Enter candidate ID for detailed profile: ").strip()
                            self.show_detailed_candidate_profile(candidate_id, candidates)
                        else:
                            print("Invalid option. Please choose 'm', 'n', or 'e'.")
                
            except KeyboardInterrupt:
                print("\n\nExiting gracefully...")
                break
            except Exception as e:
                logger.error(f"Error during search: {e}")
                print(f"❌ An error occurred: {e}")
                print("Please try again with a different query.")
    
    def show_detailed_candidate_profile(self, candidate_id: str, candidates: List[Dict[str, Any]]):
        """Show detailed profile for a specific candidate"""
        candidate = None
        for c in candidates:
            if c['candidate_id'] == candidate_id:
                candidate = c
                break
        
        if not candidate:
            print(f"❌ Candidate with ID '{candidate_id}' not found in current results.")
            return
        
        print(f"\n{'='*80}")
        print(f"DETAILED CANDIDATE PROFILE")
        print(f"{'='*80}")
        print(f"Candidate ID: {candidate['candidate_id']}")
        print(f"Name: {candidate.get('name', 'N/A')}")
        print(f"Relevance Score: {candidate.get('relevance_score', 0):.3f}")
        
        if candidate.get('email'):
            print(f"Email: {candidate['email']}")
        if candidate.get('phone'):
            print(f"Phone: {candidate['phone']}")
        if candidate.get('linkedin'):
            print(f"LinkedIn: {candidate['linkedin']}")
        if candidate.get('github'):
            print(f"GitHub: {candidate['github']}")
        
        if candidate.get('description'):
            print(f"\nDescription:\n{candidate['description']}")
        
        if candidate.get('summary'):
            print(f"\nSummary:\n{candidate['summary']}")
        
        # Skills and Technologies
        all_skills = list(set((candidate.get('skills', []) or []) + (candidate.get('technologies', []) or [])))
        if all_skills:
            print(f"\nSkills & Technologies ({len(all_skills)}):")
            for i, skill in enumerate(all_skills, 1):
                print(f"  {i}. {skill}")
        
        # Experience
        companies = candidate.get('companies', []) or []
        if companies:
            print(f"\nWork Experience ({len(companies)}):")
            for i, company in enumerate(companies, 1):
                if isinstance(company, dict):
                    print(f"  {i}. {company.get('name', 'Unknown')}")
                else:
                    print(f"  {i}. {company}")
        
        # Institutions
        institutions = candidate.get('institutions', []) or []
        if institutions:
            print(f"\nInstitutions ({len(institutions)}):")
            for i, inst in enumerate(institutions, 1):
                if isinstance(inst, dict):
                    print(f"  {i}. {inst.get('name', 'Unknown')} ({inst.get('type', 'Institution')})")
                else:
                    print(f"  {i}. {inst}")
        
        # Education
        education = candidate.get('education', []) or []
        if education:
            print(f"\nEducation ({len(education)}):")
            for i, edu in enumerate(education, 1):
                print(f"  {i}. {edu}")
        
        # Projects
        projects = candidate.get('projects', []) or []
        if projects:
            print(f"\nProjects ({len(projects)}):")
            for i, project in enumerate(projects, 1):
                if isinstance(project, dict):
                    print(f"  {i}. {project.get('name', 'Unnamed Project')}")
                    if project.get('description'):
                        print(f"     Description: {project['description']}")
                    if project.get('technologies'):
                        print(f"     Technologies: {project['technologies']}")
                else:
                    print(f"  {i}. {project}")
        
        # Publications
        publications = candidate.get('publications', []) or []
        if publications:
            print(f"\nPublications ({len(publications)}):")
            for i, pub in enumerate(publications, 1):
                if isinstance(pub, dict):
                    print(f"  {i}. {pub.get('title', 'Untitled Publication')}")
                    if pub.get('description'):
                        print(f"     Description: {pub['description']}")
                    if pub.get('keywords'):
                        print(f"     Keywords: {pub['keywords']}")
                else:
                    print(f"  {i}. {pub}")
        
        # Achievements
        achievements = candidate.get('achievements', []) or []
        if achievements:
            print(f"\nAchievements ({len(achievements)}):")
            for i, achievement in enumerate(achievements, 1):
                if isinstance(achievement, dict):
                    print(f"  {i}. {achievement.get('title', 'Untitled Achievement')}")
                    if achievement.get('description'):
                        print(f"     Description: {achievement['description']}")
                else:
                    print(f"  {i}. {achievement}")
        
        # Courses
        courses = candidate.get('courses', []) or []
        if courses:
            print(f"\nCourses ({len(courses)}):")
            for i, course in enumerate(courses, 1):
                print(f"  {i}. {course}")
        
        # Location
        locations = candidate.get('locations', []) or []
        if locations:
            print(f"\nLocation(s): {', '.join(locations)}")
        
        print("="*80)

    def explain_ranking_algorithm(self):
        """Explain the ranking algorithm to users"""
        print("\n" + "="*80)
        print("ADVANCED RANKING ALGORITHM EXPLANATION")
        print("="*80)
        print("Our system uses a multi-dimensional ranking approach combining:")
        print()
        print("1. BM25 (Best Matching 25):")
        print("   - Industry-standard probabilistic retrieval model")
        print("   - Considers term frequency and document length normalization")
        print("   - Parameters: k1=1.5 (term frequency scaling), b=0.75 (length normalization)")
        print()
        print("2. TF-IDF (Term Frequency-Inverse Document Frequency):")
        print("   - Measures term importance in document vs. corpus")
        print("   - Rewards terms that are frequent in document but rare in corpus")
        print()
        print("3. Semantic Similarity:")
        print("   - Fuzzy string matching across all candidate fields")
        print("   - Handles variations in terminology and abbreviations")
        print("   - Includes institution matching for educational background")
        print()
        print("4. Exact Match Bonus:")
        print("   - Extra weight for exact matches of key terms")
        print("   - Special bonus for location and institution matches")
        print()
        print("5. Query Expansion:")
        print("   - Automatically includes synonyms and related technologies")
        print("   - Handles common abbreviations (e.g., 'JS' → 'JavaScript', 'MIT' → 'Massachusetts Institute of Technology')")
        print()
        print("Final scores are weighted combinations of these factors:")
        print("   - 35% BM25, 25% TF-IDF, 25% Semantic Similarity, 15% Exact Match")
        print("\n" + "="*80)

# Main execution
if __name__ == "__main__":
    try:
        search_system = AdvancedCandidateSearchSystem()
        search_system.interactive_search_enhanced()
    except Exception as e:
        logger.error(f"Fatal error: {e}", exc_info=True)
        print(f"A fatal error occurred: {e}")
    finally:
        search_system.close()