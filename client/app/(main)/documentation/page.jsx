"use client";
import React, { useState, useRef, useCallback } from "react";
import {
  Upload,
  Download,
  Save,
  FileText,
  Edit3,
  Eye,
  Plus,
  Trash2,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ChevronDown,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Sun,
  Moon,
  X,
} from "lucide-react";
import { useTheme } from "@/context/theme-context";

// EditView Component
const EditView = ({
  resumeData,
  updatePersonalInfo,
  updateSummary,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
  addSkill,
  removeSkill,
  addProject,
  updateProject,
  deleteProject,
  theme,
}) => {
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addSkill(newSkill);
      setNewSkill("");
    }
  };

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center">
          <User className="h-5 w-5 mr-2" />
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={resumeData.personalInfo.name}
            onChange={(e) => updatePersonalInfo("name", e.target.value)}
            className={`p-3 rounded-lg border ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />
          <input
            type="email"
            placeholder="Email"
            value={resumeData.personalInfo.email}
            onChange={(e) => updatePersonalInfo("email", e.target.value)}
            className={`p-3 rounded-lg border ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />
          <input
            type="tel"
            placeholder="Phone"
            value={resumeData.personalInfo.phone}
            onChange={(e) => updatePersonalInfo("phone", e.target.value)}
            className={`p-3 rounded-lg border ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />
          <input
            type="text"
            placeholder="Location"
            value={resumeData.personalInfo.location}
            onChange={(e) => updatePersonalInfo("location", e.target.value)}
            className={`p-3 rounded-lg border ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />
          <input
            type="text"
            placeholder="LinkedIn URL"
            value={resumeData.personalInfo.linkedin}
            onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
            className={`p-3 rounded-lg border ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />
          <input
            type="text"
            placeholder="Website/Portfolio"
            value={resumeData.personalInfo.website}
            onChange={(e) => updatePersonalInfo("website", e.target.value)}
            className={`p-3 rounded-lg border ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />
        </div>
      </div>

      {/* Summary/Objective */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Professional Summary</h3>
        <textarea
          placeholder="Write a compelling professional summary..."
          value={resumeData.summary}
          onChange={(e) => updateSummary(e.target.value)}
          rows={4}
          className={`w-full p-3 rounded-lg border ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        />
      </div>

      {/* Experience */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <Briefcase className="h-5 w-5 mr-2" />
            Work Experience
          </h3>
          <button
            onClick={addExperience}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </button>
        </div>

        {resumeData.experience.map((exp) => (
          <div
            key={exp.id}
            className={`p-4 rounded-lg border ${
              theme === "dark"
                ? "border-gray-600 bg-gray-700/50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Job Title"
                  value={exp.title}
                  onChange={(e) =>
                    updateExperience(exp.id, "title", e.target.value)
                  }
                  className={`p-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) =>
                    updateExperience(exp.id, "company", e.target.value)
                  }
                  className={`p-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={exp.location}
                  onChange={(e) =>
                    updateExperience(exp.id, "location", e.target.value)
                  }
                  className={`p-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Duration (e.g., 2020 - 2023)"
                  value={exp.duration}
                  onChange={(e) =>
                    updateExperience(exp.id, "duration", e.target.value)
                  }
                  className={`p-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>
              <button
                onClick={() => deleteExperience(exp.id)}
                className="ml-4 p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <textarea
              placeholder="Describe your responsibilities and achievements (one per line)"
              value={exp.description.join("\n")}
              onChange={(e) =>
                updateExperience(
                  exp.id,
                  "description",
                  e.target.value.split("\n")
                )
              }
              rows={4}
              className={`w-full p-3 rounded-lg border ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <GraduationCap className="h-5 w-5 mr-2" />
            Education
          </h3>
          <button
            onClick={addEducation}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </button>
        </div>

        {resumeData.education.map((edu) => (
          <div
            key={edu.id}
            className={`p-4 rounded-lg border ${
              theme === "dark"
                ? "border-gray-600 bg-gray-700/50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) =>
                    updateEducation(edu.id, "degree", e.target.value)
                  }
                  className={`p-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) =>
                    updateEducation(edu.id, "institution", e.target.value)
                  }
                  className={`p-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Duration"
                  value={edu.duration}
                  onChange={(e) =>
                    updateEducation(edu.id, "duration", e.target.value)
                  }
                  className={`p-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
                <input
                  type="text"
                  placeholder="GPA (optional)"
                  value={edu.gpa}
                  onChange={(e) =>
                    updateEducation(edu.id, "gpa", e.target.value)
                  }
                  className={`p-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>
              <button
                onClick={() => deleteEducation(edu.id)}
                className="ml-4 p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Code className="h-5 w-5 mr-2" />
          Skills
        </h3>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Add a skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
            className={`flex-1 p-3 rounded-lg border ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />
          <button
            onClick={handleAddSkill}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {resumeData.skills.map((skill, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-full text-sm flex items-center ${
                theme === "dark"
                  ? "bg-purple-900 text-purple-100"
                  : "bg-purple-100 text-purple-800"
              }`}
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="ml-2 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Projects
          </h3>
          <button
            onClick={addProject}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </button>
        </div>

        {resumeData.projects.map((project) => (
          <div
            key={project.id}
            className={`p-4 rounded-lg border ${
              theme === "dark"
                ? "border-gray-600 bg-gray-700/50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 space-y-4">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={project.name}
                  onChange={(e) =>
                    updateProject(project.id, "name", e.target.value)
                  }
                  className={`w-full p-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
                <textarea
                  placeholder="Project Description"
                  value={project.description}
                  onChange={(e) =>
                    updateProject(project.id, "description", e.target.value)
                  }
                  rows={3}
                  className={`w-full p-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Technologies (comma-separated)"
                  value={project.technologies.join(", ")}
                  onChange={(e) =>
                    updateProject(
                      project.id,
                      "technologies",
                      e.target.value.split(", ").map((t) => t.trim())
                    )
                  }
                  className={`w-full p-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Project Link (optional)"
                  value={project.link}
                  onChange={(e) =>
                    updateProject(project.id, "link", e.target.value)
                  }
                  className={`w-full p-3 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>
              <button
                onClick={() => deleteProject(project.id)}
                className="ml-4 p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ResumePreview Component
const ResumePreview = ({ resumeData, theme }) => {
  return (
    <div
      className={`max-w-4xl mx-auto p-3 ${
        theme === "dark"
          ? "bg-gray-800 text-white"
          : "bg-transparent text-gray-900"
      } h-full`}
    >
      {/* Header */}
      <div className="mb-8 text-center border-b pb-6">
        <h1 className="text-3xl font-bold mb-2">
          {resumeData.personalInfo.name}
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-300">
          <span className="flex items-center">
            <Mail className="h-4 w-4 mr-1" />
            {resumeData.personalInfo.email}
          </span>
          <span className="flex items-center">
            <Phone className="h-4 w-4 mr-1" />
            {resumeData.personalInfo.phone}
          </span>
          <span className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {resumeData.personalInfo.location}
          </span>
        </div>
        {(resumeData.personalInfo.linkedin ||
          resumeData.personalInfo.website) && (
          <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm text-purple-600">
            {resumeData.personalInfo.linkedin && (
              <a
                href={`https://${resumeData.personalInfo.linkedin}`}
                className="hover:underline"
              >
                LinkedIn
              </a>
            )}
            {resumeData.personalInfo.website && (
              <a
                href={`https://${resumeData.personalInfo.website}`}
                className="hover:underline"
              >
                Portfolio
              </a>
            )}
          </div>
        )}
      </div>

      {/* Summary */}
      {resumeData.summary && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Professional Summary
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {resumeData.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {resumeData.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 flex items-center">
            <Briefcase className="h-5 w-5 mr-2" />
            Work Experience
          </h2>
          <div className="space-y-6">
            {resumeData.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{exp.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {exp.company} • {exp.location}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {exp.duration}
                  </span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                  {exp.description.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 flex items-center">
            <GraduationCap className="h-5 w-5 mr-2" />
            Education
          </h2>
          <div className="space-y-4">
            {resumeData.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {edu.institution}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {edu.duration}
                    </span>
                    {edu.gpa && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        GPA: {edu.gpa}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 flex items-center">
            <Code className="h-5 w-5 mr-2" />
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-sm ${
                  theme === "dark"
                    ? "bg-purple-900 text-purple-100"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {resumeData.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Projects
          </h2>
          <div className="space-y-4">
            {resumeData.projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{project.name}</h3>
                  {project.link && (
                    <a
                      href={project.link}
                      className="text-purple-600 hover:underline text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Project
                    </a>
                  )}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  {project.description}
                </p>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded text-xs ${
                          theme === "dark"
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Resume Editor Component
const ResumeEditor = () => {
  const [uploadedResume, setUploadedResume] = useState(null);
  const [resumeContent, setResumeContent] = useState("");
  const [isEditMode, setIsEditMode] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const fileInputRef = useRef(null);

  // Default resume template
  const defaultResume = {
    personalInfo: {
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/johndoe",
      website: "johndoe.dev",
    },
    summary:
      "Experienced Software Engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about building scalable applications and leading cross-functional teams.",
    experience: [
      {
        id: 1,
        title: "Senior Software Engineer",
        company: "Tech Corp",
        location: "San Francisco, CA",
        duration: "2022 - Present",
        description: [
          "Led development of microservices architecture serving 1M+ users",
          "Implemented CI/CD pipelines reducing deployment time by 60%",
          "Mentored junior developers and conducted technical interviews",
        ],
      },
      {
        id: 2,
        title: "Software Engineer",
        company: "Startup Inc",
        location: "Remote",
        duration: "2020 - 2022",
        description: [
          "Built responsive web applications using React and TypeScript",
          "Developed RESTful APIs with Node.js and MongoDB",
          "Collaborated with design team to improve user experience",
        ],
      },
    ],
    education: [
      {
        id: 1,
        degree: "Bachelor of Science in Computer Science",
        institution: "University of California, Berkeley",
        duration: "2016 - 2020",
        gpa: "3.8/4.0",
      },
    ],
    skills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Python",
      "AWS",
      "Docker",
      "MongoDB",
      "PostgreSQL",
      "Git",
    ],
    projects: [
      {
        id: 1,
        name: "E-commerce Platform",
        description:
          "Built a full-stack e-commerce platform with React, Node.js, and Stripe integration",
        technologies: ["React", "Node.js", "MongoDB", "Stripe"],
        link: "github.com/johndoe/ecommerce",
      },
    ],
  };

  const [resumeData, setResumeData] = useState(defaultResume);

  // Handle file upload
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === "application/pdf") {
        setUploadedResume(file);
        // Here you would normally parse the PDF content
        setResumeContent(`Uploaded: ${file.name}`);
      } else if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setResumeContent(e.target.result);
          setUploadedResume(file);
        };
        reader.readAsText(file);
      } else {
        alert("Please upload a PDF or text file");
      }
    }
  }, []);

  // Handle drag and drop
  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file) {
        handleFileUpload({ target: { files: [file] } });
      }
    },
    [handleFileUpload]
  );

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  // Update resume data functions
  const updatePersonalInfo = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const updateSummary = (value) => {
    setResumeData((prev) => ({ ...prev, summary: value }));
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      title: "New Position",
      company: "Company Name",
      location: "Location",
      duration: "Start - End",
      description: ["Add your responsibilities and achievements"],
    };
    setResumeData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExp],
    }));
  };

  const updateExperience = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const deleteExperience = (id) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now(),
      degree: "Degree Name",
      institution: "Institution Name",
      duration: "Start - End",
      gpa: "",
    };
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }));
  };

  const updateEducation = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const deleteEducation = (id) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const addSkill = (skill) => {
    if (skill.trim() && !resumeData.skills.includes(skill.trim())) {
      setResumeData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill.trim()],
      }));
    }
  };

  const removeSkill = (skillToRemove) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const addProject = () => {
    const newProject = {
      id: Date.now(),
      name: "Project Name",
      description: "Project description",
      technologies: [],
      link: "",
    };
    setResumeData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
  };

  const updateProject = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((project) =>
        project.id === id ? { ...project, [field]: value } : project
      ),
    }));
  };

  const deleteProject = (id) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((project) => project.id !== id),
    }));
  };

  // Export resume as JSON
  const exportResume = () => {
    const dataStr = JSON.stringify(resumeData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "resume.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div
      className={`min-h-screen overflow-scroll transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
          {/* Left Panel - Upload and Editor */}
          <div
            className={`rounded-lg border h-full flex flex-col ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4">
                Upload & Edit Resume
              </h2>

              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  theme === "dark"
                    ? "border-gray-600 hover:border-gray-500 bg-gray-700/50"
                    : "border-gray-300 hover:border-gray-400 bg-gray-50"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg mb-2">
                  Drop your resume here or click to upload
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supports PDF and text files
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Choose File
                </button>
              </div>

              {uploadedResume && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-green-800 dark:text-green-200">
                    <FileText className="h-4 w-4 inline mr-2" />
                    Uploaded: {uploadedResume.name}
                  </p>
                </div>
              )}
            </div>

            {/* Editor Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {isEditMode ? (
                <EditView
                  resumeData={resumeData}
                  updatePersonalInfo={updatePersonalInfo}
                  updateSummary={updateSummary}
                  addExperience={addExperience}
                  updateExperience={updateExperience}
                  deleteExperience={deleteExperience}
                  addEducation={addEducation}
                  updateEducation={updateEducation}
                  deleteEducation={deleteEducation}
                  addSkill={addSkill}
                  removeSkill={removeSkill}
                  addProject={addProject}
                  updateProject={updateProject}
                  deleteProject={deleteProject}
                  theme={theme}
                />
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Raw Content</h3>
                  <textarea
                    value={resumeContent}
                    onChange={(e) => setResumeContent(e.target.value)}
                    className={`w-full h-96 p-4 rounded-lg border font-mono text-sm ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                    }`}
                    placeholder="Upload a resume or start typing..."
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div
            className={`rounded-lg border h-full ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold">Live Preview</h2>
            </div>
            <div className="p-6 h-full overflow-y-auto">
              <ResumePreview resumeData={resumeData} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
