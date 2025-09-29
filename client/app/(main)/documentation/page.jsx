"use client";
import React, { useState, useCallback, useEffect } from "react";
import {
  Book,
  HelpCircle,
  Database,
  FileText,
  Github,
  Linkedin,
  Shield,
  Lock,
  Search,
  ChevronDown,
  ChevronRight,
  Network, // General network/graph
  Users, // For users/candidates/contributors
  Zap, // For AI/fast processing
  Cpu, // For AI models like Llama
  FileJson, // For JSON data
  DatabaseZap, // For Neo4j specific
  Server, // For backend server
  MonitorPlay, // For Client Application
  Fingerprint, // For Supabase Auth
  Layers, // For MongoDB (layers of data)
  Scaling, // For Ranking
  GitCompareArrows, // For Comparison
  Settings2, // For Getting Started/Setup
  Sun,
  Moon, // For theme toggle
} from "lucide-react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "@/context/theme-context"; // Assuming this path

const DocumentationPage = () => {
  const [activeTab, setActiveTab] = useState("knowledge");
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const { theme, toggleTheme } = useTheme(); // Use your theme context

  // React Flow nodes updated based on README
  const getInitialNodes = (currentTheme) => [
    {
      id: "resumeData",
      type: "input",
      data: { label: "Resume Data (PDFs, Folders)" },
      position: { x: 50, y: 50 },
      style: {
        background: currentTheme === "light" ? "#E0F7FA" : "#004D40",
        color: currentTheme === "light" ? "#000" : "#FFF",
        border: `1px solid ${currentTheme === "light" ? "#00ACC1" : "#4DD0E1"}`,
      },
    },
    {
      id: "linkedinScraper",
      type: "input",
      data: { label: "LinkedIn Scraper" },
      position: { x: 50, y: 150 },
      style: {
        background: currentTheme === "light" ? "#E3F2FD" : "#0D47A1",
        color: currentTheme === "light" ? "#000" : "#FFF",
        border: `1px solid ${currentTheme === "light" ? "#1976D2" : "#90CAF9"}`,
      },
    },
    {
      id: "githubScraper",
      type: "input",
      data: { label: "GitHub Scraper" },
      position: { x: 50, y: 250 },
      style: {
        background: currentTheme === "light" ? "#F1F8E9" : "#33691E",
        color: currentTheme === "light" ? "#000" : "#FFF",
        border: `1px solid ${currentTheme === "light" ? "#558B2F" : "#AED581"}`,
      },
    },
    {
      id: "llamaExtraction",
      data: { label: "Llama-3-8B Data Extraction (extractor.py, etc.)" },
      position: { x: 300, y: 150 },
      style: {
        background: currentTheme === "light" ? "#FFF3E0" : "#E65100",
        color: currentTheme === "light" ? "#000" : "#FFF",
        border: `1px solid ${currentTheme === "light" ? "#FF9800" : "#FFCC80"}`,
      },
    },
    {
      id: "jsonDataStorage",
      data: {
        label:
          "JSON Data Storage (candidate_data/, candidate_linkedin/, candidate_github/)",
      },
      position: { x: 550, y: 150 },
      style: {
        background: currentTheme === "light" ? "#FCE4EC" : "#880E4F",
        color: currentTheme === "light" ? "#000" : "#FFF",
        border: `1px solid ${currentTheme === "light" ? "#EC407A" : "#F48FB1"}`,
      },
    },
    {
      id: "llamaSummary",
      data: { label: "Llama-3-8B AI Summary (summary_extractor.py)" },
      position: { x: 550, y: 280 },
      style: {
        background: currentTheme === "light" ? "#FFF3E0" : "#E65100",
        color: currentTheme === "light" ? "#000" : "#FFF",
        border: `1px solid ${currentTheme === "light" ? "#FF9800" : "#FFCC80"}`,
      },
    },
    {
      id: "neo4jInit",
      data: {
        label:
          "Neo4j Graph DB Init (eligble_neo.py)\n- Nodes: Candidate ID, Skills, Exp, etc.\n- Clusters: Location, Company, Skill, etc.\n- Relations: HAS_SKILLED, WORKED_AT, etc.",
      },
      position: { x: 800, y: 100 },
      style: {
        width: 280,
        background: currentTheme === "light" ? "#E8EAF6" : "#283593",
        color: currentTheme === "light" ? "#000" : "#FFF",
        border: `1px solid ${currentTheme === "light" ? "#3F51B5" : "#9FA8DA"}`,
      },
    },
    {
      id: "mongoDB",
      data: {
        label:
          "MongoDB (Application Data)\n- Candidates, History, LinkedIn/GitHub Data",
      },
      position: { x: 800, y: 280 },
      style: {
        width: 280,
        background: currentTheme === "light" ? "#E8F5E9" : "#1B5E20",
        color: currentTheme === "light" ? "#000" : "#FFF",
        border: `1px solid ${currentTheme === "light" ? "#4CAF50" : "#A5D6A7"}`,
      },
    },
    {
      id: "supabaseAuth",
      data: { label: "Supabase (User Authentication)" },
      position: { x: 800, y: 420 },
      style: {
        background: currentTheme === "light" ? "#F3E5F5" : "#4A148C",
        color: currentTheme === "light" ? "#000" : "#FFF",
        border: `1px solid ${currentTheme === "light" ? "#8E24AA" : "#CE93D8"}`,
      },
    },
    {
      id: "rankingEngine",
      data: {
        label: "Ranking Engine (BM25, TF-IDF, Fuzzy)\n(rank_fastapi.py)",
      },
      position: { x: 1100, y: 100 },
      style: {
        background: currentTheme === "light" ? "#FFFDE7" : "#F57F17",
        color: currentTheme === "light" ? "#000" : "#FFF",
        border: `1px solid ${currentTheme === "light" ? "#FFD600" : "#FFF59D"}`,
      },
    },
    {
      id: "comparisonEngine",
      data: { label: "AI Comparison Engine (comparison.py)" },
      position: { x: 1100, y: 230 },
      style: {
        background: currentTheme === "light" ? "#E1F5FE" : "#01579B",
        color: currentTheme === "light" ? "#000" : "#FFF",
        border: `1px solid ${currentTheme === "light" ? "#03A9F4" : "#81D4FA"}`,
      },
    },
    {
      id: "backendServer",
      data: { label: "Backend Server (FastAPI/Node.js)" },
      position: { x: 1350, y: 250 },
      style: {
        background: currentTheme === "light" ? "#ECEFF1" : "#37474F",
        color: currentTheme === "light" ? "#000" : "#FFF",
        border: `1px solid ${currentTheme === "light" ? "#546E7A" : "#B0BEC5"}`,
      },
    },
    {
      id: "clientApp",
      type: "output",
      data: { label: "Client Application (Next.js)" },
      position: { x: 1600, y: 250 },
      style: {
        background: currentTheme === "light" ? "#F1F8E9" : "#33691E",
        color: currentTheme === "light" ? "#000" : "#FFF",
        border: `1px solid ${currentTheme === "light" ? "#7CB342" : "#C5E1A5"}`,
      },
    },
  ];

  const initialEdges = [
    {
      id: "e-resume-llama",
      source: "resumeData",
      target: "llamaExtraction",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "e-linkedin-llama",
      source: "linkedinScraper",
      target: "llamaExtraction",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "e-github-llama",
      source: "githubScraper",
      target: "llamaExtraction",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "e-llama-json",
      source: "llamaExtraction",
      target: "jsonDataStorage",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "e-json-summary",
      source: "jsonDataStorage",
      target: "llamaSummary",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "e-json-neo4j",
      source: "jsonDataStorage",
      target: "neo4jInit",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "e-json-mongo",
      source: "jsonDataStorage",
      target: "mongoDB",
      type: "smoothstep",
      animated: true,
    }, // Data from extraction also goes to MongoDB
    {
      id: "e-summary-mongo",
      source: "llamaSummary",
      target: "mongoDB",
      type: "smoothstep",
      animated: true,
    }, // Summaries stored in MongoDB
    {
      id: "e-neo4j-ranking",
      source: "neo4jInit",
      target: "rankingEngine",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "e-mongo-ranking",
      source: "mongoDB",
      target: "rankingEngine",
      type: "smoothstep",
      animated: true,
    }, // Ranking might also use MongoDB data
    {
      id: "e-mongo-comparison",
      source: "mongoDB",
      target: "comparisonEngine",
      type: "smoothstep",
      animated: true,
    }, // Comparison uses candidate data from MongoDB
    {
      id: "e-ranking-backend",
      source: "rankingEngine",
      target: "backendServer",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "e-comparison-backend",
      source: "comparisonEngine",
      target: "backendServer",
      type: "smoothstep",
      animated: true,
    },
    {
      id: "e-mongo-backend",
      source: "mongoDB",
      target: "backendServer",
      type: "smoothstep",
      animated: true,
    }, // Backend directly interacts with MongoDB
    {
      id: "e-supabase-backend",
      source: "supabaseAuth",
      target: "backendServer",
      type: "smoothstep",
      animated: true,
    }, // Auth info used by backend
    {
      id: "e-backend-client",
      source: "backendServer",
      target: "clientApp",
      type: "smoothstep",
      animated: true,
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(getInitialNodes(theme));
  }, [theme, setNodes]);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge({ ...params, type: "smoothstep", animated: true }, eds)
      ),
    [setEdges]
  );

  const faqData = [
    {
      question: "What is HireAI by Disha AI?",
      answer:
        "HireAI is an advanced AI-powered resume extraction, enrichment, and candidate ranking pipeline designed for efficient, accurate, and scalable candidate search and comparison.",
    },
    {
      question: "What kind of data can be extracted?",
      answer:
        "The system extracts candidate data from resumes (PDFs), LinkedIn profiles, and GitHub profiles. This includes skills, experience, education, projects, and more.",
    },
    {
      question: "How is AI used in this project?",
      answer:
        "AI (Llama-3-8B) is used for data extraction from resumes, generating candidate summaries, and for advanced candidate comparison. AI techniques like TF-IDF and BM25 are used for ranking.",
    },
    {
      question: "What databases are used?",
      answer:
        "HireAI uses a dual database architecture: Supabase for user authentication (Google Auth) and MongoDB for all other application data including candidate profiles, search history, and extracted data. Additionally, Neo4j (AuraDB) is used as a graph database for relationship-aware querying and candidate clustering.",
    },
    {
      question: "How does the candidate ranking work?",
      answer:
        "It uses a multi-dimensional approach combining BM25, TF-IDF, semantic fuzzy matching, exact match bonuses, and query expansion for comprehensive and relevant results.",
    },
    {
      question: "Can I compare candidates?",
      answer:
        "Yes, the system includes an AI-powered candidate comparison feature (`comparison.py`) that analyzes candidates across multiple parameters.",
    },
    {
      question: "How do I get started with the project?",
      answer:
        "Clone the repository, install dependencies for `ai-server/`, `server/`, and `client/` directories, and then run the respective servers and the client application.",
    },
  ];

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  // Helper for section rendering
  const Section = ({ title, icon: Icon, children, titleSize = "text-2xl" }) => (
    <div
      className={`rounded-xl shadow-sm p-6 sm:p-8 ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
      <h2
        className={`font-bold mb-5 sm:mb-6 flex items-center gap-2 ${titleSize} ${
          theme === "dark" ? "text-gray-100" : "text-gray-900"
        }`}
      >
        {Icon && (
          <Icon
            className={`${
              theme === "dark" ? "text-purple-400" : "text-purple-600"
            }`}
            size={titleSize === "text-3xl" ? 30 : 24}
          />
        )}
        {title}
      </h2>
      <div
        className={`space-y-4 text-sm sm:text-base leading-relaxed ${
          theme === "dark" ? "text-gray-300" : "text-gray-600"
        }`}
      >
        {children}
      </div>
    </div>
  );

  return (
    <div
      className={`h-screen overflow-y-scroll ${
        theme === "dark"
          ? "bg-gray-900 text-gray-200"
          : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* Header */}
      <header
        className={`shadow-sm border-b sticky top-0 z-30 ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  theme === "dark" ? "bg-purple-500" : "bg-purple-600"
                }`}
              >
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span
                className={`text-xl font-semibold ${
                  theme === "dark" ? "text-gray-100" : "text-gray-900"
                }`}
              >
                HireAI Documentation
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setActiveTab("knowledge")}
                className={`flex items-center space-x-1.5 sm:space-x-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors ${
                  activeTab === "knowledge"
                    ? theme === "dark"
                      ? "bg-purple-600 text-white"
                      : "bg-purple-100 text-purple-700"
                    : theme === "dark"
                    ? "text-gray-400 hover:bg-gray-700 hover:text-gray-100"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Book size={18} /> <span>Knowledge Base</span>
              </button>
              <button
                onClick={() => setActiveTab("help")}
                className={`flex items-center space-x-1.5 sm:space-x-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors ${
                  activeTab === "help"
                    ? theme === "dark"
                      ? "bg-purple-600 text-white"
                      : "bg-purple-100 text-purple-700"
                    : theme === "dark"
                    ? "text-gray-400 hover:bg-gray-700 hover:text-gray-100"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <HelpCircle size={18} /> <span>Help Centre</span>
              </button>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  theme === "dark"
                    ? "text-yellow-400 hover:bg-gray-700"
                    : "text-purple-600 hover:bg-gray-100"
                }`}
                title={
                  theme === "dark"
                    ? "Switch to Light Mode"
                    : "Switch to Dark Mode"
                }
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "knowledge" && (
          <div className="space-y-8">
            <Section
              title="HireAI by Disha AI - Overview"
              icon={Zap}
              titleSize="text-3xl"
            >
              <p>
                This project demonstrates an advanced AI-powered resume
                extraction, enrichment, and candidate ranking pipeline, designed
                for efficient, accurate, and scalable candidate search and
                comparison.
              </p>
              <p>
                The Python backend enables extraction from resumes (PDFs,
                LinkedIn, GitHub), AI summary generation, graph database (Neo4j)
                initialization for relationship-aware querying, advanced
                candidate ranking (BM25, TF-IDF, Fuzzy Matching, Query
                Expansion), AI candidate comparison, and utilizes a dual
                database architecture (Supabase for auth, MongoDB for data).
              </p>
            </Section>

            <Section title="Data Architecture & Flow" icon={Network}>
              <div
                className={`h-[500px] rounded-lg border-2 border-dashed ${
                  theme === "dark"
                    ? "bg-gray-850 border-gray-700"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  fitView
                  className={theme === "dark" ? "dark-flow" : ""}
                >
                  <Background
                    color={theme === "dark" ? "#2d3748" : "#e2e8f0"}
                    gap={16}
                  />
                  <Controls
                    style={{
                      button: {
                        backgroundColor:
                          theme === "dark" ? "#4A5568" : "#f0f0f0",
                        color: theme === "dark" ? "#E2E8F0" : "#333",
                        border: "none",
                      },
                    }}
                  />
                  <MiniMap
                    nodeColor={(n) =>
                      n.style?.background ||
                      (theme === "dark" ? "#4A5568" : "#fff")
                    }
                    nodeStrokeWidth={2}
                    style={{
                      backgroundColor: theme === "dark" ? "#1A202C" : "#F7FAFC",
                      border: `1px solid ${
                        theme === "dark" ? "#4A5568" : "#E2E8F0"
                      }`,
                    }}
                    pannable
                    zoomable
                  />
                </ReactFlow>
              </div>
              <p className="mt-4 text-xs">
                Interactive diagram showing the data pipeline: from
                resume/profile ingestion, AI extraction & summarization, storage
                in JSON & MongoDB, graph structuring in Neo4j, to final ranking
                and comparison feeding the backend server and client
                application. Supabase handles user authentication.
              </p>
            </Section>

            <Section
              title="Data Extraction & Processing Pipeline"
              icon={FileText}
            >
              <div className="space-y-3">
                <div>
                  <strong>Resume Extraction:</strong> Use{" "}
                  <code>extractor.py</code> (Llama-3-8B-8192) for single
                  resumes, or <code>extracted_folder.py</code> for bulk
                  extraction. Output: JSON files in <code>candidate_data/</code>
                  .
                </div>
                <div>
                  <strong>LinkedIn & GitHub Data Extraction:</strong>{" "}
                  <code>linkeldn_data_extractor.py</code> and{" "}
                  <code>github_data_extractor.py</code> scrape and parse
                  profiles, storing results in <code>candidate_linkeldn/</code>{" "}
                  and <code>candidate_github/</code> respectively.
                </div>
                <div>
                  <strong>AI Summary Generation:</strong>{" "}
                  <code>summary_extractor.py</code> uses Llama-3-8B-8192 to
                  create summaries, stored in <code>candidate_summaries/</code>.
                </div>
              </div>
            </Section>

            <Section title="Key Data & Model Components" icon={Cpu}>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <code>datafolder/</code> & <code>globalfolder/</code>: Contain
                  sample resumes.
                </li>
                <li>
                  <code>candidate_data/</code>, <code>candidate_linkeldn/</code>
                  , <code>candidate_github/</code>,{" "}
                  <code>candidate_summaries/</code>: Store extracted data and
                  summaries.
                </li>
                <li>
                  <code>models/</code> (within <code>ai-server/</code>):
                  Contains backend scripts and FastAPI server logic.
                </li>
                <li>
                  Various Python scripts (<code>extractor.py</code>,{" "}
                  <code>linkeldn_data_extractor.py</code>, etc.) for specific
                  tasks.
                </li>
              </ul>
            </Section>

            <Section title="Database Architecture" icon={Database}>
              <div className="grid md:grid-cols-2 gap-6">
                <div
                  className={`p-4 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-700/30 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Fingerprint className="text-green-500" />
                    Supabase (User Authentication)
                  </h4>
                  <p>
                    Handles user authentication, primarily Google
                    authentication. All user registration, login, and profile
                    data related to auth are securely managed by Supabase.
                  </p>
                </div>
                <div
                  className={`p-4 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-700/30 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Layers className="text-green-500" />
                    MongoDB (Application Data)
                  </h4>
                  <p>
                    Stores all application data except authentication. This
                    includes candidate data, search/comparison history,
                    extracted LinkedIn/GitHub data, and other relevant
                    application state.
                  </p>
                </div>
              </div>
            </Section>

            <Section
              title="Graph Database Initialization (Neo4j)"
              icon={DatabaseZap}
            >
              <p>
                <code>eligble_neo.py</code> connects candidate JSON to Neo4j
                (AuraDB). Each candidate ID is a node; extracted data (skills,
                experience, etc.) are sub-nodes. Clusters are formed based on
                Location, Company, Institution, Project, Skill, and Technology.
              </p>
              <p className="mt-2">
                <strong>Relationships used:</strong>{" "}
                <code>HAS_EXPERIENCED_WITH</code>, <code>HAS_SKILLED</code>,{" "}
                <code>LOCATED_IN</code>, <code>STUDIED_AT</code>,{" "}
                <code>USES_TECH</code>, <code>WORKED_AT</code>,{" "}
                <code>WORKED_ON</code>.
              </p>
              <p className="mt-2">
                <strong>Advantages:</strong> Comprehensive data coverage,
                prevents overlooked relationships, enables fast,
                relationship-aware querying.
              </p>
              {/* Consider adding a placeholder or link to where users can see the graph images from README */}
            </Section>

            <Section title="Advanced Candidate Ranking" icon={Scaling}>
              <p>
                Implemented in <code>rank_fastapi.py</code>, this system uses
                TF-IDF, BM25, fuzzy string matching, multi-dimensional scoring,
                and query expansion.
              </p>
              <p className="mt-2">
                <strong>Key Features:</strong> Multi-field semantic search,
                advanced fuzzy matching, industry-standard ranking, query
                expansion.
              </p>
              <p className="mt-2">
                <strong>Final Score Weights:</strong> 35% BM25, 25% TF-IDF, 25%
                Semantic Similarity, 15% Exact Match.
              </p>
            </Section>

            <Section title="AI Candidate Comparison" icon={GitCompareArrows}>
              <p>
                Utilize <code>comparison.py</code> for AI-generated comparisons
                between candidates. It reads candidate data from{" "}
                <code>candidates_1.json</code> for analysis across similar
                parameters.
              </p>
            </Section>

            <Section title="Security & Encryption" icon={Lock}>
              <p>
                While specific application-layer encryption for candidate data
                at rest in MongoDB/Neo4j isn't detailed beyond their native
                capabilities, Supabase handles secure user authentication. Data
                in transit should use HTTPS. Best practices for securing API
                keys and database credentials must be followed.
              </p>
            </Section>

            <Section title="Getting Started" icon={Settings2}>
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  <strong>Clone the Repository:</strong>
                  <br />{" "}
                  <code
                    className={`px-2 py-1 rounded text-xs ${
                      theme === "dark"
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    git clone
                    https://github.com/sameer240704/100xEngineers-Buildathon.git
                  </code>
                </li>
                <li>
                  <strong>Install Dependencies:</strong> Follow setup
                  instructions in <code>ai-server/</code>, <code>server/</code>,
                  and <code>client/</code> directories.
                </li>
                <li>
                  <strong>Run Backend and AI Server:</strong> See respective
                  directories for FastAPI/Node.js server instructions.
                </li>
                <li>
                  <strong>Run the Client:</strong> See <code>client/</code>{" "}
                  folder for frontend setup and start instructions.
                </li>
              </ol>
            </Section>

            <Section title="License & Terms" icon={FileText}>
              <div
                className={`rounded-lg p-4 sm:p-6 ${
                  theme === "dark" ? "bg-gray-850" : "bg-gray-100"
                }`}
              >
                <h4
                  className={`font-semibold mb-3 ${
                    theme === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  HireAI by Disha AI Software License
                </h4>
                <p className="text-sm mb-4">
                  Copyright © {new Date().getFullYear()} HireAI by Disha AI. All
                  rights reserved.
                </p>
                <div className="text-xs sm:text-sm space-y-2">
                  <p>
                    This project is licensed under the MIT License. Please refer
                    to the LICENSE file in the repository for full terms.
                  </p>
                  <p className="mt-4">
                    For inquiries, please contact the repository owner.
                  </p>
                </div>
              </div>
            </Section>
          </div>
        )}

        {activeTab === "help" && (
          <div className="space-y-8">
            <Section title="Help Centre" icon={HelpCircle} titleSize="text-3xl">
              <p
                className={`text-lg mb-6 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Find answers to common questions and learn how to make the most
                of HireAI's features.
              </p>
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                    theme === "dark" ? "text-gray-500" : "text-gray-400"
                  }`}
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search help articles..."
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  }`}
                />
              </div>
            </Section>

            <Section title="Quick Start Guide" icon={Zap}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* ... Quick Start Guide items from previous response, adapt text if needed ... */}
                {[
                  {
                    icon: Users,
                    color: "purple",
                    title: "1. Set Up Account",
                    desc: "Ensure Supabase is configured for user authentication.",
                  },
                  {
                    icon: Search,
                    color: "blue",
                    title: "2. Run Servers",
                    desc: "Start the AI server, backend server, and client application.",
                  },
                  {
                    icon: FileText,
                    color: "green",
                    title: "3. Extract Data",
                    desc: "Use Python scripts to extract and process candidate data.",
                  },
                  {
                    icon: Network,
                    color: "orange",
                    title: "4. Search & Analyze",
                    desc: "Utilize the client to search, rank, and compare candidates.",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`text-center p-4 border rounded-lg ${
                      theme === "dark"
                        ? "border-gray-700 bg-gray-850 hover:border-gray-600"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                        theme === "dark"
                          ? `bg-${item.color}-800/50`
                          : `bg-${item.color}-100`
                      }`}
                    >
                      <item.icon
                        className={`${
                          theme === "dark"
                            ? `text-${item.color}-400`
                            : `text-${item.color}-600`
                        }`}
                        size={24}
                      />
                    </div>
                    <h3
                      className={`font-semibold mb-2 ${
                        theme === "dark" ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`text-xs ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Frequently Asked Questions" icon={HelpCircle}>
              <div className="space-y-3">
                {faqData.map((faq, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg ${
                      theme === "dark"
                        ? "border-gray-700 bg-gray-850"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className={`w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex justify-between items-center transition-colors rounded-t-lg ${
                        theme === "dark"
                          ? "hover:bg-gray-700/50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className={`font-medium text-sm sm:text-base ${
                          theme === "dark" ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        {faq.question}
                      </span>
                      {expandedFAQ === index ? (
                        <ChevronUp
                          className={`${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                          size={20}
                        />
                      ) : (
                        <ChevronRight
                          className={`${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                          size={20}
                        />
                      )}
                    </button>
                    {expandedFAQ === index && (
                      <div
                        className={`px-4 sm:px-6 pb-4 pt-2 text-xs sm:text-sm border-t ${
                          theme === "dark"
                            ? "text-gray-300 border-gray-700"
                            : "text-gray-600 border-gray-200"
                        }`}
                      >
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Contact & Support" icon={Users}>
              <p>
                If you encounter issues or have questions, please check the{" "}
                <a
                  href="https://github.com/sameer240704/100xEngineers-Buildathon/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-500 hover:underline"
                >
                  GitHub Issues
                </a>{" "}
                page for this project.
              </p>
              <p>
                For direct support or contributions, please refer to the
                contributing guidelines in the repository.
              </p>
            </Section>
          </div>
        )}
      </main>
    </div>
  );
};

export default DocumentationPage;
