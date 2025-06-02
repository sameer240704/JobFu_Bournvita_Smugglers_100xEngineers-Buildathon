# HireAI by JobFu

Welcome to the **HireAI by JobFu** repository!  
This project demonstrates an advanced AI-powered resume extraction, enrichment, and candidate ranking pipeline, designed for efficient, accurate, and scalable candidate search and comparison.

---

## 🚀 Overview

This repository contains a Python backend that enables:
- Extraction of candidate data from resumes (PDFs, LinkedIn, GitHub)
- AI-based summary generation for each candidate
- Graph database (Neo4j) initialization and clustering for fast, relationship-aware querying
- Advanced candidate ranking using industry-standard information retrieval techniques (BM25, TF-IDF, Fuzzy Matching, Query Expansion)
- AI-powered candidate comparison
- **Trio Database Architecture**: User authentication and candidate data are managed through Supabase and MongoDB. Ranking is managed by Neo4j

---

## 📁 Main Repository Structure

**Top-level:**
```
README.md
ai-server/
client/
server/
```
---

### Contents of `ai-server/`:
```
.gitignore
main.py
__pycache__/
models/
services/
```
---

### Contents of `client/`:
```
.gitignore
README.md
components.json
jsconfig.json
middleware.js
next.config.mjs
package.json
postcss.config.mjs
yarn.lock
app/
components/
constants/
context/
hooks/
lib/
public/
utils/
```
---

### Contents of `server/`:
```
.gitignore
index.js
package.json
vercel.json
yarn.lock
controllers/
database/
helpers/
middlewares/
models/
routes/
```
---

## 📂 Additional Data/Model Structure

- `datafolder/` – Contains 36 Mumbai-based resumes for local extraction.
- `globalfolder/` – Contains 22 global resumes (LinkedIn sourced).
- `candidate_data/` – Stores extracted candidate JSON data, including LinkedIn and GitHub links.
- `candidate_linkeldn/` – Stores extracted LinkedIn data per candidate.
- `candidate_github/` – Stores extracted GitHub data per candidate.
- `candidate_summaries/` – Stores AI-generated summaries for each candidate.
- `models/` – Contains all backend scripts and FastAPI server logic (within `ai-server/`).
- `extractor.py` – Uses Llama-3-8B-8192 to individually extract resume data.
- `extracted_folder.py` – Bulk extractor for multiple resumes at once.
- `linkeldn_data_extractor.py` – Extracts data from LinkedIn, stores in `candidate_linkeldn/`.
- `github_data_extractor.py` – Extracts candidate data from GitHub, stores in `candidate_github/`.
- `summary_extractor.py` – Generates AI summaries (Llama-3-8B-8192 context), saves to `candidate_summaries/`.
- `eligble_neo.py` – Initializes Neo4j (AuraDB) for each candidate's JSON; builds graph structure for fast query/retrieval.
- `rank_fastapi.py` – Implements advanced ranking logic for candidate search results.
- `comparison.py` – Provides AI-based candidate comparison across multiple parameters.
- `comparison.py` takes its input from the file `candidates_1.json`.

---
## Why we choose Llama-3-8B-8192 

1. **Extended Context Window (8192 tokens)** : Allowed seamless parsing of long resumes and LinkedIn profiles without truncation, improving extraction fidelity.
   
3. **Efficient 8B Parameter Size** : Balanced high performance and speed on mid-range GPUs, making it suitable for fast, scalable bulk extraction tasks.

4. **Advanced LLaMA 3 Architecture**: Outperformed Groq and Gemini in reasoning and comprehension tasks, crucial for understanding nuanced candidate profiles.

5. **Superior Fine-Tuning for Extraction** : Achieved higher precision in identifying and structuring candidate details (skills, education, projects, etc.) from noisy real-world data.

6. **Domain Adaptability**: Handled resumes and profiles across Indian and global datasets with better accuracy than older Groq/Gemini models.

7. **Lower Latency in Local Deployment** : Enabled near real-time extraction and summary generation compared to cloud-only alternatives like Gemini Pro.

8. **Consistent Performance Across Tasks** : Used in extractor.py, summary_extractor.py, and comparison.py—showed reliable output across extraction, summarization, and ranking.

9. **Better Reasoning for AI Comparisons** : Generated coherent, comparative summaries between candidates, aiding HR decision-making.

10. **Integration Flexibility** : Easily integrated with your FastAPI backend, supporting both single and bulk extraction workflows.

11. **Open-Weight Model Advantage** : Unlike proprietary Groq or Gemini APIs, LLaMA 3–8B–8192 provided full control over deployment, scaling, and cost optimization.
    
---
## 🏗️ Data Extraction & Processing Pipeline

- **Resume Extraction**:  
  - Use `extractor.py` (Llama-3-8B-8192) for single resumes, or `extracted_folder.py` for bulk extraction from `datafolder/` (Mumbai resumes) and `globalfolder/` (LinkedIn global resumes).
  - Output: JSON files in `candidate_data/`, each including parameters like LinkedIn link and GitHub link.

