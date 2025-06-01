"use client";
import React, { useState } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Github,
  ExternalLink,
  Calendar,
  Award,
  Building2,
  GraduationCap,
  Code,
  Star,
  Users,
  BookOpen,
} from "lucide-react";
import { useParams } from "next/navigation";

const CandidateProfile = () => {
  const [activeTab, setActiveTab] = useState("experiences");
  const id = useParams()._id;

  const candidateData = {
    name: "Yash Buddhadev",
    title: "AI & FinTech Enthusiast | Mozilla AI Fellow",
    description:
      "A student passionate about Artificial Intelligence, Computational Finance and Data Analytics. With a drive for problem-solving and a desire to make a meaningful impact in these dynamic realms.",
    location: "Mumbai, India",
    email: "yashbuddhadev21@gmail.com",
    phone: "+91 8369306269",
    linkedin: "https://www.linkedin.com/in/yash-buddhadev-889955289/",
    github: "https://github.com/buddhadevyash",
    portfolio: "https://yashbuddhadev.vercel.app/",
    education: {
      degree: "B.Tech",
      institution: "DJSCE",
      location: "Mumbai, India",
      duration: "2022-2026",
      gpa: "8.5",
    },
    experiences: [
      {
        position: "Mozilla AI Fellow",
        company: "@SimPPL",
        location: "Remote, HQ in New York",
        duration: "February 2024 - Present",
        description:
          "Working in AI research, I contribute actively to industry-level RCC projects, focusing on innovative solutions and real-world applications. My work bridges the gap between academic theory and practical implementation.",
        technologies: [
          "Microsoft Power BI",
          "Tableau",
          "AWS SageMaker",
          "IBM Watson",
          "Google Cloud AutoML",
          "Microsoft Azure ML",
          "Figma",
          "Adobe Ecosystem",
        ],
      },
      {
        position: "Product Developer",
        company: "@Infiheal HealthTech",
        location: "Remote, HQ in Pune",
        duration: "February 2024 - Present",
        description:
          "Contributed to build an app using Flutter, developing revenue models, achieve a product-market fit in the AI space having a lack of benchmarks in India, doing competitive analysis for further research and development.",
        technologies: [
          "Flutter",
          "Firebase",
          "SQLite3",
          "MySQL",
          "MongoDB",
          "PostgreDB",
          "Flask",
          "Django",
          "Node",
        ],
      },
    ],
    projects: [
      {
        name: "VaniVikas: Portal For Better Connectivity",
        description:
          "Developed a secure, smart, and user-friendly portal for Ali Yavar Jung Institute, streamlining patient data management and treatment tracking. It features seamless digital case files, automated case allocation, and real-time treatment updates.",
        achievement: "Winner at Smart India Hackathon 2024",
        github:
          "https://github.com/buddhadevyash/INNOV8-HumanAIze-FintechEdition/tree/main",
      },
      {
        name: "PhysioPlay: AI Playground Demo",
        description:
          "Developing 'PhysioPlay', a persona-based AI system that helps physiotherapy students and doctors enhance their diagnostic skills. Supported by Mozilla India, it offers a platform for hands-on practice and skill development in physiotherapy.",
        achievement: "Mozilla RCC Grant",
      },
      {
        name: "SmartSure: Revolutionising Insurance",
        description:
          "Leveraging AI and advanced analytics, we personalize insurance premiums using fitness data, ML models, and an AI assistant for real-time insights and seamless interaction.",
        achievement: "Winner at HumanAIze (FinTech Edition) Hackathon",
        github:
          "https://github.com/buddhadevyash/INNOV8-HumanAIze-FintechEdition/tree/main",
      },
      {
        name: "Serenity: The New-Age Music App",
        description:
          "Serenity is a Figma prototype music app with seamless controls, including play/pause, skip, and intuitive swiping. It lets users connect with artist communities, discover music, and live stream concerts with real-time interactions.",
        achievement: "Winner at TechBlitz 2024 UI/UX Design",
      },
      {
        name: "CheckMate: Your Compliance Buddy",
        description:
          "Developed entire UI and automation software for automated compliance checking AI tool, with thorough research for UX and AI architecture, understanding the parameters required and the industry requirements.",
        achievement: "Winner at CODECRAFT Hackathon",
      },
    ],
    skills: {
      programming: [
        "C",
        "Java",
        "Python",
        "Solidity",
        "Dart",
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "Next.js",
        "Flutter",
      ],
      frameworks: [
        "Microsoft Power BI",
        "Tableau",
        "AWS SageMaker",
        "IBM Watson",
        "Google Cloud AutoML",
        "Microsoft Azure ML",
        "Figma",
      ],
      databases: ["Firebase", "SQLite3", "MySQL", "MongoDB", "PostgreDB"],
      tools: ["Flask", "Django", "Node"],
      cloud: ["AWS", "Google Cloud", "Microsoft Azure"],
    },
    volunteering: [
      "Founding Member and Chairperson, @DJS InfoMatrix",
      "Incharge Treasurer, @DJS National Student Data Corps",
    ],
    publications: [
      {
        title:
          "Automated Compliance Checking Of Unstructured Data Using LLMs And Langchain IRJMT",
        journal: "IRJMT",
      },
    ],
  };

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
        isActive
          ? "text-blue-600 border-blue-600 bg-blue-50/50"
          : "text-gray-600 border-transparent hover:text-blue-600 hover:border-blue-300"
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  const ExperienceCard = ({ experience }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {experience.company.charAt(1)}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {experience.position}
          </h3>
          <p className="text-blue-600 font-medium mb-1">{experience.company}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {experience.duration}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {experience.location}
            </span>
          </div>
        </div>
      </div>
      <p className="text-gray-700 mb-4 leading-relaxed">
        {experience.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {experience.technologies.slice(0, 6).map((tech, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
          >
            {tech}
          </span>
        ))}
        {experience.technologies.length > 6 && (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
            +{experience.technologies.length - 6} more
          </span>
        )}
      </div>
    </div>
  );

  const ProjectCard = ({ project }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Github size={20} />
          </a>
        )}
      </div>
      <p className="text-gray-700 mb-4 leading-relaxed">
        {project.description}
      </p>
      {project.achievement && (
        <div className="flex items-center gap-2 mb-3">
          <Award size={16} className="text-yellow-500" />
          <span className="text-sm font-medium text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full">
            {project.achievement}
          </span>
        </div>
      )}
    </div>
  );

  const SkillSection = ({ title, skills, icon: Icon }) => (
    <div className="mb-6">
      <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
        <Icon size={16} className="text-blue-600" />
        {title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-screen overflow-scroll bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white shadow-sm">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              Candidate Profile
            </h1>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                Add to Sequence
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Shortlisted
              </button>
            </div>
          </div>
        </div>

        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-8">
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-4xl font-bold">
              YB
            </div>
            <div className="flex-1 text-white">
              <h2 className="text-3xl font-bold mb-2">{candidateData.name}</h2>
              <p className="text-xl text-blue-100 mb-3">
                {candidateData.title}
              </p>
              <p className="text-blue-100 mb-4 max-w-2xl leading-relaxed">
                {candidateData.description}
              </p>

              <div className="flex items-center gap-6 text-sm">
                <span className="flex items-center gap-2">
                  <MapPin size={16} />
                  {candidateData.location}
                </span>
                <a
                  href={`mailto:${candidateData.email}`}
                  className="flex items-center gap-2 hover:text-blue-200 transition-colors"
                >
                  <Mail size={16} />
                  {candidateData.email}
                </a>
                <span className="flex items-center gap-2">
                  <Phone size={16} />
                  {candidateData.phone}
                </span>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <a
                  href={candidateData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Linkedin size={16} />
                  LinkedIn
                </a>
                <a
                  href={candidateData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Github size={16} />
                  GitHub
                </a>
                <a
                  href={candidateData.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                >
                  <ExternalLink size={16} />
                  Portfolio
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white">
          <div className="flex">
            <TabButton
              id="experiences"
              label="Experiences"
              icon={Building2}
              isActive={activeTab === "experiences"}
              onClick={setActiveTab}
            />
            <TabButton
              id="projects"
              label="Projects"
              icon={Code}
              isActive={activeTab === "projects"}
              onClick={setActiveTab}
            />
            <TabButton
              id="education"
              label="Education"
              icon={GraduationCap}
              isActive={activeTab === "education"}
              onClick={setActiveTab}
            />
            <TabButton
              id="skills"
              label="Skills"
              icon={Star}
              isActive={activeTab === "skills"}
              onClick={setActiveTab}
            />
            <TabButton
              id="additional"
              label="Additional"
              icon={Users}
              isActive={activeTab === "additional"}
              onClick={setActiveTab}
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Experiences Tab */}
          {activeTab === "experiences" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="text-blue-600" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">
                  Work Experience
                </h2>
              </div>
              {candidateData.experiences.map((exp, index) => (
                <ExperienceCard key={index} experience={exp} />
              ))}
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Code className="text-blue-600" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {candidateData.projects.map((project, index) => (
                  <ProjectCard key={index} project={project} />
                ))}
              </div>
            </div>
          )}

          {/* Education Tab */}
          {activeTab === "education" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="text-blue-600" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">Education</h2>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    DJ
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {candidateData.education.degree}
                    </h3>
                    <p className="text-blue-600 font-medium mb-1">
                      {candidateData.education.institution}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {candidateData.education.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {candidateData.education.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">
                        CGPA: {candidateData.education.gpa}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === "skills" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Star className="text-blue-600" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">
                  Skills & Technologies
                </h2>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                <SkillSection
                  title="Programming Languages"
                  skills={candidateData.skills.programming}
                  icon={Code}
                />
                <SkillSection
                  title="Frameworks & Libraries"
                  skills={candidateData.skills.frameworks}
                  icon={Building2}
                />
                <SkillSection
                  title="Databases"
                  skills={candidateData.skills.databases}
                  icon={Star}
                />
                <SkillSection
                  title="Tools & Platforms"
                  skills={candidateData.skills.tools}
                  icon={Star}
                />
                <SkillSection
                  title="Cloud Platforms"
                  skills={candidateData.skills.cloud}
                  icon={Star}
                />
              </div>
            </div>
          )}

          {/* Additional Tab */}
          {activeTab === "additional" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Users className="text-blue-600" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">
                  Additional Information
                </h2>
              </div>

              {/* Volunteering */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                  <Users size={20} className="text-blue-600" />
                  Leadership & Volunteering
                </h3>
                <div className="space-y-3">
                  {candidateData.volunteering.map((vol, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">{vol}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Publications */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                  <BookOpen size={20} className="text-blue-600" />
                  Publications
                </h3>
                <div className="space-y-3">
                  {candidateData.publications.map((pub, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {pub.title}
                      </h4>
                      <p className="text-sm text-gray-600">{pub.journal}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
