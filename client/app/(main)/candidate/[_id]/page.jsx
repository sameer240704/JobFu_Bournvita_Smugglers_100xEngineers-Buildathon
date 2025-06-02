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
  Building2, // For Experience (general)
  GraduationCap, // For Education (general)
  Code, // For Projects / Skills (general)
  Star, // For Skills / Rating (general)
  Users, // For Additional / Followers
  BookOpen, // For Publications / Articles
  Briefcase, // For Job Title in LinkedIn Profile
  Globe, // For Website in LinkedIn Profile
  MessageSquare, // For About section
  Share2, // For Activities
  Heart, // For Volunteering
  CheckCircle, // For Certifications
  Languages as LanguagesIcon, // For Languages, aliased to avoid conflict
  Image as ImageIcon, // For missing images
  Link2,
  Brain, // For links
} from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button"; // Assuming you have this
import { useCurrentUserId } from "@/hooks/use-current-user-id"; // Assuming you have this
// import Image from "next/image"; // Using <img> for simplicity with external URLs for now

// The LinkedIn JSON data you provided (assuming it comes from candidateData.linkedinScrapedProfile)

const CandidateProfile = () => {
  const [activeTab, setActiveTab] = useState("experiences");
  const params = useParams();
  const id = params._id; // Or params.id, depending on your route structure
  const [candidateData, setCandidateData] = useState({});
  const [linkedInProfileData, setLinkedInProfileData] = useState(null); // State for LinkedIn specific data
  const [loading, setLoading] = useState(true); // State for loading
  const [summary, setSummary] = useState([]);
  const user = useCurrentUserId();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/users/me/${user}`)
      .then((response) => response.json())
      .then((data) => {
        setUserId(data.user[0]._id);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [user]);

  console.log(userId);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/candidates/${id}`)
        .then((response) => response.json())
        .then((data) => {
          const mainData = {
            ...data,
            experience: Object.values(data.experience || {}),
          };
          setCandidateData(mainData);
          setLinkedInProfileData(data.linkedin_data?.profile_data); // Use fetched or sample
        })
        .catch((error) => {
          console.error("Error fetching candidate data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  console.log(candidateData);

  if (loading && !linkedInProfileData) {
    return <div>Loading...</div>;
  }

  const handleAddToShortlist = () => {
    try {
      fetch(
        `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/shortlisting/user/${userId}/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            chatHistoryId: chatHistoryId,
            candidateId: id,
          }),
        }
      );
    } catch (error) {
      console.error("Error adding to shortlist:", error);
    }
  };

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-4 md:px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
        isActive
          ? "text-blue-600 border-blue-600 bg-blue-50/50"
          : "text-gray-600 border-transparent hover:text-blue-600 hover:border-blue-300"
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  // ... (Your existing ExperienceCard, ProjectCard, SkillSection components)
  // You might want to adapt ExperienceCard or create a new one if the structure
  // from `candidateData.experience` is different from `linkedInProfileData.experience`.
  // For now, I'll assume `ExperienceCard` can be reused or you'll adapt it.

  const ExperienceCard = ({ experience }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {experience.company_name
            ? experience.company_name.charAt(0)
            : experience.company
            ? experience.company.charAt(0)
            : "C"}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {experience.position}
          </h3>
          <p className="text-blue-600 font-medium mb-1">
            {experience.company_name || experience.company}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
            {(experience.starts_at || experience.duration) && (
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {experience.starts_at && experience.ends_at
                  ? `${experience.starts_at} - ${experience.ends_at}`
                  : experience.duration}
                {experience.starts_at &&
                  experience.ends_at &&
                  experience.duration &&
                  ` (${experience.duration})`}
              </span>
            )}
            {experience.location && (
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {experience.location}
              </span>
            )}
          </div>
        </div>
      </div>
      {(experience.summary || experience.description) && (
        <p className="text-gray-700 mb-4 leading-relaxed text-sm">
          {experience.summary || experience.description}
        </p>
      )}
      {experience.technologies_used &&
        experience.technologies_used.length > 0 && (
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
        )}
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
    skills && skills.length > 0 ? ( // Check if skills array exists and is not empty
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
              {skill.name || skill}{" "}
              {/* Handle if skill is an object or string */}
            </span>
          ))}
        </div>
      </div>
    ) : null;

  // --- Components for LinkedIn Profile Tab ---
  const LinkedInProfileTabContent = ({ data }) => {
    if (!data) {
      return (
        <p className="text-gray-500">LinkedIn profile data not available.</p>
      );
    }

    const SectionWrapper = ({ title, icon: Icon, children }) => (
      <div className="mb-8 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          <Icon size={22} className="text-blue-600" />
          {title}
        </h3>
        {children}
      </div>
    );

    const LinkedInExperienceItem = ({ exp }) => (
      <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-b-0">
        {exp?.company_image ? (
          <img
            src={exp.company_image}
            alt={exp.company_name}
            className="w-12 h-12 rounded-md object-contain flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 flex-shrink-0">
            <Building2 size={24} />
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">{exp?.position}</h4>
          <a
            href={exp?.company_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            {exp?.company_name}
          </a>
          <p className="text-xs text-gray-500 mt-0.5">
            {exp?.starts_at} - {exp?.ends_at || "Present"} ({exp?.duration})
          </p>
          <p className="text-xs text-gray-500">{exp?.location}</p>
          {exp?.summary && (
            <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">
              {exp?.summary}
            </p>
          )}
        </div>
      </div>
    );

    const LinkedInEducationItem = ({ edu }) => (
      <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-b-0">
        {edu?.college_image &&
        edu?.college_image !==
          "https://static.licdn.com/aero-v1/sc/h/6qpnald1ddva78jx4bnnl3vw" ? (
          <img
            src={edu.college_image}
            alt={edu.college_name}
            className="w-12 h-12 rounded-md object-contain flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 flex-shrink-0">
            <GraduationCap size={24} />
          </div>
        )}
        <div className="flex-1">
          <a
            href={edu?.college_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gray-800 hover:underline"
          >
            {edu?.college_name}
          </a>
          <p className="text-sm text-gray-600">
            {edu?.college_degree}, {edu?.college_degree_field}
          </p>
          <p className="text-xs text-gray-500">{edu?.college_duration}</p>
          {edu?.college_activity && (
            <p className="mt-1 text-xs text-gray-500 italic">
              {edu?.college_activity}
            </p>
          )}
        </div>
      </div>
    );

    const LinkedInCertificationItem = ({ cert }) => (
      <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-b-0">
        {cert.company_image ? (
          <img
            src={cert.company_image}
            alt={cert.company_name}
            className="w-12 h-12 rounded-md object-contain flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 flex-shrink-0">
            <Award size={24} />
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">{cert?.certification}</h4>
          <a
            href={cert?.company_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            {cert?.company_name}
          </a>
          <p className="text-xs text-gray-500">{cert?.issue_date}</p>
          {cert?.credential_url && cert?.credential_id && (
            <a
              href={cert?.credential_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-xs text-blue-500 hover:underline"
            >
              <Link2 size={12} /> {cert?.credential_id}
            </a>
          )}
        </div>
      </div>
    );

    const LinkedInSimilarProfileItem = ({ profile }) => {
      if (!profile || !profile.name) return null;

      // Fallback for profile image if you had one, or use initials
      const initials = profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

      return (
        <div className="flex-shrink-0 w-48 sm:w-56 bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow duration-200 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-semibold text-lg mb-2 flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0 mb-2">
            <a
              href={profile.link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gray-800 hover:text-blue-600 hover:underline text-xs line-clamp-2 break-words" // Smaller text for narrower card
            >
              {profile.name}
            </a>
            {profile.summary && profile.summary !== "--" && (
              <p className="text-xxs text-gray-600 mt-0.5 line-clamp-2">
                {" "}
                {/* Even smaller text */}
                {profile.summary}
              </p>
            )}
            {profile.location && (
              <p className="text-xxs text-gray-500 mt-0.5 flex items-center justify-center gap-0.5">
                <MapPin size={10} /> {profile.location}
              </p>
            )}
          </div>
          <a
            href={profile.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-1 text-xxs text-blue-600 hover:text-blue-700 hover:underline bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md transition-colors"
            title={`View ${profile.name}'s profile on LinkedIn`}
          >
            View Profile <ExternalLink size={10} />
          </a>
        </div>
      );
    };

    const LinkedInVolunteeringItem = ({ vol }) => (
      <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-b-0">
        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 flex-shrink-0">
          <Heart size={24} /> {/* Placeholder if no image */}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">
            {vol.company_position}
          </h4>
          <a
            href={vol?.company_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            {vol?.company_name}
          </a>
          <p className="text-xs text-gray-500">
            {vol?.starts_at} - {vol?.ends_at || "Present"}
          </p>
        </div>
      </div>
    );

    const LinkedInActivityItem = ({ act }) => {
      if (!act || !act.title) return;
      return (
        <div className="py-4 border-b text-black border-gray-100 last:border-b-0">
          <a
            href={act.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-gray-50 p-2 -m-2 block rounded-md"
          >
            {act.image && (
              <img
                src={act.image}
                alt="Activity image"
                className="w-full h-auto max-h-48 object-cover rounded-md mb-2"
              />
            )}
            <p className="text-sm text-gray-700 mb-1 line-clamp-3">
              {act.title}
            </p>
            <p className="text-xs text-blue-600">{act.activity}</p>
          </a>
        </div>
      );
    };

    const LinkedInLanguageItem = ({ lang }) => (
      <div className="py-2">
        <span className="font-medium text-gray-700">{lang?.name}:</span>{" "}
        <span className="text-gray-600">{lang?.level}</span>
      </div>
    );

    return (
      <div className="space-y-6">
        {/* LinkedIn Header Section */}
        <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {data.background_cover_image_url && (
            <img
              src={data.background_cover_image_url}
              alt="Cover"
              className="w-full h-32 sm:h-48 object-cover"
            />
          )}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:gap-6">
              {data.profile_photo && (
                <img
                  src={data.profile_photo}
                  alt={data.fullName}
                  className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white flex-shrink-0 object-cover ${
                    data.background_cover_image_url
                      ? "-mt-12 sm:-mt-16"
                      : "mt-0"
                  } mb-4 sm:mb-0 shadow-md`}
                />
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {data.fullName}
                </h2>
                <p className="text-md text-gray-700 mt-1">{data.headline}</p>
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                  <MapPin size={14} /> {data.location}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  {data.followers && (
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {data.followers}
                    </span>
                  )}
                  {data.connections && <span>{data.connections}</span>}
                </div>
                {/* Top Card Description Links from LinkedIn Data */}
                {data.description && (
                  <div className="mt-3 text-xs text-gray-500 space-y-0.5">
                    {data.description.description1 &&
                      data.description.description1_link && (
                        <p>
                          <a
                            href={data.description.description1_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-blue-600"
                          >
                            {data.description.description1}
                          </a>
                        </p>
                      )}
                    {data.description.description2 &&
                      data.description.description2_link && (
                        <p>
                          <a
                            href={data.description.description2_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-blue-600"
                          >
                            {data.description.description2}
                          </a>
                        </p>
                      )}
                    {data.description.description3 &&
                      data.description.description3_link && (
                        <p>
                          <a
                            href={data.description.description3_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-blue-600"
                          >
                            {data.description.description3}
                          </a>
                        </p>
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {data.about && (
          <SectionWrapper title="About" icon={MessageSquare}>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {data.about}
            </p>
          </SectionWrapper>
        )}

        {data.experience && data.experience.length > 0 && (
          <SectionWrapper title="Experience" icon={Briefcase}>
            <div className="space-y-4">
              {data.experience.map((exp, index) => (
                <LinkedInExperienceItem
                  key={`linkedin-exp-${index}`}
                  exp={exp}
                />
              ))}
            </div>
          </SectionWrapper>
        )}

        {data.education && data.education.length > 0 && (
          <SectionWrapper title="Education" icon={GraduationCap}>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <LinkedInEducationItem
                  key={`linkedin-edu-${index}`}
                  edu={edu}
                />
              ))}
            </div>
          </SectionWrapper>
        )}

        {/* Skills from LinkedIn Data (if different from primary skills tab) */}
        {data.skills && data.skills.length > 0 && (
          <SectionWrapper title="Skills (from LinkedIn)" icon={Star}>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span
                  key={`linkedin-skill-${index}`}
                  className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </SectionWrapper>
        )}

        {data.certification && data.certification.length > 0 && (
          <SectionWrapper title="Licenses & Certifications" icon={CheckCircle}>
            <div className="space-y-4">
              {data.certification.map((cert, index) => (
                <LinkedInCertificationItem
                  key={`linkedin-cert-${index}`}
                  cert={cert}
                />
              ))}
            </div>
          </SectionWrapper>
        )}

        {data.volunteering && data.volunteering.length > 0 && (
          <SectionWrapper title="Volunteering" icon={Heart}>
            <div className="space-y-4">
              {data.volunteering?.map((vol, index) => (
                <LinkedInVolunteeringItem
                  key={`linkedin-vol-${index}`}
                  vol={vol}
                />
              ))}
            </div>
          </SectionWrapper>
        )}

        {data.languages && data.languages.length > 0 && (
          <SectionWrapper title="Languages" icon={LanguagesIcon}>
            <div className="space-y-1">
              {data.languages?.map((lang, index) => (
                <LinkedInLanguageItem
                  key={`linkedin-lang-${index}`}
                  lang={lang}
                />
              ))}
            </div>
          </SectionWrapper>
        )}

        {data.activities && data.activities.length > 0 && (
          <SectionWrapper title="Activities" icon={Share2}>
            <div className="grid grid-cols-3 space-x-4 space-y-4">
              {data.activities.map((act, index) => (
                <LinkedInActivityItem key={`linkedin-act-${index}`} act={act} />
              ))}
            </div>
          </SectionWrapper>
        )}

        {data.similar_profiles && data.similar_profiles.length > 0 && (
          <SectionWrapper title="People Also Viewed" icon={Share2}>
            <div className="space-y-1 grid grid-cols-4 w-full justify-center gap-2">
              {data.similar_profiles.map((profile, index) => (
                <LinkedInSimilarProfileItem key={index} profile={profile} />
              ))}
            </div>
          </SectionWrapper>
        )}
      </div>
    );
  };

  const handleGenerateSummary = async () => {
    setLoading(true);
    try {
      await new Promise(setTimeout(() => setLoading(false), 500));
      setSummary([candidateData.ai_summary_data.raw_summary]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-scroll bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-b-lg">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          {" "}
          {/* Made header sticky */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <h1 className="text-xl font-semibold text-gray-900">
              Candidate Profile
            </h1>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50 hover:text-purple-500"
                onClick={handleGenerateSummary}
              >
                <Brain className="w-5 h-5" /> Generate Summary
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700"
                onClick={handleAddToShortlist}
              >
                {candidateData.shortlisted ? "✓ Shortlisted" : "Shortlist"}
              </Button>
            </div>
          </div>
        </div>
        {/* Profile Header */}
        {candidateData.name && ( // Only render if candidateData is loaded
          <div className="relative">
            {linkedInProfileData?.background_cover_image_url && (
              <img
                src={linkedInProfileData.background_cover_image_url}
                alt="Cover"
                className="w-full h-40 md:h-56 object-cover rounded-t-lg"
              />
            )}
            <div
              className={`px-6 py-8 ${
                !linkedInProfileData?.background_cover_image_url
                  ? "bg-gradient-to-r from-blue-600 to-purple-700 rounded-t-lg"
                  : ""
              }`}
            >
              <div className="flex flex-col md:flex-row items-start gap-6">
                {linkedInProfileData?.profile_photo ? (
                  <img
                    src={linkedInProfileData.profile_photo}
                    alt={
                      linkedInProfileData.fullName ||
                      candidateData.candidate_name
                    }
                    className={`w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white object-cover flex-shrink-0 shadow-lg ${
                      linkedInProfileData?.background_cover_image_url
                        ? "-mt-16 md:-mt-20"
                        : ""
                    }`}
                  />
                ) : (
                  <div
                    className={`w-28 h-28 md:w-32 md:h-32 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-4xl font-bold flex-shrink-0 shadow-lg ${
                      linkedInProfileData?.background_cover_image_url
                        ? "-mt-16 md:-mt-20"
                        : ""
                    }`}
                  >
                    {candidateData.candidate_name
                      ?.split(" ")
                      .map((word, index) => (
                        <span key={index}>{word.charAt(0)}</span>
                      ))}
                  </div>
                )}
                <div
                  className={`flex-1 ${
                    linkedInProfileData?.background_cover_image_url
                      ? "pt-4"
                      : "text-white"
                  }`}
                >
                  <h2
                    className={`text-2xl md:text-3xl font-bold mb-1 ${
                      linkedInProfileData?.background_cover_image_url
                        ? "text-gray-900"
                        : "text-white"
                    }`}
                  >
                    {linkedInProfileData?.fullName ||
                      candidateData.candidate_name}
                  </h2>
                  <p
                    className={`text-md md:text-lg mb-2 ${
                      linkedInProfileData?.background_cover_image_url
                        ? "text-gray-600"
                        : "text-blue-100"
                    }`}
                  >
                    {
                      linkedInProfileData?.headline ||
                        candidateData.title /* Assuming candidateData.title for fallback */
                    }
                  </p>
                  <p
                    className={`text-sm mb-3 max-w-2xl leading-relaxed ${
                      linkedInProfileData?.background_cover_image_url
                        ? "text-gray-500"
                        : "text-blue-100"
                    }`}
                  >
                    {
                      candidateData.description /* This is the main description from your original schema */
                    }
                  </p>

                  <div
                    className={`flex flex-wrap items-center gap-x-6 gap-y-2 text-sm ${
                      linkedInProfileData?.background_cover_image_url
                        ? "text-gray-500"
                        : "text-blue-100"
                    }`}
                  >
                    {candidateData.contact_information?.location && (
                      <span className="flex items-center gap-2">
                        <MapPin size={16} />
                        {candidateData.contact_information.location}
                      </span>
                    )}
                    {candidateData.contact_information?.email && (
                      <a
                        href={`mailto:${candidateData.contact_information.email}`}
                        className={`flex items-center gap-2 transition-colors ${
                          linkedInProfileData?.background_cover_image_url
                            ? "hover:text-blue-600"
                            : "hover:text-blue-200"
                        }`}
                      >
                        <Mail size={16} />
                        {candidateData.contact_information.email}
                      </a>
                    )}
                    {candidateData.contact_information?.phone && (
                      <span className="flex items-center gap-2">
                        <Phone size={16} />
                        {candidateData.contact_information.phone}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    {candidateData.contact_information?.linkedin && (
                      <a
                        href={candidateData.contact_information.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg transition-colors ${
                          linkedInProfileData?.background_cover_image_url
                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            : "bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                        }`}
                      >
                        <Linkedin size={14} /> LinkedIn
                      </a>
                    )}
                    {/* Add GitHub and Portfolio similarly */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white sticky top-[70px] z-10">
          {" "}
          {/* Adjust top value based on header height */}
          <div className="max-w-6xl mx-auto flex overflow-x-auto">
            <TabButton
              id="experiences"
              label="Summary" // Changed from Experiences to Summary
              icon={Building2}
              isActive={activeTab === "experiences"}
              onClick={setActiveTab}
            />
            <TabButton
              id="linkedin"
              label="LinkedIn Profile"
              icon={Linkedin}
              isActive={activeTab === "linkedin"}
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
              id="skills"
              label="Skills"
              icon={Star}
              isActive={activeTab === "skills"}
              onClick={setActiveTab}
            />
            {candidateData.additional_information &&
              Object.keys(candidateData.additional_information).length > 0 && (
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
        <div className="p-6 bg-gray-50 min-h-[calc(100vh-200px)]">
          {" "}
          {/* Added min-height and bg */}
          {/* Experiences Tab (now Summary Tab) */}
          {activeTab === "experiences" && candidateData.experience && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-8 rounded">
                <div className="flex items-start gap-6">
                  <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-4xl font-bold">
                    {candidateData.candidate_name
                      ?.split(" ")
                      .map((word, index) => {
                        return <span key={index}>{word.charAt(0)}</span>;
                      })}
                  </div>
                  <div className="flex-1 text-white">
                    <h2 className="text-3xl font-bold mb-2">
                      {candidateData.name}
                    </h2>
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
              <div>{summary}</div>
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="text-blue-600" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">
                  Work Experience Summary
                </h2>
              </div>
              {candidateData.experience?.map((exp, index) => (
                <ExperienceCard key={`summary-exp-${index}`} experience={exp} />
              ))}
            </div>
          )}
          {/* LinkedIn Profile Tab */}
          {activeTab === "linkedin" && (
            <LinkedInProfileTabContent data={linkedInProfileData} />
          )}
          {/* Projects Tab */}
          {activeTab === "projects" && candidateData.projects && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Code className="text-blue-600" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
              </div>
              {candidateData.projects.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {candidateData.projects.map((project, index) => (
                    <ProjectCard key={index} project={project} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No projects listed.</p>
              )}
            </div>
          )}
          {/* Skills Tab */}
          {activeTab === "skills" && candidateData.skills && (
            // ... your existing skills tab content, ensure it checks for candidateData.skills and its sub-properties
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
                    candidateData.skills?.technical_skills
                      ?.programming_languages || []
                  }
                  icon={Code}
                />
                <SkillSection
                  title="Frameworks & Libraries"
                  skills={
                    candidateData.skills?.technical_skills
                      ?.frameworks_libraries || []
                  }
                  icon={Building2}
                />
                <SkillSection
                  title="Databases"
                  skills={
                    candidateData.skills?.technical_skills?.databases || []
                  }
                  icon={Star} // Consider Database icon from lucide if available
                />
                <SkillSection
                  title="Tools & Platforms"
                  skills={
                    candidateData.skills?.technical_skills?.tools_software || []
                  }
                  icon={Briefcase} // Or a tools icon
                />
                <SkillSection
                  title="Cloud Platforms"
                  skills={
                    candidateData.skills?.technical_skills?.cloud_platforms ||
                    []
                  }
                  icon={Globe} // Or a cloud icon
                />
                <SkillSection
                  title="DevOps"
                  skills={candidateData.skills?.technical_skills?.devops || []}
                  icon={Code}
                />
                <SkillSection
                  title="Data Science"
                  skills={
                    candidateData.skills?.technical_skills?.data_science || []
                  }
                  icon={Star}
                />
                <SkillSection
                  title="Other Technical Skills"
                  skills={
                    candidateData.skills?.technical_skills?.other_technical ||
                    []
                  }
                  icon={Star}
                />
              </div>
            </div>
          )}
          {/* Additional Tab */}
          {activeTab === "additional" &&
            candidateData.additional_information.length && (
              // ... your existing additional tab content
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="text-blue-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Additional Information
                  </h2>
                </div>
                {/* Volunteering */}
                {candidateData.additional_information.volunteering &&
                  candidateData.additional_information.volunteering.length >
                    0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                        <Heart size={20} className="text-blue-600" />
                        Volunteering
                      </h3>
                      <div className="space-y-3">
                        {candidateData.additional_information.volunteering.map(
                          (vol, index) => (
                            <div
                              key={index}
                              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <h4 className="font-medium text-gray-900 mb-1">
                                {vol.role || vol}
                              </h4>{" "}
                              {/* Adjust if 'vol' is an object */}
                              {vol.organization && (
                                <p className="text-sm text-blue-600">
                                  {vol.organization}
                                </p>
                              )}
                              {vol.duration && (
                                <p className="text-xs text-gray-500">
                                  {vol.duration}
                                </p>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                {/* Publications */}
                {candidateData.publications &&
                  candidateData.publications.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                        <BookOpen size={20} className="text-blue-600" />
                        Publications
                      </h3>
                      <div className="space-y-3">
                        {candidateData.publications.map((pub, index) => (
                          <div
                            key={index}
                            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <h4 className="font-medium text-gray-900 mb-1">
                              {pub.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {pub.journal} - {pub.date}
                            </p>
                            {pub.link && (
                              <a
                                href={pub.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-500 hover:underline"
                              >
                                View Publication
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
