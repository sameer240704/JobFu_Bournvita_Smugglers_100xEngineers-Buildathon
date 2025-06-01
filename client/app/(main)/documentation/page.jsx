"use client";
import React, { useState, useCallback, useEffect } from "react"; // Added useEffect
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
  Network,
  Users,
  Zap,
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

const DocumentationPage = () => {
  const [activeTab, setActiveTab] = useState("knowledge");
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const theme = localStorage.getItem("theme") || "light";

  // Apply theme to HTML element for global dark styles
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // React Flow nodes for data architecture
  // Note: For full dark mode, these node styles would also need to be dynamic
  const initialNodes = [
    {
      id: "1",
      type: "input",
      data: { label: "Resume Data Sources" },
      position: { x: 100, y: 50 },
      style: {
        background: theme === "light" ? "#e1f5fe" : "#01579b", // Darker blue for dark
        color: theme === "light" ? "#000" : "#fff",
        border: `2px solid ${theme === "light" ? "#0277bd" : "#4fc3f7"}`,
        borderRadius: "8px",
        padding: "10px",
      },
    },
    {
      id: "2",
      data: { label: "Data Aggregation\n& Processing" },
      position: { x: 100, y: 150 },
      style: {
        background: theme === "light" ? "#f3e5f5" : "#4a148c",
        color: theme === "light" ? "#000" : "#fff",
        border: `2px solid ${theme === "light" ? "#7b1fa2" : "#ce93d8"}`,
      },
    },
    {
      id: "3",
      data: { label: "JSON Converter" },
      position: { x: 100, y: 250 },
      style: {
        background: theme === "light" ? "#fff3e0" : "#e65100",
        color: theme === "light" ? "#000" : "#fff",
        border: `2px solid ${theme === "light" ? "#ef6c00" : "#ffcc80"}`,
      },
    },
    {
      id: "4",
      data: { label: "Graph Database\n(Neo4j/GraphQL)" },
      position: { x: 300, y: 200 },
      style: {
        background: theme === "light" ? "#e8f5e8" : "#1b5e20",
        color: theme === "light" ? "#000" : "#fff",
        border: `2px solid ${theme === "light" ? "#2e7d32" : "#a5d6a7"}`,
      },
    },
    {
      id: "5",
      type: "input",
      data: { label: "LinkedIn Scraper" },
      position: { x: 500, y: 50 },
      style: {
        background: theme === "light" ? "#e3f2fd" : "#0d47a1",
        color: theme === "light" ? "#000" : "#fff",
        border: `2px solid ${theme === "light" ? "#1976d2" : "#90caf9"}`,
      },
    },
    {
      id: "6",
      type: "input",
      data: { label: "GitHub Scraper" },
      position: { x: 500, y: 150 },
      style: {
        background: theme === "light" ? "#f1f8e9" : "#33691e",
        color: theme === "light" ? "#000" : "#fff",
        border: `2px solid ${theme === "light" ? "#388e3c" : "#c5e1a5"}`,
      },
    },
    {
      id: "7",
      data: { label: "AES-256 Encryption" },
      position: { x: 300, y: 350 },
      style: {
        background: theme === "light" ? "#ffebee" : "#b71c1c",
        color: theme === "light" ? "#000" : "#fff",
        border: `2px solid ${theme === "light" ? "#d32f2f" : "#ef9a9a"}`,
      },
    },
    {
      id: "8",
      type: "output",
      data: { label: "Secure Storage" },
      position: { x: 300, y: 450 },
      style: {
        background: theme === "light" ? "#fce4ec" : "#880e4f",
        color: theme === "light" ? "#000" : "#fff",
        border: `2px solid ${theme === "light" ? "#c2185b" : "#f48fb1"}`,
      },
    },
    {
      id: "9",
      type: "output",
      data: { label: "Search & Query Engine" },
      position: { x: 500, y: 300 },
      style: {
        background: theme === "light" ? "#fff8e1" : "#ff8f00",
        color: theme === "light" ? "#000" : "#fff",
        border: `2px solid ${theme === "light" ? "#ffa000" : "#ffe082"}`,
      },
    },
  ];

  const initialEdges = [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      animated: true,
      style: { stroke: "#6366f1", strokeWidth: 2 },
      type: "smoothstep",
    },
    {
      id: "e2-3",
      source: "2",
      target: "3",
      animated: true,
      style: { stroke: "#8b5cf6", strokeWidth: 2 },
      type: "smoothstep",
    },
    {
      id: "e3-4",
      source: "3",
      target: "4",
      animated: true,
      style: { stroke: "#ef4444", strokeWidth: 2 },
      type: "smoothstep",
    },
    {
      id: "e5-4",
      source: "5",
      target: "4",
      animated: true,
      style: { stroke: "#3b82f6", strokeWidth: 2 },
      type: "smoothstep",
    },
    {
      id: "e6-4",
      source: "6",
      target: "4",
      animated: true,
      style: { stroke: "#22c55e", strokeWidth: 2 },
      type: "smoothstep",
    },
    {
      id: "e4-7",
      source: "4",
      target: "7",
      animated: true,
      style: { stroke: "#f97316", strokeWidth: 2 },
      type: "smoothstep",
    },
    {
      id: "e7-8",
      source: "7",
      target: "8",
      animated: true,
      style: { stroke: "#ec4899", strokeWidth: 2 },
      type: "smoothstep",
    },
    {
      id: "e4-9",
      source: "4",
      target: "9",
      animated: true,
      style: { stroke: "#f59e0b", strokeWidth: 2 },
      type: "smoothstep",
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when theme changes
  useEffect(() => {
    setNodes(initialNodes);
  }, [theme, setNodes]);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge({ ...params, type: "smoothstep", animated: true }, eds)
      ),
    [setEdges]
  );

  const faqData = [
    // ... FAQ data remains the same
    {
      question: "How do I search for candidates on JobFu?",
      answer:
        "Use our advanced search filters to find candidates by skills, experience, location, and job titles. Our AI automatically matches the best candidates to your job requirements.",
    },
    {
      question: "What data sources does JobFu use to build candidate profiles?",
      answer:
        "JobFu aggregates data from multiple sources including publicly available resumes, LinkedIn profiles, GitHub repositories, and other professional platforms to create comprehensive candidate profiles.",
    },
    {
      question: "How secure is candidate data?",
      answer:
        "All candidate data is encrypted using AES-256 encryption before storage. We follow industry-standard security practices and comply with data protection regulations including GDPR.",
    },
    {
      question: "How does the AI candidate matching work?",
      answer:
        "Our AI analyzes candidate profiles stored in a graph database, matching skills, experience, and job requirements using advanced algorithms to recommend the most suitable candidates for your positions.",
    },
    {
      question: "Can I integrate JobFu with my existing ATS?",
      answer:
        "Yes, JobFu provides API endpoints for seamless integration with popular ATS platforms. Contact our support team for integration assistance and documentation.",
    },
    {
      question: "How do I shortlist and manage candidates?",
      answer:
        "Use our shortlisting tools to save promising candidates, add notes, and track their progress through your recruitment pipeline. You can also set up automated follow-ups.",
    },
  ];

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div
      className={`h-screen overflow-scroll ${
        theme === "dark"
          ? "bg-gray-900 text-gray-200"
          : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* Header */}
      <div
        className={`shadow-sm border-b ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  theme === "dark" ? "bg-purple-500" : "bg-purple-600"
                }`}
              >
                <span className="text-white font-bold text-sm">J</span>
              </div>
              <span
                className={`text-xl font-semibold ${
                  theme === "dark" ? "text-gray-100" : "text-gray-900"
                }`}
              >
                JobFu Documentation
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab("knowledge")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "knowledge"
                    ? theme === "dark"
                      ? "bg-purple-700 text-purple-100"
                      : "bg-purple-100 text-purple-700"
                    : theme === "dark"
                    ? "text-gray-400 hover:text-gray-100"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Book size={20} />
                <span>Knowledge Base</span>
              </button>
              <button
                onClick={() => setActiveTab("help")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "help"
                    ? theme === "dark"
                      ? "bg-purple-700 text-purple-100"
                      : "bg-purple-100 text-purple-700"
                    : theme === "dark"
                    ? "text-gray-400 hover:text-gray-100"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <HelpCircle size={20} />
                <span>Help Centre</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "knowledge" && (
          <div className="space-y-8">
            {/* Overview */}
            <div
              className={`rounded-xl shadow-sm p-8 ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h1
                className={`text-3xl font-bold mb-4 ${
                  theme === "dark" ? "text-gray-100" : "text-gray-900"
                }`}
              >
                JobFu Knowledge Base
              </h1>
              <p
                className={`text-lg mb-6 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Comprehensive documentation for JobFu's AI-powered recruitment
                platform, designed for recruiters to find, assess, and hire the
                best candidates efficiently.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  className={`flex items-start space-x-3 p-4 rounded-lg ${
                    theme === "dark" ? "bg-blue-900/50" : "bg-blue-50"
                  }`}
                >
                  <Database
                    className="text-blue-500 dark:text-blue-400 mt-1"
                    size={24}
                  />
                  <div>
                    <h3
                      className={`font-semibold ${
                        theme === "dark" ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      Candidate Database
                    </h3>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      AI-curated profiles from multiple professional sources
                    </p>
                  </div>
                </div>
                <div
                  className={`flex items-start space-x-3 p-4 rounded-lg ${
                    theme === "dark" ? "bg-green-900/50" : "bg-green-50"
                  }`}
                >
                  <Network
                    className="text-green-500 dark:text-green-400 mt-1"
                    size={24}
                  />
                  <div>
                    <h3
                      className={`font-semibold ${
                        theme === "dark" ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      Smart Matching
                    </h3>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      AI-powered candidate-job matching and recommendations
                    </p>
                  </div>
                </div>
                <div
                  className={`flex items-start space-x-3 p-4 rounded-lg ${
                    theme === "dark" ? "bg-red-900/50" : "bg-red-50"
                  }`}
                >
                  <Shield
                    className="text-red-500 dark:text-red-400 mt-1"
                    size={24}
                  />
                  <div>
                    <h3
                      className={`font-semibold ${
                        theme === "dark" ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      Security
                    </h3>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      AES-256 encryption and secure storage
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Architecture Flow */}
            <div
              className={`rounded-xl shadow-sm p-8 ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h2
                className={`text-2xl font-bold mb-6 ${
                  theme === "dark" ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Data Architecture & Flow
              </h2>
              <div
                className={`h-96 rounded-lg border-2 border-dashed ${
                  theme === "dark"
                    ? "bg-gray-850 border-gray-700"
                    : "bg-gray-50 border-gray-300"
                }`}
              >
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  fitView
                  className={theme === "dark" ? "dark-flow" : ""} // Add a class for specific dark flow styling if needed
                >
                  <Background
                    color={theme === "dark" ? "#374151" : "#ddd"}
                    gap={16}
                  />
                  <Controls
                    style={{
                      button: {
                        backgroundColor:
                          theme === "dark" ? "#4B5563" : "#f0f0f0",
                        color: theme === "dark" ? "#E5E7EB" : "#333",
                        border: "none",
                      },
                    }}
                  />
                  <MiniMap
                    nodeStrokeColor={(n) => {
                      if (n.type === "input")
                        return theme === "dark" ? "#60A5FA" : "#2563EB";
                      if (n.type === "output")
                        return theme === "dark" ? "#F472B6" : "#DB2777";
                      return theme === "dark" ? "#A78BFA" : "#7C3AED";
                    }}
                    nodeColor={(n) => {
                      if (n.type === "input")
                        return theme === "dark" ? "#374151" : "#E0E7FF";
                      if (n.type === "output")
                        return theme === "dark" ? "#374151" : "#FFE4E6";
                      return theme === "dark" ? "#374151" : "#F3E8FF";
                    }}
                    pannable
                    zoomable
                    style={{
                      backgroundColor: theme === "dark" ? "#1F2937" : "#fff",
                    }}
                  />
                </ReactFlow>
              </div>
              <p
                className={`text-sm mt-4 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Interactive diagram showing how JobFu aggregates candidate data
                from multiple professional sources and processes it through our
                secure AI pipeline for intelligent candidate matching.
              </p>
            </div>

            {/* Data Sources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div
                className={`rounded-xl shadow-sm p-8 ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3
                  className={`text-xl font-bold mb-4 flex items-center ${
                    theme === "dark" ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  <FileText
                    className="mr-3 text-blue-500 dark:text-blue-400"
                    size={24}
                  />
                  Candidate Data Aggregation
                </h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 dark:border-blue-400 pl-4">
                    <h4
                      className={`font-semibold ${
                        theme === "dark" ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      Resume Collection
                    </h4>
                    <p
                      className={`${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Automated collection and parsing of resumes from job
                      boards and professional networks
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 dark:border-purple-400 pl-4">
                    <h4
                      className={`font-semibold ${
                        theme === "dark" ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      Profile Structuring
                    </h4>
                    <p
                      className={`${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      AI-powered extraction of skills, experience, education,
                      and contact information
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 dark:border-green-400 pl-4">
                    <h4
                      className={`font-semibold ${
                        theme === "dark" ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      Relationship Mapping
                    </h4>
                    <p
                      className={`${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Graph database connecting candidates, skills, companies,
                      and job roles for intelligent matching
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`rounded-xl shadow-sm p-8 ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3
                  className={`text-xl font-bold mb-4 flex items-center ${
                    theme === "dark" ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  <Network
                    className="mr-3 text-green-500 dark:text-green-400"
                    size={24}
                  />
                  Professional Data Sources
                </h3>
                <div className="space-y-4">
                  <div
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      theme === "dark" ? "bg-blue-900/30" : "bg-blue-50"
                    }`}
                  >
                    <Linkedin
                      className="text-blue-500 dark:text-blue-400"
                      size={24}
                    />
                    <div>
                      <h4
                        className={`font-semibold ${
                          theme === "dark" ? "text-gray-200" : "text-gray-900"
                        }`}
                      >
                        LinkedIn Intelligence
                      </h4>
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Professional profiles, skills, work history, and
                        recommendations
                      </p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
                    }`}
                  >
                    <Github
                      className={`${
                        theme === "dark" ? "text-gray-300" : "text-gray-800"
                      }`}
                      size={24}
                    />
                    <div>
                      <h4
                        className={`font-semibold ${
                          theme === "dark" ? "text-gray-200" : "text-gray-900"
                        }`}
                      >
                        GitHub Analytics
                      </h4>
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Code repositories, contribution patterns, and technical
                        expertise assessment
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security & Encryption */}
            <div
              className={`rounded-xl shadow-sm p-8 ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3
                className={`text-xl font-bold mb-6 flex items-center ${
                  theme === "dark" ? "text-gray-100" : "text-gray-900"
                }`}
              >
                <Lock
                  className="mr-3 text-red-500 dark:text-red-400"
                  size={24}
                />
                Security & Encryption
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div
                    className={`border rounded-lg p-4 ${
                      theme === "dark" ? "border-red-700/50" : "border-red-200"
                    }`}
                  >
                    <h4
                      className={`font-semibold mb-2 ${
                        theme === "dark" ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      AES-256 Encryption
                    </h4>
                    <p
                      className={`text-sm mb-3 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      All candidate data is encrypted using Advanced Encryption
                      Standard (AES) with 256-bit keys to ensure privacy and
                      compliance with data protection regulations.
                    </p>
                    <div
                      className={`p-3 rounded font-mono text-sm ${
                        theme === "dark"
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Encryption: AES-256-CBC
                      <br />
                      Key Management: HSM
                      <br />
                      Salt: Random 32-byte
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div
                    className={`border rounded-lg p-4 ${
                      theme === "dark"
                        ? "border-green-700/50"
                        : "border-green-200"
                    }`}
                  >
                    <h4
                      className={`font-semibold mb-2 ${
                        theme === "dark" ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      Data Protection
                    </h4>
                    <ul
                      className={`text-sm space-y-1 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <li>• GDPR & CCPA compliant</li>
                      <li>• Data minimization principles</li>
                      <li>• Regular security audits</li>
                      <li>• Encrypted data transmission</li>
                      <li>• Access logging and monitoring</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* License */}
            <div
              className={`rounded-xl shadow-sm p-8 ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3
                className={`text-xl font-bold mb-4 ${
                  theme === "dark" ? "text-gray-100" : "text-gray-900"
                }`}
              >
                License & Terms
              </h3>
              <div
                className={`rounded-lg p-6 ${
                  theme === "dark" ? "bg-gray-850" : "bg-gray-50"
                }`}
              >
                <h4
                  className={`font-semibold mb-3 ${
                    theme === "dark" ? "text-gray-200" : "text-gray-900"
                  }`}
                >
                  JobFu Software License Agreement
                </h4>
                <p
                  className={`text-sm mb-4 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Copyright © 2025 JobFu Technologies. All rights reserved.
                </p>
                <div
                  className={`text-sm space-y-2 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <p>
                    This software is licensed under a proprietary license
                    agreement. Key terms include:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Commercial use permitted with valid subscription</li>
                    <li>Redistribution prohibited without written consent</li>
                    <li>Data processing subject to privacy policy</li>
                    <li>API usage governed by rate limits and terms</li>
                  </ul>
                  <p className="mt-4">
                    For complete license terms, please contact: legal@JobFu.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "help" && (
          <div className="space-y-8">
            {/* Help Centre Header */}
            <div
              className={`rounded-xl shadow-sm p-8 ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h1
                className={`text-3xl font-bold mb-4 ${
                  theme === "dark" ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Help Centre
              </h1>
              <p
                className={`text-lg mb-6 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Find answers to common questions and learn how to make the most
                of JobFu's features.
              </p>

              <div className="relative">
                <Search
                  className={`absolute left-3 top-3 ${
                    theme === "dark" ? "text-gray-500" : "text-gray-400"
                  }`}
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search help articles..."
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  }`}
                />
              </div>
            </div>

            {/* Quick Start Guide */}
            <div
              className={`rounded-xl shadow-sm p-8 ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h2
                className={`text-2xl font-bold mb-6 ${
                  theme === "dark" ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Quick Start Guide
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: Users,
                    color: "purple",
                    title: "1. Set Up Your Account",
                    desc: "Create your recruiter profile and configure job preferences",
                  },
                  {
                    icon: Search,
                    color: "blue",
                    title: "2. Search Candidates",
                    desc: "Use AI-powered search to find qualified candidates",
                  },
                  {
                    icon: FileText,
                    color: "green",
                    title: "3. Review & Shortlist",
                    desc: "Analyze profiles and create your shortlist",
                  },
                  {
                    icon: Zap,
                    color: "orange",
                    title: "4. Connect & Hire",
                    desc: "Reach out to candidates and manage the hiring process",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`text-center p-4 border rounded-lg ${
                      theme === "dark"
                        ? "border-gray-700 bg-gray-850"
                        : "border-gray-200 bg-white"
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
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div
              className={`rounded-xl shadow-sm p-8 ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h2
                className={`text-2xl font-bold mb-6 ${
                  theme === "dark" ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
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
                      className={`w-full px-6 py-4 text-left flex justify-between items-center transition-colors ${
                        theme === "dark"
                          ? "hover:bg-gray-700/50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className={`font-medium ${
                          theme === "dark" ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        {faq.question}
                      </span>
                      {expandedFAQ === index ? (
                        <ChevronDown
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
                        className={`px-6 pb-4 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Guides & Best Practices (Combined for brevity in example) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div
                className={`rounded-xl shadow-sm p-8 ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3
                  className={`text-xl font-bold mb-4 ${
                    theme === "dark" ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Recruiter Tools & Features
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 ${
                        theme === "dark" ? "bg-purple-900" : "bg-purple-100"
                      }`}
                    >
                      <span
                        className={`text-xs font-bold ${
                          theme === "dark"
                            ? "text-purple-200"
                            : "text-purple-600"
                        }`}
                      >
                        1
                      </span>
                    </div>
                    <div>
                      <h4
                        className={`font-semibold ${
                          theme === "dark" ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        Advanced Search & Filters
                      </h4>
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Find candidates by skills, experience, location, salary
                        expectations, and more
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 ${
                        theme === "dark" ? "bg-purple-900" : "bg-purple-100"
                      }`}
                    >
                      <span
                        className={`text-xs font-bold ${
                          theme === "dark"
                            ? "text-purple-200"
                            : "text-purple-600"
                        }`}
                      >
                        2
                      </span>
                    </div>
                    <div>
                      <h4
                        className={`font-semibold ${
                          theme === "dark" ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        AI-Powered Candidate Ranking
                      </h4>
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Automatically rank candidates based on job requirements
                        and fit score
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 ${
                        theme === "dark" ? "bg-purple-900" : "bg-purple-100"
                      }`}
                    >
                      <span
                        className={`text-xs font-bold ${
                          theme === "dark"
                            ? "text-purple-200"
                            : "text-purple-600"
                        }`}
                      >
                        3
                      </span>
                    </div>
                    <div>
                      <h4
                        className={`font-semibold ${
                          theme === "dark" ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        Pipeline Management
                      </h4>
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Track candidates through your recruitment pipeline with
                        notes and status updates
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`rounded-xl shadow-sm p-8 ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3
                  className={`text-xl font-bold mb-4 ${
                    theme === "dark" ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Best Practices
                </h3>
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-lg ${
                      theme === "dark" ? "bg-blue-900/40" : "bg-blue-50"
                    }`}
                  >
                    <h4
                      className={`font-semibold mb-2 ${
                        theme === "dark" ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      Effective Search Strategies
                    </h4>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Use specific keywords, combine multiple filters, and
                      leverage Boolean search for better candidate discovery
                    </p>
                  </div>
                  <div
                    className={`p-4 rounded-lg ${
                      theme === "dark" ? "bg-green-900/40" : "bg-green-50"
                    }`}
                  >
                    <h4
                      className={`font-semibold mb-2 ${
                        theme === "dark" ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      Candidate Engagement
                    </h4>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Personalize your outreach messages and respond quickly to
                      maintain candidate interest
                    </p>
                  </div>
                  <div
                    className={`p-4 rounded-lg ${
                      theme === "dark" ? "bg-orange-900/40" : "bg-orange-50"
                    }`}
                  >
                    <h4
                      className={`font-semibold mb-2 ${
                        theme === "dark" ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      Data Compliance
                    </h4>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Ensure your recruitment practices comply with local data
                      protection and employment laws
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div
              className={`rounded-xl shadow-sm p-8 text-white ${
                theme === "dark"
                  ? "bg-gradient-to-r from-purple-700 to-blue-700"
                  : "bg-gradient-to-r from-purple-600 to-blue-600"
              }`}
            >
              <h3 className="text-xl font-bold mb-4">Need More Help?</h3>
              <p className="mb-6 opacity-90">
                Can't find what you're looking for? Our support team is here to
                help you get the most out of JobFu.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    theme === "dark"
                      ? "bg-gray-100 text-purple-600 hover:bg-gray-200"
                      : "bg-white text-purple-600 hover:bg-gray-100"
                  }`}
                >
                  Contact Support
                </button>
                <button
                  className={`border border-white text-white px-6 py-3 rounded-lg font-medium transition-colors ${
                    theme === "dark"
                      ? "hover:bg-white hover:text-purple-700"
                      : "hover:bg-white hover:text-purple-600"
                  }`}
                >
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentationPage;
