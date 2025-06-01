"use client";
import React, { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { useCurrentUserId } from "@/hooks/use-current-user-id";

const CandidateProfile = () => {
  const [activeTab, setActiveTab] = useState("experiences");
  const id = useParams()._id;
  const [candidateData, setCandidateData] = useState({});

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/candidates/${id}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.experience);
        const experienceArray = Object.values(data.experience || {});
        setCandidateData({ ...data, experience: experienceArray });
        // setCandidateData(data);
      })
      .catch((error) => {
        console.error("Error fetching candidate data:", error);
      });
  }, [id]);

  const userId = useCurrentUserId();
  const [ids, setIds] = useState("");
  useEffect(() => {
    if (userId) {
      fetch(`${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/users/me/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setIds(data);
          console.log(data);
        });
    }
  }, []);
  console.log(ids);

  const [shortlistedCandidates, setShortlistedCandidates] = useState([]);

  // useEffect(() => {
  //   try {
  //     fetch(
  //       `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/shortlisting/user/${ids}`
  //     )
  //       .then((response) => response.json())
  //       .then((data) => {
  //         setShortlistedCandidates(data);
  //       });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [candidateData]);

  console.log(shortlistedCandidates);

  const handleUpdate = () => {
    const method = candidateData.shortlisted ? "DELETE" : "POST";
    const url = fetch(
      `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/shortlisting/${id}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body:
          method === "POST"
            ? JSON.stringify({
                shortlisted: true,
              })
            : null,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setCandidateData({
          ...candidateData,
          shortlisted: !candidateData.shortlisted,
        });
      })
      .catch((error) => {
        console.error("Error updating shortlist status:", error);
      });
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
          {experience.company.charAt(0)}
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
        {experience.technologies_used.slice(0, 6).map((tech, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
          >
            {tech}
          </span>
        ))}
        {experience.technologies_used.length > 6 && (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
            +{experience.technologies_used.length - 6} more
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
      {project.achievements && (
        <div className="flex items-center gap-2 mb-3">
          <Award size={16} className="text-yellow-500" />
          <span className="text-sm font-medium text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full">
            {project.achievements}
          </span>
        </div>
      )}
    </div>
  );

  const SkillSection = ({ title, skills, icon: Icon }) =>
    skills.length != 0 ? (
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
    ) : (
      <></>
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
              <Button className="px-4 py-2 border-purple-600 border hover:border-purplr-400">
                Add to Sequence
              </Button>
              <Button
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 cursor-pointer"
                onClick={handleUpdate}
              >
                Shortlisted
              </Button>
            </div>
          </div>
        </div>

        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-8 rounded">
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-4xl font-bold">
              {candidateData.candidate_name?.split(" ").map((word, index) => {
                return <span key={index}>{word.charAt(0)}</span>;
              })}
            </div>
            <div className="flex-1 text-white">
              <h2 className="text-3xl font-bold mb-2">{candidateData.name}</h2>
              <p className="text-xl text-blue-100 mb-3">
                {candidateData.candidate_name}
              </p>
              <p className="text-blue-100 mb-4 max-w-2xl leading-relaxed">
                {candidateData.description}
              </p>

              <div className="flex items-center gap-6 text-sm">
                <span className="flex items-center gap-2">
                  <MapPin size={16} />
                  {candidateData.contact_information?.location}
                </span>
                <a
                  href={`mailto:${candidateData.email}`}
                  className="flex items-center gap-2 hover:text-blue-200 transition-colors"
                >
                  <Mail size={16} />
                  {candidateData.contact_information?.email}
                </a>
                <span className="flex items-center gap-2">
                  <Phone size={16} />
                  {candidateData.contact_information?.phone}
                </span>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <a
                  href={candidateData.contact_information?.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Linkedin size={16} />
                  LinkedIn
                </a>
                <a
                  href={candidateData.contact_information?.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Github size={16} />
                  GitHub
                </a>
                <a
                  href={candidateData.contact_information?.portfolio}
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
            {candidateData.additional_information?.length == 0 && (
              <TabButton
                id="additional"
                label="Additional"
                icon={Users}
                isActive={activeTab === "additional"}
                onClick={setActiveTab}
              />
            )}
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
              {candidateData.experience?.map((exp, index) => {
                return <ExperienceCard key={index} experience={exp} />;
              })}
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
                  {candidateData.education.map((ed, index) => {
                    return (
                      <>
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                          {ed.institution.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {ed.degree}
                          </h3>
                          <p className="text-blue-600 font-medium mb-1">
                            {ed.institution}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {ed.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />
                              {ed.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star size={16} className="text-yellow-500" />
                            <span className="text-sm font-medium text-gray-700">
                              CGPA: {ed.gpa_cgpa}
                            </span>
                          </div>
                        </div>
                      </>
                    );
                  })}
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
                  skills={
                    candidateData.skills.technical_skills.programming_languages
                  }
                  icon={Code}
                />
                <SkillSection
                  title="Frameworks & Libraries"
                  skills={
                    candidateData.skills.technical_skills.frameworks_libraries
                  }
                  icon={Building2}
                />
                <SkillSection
                  title="Databases"
                  skills={candidateData.skills.technical_skills.databases}
                  icon={Star}
                />
                <SkillSection
                  title="Tools & Platforms"
                  skills={candidateData.skills.technical_skills.tools_software}
                  icon={Star}
                />
                <SkillSection
                  title="Cloud Platforms"
                  skills={candidateData.skills.technical_skills.cloud_platforms}
                  icon={Star}
                />
                <SkillSection
                  title="DevOPs"
                  skills={candidateData.skills.technical_skills.devops}
                  icon={Star}
                />
                <SkillSection
                  title="Data Science"
                  skills={candidateData.skills.technical_skills.data_science}
                  icon={Star}
                />
                <SkillSection
                  title="Other Technical Skills"
                  skills={candidateData.skills.technical_skills.other_technical}
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
              {candidateData.additional_information.length == 0 && (
                <>
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                      <Users size={20} className="text-blue-600" />
                      Volunteering
                    </h3>
                    <div className="space-y-3">
                      {candidateData.additional_information.volunteering.map(
                        (vol, index) => (
                          <div
                            key={index}
                            className="p-4 bg-gray-50 rounded-lg"
                          >
                            <h4 className="font-medium text-gray-900 mb-1">
                              {vol}
                            </h4>
                          </div>
                        )
                      )}
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
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
