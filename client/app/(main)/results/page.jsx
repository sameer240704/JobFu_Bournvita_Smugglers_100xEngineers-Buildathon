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
import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link"; // Not used in the provided snippet
import ChatHistoryPanel from "@/components/misc/ChatHistoryPanel"; // Assuming this path is correct
import Link from "next/link";

const initialFiltersState = {
  location: [],
  jobTitle: "",
  minExperience: "",
  maxExperience: "",
  industry: "",
  skills: [],
};

const CandidateSearchResults = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true); // Initial loading for page
  const [chatHistoryLoading, setChatHistoryLoading] = useState(true); // Loading for chat history
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [shortlisted, setShortlisted] = useState(new Set());

  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchQueryFromUrl, setSearchQueryFromUrl] = useState("");
  const [appliedFiltersFromUrl, setAppliedFiltersFromUrl] =
    useState(initialFiltersState);
  const [editableFilters, setEditableFilters] = useState(initialFiltersState);

  // Mock search results (as in your original code) - this would eventually be from an API
  const mockCandidates = [
    {
      _id: "mockcandidate1", // Using _id to simulate DB ID
      id: 1, // Keeping original id for some internal logic if needed
      name: "Mohit Agarwal",
      title: "Software Development Engineer 3 at Amazon",
      location: "Pune, Maharashtra, India",
      education:
        "Bachelor of Technology, Computer Science at Orissa Engineering College, Bhubaneswar",
      experience: "over 5 years of experience in the IT industry",
      description:
        "Mohit Agarwal has over 5 years of experience in the IT industry and has worked extensively with NodeJS, Express, and JavaScript technologies.",
      skills: ["NodeJS", "Express", "JavaScript", "React", "AWS"],
      linkedin: "https://linkedin.com/in/mohitagarwal",
      github: "https://github.com/mohitagarwal",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 4.8,
      availability: "Available in 2 weeks",
    },
    // ... other mock candidates, ensure they have _id
    {
      _id: "mockcandidate2",
      id: 2,
      name: "Chandan Mistry",
      title: "Senior Software Engineer at Digital Aptech PVT. LTD.",
      location: "Kolkata, West Bengal, India",
      education: "Masters, Computer Application at University of Technology",
      experience: "Senior Software Engineer with over 5 years of experience",
      description:
        "Chandan Mistry is a Senior Software Engineer with over 5 years of experience in IT, proficient in Node.js (Express.js) and has been developing full-stack applications using technologies like Angular, Vue.js, and Laravel.",
      skills: ["Node.js", "Express.js", "Angular", "Vue.js", "Laravel"],
      linkedin: "https://linkedin.com/in/chandanmistry",
      github: "https://github.com/chandanmistry",
      twitter: "https://twitter.com/chandanmistry",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 4.9,
      availability: "Immediately available",
    },
  ];

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
  const fetchChatHistory = useCallback(async () => {
    setChatHistoryLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/chats`
      ); // Adjust API path if needed
      if (!response.ok) {
        throw new Error(`Error fetching chat history: ${response.statusText}`);
      }
      const dbChats = await response.json();
      // Map DB chat items to the structure expected by ChatHistoryPanel
      console.log(dbChats.length);
      if (!dbChats.length) return;
      const formattedChats = dbChats.map((chat) => ({
        id: chat._id, // Use MongoDB _id
        title: generateSearchSummaryText(chat.query, chat.filters),
        type: "search",
        timestamp: new Date(chat.createdAt).toLocaleString(),
        lastMessage: `Found ${chat.response?.length || 0} candidates`, // Or a more generic message
        searchData: {
          // Store the raw query and filters for restoration
          query: chat.query,
          filters: chat.filters,
          // candidateIds: chat.response?.map(r => r.candidate) || [] // Store candidate IDs if needed
        },
      }));
      setChatHistory(formattedChats);
    } catch (error) {
      console.error("Failed to load chat history:", error);
      setChatHistory([]); // Ensure it's an array on error
    } finally {
      setChatHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChatHistory();
  }, [fetchChatHistory]);

  // --- Parse URL parameters and fetch initial candidates ---
  useEffect(() => {
    const queryFromUrlParam = searchParams.get("q");
    const filtersStringFromUrl = searchParams.get("filters");

    let currentQuery = "";
    let currentFilters = initialFiltersState;

    if (queryFromUrlParam) {
      currentQuery = queryFromUrlParam;
      setSearchQueryFromUrl(queryFromUrlParam);
    }
    if (filtersStringFromUrl) {
      try {
        const parsedFilters = JSON.parse(filtersStringFromUrl);
        currentFilters = {
          ...initialFiltersState,
          ...parsedFilters,
          location: parsedFilters.location || [],
          skills: parsedFilters.skills || [],
        };
        setAppliedFiltersFromUrl(currentFilters);
        setEditableFilters(currentFilters); // Sync editable filters
      } catch (error) {
        console.error("Error parsing filters from URL:", error);
        setAppliedFiltersFromUrl(initialFiltersState);
        setEditableFilters(initialFiltersState);
      }
    } else {
      setAppliedFiltersFromUrl(initialFiltersState);
      setEditableFilters(initialFiltersState);
    }

    // Simulate API call for candidates based on URL params
    setLoading(true);
    console.log(
      "Simulating API call with query:",
      currentQuery,
      "and filters:",
      currentFilters
    );
    // TODO: Replace with actual API call to fetch candidates
    // For now, we use mockCandidates. In a real app, filter mockCandidates or fetch.
    setTimeout(() => {
      setCandidates(mockCandidates);
      setLoading(false);
    }, 1500);
  }, [searchParams]);

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
      // The useEffect listening to searchParams will then update states and "re-fetch" candidates

      // setSearchQueryFromUrl(selectedChat.searchData.query);
      // setAppliedFiltersFromUrl(selectedChat.searchData.filters);
      // setEditableFilters(selectedChat.searchData.filters); // Also update editable filters

      // // Simulate re-fetching candidates based on restored search
      // setLoading(true);
      // // TODO: In a real app, you'd fetch candidates based on these restored params
      // // For now, just use mock data or filter mock data if possible
      // setTimeout(() => {
      //   setCandidates(mockCandidates); // Or filter mockCandidates
      //   setLoading(false);
      // }, 500);
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

  const toggleShortlist = (candidateId) => {
    setShortlisted((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(candidateId)) newSet.delete(candidateId);
      else newSet.add(candidateId);
      return newSet;
    });
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

  if (loading && candidates.length === 0) {
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
    <div className="min-h-screen bg-gray-50">
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
                Profiles ({loading ? "..." : candidates.length})
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
              <button
                onClick={() => {
                  const newParams = new URLSearchParams(
                    searchParams.toString()
                  );
                  newParams.set("filters", JSON.stringify(editableFilters));
                  if (searchQueryFromUrl)
                    newParams.set("q", searchQueryFromUrl);
                  else newParams.delete("q");
                  router.push(`?${newParams.toString()}`);
                }}
                className="px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-xs sm:text-sm"
              >
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
                        <img
                          src={
                            candidate.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              candidate.name
                            )}&background=random`
                          }
                          alt={candidate.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-200"
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
                              {candidate.name}
                            </Link>
                          </h3>
                          <div className="flex items-center gap-2 mt-1 sm:mt-0">
                            {candidate.linkedin && (
                              <SocialLink
                                href={candidate.linkedin}
                                icon={Linkedin}
                                label="LinkedIn"
                              />
                            )}
                            {candidate.github && (
                              <SocialLink
                                href={candidate.github}
                                icon={Github}
                                label="GitHub"
                              />
                            )}
                            {candidate.twitter && (
                              <SocialLink
                                href={candidate.twitter}
                                icon={Twitter}
                                label="Twitter"
                              />
                            )}
                            {candidate.website && (
                              <SocialLink
                                href={candidate.website}
                                icon={Globe}
                                label="Website"
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-1.5 text-sm text-gray-600">
                          <Briefcase size={15} className="flex-shrink-0" />
                          <p className="font-medium">{candidate.title}</p>
                        </div>
                        <div className="flex items-center gap-2 mb-1.5 text-xs sm:text-sm text-gray-500">
                          <MapPin size={15} className="flex-shrink-0" />
                          <p>{candidate.location}</p>
                        </div>
                        {candidate.education && (
                          <div className="flex items-start gap-2 mb-2 text-xs sm:text-sm text-gray-500">
                            <GraduationCap
                              size={15}
                              className="flex-shrink-0 mt-0.5"
                            />
                            <p className="line-clamp-2">
                              {candidate.education}
                            </p>
                          </div>
                        )}
                        {candidate.description && (
                          <div className="flex items-start gap-2 mb-3 text-xs sm:text-sm text-gray-600">
                            <Star
                              size={15}
                              className="text-purple-500 flex-shrink-0 mt-0.5"
                            />
                            <p className="leading-relaxed line-clamp-2 sm:line-clamp-3">
                              {candidate.description}
                            </p>
                          </div>
                        )}
                        {candidate.skills && candidate.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {candidate.skills.slice(0, 5).map(
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
                        <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500">
                          {candidate.availability && (
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              <span>{candidate.availability}</span>
                            </div>
                          )}
                          {candidate.rating && (
                            <div className="flex items-center gap-1">
                              <Star
                                size={14}
                                className="fill-yellow-400 text-yellow-400"
                              />
                              <span>{candidate.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto sm:ml-4">
                      <button
                        onClick={() =>
                          toggleShortlist(candidate.id || candidate._id)
                        }
                        className={`w-full sm:w-auto px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 ${
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
                      </button>
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
      </div>
      {/* Chat History Panel */}
      <ChatHistoryPanel
        isOpen={isChatHistoryOpen}
        onClose={() => setIsChatHistoryOpen(false)} // Corrected onClose
        chatHistory={chatHistory}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onNewChat={handleNewChat} // This now clears search and navigates to base page
        title={chatHistoryLoading ? "Loading Chats..." : "Search History"}
        isLoading={chatHistoryLoading}
      />
    </div>
  );
};

export default CandidateSearchResults;
