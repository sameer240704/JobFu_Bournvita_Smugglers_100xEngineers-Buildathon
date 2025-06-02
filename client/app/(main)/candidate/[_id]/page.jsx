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
  User,
  BookOpen,
  Briefcase,
  Globe,
  MessageSquare,
  Share2,
  Heart,
  CheckCircle,
  Languages as LanguagesIcon,
  Link2,
  Brain,
  Database,
  GithubIcon,
  Notebook,
} from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button"; // Assuming path
import { useCurrentUserId } from "@/hooks/use-current-user-id"; // Assuming path
import GitHubProfileTab from "@/components/misc/GitHubProfileTab"; // Import the new component

const CandidateProfile = () => {
  const [activeTab, setActiveTab] = useState("experiences"); // Default tab
  const params = useParams();
  const candidateIdFromUrl = params._id;
  const [candidateData, setCandidateData] = useState({});
  const [linkedInProfileData, setLinkedInProfileData] = useState(null);
  const [githubData, setGithubData] = useState(null);
  const [summary, setSummary] = useState([]); // For AI generated summary
  const [loading, setLoading] = useState(true);
  const [isShortlisted, setIsShortlisted] = useState(false); // Local state for shortlist button

  const authProviderUserId = useCurrentUserId();
  const [dbUserId, setDbUserId] = useState(""); // Application's internal MongoDB user ID

  // Fetch application's internal user ID
  useEffect(() => {
    if (authProviderUserId) {
      fetch(
        `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/users/me/${authProviderUserId}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data && data.user && data.user.length > 0 && data.user[0]?._id) {
            setDbUserId(data.user[0]._id);
          } else {
            console.error("User's database ID not found.");
          }
        })
        .catch((error) =>
          console.error("Error fetching user's database ID:", error)
        );
    }
  }, [authProviderUserId]);

  // Fetch candidate data (including LinkedIn and GitHub sub-objects)

  useEffect(() => {
    if (candidateIdFromUrl) {
      setLoading(true);
      fetch(
        `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/candidates/${candidateIdFromUrl}`
      )
        .then((response) => {
          if (!response)
            throw new Error(`HTTP error! status: ${response.status}`);
          return response.json();
        })
        .then((apiResponse) => {
          if (apiResponse && apiResponse) {
            const data = apiResponse;
            const mainData = {
              ...data,
              experience: Object.values(data.experience || {}), // Normalize experience
            };
            setCandidateData(mainData);
            setLinkedInProfileData(data.linkedin_data?.profile_data || null);
            setGithubData(data.github_data || null); // Assuming github_data is the key
            setIsShortlisted(data.shortlisted || false); // Initialize shortlist status
            if (data.ai_summary_data?.raw_summary) {
              // Pre-populate summary if available
              setSummary(data.ai_summary_data.raw_summary);
            }
          } else {
            console.error(
              "Candidate data not found or API error:",
              apiResponse
            );
            setCandidateData({});
            setLinkedInProfileData(null);
            setGithubData(null);
          }
        })
        .catch((error) => {
          console.error("Error fetching candidate data:", error);
          setCandidateData({});
          setLinkedInProfileData(null);
          setGithubData(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false); // No ID, so not loading
    }
  }, [candidateIdFromUrl]);

  console.log(candidateData);

  const handleToggleShortlist = async () => {
    if (!dbUserId || !candidateIdFromUrl) {
      alert("User or Candidate ID missing.");
      return;
    }
    const newShortlistStatus = !isShortlisted;
    const endpoint = newShortlistStatus
      ? `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/shortlisting/user/${dbUserId}/add`
      : `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/shortlisting/user/${dbUserId}/candidate/${candidateIdFromUrl}`; // Assuming this is your remove endpoint

    const method = newShortlistStatus ? "POST" : "DELETE";

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: newShortlistStatus
          ? JSON.stringify({ candidateId: candidateIdFromUrl })
          : null,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to update shortlist status"
        );
      }
      setIsShortlisted(newShortlistStatus);
      // Optionally: show a success toast
    } catch (error) {
      console.error("Error updating shortlist status:", error);
      alert("Error: " + error.message);
    }
  };

  const handleGenerateSummary = async () => {
    if (candidateData.ai_summary_data?.raw_summary) {
      setSummary(candidateData.ai_summary_data.raw_summary);
      return; // Use existing summary
    }
    // If no existing summary, proceed to generate (implement API call if needed)
    alert(
      "AI Summary generation endpoint not implemented yet. Showing placeholder."
    );
    // Placeholder:
    // setLoading(true);
    // try {
    //   const response = await fetch(`/api/candidates/${candidateIdFromUrl}/generate-summary`, { method: 'POST' });
    //   const data = await response.json();
    //   if (data.success) setSummary(data.summary); else throw new Error(data.message);
    // } catch (error) { console.error("Error generating summary:", error); }
    // finally { setLoading(false); }
  };

  const TabButton = ({ id, label, icon: IconComponent, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-4 md:px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
        isActive
          ? "text-blue-600 border-blue-600 bg-blue-50/50"
          : "text-gray-600 border-transparent hover:text-blue-600 hover:border-blue-300"
      }`}
    >
      <IconComponent size={16} />
      {label}
    </button>
  );

  const ExperienceCard = ({ experience }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {experience.company_name?.charAt(0) ||
            experience.company?.charAt(0) ||
            "C"}
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
      {experience.technologies_used?.length > 0 && (
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
            className="text-gray-400 hover:text-blue-600"
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

  const SkillSection = ({ title, skills, icon: IconComponent }) =>
    skills?.length > 0 ? (
      <div className="mb-6">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
          <IconComponent size={16} className="text-blue-600" />
          {title}
        </h4>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg"
            >
              {skill.name || skill}
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
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:gap-6">
              {data.profile_photo ? (
                <img
                  src={data.profile_photo}
                  alt={data.fullName || "Profile"}
                  className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white flex-shrink-0 object-cover ${
                    data.background_cover_image_url
                      ? "-mt-12 sm:-mt-16"
                      : "mt-0"
                  } mb-4 sm:mb-0 shadow-md`}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ) : (
                <div
                  className={`w-24 h-24 sm:w-32 sm:h-32 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-4xl font-semibold ${
                    data.background_cover_image_url
                      ? "-mt-12 sm:-mt-16"
                      : "mt-0"
                  } mb-4 sm:mb-0 shadow-md`}
                >
                  {(data.first_name?.[0] || "") + (data.last_name?.[0] || "")}
                </div>
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
                      <User size={14} />
                      {data.followers}
                    </span>
                  )}
                  {data.connections && <span>{data.connections}</span>}
                </div>
                {data.description && typeof data.description === "object" && (
                  <div className="mt-3 text-xs text-gray-500 space-y-0.5">
                    {Object.entries(data.description).map(([key, value]) => {
                      if (key.endsWith("_link") || !value) return null;
                      const linkKey = `${key}_link`;
                      return value && data.description[linkKey] ? (
                        <p key={key}>
                          <a
                            href={data.description[linkKey]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline text-blue-600"
                          >
                            {value}
                          </a>
                        </p>
                      ) : value ? (
                        <p key={key}>{value}</p>
                      ) : null;
                    })}
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

        {data.education?.length > 0 && (
          <SectionWrapper title="Education" icon={GraduationCap}>
            <div className="space-y-0">
              {data.education.map((edu, i) => (
                <LinkedInEducationItem key={`li-edu-${i}`} edu={edu} />
              ))}
            </div>
          </SectionWrapper>
        )}
        {data.skills?.length > 0 && (
          <SectionWrapper title="Skills" icon={Star}>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((s, i) => (
                <span
                  key={`li-skill-${i}`}
                  className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg"
                >
                  {s.name || s}
                </span>
              ))}
            </div>
          </SectionWrapper>
        )}
        {data.certification?.length > 0 && (
          <SectionWrapper title="Licenses & Certifications" icon={CheckCircle}>
            <div className="space-y-0">
              {data.certification.map((cert, i) => (
                <LinkedInCertificationItem key={`li-cert-${i}`} cert={cert} />
              ))}
            </div>
          </SectionWrapper>
        )}
        {data.volunteering?.length > 0 && (
          <SectionWrapper title="Volunteering" icon={Heart}>
            <div className="space-y-0">
              {data.volunteering.map((vol, i) => (
                <LinkedInVolunteeringItem key={`li-vol-${i}`} vol={vol} />
              ))}
            </div>
          </SectionWrapper>
        )}
        {data.languages?.length > 0 && (
          <SectionWrapper title="Languages" icon={LanguagesIcon}>
            <div className="space-y-0">
              {data.languages.map((lang, i) => (
                <LinkedInLanguageItem key={`li-lang-${i}`} lang={lang} />
              ))}
            </div>
          </SectionWrapper>
        )}
        {data.activities?.length > 0 && (
          <SectionWrapper title="Activities" icon={Share2}>
            <div className="grid grid-cols-3 gap-4 space-y-4">
              {data.activities.map((act, i) => (
                <LinkedInActivityItem key={`li-act-${i}`} act={act} />
              ))}
            </div>
          </SectionWrapper>
        )}
        {data.similar_profiles?.length > 0 && (
          <SectionWrapper title="People Also Viewed" icon={User}>
            <div className="flex space-x-4 overflow-x-auto pb-3 -mb-3 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-track-transparent">
              {data.similar_profiles.map((p, i) => (
                <LinkedInSimilarProfileItem key={`li-sim-${i}`} profile={p} />
              ))}
            </div>
          </SectionWrapper>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-16 w-16 text-purple-600 mx-auto mb-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-xl font-semibold text-gray-700">
            Loading Candidate Profile...
          </p>
        </div>
      </div>
    );
  }

  if (
    !candidateData.name &&
    !linkedInProfileData?.fullName &&
    !githubData?.profile?.name
  ) {
    return (
      <div className="h-screen overflow-scroll bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-10 rounded-xl shadow-xl">
          <User size={64} className="mx-auto mb-6 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Profile Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the candidate profile you were looking for.
          </p>
          <Button
            onClick={() => router.push("/chat-history")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Back to Searches
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-scroll bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-b-lg">
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
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
                <Brain size={18} className="mr-2" /> AI Summary
              </Button>
              <Button
                className={`transition-colors ${
                  isShortlisted
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                }`}
                onClick={handleToggleShortlist}
              >
                {isShortlisted ? (
                  <>
                    <CheckCircle size={18} className="mr-2" /> Shortlisted
                  </>
                ) : (
                  "Shortlist Candidate"
                )}
              </Button>
            </div>
          </div>
        </header>

        <div className="relative px-4 py-6">
          <div className="flex items-start gap-6">
            {linkedInProfileData?.profile_photo ||
            candidateData?.profile_photo_url ? (
              <div className="flex-col">
                <img
                  src={
                    linkedInProfileData?.profile_photo ||
                    candidateData?.profile_photo_url
                  }
                  alt={
                    linkedInProfileData?.fullName ||
                    candidateData?.candidate_name ||
                    "Profile"
                  }
                  className={`w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white object-cover flex-shrink-0 shadow-lg ${
                    linkedInProfileData?.background_cover_image_url ||
                    candidateData?.cover_image_url
                      ? ""
                      : ""
                  }`}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                <div className="grid items-center gap-3 mt-4">
                  {candidateData?.contact_information?.linkedin && (
                    <a
                      href={candidateData.contact_information.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg transition-colors ${
                        linkedInProfileData?.background_cover_image_url ||
                        candidateData?.cover_image_url
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : "bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                      }`}
                    >
                      <Linkedin size={14} /> LinkedIn
                    </a>
                  )}
                  {candidateData?.contact_information?.github && (
                    <a
                      href={candidateData.contact_information.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg transition-colors ${
                        linkedInProfileData?.background_cover_image_url ||
                        candidateData?.cover_image_url
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : "bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                      }`}
                    >
                      <Github size={14} /> GitHub
                    </a>
                  )}
                  {candidateData?.contact_information?.portfolio && (
                    <a
                      href={candidateData.contact_information.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg transition-colors ${
                        linkedInProfileData?.background_cover_image_url ||
                        candidateData?.cover_image_url
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : "bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                      }`}
                    >
                      <ExternalLink size={14} /> Portfolio
                    </a>
                  )}
                </div>
              </div>
            ) : (
              (candidateData?.candidate_name ||
                linkedInProfileData?.fullName) && (
                <div
                  className={`w-28 h-28 md:w-32 md:h-32 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-4xl font-bold flex-shrink-0 shadow-lg`}
                >
                  {(
                    candidateData?.candidate_name ||
                    linkedInProfileData?.fullName
                  )
                    ?.split(" ")
                    .map((word, index) => (
                      <span key={index}>{word.charAt(0)}</span>
                    ))
                    .slice(0, 2)}
                </div>
              )
            )}
            <div
              className={`flex-1 ${
                linkedInProfileData?.background_cover_image_url ||
                candidateData?.cover_image_url
                  ? "pt-4"
                  : "text-white"
              }`}
            >
              <h2
                className={`text-2xl md:text-3xl font-bold mb-1 ${
                  linkedInProfileData?.background_cover_image_url ||
                  candidateData?.cover_image_url
                    ? "text-gray-900"
                    : "text-white"
                }`}
              >
                {linkedInProfileData?.fullName ||
                  candidateData?.candidate_name ||
                  "N/A"}
              </h2>
              <p
                className={`text-md md:text-lg mb-2 ${
                  linkedInProfileData?.background_cover_image_url ||
                  candidateData?.cover_image_url
                    ? "text-gray-600"
                    : "text-blue-100"
                }`}
              >
                {linkedInProfileData?.headline ||
                  candidateData?.title ||
                  "No headline available"}
              </p>
              <p
                className={`text-sm mb-3 max-w-2xl leading-relaxed ${
                  linkedInProfileData?.background_cover_image_url ||
                  candidateData?.cover_image_url
                    ? "text-gray-500"
                    : "text-blue-100"
                }`}
              >
                {candidateData?.description ||
                  linkedInProfileData?.about ||
                  "No description available."}
              </p>
              <div
                className={`flex flex-wrap items-center gap-x-6 gap-y-2 text-sm ${
                  linkedInProfileData?.background_cover_image_url ||
                  candidateData?.cover_image_url
                    ? "text-gray-500"
                    : "text-blue-100"
                }`}
              >
                {candidateData?.contact_information?.location && (
                  <span className="flex items-center gap-2">
                    <MapPin size={16} />
                    {candidateData.contact_information.location}
                  </span>
                )}
                {candidateData?.contact_information?.email && (
                  <a
                    href={`mailto:${candidateData.contact_information.email}`}
                    className={`flex items-center gap-2 transition-colors ${
                      linkedInProfileData?.background_cover_image_url ||
                      candidateData?.cover_image_url
                        ? "hover:text-blue-600"
                        : "hover:text-blue-200"
                    }`}
                  >
                    <Mail size={16} />
                    {candidateData.contact_information.email}
                  </a>
                )}
                {candidateData?.contact_information?.phone && (
                  <span className="flex items-center gap-2">
                    <Phone size={16} />
                    {candidateData.contact_information.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <nav className="border-b border-gray-200 bg-white sticky top-[70px] z-20">
          {" "}
          {/* Tabs also sticky */}
          <div className="max-w-6xl mx-auto flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-track-transparent">
            <TabButton
              id="experiences"
              label="Summary"
              icon={Briefcase}
              isActive={activeTab === "experiences"}
              onClick={setActiveTab}
            />
            {linkedInProfileData && (
              <TabButton
                id="linkedin"
                label="LinkedIn"
                icon={Linkedin}
                isActive={activeTab === "linkedin"}
                onClick={setActiveTab}
              />
            )}
            {githubData && (
              <TabButton
                id="github"
                label="GitHub"
                icon={Github}
                isActive={activeTab === "github"}
                onClick={setActiveTab}
              />
            )}
            {candidateData?.projects?.length > 0 && (
              <TabButton
                id="projects"
                label="Projects"
                icon={Code}
                isActive={activeTab === "projects"}
                onClick={setActiveTab}
              />
            )}
            {candidateData?.skills &&
              (candidateData.skills.technical_skills?.programming_languages
                ?.length > 0 ||
                candidateData.skills.other_skills?.length > 0) && (
                <TabButton
                  id="skills"
                  label="Skills"
                  icon={Star}
                  isActive={activeTab === "skills"}
                  onClick={setActiveTab}
                />
              )}
            {candidateData?.education?.length > 0 && (
              <TabButton
                id="education"
                label="Education"
                icon={GraduationCap}
                isActive={activeTab === "education"}
                onClick={setActiveTab}
              />
            )}
            {candidateData?.additional_information &&
              (candidateData.additional_information.volunteering?.length > 0 ||
                candidateData.additional_information.publications?.length > 0 ||
                candidateData.additional_information.awards?.length > 0) && (
                <TabButton
                  id="additional"
                  label="Additional"
                  icon={User}
                  isActive={activeTab === "additional"}
                  onClick={setActiveTab}
                />
              )}
          </div>
        </nav>

        <div className="p-6 mb-8">
          {/* Adjust min-height if needed */}
          {activeTab === "experiences" && (
            <>
              {summary.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Brain className="text-purple-600" size={24} />
                    <h2 className="text-2xl font-bold text-gray-900">
                      AI Generated Summary
                    </h2>
                  </div>
                  <div className="space-y-3 text-gray-700 leading-relaxed prose prose-sm max-w-none">
                    {summary.map((item, index) => (
                      <p key={index}>{item}</p>
                    ))}
                  </div>
                </div>
              )}
              {candidateData?.experience?.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Briefcase className="text-blue-600" size={24} />
                    <h2 className="text-2xl font-bold text-gray-900">
                      Work Experience
                    </h2>
                  </div>
                  {candidateData.experience.map((exp, index) => (
                    <ExperienceCard
                      key={`summary-exp-${index}`}
                      experience={exp}
                    />
                  ))}
                </div>
              ) : (
                summary.length === 0 && (
                  <p className="text-gray-500 text-center py-10">
                    No summary or work experience available.
                  </p>
                )
              )}
            </>
          )}
          {activeTab === "linkedin" && linkedInProfileData && (
            <LinkedInProfileTabContent data={linkedInProfileData} />
          )}
          {activeTab === "github" && githubData && (
            <GitHubProfileTab githubData={githubData} />
          )}
          {activeTab === "projects" && candidateData?.projects?.length > 0 && (
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
          {activeTab === "skills" && candidateData?.skills && (
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
                  icon={Database}
                />
                <SkillSection
                  title="Tools & Platforms"
                  skills={
                    candidateData.skills?.technical_skills?.tools_software || []
                  }
                  icon={Briefcase}
                />
                <SkillSection
                  title="Cloud Platforms"
                  skills={
                    candidateData.skills?.technical_skills?.cloud_platforms ||
                    []
                  }
                  icon={Globe}
                />
                <SkillSection
                  title="DevOps"
                  skills={candidateData.skills?.technical_skills?.devops || []}
                  icon={GithubIcon}
                />
                <SkillSection
                  title="Data Science & ML"
                  skills={
                    candidateData.skills?.technical_skills?.data_science || []
                  }
                  icon={Brain}
                />
                <SkillSection
                  title="Other Technical Skills"
                  skills={
                    candidateData.skills?.technical_skills?.other_technical ||
                    []
                  }
                  icon={Code}
                />
                <SkillSection
                  title="Soft Skills"
                  skills={candidateData.skills?.other_skills?.soft_skills || []}
                  icon={User}
                />
                <SkillSection
                  title="Methodologies"
                  skills={
                    candidateData.skills?.other_skills?.methodologies || []
                  }
                  icon={Notebook}
                />
              </div>
            </div>
          )}
          {activeTab === "education" &&
            candidateData?.education?.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <GraduationCap className="text-blue-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Education
                  </h2>
                </div>
                {candidateData.education.map((ed, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {ed.institution?.charAt(0) || "E"}
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
                          {ed.location && (
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />
                              {ed.location}
                            </span>
                          )}
                        </div>
                        {ed.gpa_cgpa && (
                          <div className="flex items-center gap-2">
                            <Star
                              size={16}
                              className="text-yellow-500 fill-yellow-500"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              CGPA: {ed.gpa_cgpa}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          {activeTab === "additional" &&
            candidateData?.additional_information && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <User className="text-blue-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Additional Information
                  </h2>
                </div>
                {candidateData.additional_information.volunteering?.length >
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
                            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                          >
                            <h4 className="font-medium text-gray-900 mb-1">
                              {vol.role || vol}
                            </h4>
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
                {candidateData.additional_information.publications?.length >
                  0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                      <BookOpen size={20} className="text-blue-600" />
                      Publications
                    </h3>
                    <div className="space-y-3">
                      {candidateData.additional_information.publications.map(
                        (pub, index) => (
                          <div
                            key={index}
                            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
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
                        )
                      )}
                    </div>
                  </div>
                )}
                {candidateData.additional_information.awards?.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                      <Award size={20} className="text-blue-600" />
                      Awards & Honors
                    </h3>
                    <div className="space-y-3">
                      {candidateData.additional_information.awards.map(
                        (award, index) => (
                          <div
                            key={index}
                            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                          >
                            <h4 className="font-medium text-gray-900 mb-1">
                              {award.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {award.issuer} - {award.date}
                            </p>
                            {award.description && (
                              <p className="text-xs text-gray-500 mt-1">
                                {award.description}
                              </p>
                            )}
                          </div>
                        )
                      )}
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
