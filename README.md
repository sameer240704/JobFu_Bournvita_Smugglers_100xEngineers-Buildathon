# 100xEngineers Buildathon

Welcome to the **100xEngineers Buildathon** repository!  
This project demonstrates an advanced AI-powered resume extraction, enrichment, and candidate ranking pipeline, designed for efficient, accurate, and scalable candidate search and comparison.

---

## 🚀 Overview

This repository contains a Python backend that enables:
- Extraction of candidate data from resumes (PDFs, LinkedIn, GitHub)
- AI-based summary generation for each candidate
- Graph database (Neo4j) initialization and clustering for fast, relationship-aware querying
- Advanced candidate ranking using industry-standard information retrieval techniques (BM25, TF-IDF, Fuzzy Matching, Query Expansion)
- AI-powered candidate comparison

---

## 📂 Repository Structure

- `datafolder/` – Contains 36 Mumbai-based resumes for local extraction.
- `globalfolder/` – Contains 22 global resumes (LinkedIn sourced).
- `candidate_data/` – Stores extracted candidate JSON data, including LinkedIn and GitHub links.
- `candidate_linkeldn/` – Stores extracted LinkedIn data per candidate.
- `candidate_github/` – Stores extracted GitHub data per candidate.
- `candidate_summaries/` – Stores AI-generated summaries for each candidate.
- `models/` – Contains all backend scripts and FastAPI server logic.
- `extractor.py` – Uses Grok model Llama-3-8B-8192 to individually extract resume data.
- `extracted_folder.py` – Bulk extractor for multiple resumes at once.
- `linkeldn_data_extractor.py` – Extracts data from LinkedIn, stores in `candidate_linkeldn/`.
- `github_data_extractor.py` – Extracts data from GitHub, stores in `candidate_github/`.
- `summary_extractor.py` – Generates AI summaries (Grok model : Llama-3-8B-8192), saves to `candidate_summaries/`.
- `eligble_neo.py` – Initializes Neo4j (AuraDB) for each candidate's JSON; builds graph structure for fast query/retrieval.
- `rank_fastapi.py` – Implements advanced ranking logic for candidate search results.
- `comparison.py` – Provides AI-based candidate comparison across multiple parameters.
  - **Note:** `comparison.py` takes its input from the file `candidates_1.json`.

---

## 🏗️ Data Extraction & Processing Pipeline

- **Resume Extraction**:  
  - Use `extractor.py` (model) for single resumes, or `extracted_folder.py` for bulk extraction from `datafolder/` (Mumbai resumes) and `globalfolder/` (LinkedIn global resumes).
  - Output: JSON files in `candidate_data/`, each including parameters like LinkedIn link and GitHub link.

- **LinkedIn & GitHub Data Extraction**:  
  - `linkeldn_data_extractor.py`: Scrapes and parses LinkedIn profiles, storing results in `candidate_linkeldn/`.
  - `github_data_extractor.py`: Extracts candidate data from GitHub, storing results in `candidate_github/`.

- **AI Summary Generation**:  
  - `summary_extractor.py` uses Llama 3 8B (8192 context) to create a detailed summary for each candidate, stored in `candidate_summaries/`.

---

## 🗃️ Graph Database Initialization (Neo4j)

- **Initialization**:  
  - `eligble_neo.py` connects each candidate JSON to a Neo4j (AuraDB) graph database.
  - Each candidate's unique ID is a node; all extracted data (skills, experience, projects, etc.) are sub-nodes.
  - Clusters are formed on the basis of:
    - Location
    - Company
    - Institution
    - Project
    - Skill
    - Technology
  - Relationships used:
    - `HAS_EXPERIENCED_WITH`
    - `HAS_SKILLED`
    - `LOCATED_IN`
    - `STUDIED_AT`
    - `USES_TECH`
    - `WORKED_AT`
    - `WORKED_ON`
- **Advantages**:  
  - Nodes and sub-nodes can be connected to multiple clusters.
  - Graph structure ensures comprehensive data coverage and prevents overlooked relationships.
  - Enables extremely fast, relationship-aware indexing and querying (superior to traditional retrieval).

---

## 📈 Advanced Candidate Ranking

Implemented in `rank_fastapi.py` and used in the backend server.

**Enhanced candidate search system using industry-standard information retrieval techniques:**

1. **TF-IDF (Term Frequency-Inverse Document Frequency)** for semantic matching  
2. **BM25 ranking algorithm** for relevance scoring  
3. **Fuzzy string matching** for handling variations  
4. **Multi-dimensional scoring with weighted components**  
5. **Query expansion** for comprehensive matching  

**Key Features:**
- No node/data/subdata overlooked, even with complex graph relationships
- No limit on extraction nodes per candidate
- Multi-field semantic search across all attributes
- Advanced fuzzy matching for institutions and companies
- Industry-standard ranking algorithms
- Query expansion and synonym handling

### 🔍 Ranking Algorithm Explanation

The system uses a multi-dimensional ranking approach combining:

1. **BM25 (Best Matching 25):**
   - Industry-standard probabilistic retrieval model
   - Considers term frequency and document length normalization
   - Parameters: k1=1.5 (term frequency scaling), b=0.75 (length normalization)

2. **TF-IDF (Term Frequency-Inverse Document Frequency):**
   - Measures term importance in document vs. corpus
   - Rewards terms that are frequent in document but rare in corpus

3. **Semantic Similarity:**
   - Fuzzy string matching across all candidate fields
   - Handles variations in terminology and abbreviations

4. **Exact Match Bonus:**
   - Extra weight for exact matches of key terms
   - Special bonus for location matches

5. **Query Expansion:**
   - Automatically includes synonyms and related technologies
   - Handles common abbreviations (e.g., 'JS' → 'JavaScript')

**Final scores are weighted combinations of these factors:**
- 35% BM25
- 25% TF-IDF
- 25% Semantic Similarity
- 15% Exact Match

---

## 🤖 AI Candidate Comparison

- Use `comparison.py` for AI-generated comparisons between any number of candidates.
- **Note:** `comparison.py` reads candidate data from the file `candidates_1.json` for comparison across similar parameters.

---

## 🛠️ Getting Started

1. **Clone the Repository**
    ```bash
    git clone https://github.com/sameer240704/100xEngineers-Buildathon.git
    cd 100xEngineers-Buildathon
    ```

2. **Install Dependencies**
    - Follow the setup instructions in the `models/` directory or project root.

3. **Run the Backend**
    - See documentation in the `models/` directory for starting the FastAPI server and using the endpoints.

---

## 🤝 Contributing

1. Fork this repository.
2. Create a new branch: `git checkout -b my-feature`
3. Make your changes and commit: `git commit -m 'Add my feature'`
4. Push to your branch: `git push origin my-feature`
5. Open a Pull Request.

Please follow the [Code of Conduct](CODE_OF_CONDUCT.md) and review our [Contributing Guidelines](CONTRIBUTING.md) if available.

---

## 📑 Resources

- [Buildathon Website](#) (insert link if available)
- [Documentation](./docs/)
- [Issues](https://github.com/sameer240704/100xEngineers-Buildathon/issues)

---

## 🙏 Acknowledgements

Special thanks to the organizers, mentors, and all participants of the 100xEngineers Buildathon.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

Happy building! 🚀
