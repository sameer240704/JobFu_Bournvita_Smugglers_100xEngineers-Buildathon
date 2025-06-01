"use client";
import React, { useState, useCallback } from "react";
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
  Settings,
  Zap,
} from "lucide-react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Position,
  ConnectionMode,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const DocumentationPage = () => {
  const [activeTab, setActiveTab] = useState("knowledge");
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  // React Flow nodes for data architecture
  const initialNodes = [
    {
      id: "1",
      type: "input",
      data: { label: "Resume Data Sources" },
      position: { x: 100, y: 50 },
      style: {
        background: "#e1f5fe",
        border: "2px solid #0277bd",
        borderRadius: "8px",
        padding: "10px",
      },
    },
    {
      id: "2",
      data: { label: "Data Aggregation\n& Processing" },
      position: { x: 100, y: 150 },
      style: { background: "#f3e5f5", border: "2px solid #7b1fa2" },
    },
    {
      id: "3",
      data: { label: "JSON Converter" },
      position: { x: 100, y: 250 },
      style: { background: "#fff3e0", border: "2px solid #ef6c00" },
    },
    {
      id: "4",
      data: { label: "Graph Database\n(Neo4j/GraphQL)" },
      position: { x: 300, y: 200 },
      style: { background: "#e8f5e8", border: "2px solid #2e7d32" },
    },
    {
      id: "5",
      type: "input",
      data: { label: "LinkedIn Scraper" },
      position: { x: 500, y: 50 },
      style: { background: "#e3f2fd", border: "2px solid #1976d2" },
    },
    {
      id: "6",
      type: "input",
      data: { label: "GitHub Scraper" },
      position: { x: 500, y: 150 },
      style: { background: "#f1f8e9", border: "2px solid #388e3c" },
    },
    {
      id: "7",
      data: { label: "AES-256 Encryption" },
      position: { x: 300, y: 350 },
      style: { background: "#ffebee", border: "2px solid #d32f2f" },
    },
    {
      id: "8",
      type: "output",
      data: { label: "Secure Storage" },
      position: { x: 300, y: 450 },
      style: { background: "#fce4ec", border: "2px solid #c2185b" },
    },
    {
      id: "9",
      type: "output",
      data: { label: "Search & Query Engine" },
      position: { x: 500, y: 300 },
      style: { background: "#fff8e1", border: "2px solid #ffa000" },
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
    { id: "e2-3", source: "2", target: "3", animated: true },
    { id: "e3-4", source: "3", target: "4", animated: true },
    { id: "e5-4", source: "5", target: "4", animated: true },
    { id: "e6-4", source: "6", target: "4", animated: true },
    { id: "e4-7", source: "4", target: "7", animated: true },
    { id: "e7-8", source: "7", target: "8", animated: true },
    { id: "e4-9", source: "4", target: "9", animated: true },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) => addEdge({ ...params, type: "smoothstep" }, eds)),
    [setEdges]
  );

  const faqData = [
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
    <div className="min-h-screen overflow-scroll bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                JobFu Documentation
              </span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab("knowledge")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "knowledge"
                    ? "bg-purple-100 text-purple-700"
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
                    ? "bg-purple-100 text-purple-700"
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
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                JobFu Knowledge Base
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Comprehensive documentation for JobFu's AI-powered recruitment
                platform, designed for recruiters to find, assess, and hire the
                best candidates efficiently.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                  <Database className="text-blue-600 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Candidate Database
                    </h3>
                    <p className="text-sm text-gray-600">
                      AI-curated profiles from multiple professional sources
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                  <Network className="text-green-600 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Smart Matching
                    </h3>
                    <p className="text-sm text-gray-600">
                      AI-powered candidate-job matching and recommendations
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
                  <Shield className="text-red-600 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900">Security</h3>
                    <p className="text-sm text-gray-600">
                      AES-256 encryption and secure storage
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Architecture Flow */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Data Architecture & Flow
              </h2>
              <div className="h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  fitView
                  className="bg-gray-50"
                >
                  <Background />
                  <Controls />
                  <MiniMap />
                </ReactFlow>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Interactive diagram showing how JobFu aggregates candidate data
                from multiple professional sources and processes it through our
                secure AI pipeline for intelligent candidate matching.
              </p>
            </div>

            {/* Data Sources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FileText className="mr-3 text-blue-600" size={24} />
                  Candidate Data Aggregation
                </h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-gray-900">
                      Resume Collection
                    </h4>
                    <p className="text-gray-600">
                      Automated collection and parsing of resumes from job
                      boards and professional networks
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold text-gray-900">
                      Profile Structuring
                    </h4>
                    <p className="text-gray-600">
                      AI-powered extraction of skills, experience, education,
                      and contact information
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-gray-900">
                      Relationship Mapping
                    </h4>
                    <p className="text-gray-600">
                      Graph database connecting candidates, skills, companies,
                      and job roles for intelligent matching
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Network className="mr-3 text-green-600" size={24} />
                  Professional Data Sources
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Linkedin className="text-blue-600" size={24} />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        LinkedIn Intelligence
                      </h4>
                      <p className="text-sm text-gray-600">
                        Professional profiles, skills, work history, and
                        recommendations
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Github className="text-gray-800" size={24} />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        GitHub Analytics
                      </h4>
                      <p className="text-sm text-gray-600">
                        Code repositories, contribution patterns, and technical
                        expertise assessment
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security & Encryption */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Lock className="mr-3 text-red-600" size={24} />
                Security & Encryption
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      AES-256 Encryption
                    </h4>
                    <p className="text-gray-600 text-sm mb-3">
                      All candidate data is encrypted using Advanced Encryption
                      Standard (AES) with 256-bit keys to ensure privacy and
                      compliance with data protection regulations.
                    </p>
                    <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                      Encryption: AES-256-CBC
                      <br />
                      Key Management: HSM
                      <br />
                      Salt: Random 32-byte
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Data Protection
                    </h4>
                    <ul className="text-gray-600 text-sm space-y-1">
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
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                License & Terms
              </h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  JobFu Software License Agreement
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  Copyright © 2025 JobFu Technologies. All rights reserved.
                </p>
                <div className="text-sm text-gray-600 space-y-2">
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
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Help Centre
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Find answers to common questions and learn how to make the most
                of JobFu's features.
              </p>

              <div className="relative">
                <Search
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search help articles..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Quick Start Guide */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Quick Start Guide
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="text-purple-600" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    1. Set Up Your Account
                  </h3>
                  <p className="text-sm text-gray-600">
                    Create your recruiter profile and configure job preferences
                  </p>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="text-blue-600" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    2. Search Candidates
                  </h3>
                  <p className="text-sm text-gray-600">
                    Use AI-powered search to find qualified candidates
                  </p>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="text-green-600" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    3. Review & Shortlist
                  </h3>
                  <p className="text-sm text-gray-600">
                    Analyze profiles and create your shortlist
                  </p>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="text-orange-600" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    4. Connect & Hire
                  </h3>
                  <p className="text-sm text-gray-600">
                    Reach out to candidates and manage the hiring process
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqData.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">
                        {faq.question}
                      </span>
                      {expandedFAQ === index ? (
                        <ChevronDown className="text-gray-500" size={20} />
                      ) : (
                        <ChevronRight className="text-gray-500" size={20} />
                      )}
                    </button>
                    {expandedFAQ === index && (
                      <div className="px-6 pb-4 text-gray-600">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Guides */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Recruiter Tools & Features
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                      <span className="text-purple-600 text-xs font-bold">
                        1
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Advanced Search & Filters
                      </h4>
                      <p className="text-sm text-gray-600">
                        Find candidates by skills, experience, location, salary
                        expectations, and more
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                      <span className="text-purple-600 text-xs font-bold">
                        2
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        AI-Powered Candidate Ranking
                      </h4>
                      <p className="text-sm text-gray-600">
                        Automatically rank candidates based on job requirements
                        and fit score
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                      <span className="text-purple-600 text-xs font-bold">
                        3
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Pipeline Management
                      </h4>
                      <p className="text-sm text-gray-600">
                        Track candidates through your recruitment pipeline with
                        notes and status updates
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Best Practices
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Effective Search Strategies
                    </h4>
                    <p className="text-sm text-gray-600">
                      Use specific keywords, combine multiple filters, and
                      leverage Boolean search for better candidate discovery
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Candidate Engagement
                    </h4>
                    <p className="text-sm text-gray-600">
                      Personalize your outreach messages and respond quickly to
                      maintain candidate interest
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Data Compliance
                    </h4>
                    <p className="text-sm text-gray-600">
                      Ensure your recruitment practices comply with local data
                      protection and employment laws
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-sm p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Need More Help?</h3>
              <p className="mb-6">
                Can't find what you're looking for? Our support team is here to
                help you get the most out of JobFu.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  Contact Support
                </button>
                <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-purple-600 transition-colors">
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
