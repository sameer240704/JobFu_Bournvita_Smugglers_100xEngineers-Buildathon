"use client";
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Star,
  MessageCircle,
  // ExternalLink, // Not used in the provided snippet
  Github,
  Linkedin,
  Twitter,
  Globe,
  // Mail, // Not used
  // Phone, // Not used
  ChevronLeft,
  User,
  Briefcase,
  GraduationCap,
  Clock,
  // Filter, // Not used
  // ArrowUpDown, // Not used
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation"; // useRouter is not needed if only reading params
import Link from "next/link";
import ChatHistoryPanel from "@/components/misc/ChatHistoryPanel";

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
  const [loading, setLoading] = useState(true);
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  // const [selectedCandidate, setSelectedCandidate] = useState(null); // Not used in current logic
  const [sortBy, setSortBy] = useState("relevance");
  const [shortlisted, setShortlisted] = useState(new Set());

  const searchParams = useSearchParams(); // Correct hook for accessing URL search parameters

  // State for storing parsed URL parameters
  const [searchQueryFromUrl, setSearchQueryFromUrl] = useState("");
  const [appliedFiltersFromUrl, setAppliedFiltersFromUrl] =
    useState(initialFiltersState);
  const router = useRouter();

  // Define the localStorage key
  const LOCAL_STORAGE_CHAT_KEY = "peopleGptChatHistory"; // Use a distinct key if needed

  // Mock search results (as in your original code)
  const mockCandidates = [
    {
      id: 1,
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
      twitter: null,
      website: "https://mohitagarwal.dev",
      email: "mohit@example.com",
      phone: "+91 98765 43210",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 4.8,
      availability: "Available in 2 weeks",
    },
    {
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
      website: null,
      email: "chandan@example.com",
      phone: "+91 98765 43211",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 4.9,
      availability: "Immediately available",
    },
    {
      id: 3,
      name: "Dharamdeo Choudhary",
      title: "Senior Software Engineer at Netsmartz",
      location: "Chandigarh, Chandigarh, India",
      education: "Masters Sikkim Manipal University - Distance Education",
      experience:
        "over 10 years of industry experience in Full Stack Development",
      description:
        "Dharamdeo Choudhary has over 10 years of industry experience in Full Stack Development and is an expert in node.js, with a strong background in Angular and React. He has consistently taken on multiple projects from beginning to completion and has a proven track record of working under pressure deadlines.",
      skills: ["Node.js", "Angular", "React", "Full Stack", "JavaScript"],
      linkedin: "https://linkedin.com/in/dharamdeochoudhary",
      github: "https://github.com/dharamdeo",
      twitter: null,
      website: "https://dharamdeo.dev",
      email: "dharamdeo@example.com",
      phone: "+91 98765 43212",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      rating: 4.7,
      availability: "Available in 1 month",
    },
    {
      id: 4,
      name: "Husain Bharaj",
      title: "Senior Software Engineer at Synechron",
      location: "Lucknow, Uttar Pradesh, India",
      education: "Masters Indira Gandhi National Open University",
      experience: "over 10 years of experience in Software Development",
      description:
        "Husain Bharaj has over 10 years of experience in Software Development with a strong focus on Node.js technology in the finance and banking domain. He has worked on Microservice architecture, Rest API, and Node.js in various IT and telecommunications projects.",
      skills: ["Node.js", "Microservices", "REST API", "Finance", "Banking"],
      linkedin: "https://linkedin.com/in/husainbharaj",
      github: "https://github.com/husainbharaj",
      twitter: "https://twitter.com/husainbharaj",
      website: null,
      email: "husain@example.com",
      phone: "+91 98765 43213",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      rating: 4.6,
      availability: "Available in 3 weeks",
    },
    {
      id: 5,
      name: "Kiran Sarella",
      title: "Senior Software Engineer at Tech Mahindra",
      location: "Hyderabad, Telangana, India",
      education:
        "Bachelor of Technology, Computer Science at Gudlavalleru Engineering College, Seshadri Rao Gudlavalleru",
      experience: "over 12 years of experience",
      description:
        "Kiran Sarella has worked on various technologies in Node.js, MongoDB, Swagger, React.js for more than 12 years and has expertise in developing Microservices, REST APIs using Node.js along with strong skills in Docker and MongoDB.",
      skills: ["Node.js", "MongoDB", "React.js", "Microservices", "Docker"],
      linkedin: "https://linkedin.com/in/kiransarella",
      github: "https://github.com/kiransarella",
      twitter: null,
      website: "https://kiransarella.tech",
      email: "kiran@example.com",
      phone: "+91 98765 43214",
      avatar:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
      rating: 4.8,
      availability: "Available immediately",
    },
  ];

  useEffect(() => {
    // Parse URL parameters
    const queryFromUrl = searchParams.get("q");
    const filtersStringFromUrl = searchParams.get("filters");

    if (queryFromUrl) {
      setSearchQueryFromUrl(queryFromUrl);
    }

    if (filtersStringFromUrl) {
      try {
        const parsedFilters = JSON.parse(filtersStringFromUrl);
        // Ensure all keys from initialFiltersState are present, defaulting if necessary
        const completeFilters = {
          ...initialFiltersState,
          ...parsedFilters,
          location: parsedFilters.location || [], // Ensure array type
          skills: parsedFilters.skills || [], // Ensure array type
        };
        setAppliedFiltersFromUrl(completeFilters);
        console.log("Parsed filters from URL:", completeFilters);
      } catch (error) {
        console.error("Error parsing filters from URL:", error);
        setAppliedFiltersFromUrl(initialFiltersState); // Fallback to default
      }
    } else {
      setAppliedFiltersFromUrl(initialFiltersState); // Fallback if no filters in URL
    }

    // Simulate API call for candidates
    setLoading(true);
    setTimeout(() => {
      // In a real app, you would use searchQueryFromUrl and appliedFiltersFromUrl
      // to fetch/filter candidates from your backend.
      // For now, we just log them and use mock data.
      console.log(
        "Simulating API call with query:",
        queryFromUrl,
        "and filters:",
        appliedFiltersFromUrl
      );
      setCandidates(mockCandidates);
      setLoading(false);
    }, 1500);

    loadChatHistory();
  }, [searchParams]); // Re-run if searchParams change

  const loadChatHistory = () => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_CHAT_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Ensure chatHistory is always an array
        setChatHistory(Array.isArray(parsedData.chats) ? parsedData.chats : []);
        if (parsedData.lastSearch) {
          setSearchQueryFromUrl(parsedData.lastSearch.query);
          setAppliedFiltersFromUrl(parsedData.lastSearch.filters);
          setCandidates(parsedData.lastSearch.results);
        }
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      setChatHistory([]); // Ensure chatHistory is reset to an empty array on error
    }
  };

  // Function to save both chat history and search results
  const saveToLocalStorage = (chats, searchData = null) => {
    try {
      // Ensure chats is an array
      const chatArray = Array.isArray(chats) ? chats : [];

      // Create new chat entry if searchData is provided
      if (searchData) {
        const newChat = {
          id: Date.now(),
          title: generateSearchSummary(),
          type: "search",
          timestamp: new Date().toLocaleString(),
          lastMessage: `Found ${candidates.length} candidates`,
          searchData: {
            query: searchQueryFromUrl,
            filters: appliedFiltersFromUrl,
            results: candidates,
          },
        };
        chatArray.unshift(newChat);
      }

      localStorage.setItem(LOCAL_STORAGE_CHAT_KEY, JSON.stringify(chatArray));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  // Function to save new search to chat history
  // Modify the saveSearchToHistory function to check for duplicates
  const saveSearchToHistory = () => {
    const searchSummary = generateSearchSummary();
    const timestamp = new Date().toLocaleString();

    // Check if a similar search already exists
    const isDuplicate = chatHistory.some(
      (chat) =>
        chat.searchData.query === searchQueryFromUrl &&
        JSON.stringify(chat.searchData.filters) ===
          JSON.stringify(appliedFiltersFromUrl)
    );

    // Only save if not a duplicate
    if (!isDuplicate) {
      const newChat = {
        id: Date.now(),
        title: searchSummary,
        type: "search",
        timestamp: timestamp,
        lastMessage: `Found ${candidates.length} candidates`,
        searchData: {
          query: searchQueryFromUrl,
          filters: appliedFiltersFromUrl,
          results: candidates,
        },
      };

      const updatedHistory = [newChat, ...chatHistory];
      setChatHistory(updatedHistory);
      saveToLocalStorage(updatedHistory);
    }
  };

  // Save search results when candidates are loaded
  useEffect(() => {
    if (!loading && candidates.length > 0) {
      saveSearchToHistory();
    }
  }, [loading, candidates]);

  // Enhanced handleDeleteChat to update localStorage
  const handleDeleteChat = (chatIdToDelete, event) => {
    event.stopPropagation();
    const updatedHistory = chatHistory.filter(
      (chat) => chat.id !== chatIdToDelete
    );
    setChatHistory(updatedHistory);
    saveToLocalStorage(updatedHistory);
  };

  // Enhanced handleChatClick to restore search state
  const handleChatClick = (chat) => {
    if (chat.type === "search" && chat.searchData) {
      setSearchQueryFromUrl(chat.searchData.query);
      setAppliedFiltersFromUrl(chat.searchData.filters);
      setCandidates(chat.searchData.results);
      saveToLocalStorage(chatHistory, chat.searchData);
    }
    setIsChatHistoryOpen(false);
  };

  const handleSelectChat = (chatId) => {
    const selectedChat = chatHistory.find((chat) => chat.id === chatId);
    if (selectedChat?.type === "search" && selectedChat.searchData) {
      setSearchQueryFromUrl(selectedChat.searchData.query);
      setAppliedFiltersFromUrl(selectedChat.searchData.filters);
      setCandidates(selectedChat.searchData.results);
      saveToLocalStorage(chatHistory, selectedChat.searchData);
    }
    setIsChatHistoryOpen(false);
  };

  const handleNewChat = () => {
    router.push("/chat-history");
  };

  const toggleShortlist = (candidateId) => {
    // ... (your existing toggleShortlist logic)
  };

  const SocialLink = ({ href, icon: Icon, label, className = "" }) => {
    // ... (your existing SocialLink component)
  };

  // Helper function to generate the summary text for the header
  const generateSearchSummary = () => {
    let summaryParts = [];
    if (searchQueryFromUrl) {
      summaryParts.push(`"${searchQueryFromUrl}"`);
    }
    if (appliedFiltersFromUrl.jobTitle) {
      summaryParts.push(`as ${appliedFiltersFromUrl.jobTitle}`);
    }
    if (
      appliedFiltersFromUrl.location &&
      appliedFiltersFromUrl.location.length > 0
    ) {
      summaryParts.push(`in ${appliedFiltersFromUrl.location.join(", ")}`);
    }
    if (appliedFiltersFromUrl.industry) {
      summaryParts.push(`in the ${appliedFiltersFromUrl.industry} industry`);
    }
    if (
      appliedFiltersFromUrl.minExperience ||
      appliedFiltersFromUrl.maxExperience
    ) {
      let expText = "with ";
      if (
        appliedFiltersFromUrl.minExperience &&
        appliedFiltersFromUrl.maxExperience
      ) {
        expText += `${appliedFiltersFromUrl.minExperience}-${appliedFiltersFromUrl.maxExperience} years of experience`;
      } else if (appliedFiltersFromUrl.minExperience) {
        expText += `at least ${appliedFiltersFromUrl.minExperience} years of experience`;
      } else if (appliedFiltersFromUrl.maxExperience) {
        expText += `up to ${appliedFiltersFromUrl.maxExperience} years of experience`;
      }
      summaryParts.push(expText);
    }
    if (
      appliedFiltersFromUrl.skills &&
      appliedFiltersFromUrl.skills.length > 0
    ) {
      summaryParts.push(
        `skilled in ${appliedFiltersFromUrl.skills.join(", ")}`
      );
    }

    if (summaryParts.length === 0) {
      return "Showing all profiles.";
    }
    return `Searching for: ${summaryParts.join(" ")}.`;
  };

  // Helper to generate filter pills for display
  const getDisplayableFilters = () => {
    const pills = [];
    let otherFiltersCount = 0;

    if (appliedFiltersFromUrl.jobTitle) {
      pills.push({
        type: "Job Title",
        value: appliedFiltersFromUrl.jobTitle,
        icon: Briefcase,
      });
    }
    if (
      appliedFiltersFromUrl.location &&
      appliedFiltersFromUrl.location.length > 0
    ) {
      // For simplicity, just show the first location or a count
      if (appliedFiltersFromUrl.location.length === 1) {
        pills.push({
          type: "Location",
          value: appliedFiltersFromUrl.location[0],
          icon: MapPin,
        });
      } else {
        pills.push({
          type: "Location",
          value: `${appliedFiltersFromUrl.location.length} locations`,
          icon: MapPin,
        });
      }
    }
    if (appliedFiltersFromUrl.industry) {
      pills.push({
        type: "Industry",
        value: appliedFiltersFromUrl.industry,
        icon: Briefcase,
      }); // Re-using briefcase, or add specific
    }
    if (
      appliedFiltersFromUrl.minExperience ||
      appliedFiltersFromUrl.maxExperience
    ) {
      let expLabel = "";
      if (
        appliedFiltersFromUrl.minExperience &&
        appliedFiltersFromUrl.maxExperience
      ) {
        expLabel = `${appliedFiltersFromUrl.minExperience}-${appliedFiltersFromUrl.maxExperience} yrs exp`;
      } else if (appliedFiltersFromUrl.minExperience) {
        expLabel = `${appliedFiltersFromUrl.minExperience}+ yrs exp`;
      } else {
        expLabel = `Up to ${appliedFiltersFromUrl.maxExperience} yrs exp`;
      }
      pills.push({ type: "Experience", value: expLabel, icon: Clock });
    }
    if (
      appliedFiltersFromUrl.skills &&
      appliedFiltersFromUrl.skills.length > 0
    ) {
      // Show first few skills or count
      if (appliedFiltersFromUrl.skills.length <= 2) {
        appliedFiltersFromUrl.skills.forEach((skill) =>
          pills.push({ type: "Skill", value: skill, icon: Star })
        );
      } else {
        pills.push({
          type: "Skills",
          value: `${appliedFiltersFromUrl.skills.length} skills`,
          icon: Star,
        });
      }
    }

    // This is a simplified count. You might want more sophisticated logic
    // to decide what counts as an "other" filter.
    const allFilterValues = Object.values(appliedFiltersFromUrl).flat();
    const activeFilterKeysCount = Object.keys(appliedFiltersFromUrl).filter(
      (key) => {
        const value = appliedFiltersFromUrl[key];
        if (Array.isArray(value)) return value.length > 0;
        return !!value;
      }
    ).length;

    // If more filters were applied than pills shown, calculate 'otherFiltersCount'
    // This is a placeholder, as direct pill generation is complex
    // For now, let's just count how many *types* of filters are active
    const displayedPillTypes = new Set(pills.map((p) => p.type));
    let potentialOtherFilters = 0;
    if (appliedFiltersFromUrl.jobTitle && !displayedPillTypes.has("Job Title"))
      potentialOtherFilters++;
    if (
      appliedFiltersFromUrl.location?.length > 0 &&
      !displayedPillTypes.has("Location")
    )
      potentialOtherFilters++;
    // ... and so on for other filter types.
    // For simplicity now, we'll rely on the text summary more.
    // The "+X more filters" is hard to implement perfectly without knowing exact display rules.

    return {
      pills,
      otherFiltersCount: Math.max(0, activeFilterKeysCount - pills.length),
    };
  };

  const { pills: displayPills, otherFiltersCount } = getDisplayableFilters();

  if (loading) {
    // ... (your existing loading state)
  }

  const [editableFilters, setEditableFilters] = useState(initialFiltersState);

  // Add effect to load filters from localStorage
  useEffect(() => {
    const savedFilters = localStorage.getItem("peopleGptFilters");
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        setEditableFilters(parsedFilters);
      } catch (error) {
        console.error("Error loading filters from localStorage:", error);
        setEditableFilters(initialFiltersState);
      }
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem("peopleGptFilters", JSON.stringify(editableFilters));
  }, [editableFilters]);

  return (
    <div className="min-h-screen overflow-scroll">
      {/* Header */}
      <div className="bg-white/70 sticky top-0 z-10">
        <div className="max-w-9xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ChevronLeft size={20} />
                <span>Back to Search</span>
              </button>
              <div className="h-6 border-l border-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">
                All Profiles ({candidates.length}k)
              </h1>
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
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
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
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
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min Exp"
                  value={editableFilters.minExperience}
                  onChange={(e) =>
                    setEditableFilters((prev) => ({
                      ...prev,
                      minExperience: e.target.value,
                    }))
                  }
                  className="w-24 text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max Exp"
                  value={editableFilters.maxExperience}
                  onChange={(e) =>
                    setEditableFilters((prev) => ({
                      ...prev,
                      maxExperience: e.target.value,
                    }))
                  }
                  className="w-24 text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => {
                  // Apply filters to URL and trigger search
                  const newParams = new URLSearchParams(
                    searchParams.toString()
                  );
                  newParams.set("filters", JSON.stringify(editableFilters));
                  router.push(`?${newParams.toString()}`);
                }}
                className="px-4 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
              >
                Apply Filters
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                1 - 15 of {candidates.length}k
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="experience">Sort by Experience</option>
                <option value="rating">Sort by Rating</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Search Query Display */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-800 font-medium">
                {generateSearchSummary()}
              </p>
              {(searchQueryFromUrl || displayPills.length > 0) && (
                <div className="flex items-center flex-wrap gap-2 mt-2">
                  {searchQueryFromUrl && (
                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                      Query: "{searchQueryFromUrl}"
                    </span>
                  )}
                  {displayPills.map((pill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                    >
                      {pill.icon && <pill.icon size={12} />}
                      {pill.value}
                    </span>
                  ))}
                  {otherFiltersCount > 0 && (
                    <span className="text-blue-600 text-xs">
                      (+{otherFiltersCount} more filters)
                    </span>
                  )}
                  <button
                    onClick={() => window.history.back()} // Or navigate to your search page
                    className="text-blue-600 text-xs hover:underline ml-2"
                  >
                    Edit Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {candidates.map((candidate, index) => (
            // ... (your existing candidate card mapping) ...
            <div
              key={candidate.id}
              className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <img
                        src={candidate.avatar}
                        alt={candidate.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      {/* Name and Social Links */}
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {candidate.name}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <SocialLink
                            href={candidate.linkedin}
                            icon={Linkedin}
                            label="LinkedIn"
                          />
                          <SocialLink
                            href={candidate.github}
                            icon={Github}
                            label="GitHub"
                          />
                          <SocialLink
                            href={candidate.twitter}
                            icon={Twitter}
                            label="Twitter"
                          />
                          <SocialLink
                            href={candidate.website}
                            icon={Globe}
                            label="Website"
                          />
                        </div>
                      </div>

                      {/* Job Title and Company */}
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase
                          size={16}
                          className="text-gray-500 flex-shrink-0"
                        />
                        <p className="text-gray-700 font-medium">
                          {candidate.title}
                        </p>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin
                          size={16}
                          className="text-gray-500 flex-shrink-0"
                        />
                        <p className="text-gray-600 text-sm">
                          {candidate.location}
                        </p>
                      </div>

                      {/* Education */}
                      <div className="flex items-start gap-2 mb-3">
                        <GraduationCap
                          size={16}
                          className="text-gray-500 flex-shrink-0 mt-0.5"
                        />
                        <p className="text-gray-600 text-sm">
                          {candidate.education}
                        </p>
                      </div>

                      {/* Description */}
                      <div className="flex items-start gap-2 mb-4">
                        <Star
                          size={16}
                          className="text-purple-500 flex-shrink-0 mt-0.5"
                        />
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {candidate.description}
                        </p>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {candidate.skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Additional Info */}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{candidate.availability}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star
                            size={14}
                            className="fill-yellow-400 text-yellow-400"
                          />
                          <span>{candidate.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => toggleShortlist(candidate.id)}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        shortlisted.has(candidate.id)
                          ? "bg-purple-100 text-purple-700 border border-purple-200"
                          : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {shortlisted.has(candidate.id)
                        ? "✓ Shortlisted"
                        : "Shortlist"}
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 transition-colors">
                      Summarize
                    </button>
                    <button
                      onClick={() => handleChat(candidate)}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
                    >
                      <MessageCircle size={16} />
                      View Chats
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <button className="px-6 py-3 text-sm font-medium text-purple-600 bg-white border border-purple-200 rounded-md hover:bg-purple-50 transition-colors">
            Load More Results
          </button>
        </div>
      </div>

      {/* Chat History Panel */}
      <ChatHistoryPanel
        isOpen={isChatHistoryOpen}
        onClose={() => setIsChatHistoryOpen(!isChatHistoryOpen)}
        chatHistory={chatHistory}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onNewChat={handleNewChat}
        title="All Chats"
      />
    </div>
  );
};

export default CandidateSearchResults;