- **LinkedIn & GitHub Data Extraction**:  
  - `linkeldn_data_extractor.py`: Scrapes and parses LinkedIn profiles, storing results in `candidate_linkeldn/`.
  - `github_data_extractor.py`: Extracts candidate data from GitHub, storing results in `candidate_github/`.

- **AI Summary Generation**:  
  - `summary_extractor.py` uses Llama-3-8B-8192 context to create a detailed summary for each candidate, stored in `candidate_summaries/`.

---

## 🗃️ Database Architecture

### Supabase (User Authentication)

- **Supabase** is used for handling user authentication, specifically Google authentication.
- All user authentication data (registration, login, profiles) is securely managed by Supabase.

### MongoDB (Candidate Data, History, and More)

- **MongoDB** is used to store all application data except authentication, including:
  - Candidate data
  - Candidate search and comparison history
  - Extracted LinkedIn data
  - Extracted GitHub data
  - Any other relevant data related to candidates or application state

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
![Untitled](https://github.com/user-attachments/assets/886ec931-3314-49d2-805a-8c51f8b43a6d)
![Untitled-1](https://github.com/user-attachments/assets/c2def683-9b8e-4353-9dbf-e9a95440c33b)
![Untitled-1](https://github.com/user-attachments/assets/9c7948fd-b968-4c73-8013-72a345dea9bb)
![Untitled](https://github.com/user-attachments/assets/13643947-3018-4304-841f-5db3d6d145f9)
![Untitled-1](https://github.com/user-attachments/assets/7db6d3cb-c3b4-446b-9c13-75c53d05b79d)
![Untitled](https://github.com/user-attachments/assets/77ab4fda-3f40-490a-82f7-049a93a3c0c5)
![Untitled-1](https://github.com/user-attachments/assets/8473b960-9cbf-463d-a670-4efbc2b63160)






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

## 🤖 Something to bring you in  notice 
We want to highlight that we have developed an AI agent to select and compare any number of candidates side by side based on their general overall profile, education, experience, projects, and skills. The comparison is conducted using the following ten parameters for each candidate:
    Technical Skills Depth
    Programming Languages Proficiency
    Project Complexity & Impact
    Professional Experience Quality
    Technology Stack Breadth
    Problem Solving Ability
    Educational Foundation
    Industry Exposure
    Communication & Leadership
    Career Growth Potential

##  Project Images 
![image](https://github.com/user-attachments/assets/a750c45d-f3b8-41cf-967f-ed8edecc7a47)
![image](https://github.com/user-attachments/assets/16100adc-000f-408f-9c28-63776c4e5c25)
![image](https://github.com/user-attachments/assets/85e84aea-fd4f-471a-8064-bc4db8cb2f35)
![image](https://github.com/user-attachments/assets/c12bc4c0-1a5d-4ddf-a862-b5fd3f18049d)
![image](https://github.com/user-attachments/assets/3e061945-a809-4b8f-93f8-e8d6182c7461)
![image](https://github.com/user-attachments/assets/2cde4624-6763-40db-9b96-faf12402898a)








##  This is how the Email has been sent 
![Untitled-1](https://github.com/user-attachments/assets/4bc12821-d9d7-487a-877c-2db901541ca4)
![Untitled](https://github.com/user-attachments/assets/3aacf16c-8640-4dbc-ac13-f612d0f84dac)
![Untitled](https://github.com/user-attachments/assets/e8e07833-85d4-4a7b-8340-f378f919a845)



## 🛠️ Getting Started

1. **Clone the Repository**
    ```bash
    git clone https://github.com/sameer240704/100xEngineers-Buildathon.git
    cd 100xEngineers-Buildathon
    ```

2. **Install Dependencies**
    - Follow the setup instructions in the `ai-server/`, `server/`, and `client/` directories.

3. **Run the Backend and AI Server**
    - See respective directories for FastAPI/Node.js server instructions.

4. **Run the Client**
    - See `client/` folder for frontend setup and start instructions.

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

- [HireAI by JobFu Website](#) (insert link if available)
- [Documentation](./docs/)
- [Issues](https://github.com/sameer240704/100xEngineers-Buildathon/issues)

---

## 🙏 Acknowledgements

Special thanks to the organizers, mentors, and all participants of the HireAI by Jobfu project.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 🎥 Project Demo & Deployed Link
Video Demo: [https://www.loom.com/share/18327b9baa65499697d23b2141af4bc6?sid=1f3d33f9-fa07-4527-bd58-62c2ea32a2d4]

Deployed Link: [https://jobfu-tech.vercel.app/]

P.S. We had an absolute blast crafting the AI agent for side-by-side candidate comparison in HireAI by JobFu! Its robust evaluation across ten key parameters, including Technical Skills Depth, Programming Languages Proficiency, Project Complexity, and Career Growth Potential, is set to revolutionize hiring processes. We’re thrilled about its potential to streamline recruitment and can’t wait to integrate this feature into the frontend, creating an intuitive, dynamic interface that empowers recruiters with unparalleled insights and efficiency!



Happy building! 🚀
