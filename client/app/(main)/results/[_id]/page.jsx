"use client";
import React, { useState, useEffect, useCallback } from "react"; // Added useCallback
import {
  MapPin,
  Star,
  MessageCircle,
  Github,
  Linkedin,
  Twitter,
  Globe,
  ChevronLeft,
  User,
  Briefcase,
  GraduationCap,
  Clock,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
// import Link from "next/link"; // Not used in the provided snippet
import ChatHistoryPanel from "@/components/misc/ChatHistoryPanel"; // Assuming this path is correct
import Link from "next/link";
import { useCurrentUserId } from "@/hooks/use-current-user-id";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import JobDetailsPopup from "@/components/misc/job-details-popup";
import { toast } from "sonner";

const initialFiltersState = {
  location: [],
  jobTitle: "",
  minExperience: "",
  maxExperience: "",
  industry: "",
  skills: [],
};

const CandidateSearchResults = () => {
  const [candidates, setCandidates] = useState(null);
  const [loading, setLoading] = useState(true); // Initial loading for page
  const [chatHistoryLoading, setChatHistoryLoading] = useState(true); // Loading for chat history
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [shortlisted, setShortlisted] = useState(new Set());

  const [showJobDetailsPopup, setShowJobDetailsPopup] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const router = useRouter();
  const id = useParams()._id;
  const user = useCurrentUserId();
  const [userId, setUserId] = useState(null); // State for user ID

  const [searchQueryFromUrl, setSearchQueryFromUrl] = useState("");
  const [appliedFiltersFromUrl, setAppliedFiltersFromUrl] =
    useState(initialFiltersState);
  const [editableFilters, setEditableFilters] = useState(initialFiltersState);
  const [allChatHistory, setAllChatHistory] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/users/me/${user}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.user) {
          setUserId(data.user[0]?._id);
        } else {
          console.error("No user data found in the response.");
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [user]);

  useEffect(() => {
    const fetchAllChats = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/chats/${userId}`
        );
        if (!response.success) {
          throw new Error(`Error fetching all chats: ${response.statusText}`);
        }
        const data = await response.json();
        setAllChatHistory(data.data);
      } catch (error) {
        console.error("Error fetching all chats:", error);
        toast.error("Failed to load chat history");
      }
    };
    fetchAllChats();
  }, [userId]);
  console.log(allChatHistory);

  useEffect(() => {
    const fetchShortlistedCandidates = async () => {
      if (!user || !id) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/shortlist/user/${user}/chat/${id}`
        );

        if (!response.ok) {
          throw new Error(
            `Error fetching shortlisted candidates: ${response.statusText}`
          );
        }

        const data = await response.json();
        const shortlistedIds = new Set(
          data.map((item) => item.candidateId._id || item.candidateId)
        );
        setShortlisted(shortlistedIds);
      } catch (error) {
        console.error("Failed to fetch shortlisted candidates:", error);
        toast.error("Failed to load shortlisted candidates");
      }
    };

    fetchShortlistedCandidates();
  }, []);

  // --- Helper to generate summary for titles etc. ---
  const generateSearchSummaryText = (query, filters) => {
    let summaryParts = [];
    if (query) {
      summaryParts.push(`"${query}"`);
    }
    if (filters?.jobTitle) {
      summaryParts.push(`as ${filters.jobTitle}`);
    }
    if (filters?.location && filters.location.length > 0) {
      summaryParts.push(`in ${filters.location.join(", ")}`);
    }
    // ... (add other filter conditions as in your original generateSearchSummary)
    if (summaryParts.length === 0) {
      return "General Search";
    }
    return `Search: ${summaryParts.join(" ")}`;
  };

  // --- Fetch Chat History from API ---

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/chats/${userId}/${id}`
        );
        if (!response) {
          throw new Error(
            `Error fetching chat history: ${response.statusText}`
          );
        }
        const data = await response.json();

        const formattedHistory = data.data.map((chat) => ({
          id: chat._id,
          title: generateSearchSummaryText(chat.query, chat.filters),
          type: "search",
          timestamp: new Date(chat.createdAt).toLocaleString(),
          lastMessage: `Found ${chat.response?.length || 0} candidates`,
          query: chat.query,
          filters: chat.filters,
          response: chat.response,
        }));
        setChatHistory(formattedHistory);

        setChatHistoryLoading(false);

        // Get all candidate IDs from the chat history responses
        const candidateIds = formattedHistory.flatMap(
          (chat) => chat.response?.map((item) => item.candidate._id) || []
        );

        // Fetch candidates for all IDs
        const candidatePromises = candidateIds.map((candidateId) =>
          fetch(
            `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/candidates/${candidateId}`
          ).then((res) => res.json())
        );

        const candidateResults = await Promise.all(candidatePromises);
        setCandidates(candidateResults);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching chat history:", error);
        setChatHistoryLoading(false);
        setLoading(false);
      }
    };

    if (userId) {
      fetchChatHistory();
    }
  }, [userId]);

  // --- Save new search to DB-backed chat history ---
  const saveSearchToDbHistory = useCallback(
    async (query, filters, resultCount) => {
      if (
        !query &&
        !Object.values(filters).some((f) =>
          Array.isArray(f) ? f.length > 0 : !!f
        )
      ) {
        console.log("Skipping save to history: Empty query and filters.");
        return;
      }

      // Basic duplicate check against current client-side history
      // A more robust check might be needed on the backend or involve fetching recent items
      const searchTitle = generateSearchSummaryText(query, filters);
      const isDuplicate = chatHistory.some(
        (chat) => chat.title === searchTitle // Simple title check for demo
      );

      if (isDuplicate) {
        console.log("Skipping save to history: Likely duplicate search.");
        return;
      }

      const payload = {
        query: query,
        filters: filters,
        response: [], // Sending empty for now as mockCandidates might not have real _ids
      };

      try {
        const response = await fetch("/api/chats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error(
            `Error saving search to history: ${response.statusText}`
          );
        }
        const newChatEntry = await response.json();
        // Add to local state, formatted
        setChatHistory((prev) => [
          {
            id: newChatEntry._id,
            title: generateSearchSummaryText(
              newChatEntry.query,
              newChatEntry.filters
            ),
            type: "search",
            timestamp: new Date(newChatEntry.createdAt).toLocaleString(),
            lastMessage: `Found ${
              newChatEntry.response?.length || resultCount
            } candidates`,
            searchData: {
              query: newChatEntry.query,
              filters: newChatEntry.filters,
            },
          },
          ...prev,
        ]);
      } catch (error) {
        console.error("Failed to save search to history:", error);
      }
    },
    [chatHistory, candidates]
  ); // candidates dependency might be too broad if only count is needed

  // Save search results when candidates are loaded (and URL params are present)
  useEffect(() => {
    if (
      !loading &&
      candidates.length > 0 &&
      (searchQueryFromUrl ||
        Object.values(appliedFiltersFromUrl).some((f) =>
          Array.isArray(f) ? f.length > 0 : !!f
        ))
    ) {
      saveSearchToDbHistory(
        searchQueryFromUrl,
        appliedFiltersFromUrl,
        candidates.length
      );
    }
  }, [
    loading,
    candidates,
    searchQueryFromUrl,
    appliedFiltersFromUrl,
    saveSearchToDbHistory,
  ]);

  // --- Delete Chat from DB ---
  const handleDeleteChat = async (chatIdToDelete, event) => {
    event.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this chat?")) return;

    try {
      const response = await fetch(`/api/chat-history/${chatIdToDelete}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Error deleting chat: ${response.statusText}`);
      }
      setChatHistory((prev) =>
        prev.filter((chat) => chat.id !== chatIdToDelete)
      );
    } catch (error) {
      console.error("Failed to delete chat:", error);
      // Optionally, show an error message to the user
    }
  };

  // --- Handle selecting a chat from history ---
  const handleSelectChat = (chatId) => {
    const selectedChat = chatHistory.find((chat) => chat.id === chatId);
    if (selectedChat?.type === "search" && selectedChat.searchData) {
      // Update URL to reflect the selected search
      const newParams = new URLSearchParams();
      if (selectedChat.searchData.query) {
        newParams.set("q", selectedChat.searchData.query);
      }
      if (
        selectedChat.searchData.filters &&
        Object.keys(selectedChat.searchData.filters).length > 0
      ) {
        newParams.set(
          "filters",
          JSON.stringify(selectedChat.searchData.filters)
        );
      }
      router.push(`?${newParams.toString()}`);
    }
    setIsChatHistoryOpen(false);
  };

  const handleNewChat = () => {
    // This should ideally clear the current search/filters and perhaps navigate to a base state
    // or open a new "chat" interface if that's different from search.
    // For now, let's clear URL params and let useEffect reset.
    router.push(window.location.pathname); // Navigates to the page without query params
    setIsChatHistoryOpen(false); // Or keep it open if a new chat is started in the panel
  };

  const handleShortlistClick = (candidate) => {
    setSelectedCandidate(candidate);
    setShowJobDetailsPopup(true);
  };

  const handleSaveJobDetails = async (jobDetails) => {
    if (!user) return;

    try {
      const offerDetails = {
        jobTitle: jobDetails.jobTitle,
        jobDescription: jobDetails.jobDescription,
        salary: jobDetails.salary,
        benefits: jobDetails.benefits,
        startDate: jobDetails.startDate,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/shortlist/user/${user}/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user,
            candidateId: selectedCandidate,
            chatHistoryId: id,
            offerDetails,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error("Error:", data.message);
      } else {
        setShortlisted((prev) => {
          const newSet = new Set(prev);
          newSet.add(selectedCandidate._id);
          return newSet;
        });

        toast.success("Candidate has been shortlisted!");
      }
    } catch (err) {
      console.error("Shortlist Error:", err.message);
      toast.error("Shortlist Error:", err.message);
    } finally {
      setShowJobDetailsPopup(false);
      setSelectedCandidate(null);
    }
  };

  const SocialLink = ({ href, icon: Icon, label, className = "" }) => {
    if (!href) return null;
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors ${className}`}
        title={label}
      >
        <Icon size={16} />
      </a>
    );
  };

  const generateDisplaySearchSummary = () => {
    // This uses the current URL state for display
    return generateSearchSummaryText(searchQueryFromUrl, appliedFiltersFromUrl);
  };

  const getDisplayableFilters = () => {
    // This uses the current URL state for display
    const pills = [];
    const filtersToDisplay = appliedFiltersFromUrl; // Use the state derived from URL

    if (filtersToDisplay.jobTitle) {
      pills.push({
        type: "Job Title",
        value: filtersToDisplay.jobTitle,
        icon: Briefcase,
      });
    }
    if (filtersToDisplay.location && filtersToDisplay.location.length > 0) {
      pills.push({
        type: "Location",
        value: filtersToDisplay.location.join(", "),
        icon: MapPin,
      });
    }
    // ... (add other filter pill generations based on appliedFiltersFromUrl)
    if (filtersToDisplay.industry) {
      pills.push({
        type: "Industry",
        value: filtersToDisplay.industry,
        icon: Briefcase,
      });
    }
    if (filtersToDisplay.minExperience || filtersToDisplay.maxExperience) {
      let expLabel = "";
      if (filtersToDisplay.minExperience && filtersToDisplay.maxExperience) {
        expLabel = `${filtersToDisplay.minExperience}-${filtersToDisplay.maxExperience} yrs`;
      } else if (filtersToDisplay.minExperience) {
        expLabel = `${filtersToDisplay.minExperience}+ yrs`;
      } else {
        expLabel = `Up to ${filtersToDisplay.maxExperience} yrs`;
      }
      pills.push({ type: "Experience", value: expLabel, icon: Clock });
    }
    if (filtersToDisplay.skills && filtersToDisplay.skills.length > 0) {
      pills.push({
        type: "Skills",
        value: filtersToDisplay.skills.join(", "),
        icon: Star,
      });
    }

    const activeFilterKeyCount = Object.keys(filtersToDisplay).filter((key) => {
      const value = filtersToDisplay[key];
      return Array.isArray(value) ? value.length > 0 : !!value;
    }).length;

    return {
      pills,
      otherFiltersCount: Math.max(0, activeFilterKeyCount - pills.length),
    };
  };

  const { pills: displayPills, otherFiltersCount } = getDisplayableFilters();

  if (loading && !candidates?.length) {
    // Show main loading only if no candidates yet
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching candidates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-scroll bg-gray-50">
      {" "}
      {/* Changed overflow-scroll to bg-gray-50 for main page background */}
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          {" "}
          {/* Adjusted max-width and padding */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-4 flex-shrink-0">
              <button
                onClick={() => router.back()} // Use router.back() for Next.js
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ChevronLeft size={20} />
                <span className="text-sm sm:text-base">Back to Search</span>
              </button>
              <div className="h-6 border-l border-gray-300 hidden sm:block"></div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                Profiles ({loading ? "..." : candidates?.length})
              </h1>
            </div>

            {/* Editable Filters Section */}
            <div className="flex flex-wrap items-center gap-2 justify-center">
              <input
                type="text"
                placeholder="Job Title"
                value={editableFilters.jobTitle}
                onChange={(e) =>
                  setEditableFilters((prev) => ({
                    ...prev,
                    jobTitle: e.target.value,
                  }))
                }
                className="text-xs sm:text-sm border border-gray-300 rounded-md px-2 py-1.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent w-32 sm:w-auto"
              />
              {/* Add other editable filter inputs similarly */}
              <input
                type="text"
                placeholder="Industry"
                value={editableFilters.industry}
                onChange={(e) =>
                  setEditableFilters((prev) => ({
                    ...prev,
                    industry: e.target.value,
                  }))
                }
                className="text-xs sm:text-sm border border-gray-300 rounded-md px-2 py-1.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent w-32 sm:w-auto"
              />
              <button className="px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-xs sm:text-sm">
                Apply
              </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <span className="text-xs sm:text-sm text-gray-600">
                {candidates.length > 0
                  ? `1-${Math.min(15, candidates.length)} of ${
                      candidates.length
                    }`
                  : "0 results"}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs sm:text-sm border border-gray-300 rounded-md px-2 py-1.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="experience">Sort: Experience</option>
                <option value="rating">Sort: Rating</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content Area */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Query Display */}
        {(searchQueryFromUrl ||
          Object.values(appliedFiltersFromUrl).some((val) =>
            Array.isArray(val) ? val.length > 0 : !!val
          )) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <User size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-800 font-medium">
                  {generateDisplaySearchSummary()}
                </p>
                {displayPills.length > 0 && (
                  <div className="flex items-center flex-wrap gap-1.5 mt-2">
                    {displayPills.map((pill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full"
                      >
                        {pill.icon && <pill.icon size={12} />}
                        {pill.value}
                      </span>
                    ))}
                    {otherFiltersCount > 0 && (
                      <span className="text-blue-600 text-xs">
                        (+{otherFiltersCount} more)
                      </span>
                    )}
                    <button
                      onClick={() => router.back()} // Or specific search page
                      className="text-blue-600 text-xs hover:underline ml-1"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {loading && candidates.length === 0 ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto mb-3"></div>
            <p className="text-gray-500">Loading results...</p>
          </div>
        ) : !loading && candidates.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow p-8">
            <User size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Candidates Found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search query or filters.
            </p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
            >
              Modify Search
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <div
                key={candidate.id || candidate._id} // Use unique key
                className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between">
                    <div className="flex gap-4 flex-1 mb-4 sm:mb-0">
                      <div className="flex-shrink-0">
                        <Image
                          src={
                            candidate.linkedin_data.profile_data
                              .profile_photo ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              candidate.linkedin_data.profile_data.profile_photo
                            )}&background=random`
                          }
                          alt={candidate.candidate_name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-200"
                          width={10000}
                          height={10000}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-1 sm:mb-2">
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 truncate hover:text-purple-600">
                            <Link
                              href={`/candidate/${
                                candidate.id || candidate._id
                              }`}
                            >
                              {candidate.candidate_name}
                            </Link>
                          </h3>
                          <div className="flex items-center gap-2 mt-1 sm:mt-0">
                            {candidate.contact_information.linkedin && (
                              <SocialLink
                                href={candidate.contact_information.linkedin}
                                icon={Linkedin}
                                label="LinkedIn"
                              />
                            )}
                            {candidate.contact_information.github && (
                              <SocialLink
                                href={candidate.contact_information.github}
                                icon={Github}
                                label="GitHub"
                              />
                            )}
                            {candidate.contact_information.twitter && (
                              <SocialLink
                                href={candidate.contact_information.twitter}
                                icon={Twitter}
                                label="Twitter"
                              />
                            )}
                            {candidate.contact_information.portfolio && (
                              <SocialLink
                                href={candidate.contact_information.portfolio}
                                icon={Globe}
                                label="Website"
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-1.5 text-sm text-gray-600">
                          <Briefcase size={15} className="flex-shrink-0" />
                          <p className="font-medium">
                            {candidate.ai_summary_data?.raw_summary["point1"]}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mb-1.5 text-xs sm:text-sm text-gray-500">
                          <MapPin size={15} className="flex-shrink-0" />
                          <p>{candidate.contact_information.location}</p>
                        </div>
                        {candidate.education && candidate.education[0] && (
                          <div className="mb-4">
                            <h3 className="font-semibold">
                              {candidate.education[0].degree}
                            </h3>
                            <p>{candidate.education[0].institution}</p>
                            <p>{candidate.education[0].location}</p>
                            <p>{candidate.education[0].duration}</p>
                            {candidate.education[0].gpa_cgpa && (
                              <p>GPA/CGPA: {candidate.education[0].gpa_cgpa}</p>
                            )}
                            {candidate.education[0].additional_info && (
                              <p>{candidate.education[0].additional_info}</p>
                            )}
                          </div>
                        )}
                        {candidate.skills.technical_skills
                          .programming_languages &&
                          candidate.skills.technical_skills
                            .programming_languages.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {candidate.skills.technical_skills.programming_languages.map(
                                (
                                  skill,
                                  skillIndex // Show limited skills
                                ) => (
                                  <span
                                    key={skillIndex}
                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700"
                                  >
                                    {skill}
                                  </span>
                                )
                              )}
                              {candidate.skills.length > 5 && (
                                <span className="text-xs text-gray-500 self-center">
                                  +{candidate.skills.length - 5} more
                                </span>
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto sm:ml-4">
                      <Button
                        onClick={() => handleShortlistClick(candidate._id)}
                        className={`w-full sm:w-auto px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                          shortlisted.has(candidate.id || candidate._id)
                            ? "bg-purple-100 text-purple-700 border border-purple-300"
                            : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                        }`}
                      >
                        <Star
                          size={14}
                          className={
                            shortlisted.has(candidate.id || candidate._id)
                              ? "fill-purple-500"
                              : ""
                          }
                        />
                        {shortlisted.has(candidate.id || candidate._id)
                          ? "Shortlisted"
                          : "Shortlist"}
                      </Button>
                      <button
                        onClick={() => setIsChatHistoryOpen(true)} // Simplified: opens main chat history
                        className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
                      >
                        <MessageCircle size={14} />
                        Chats
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button - only if there are results and potentially more to load */}
        {!loading && candidates.length > 0 && (
          <div className="mt-8 text-center">
            <button className="px-5 py-2.5 text-sm font-medium text-purple-600 bg-white border border-purple-300 rounded-md hover:bg-purple-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50">
              Load More Results
            </button>
          </div>
        )}

        {showJobDetailsPopup && selectedCandidate && (
          <JobDetailsPopup
            isOpen={showJobDetailsPopup}
            onClose={() => {
              setShowJobDetailsPopup(false);
              setSelectedCandidate(null);
            }}
            onSave={handleSaveJobDetails}
            candidateName={selectedCandidate.candidate_name}
          />
        )}
      </div>
      {/* Chat History Panel */}
      <ChatHistoryPanel
        isOpen={isChatHistoryOpen}
        onClose={() => setIsChatHistoryOpen(false)}
        chatHistory={allChatHistory}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onNewChat={handleNewChat}
        title="Search History"
        isLoading={allChatHistory.length === 0} // Show loading in panel only if history is empty and page is loading
      />
      {/* Floating button to open chat history */}
      {!isChatHistoryOpen && (
        <button
          onClick={() => setIsChatHistoryOpen(true)}
          className="fixed bottom-6 right-6 bg-purple-600 p-3 text-white rounded-full shadow-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 z-20 transition-transform hover:scale-110"
          aria-label="Open chat history"
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default CandidateSearchResults;
