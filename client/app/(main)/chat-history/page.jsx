  "use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ChatHistoryPanel from "@/components/misc/ChatHistoryPanel";

// --- ICONS (DropdownIcon, CloseIcon, ChatIcon, ChevronLeftIcon, TrashIcon) ---
const DropdownIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);
const CloseIcon = () => (
  <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const LOCAL_STORAGE_CHAT_KEY = "peopleGptChatHistory";

// --- MAIN PAGE COMPONENT ---
const Page = () => {
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [currentMultiInputValue, setCurrentMultiInputValue] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const initialFilters = {
    location: [],
    jobTitle: "",
    minExperience: "",
    maxExperience: "",
    industry: "",
    skills: [],
  };
  const [filters, setFilters] = useState(initialFilters);
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  // Load chats from localStorage on component mount
  useEffect(() => {
    const storedChats = localStorage.getItem(LOCAL_STORAGE_CHAT_KEY);
    if (storedChats) {
      try {
        const parsedData = JSON.parse(storedChats);
        // Handle both array and object formats
        if (Array.isArray(parsedData)) {
          setChatHistory(parsedData);
        } else if (Array.isArray(parsedData.chats)) {
          setChatHistory(parsedData.chats);
        } else {
          setChatHistory([]);
        }
      } catch (error) {
        console.error("Error parsing chat history from localStorage:", error);
        setChatHistory([]);
      }
    }
  }, []);

  // Update the localStorage save effect
  useEffect(() => {
    if (typeof window !== "undefined" && chatHistory.length > 0) {
      try {
        localStorage.setItem(
          LOCAL_STORAGE_CHAT_KEY,
          JSON.stringify(chatHistory)
        );
      } catch (error) {
        console.error("Error saving chat history to localStorage:", error);
      }
    }
  }, [chatHistory]);

  const dropdownRefs = {
    location: useRef(null),
    jobTitle: useRef(null),
    experience: useRef(null),
    industry: useRef(null),
    skills: useRef(null),
  };

  const filterOptions = [
    { id: "location", label: "Location", type: "multi" },
    { id: "jobTitle", label: "Job Title", type: "single" },
    { id: "experience", label: "Years of Experience", type: "range" },
    { id: "industry", label: "Industry", type: "single" },
    { id: "skills", label: "Skills", type: "multi" },
  ];

  const handleInputChange = (filterName, value) =>
    setFilters((prev) => ({ ...prev, [filterName]: value }));

  const handleMultiInputCurrentChange = (filterId, value) =>
    setCurrentMultiInputValue((prev) => ({ ...prev, [filterId]: value }));

  const addMultiValueItem = (filterId) => {
    const valueToAdd = currentMultiInputValue[filterId]?.trim();
    if (valueToAdd && !filters[filterId].includes(valueToAdd)) {
      setFilters((prev) => ({
        ...prev,
        [filterId]: [...prev[filterId], valueToAdd],
      }));
    }
    setCurrentMultiInputValue((prev) => ({ ...prev, [filterId]: "" }));
  };

  const removeMultiValueItem = (filterId, itemToRemove) =>
    setFilters((prev) => ({
      ...prev,
      [filterId]: prev[filterId].filter((item) => item !== itemToRemove),
    }));

  const removeActiveFilterItem = (filterId, itemValue = null) => {
    const option = filterOptions.find((opt) => opt.id === filterId);
    if (option) {
      if (option.type === "multi" && itemValue) {
        removeMultiValueItem(filterId, itemValue);
      } else if (option.id === "experience") {
        if (itemValue === `Min: ${filters.minExperience} yrs`)
          setFilters((prev) => ({ ...prev, minExperience: "" }));
        else if (itemValue === `Max: ${filters.maxExperience} yrs`)
          setFilters((prev) => ({ ...prev, maxExperience: "" }));
      } else {
        setFilters((prev) => ({ ...prev, [filterId]: "" }));
      }
    }
  };

  const toggleDropdown = (dropdownName) =>
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);

  const hasActiveFilters = () => {
    return (
      filters.location.length > 0 ||
      filters.jobTitle !== "" ||
      filters.minExperience !== "" ||
      filters.maxExperience !== "" ||
      filters.industry !== "" ||
      filters.skills.length > 0
    );
  };

  // Handle search functionality
  const handleSearch = async () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery && !hasActiveFilters()) {
      alert("Please enter a search query or apply filters");
      return;
    }

    setIsSearching(true);

    try {
      // Prepare search payload
      const searchPayload = {
        query: trimmedQuery,
        filters: {
          location: filters.location,
          jobTitle: filters.jobTitle,
          minExperience: filters.minExperience,
          maxExperience: filters.maxExperience,
          industry: filters.industry,
          skills: filters.skills,
        },
      };

      console.log("Search payload:", searchPayload);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // --- Create a new chat entry for this search ---
      const activeFilterItems = getActiveFilterDisplayItems(); // Get this before router.push or state changes
      const currentFiltersForHistory = JSON.parse(JSON.stringify(filters)); // Deep clone current filters

      let chatTitle = trimmedQuery;
      let chatLastMessage = "";
      const hasFiltersApplied = activeFilterItems.length > 0;

      if (trimmedQuery && hasFiltersApplied) {
        chatTitle = trimmedQuery;
        chatLastMessage = `Query: ${trimmedQuery} | Filters: ${activeFilterItems
          .map((f) => f.displayValue)
          .join(", ")}`;
      } else if (trimmedQuery) {
        chatTitle = trimmedQuery;
        chatLastMessage = `Query: ${trimmedQuery}`;
      } else if (hasFiltersApplied) {
        chatTitle = "Filtered Search";
        chatLastMessage = `Filters: ${activeFilterItems
          .map((f) => f.displayValue)
          .join(", ")}`;
      }

      if (chatTitle) {
        // Ensure there's something to title the chat
        const newSearchChat = {
          id: Date.now(),
          title: chatTitle,
          lastMessage: chatLastMessage,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          searchParameters: {
            // Store the state that led to this search
            query: trimmedQuery,
            filters: currentFiltersForHistory,
          },
        };
        setChatHistory((prev) => [newSearchChat, ...prev]);
      }
      // --- End new chat entry ---

      // Navigate to results page with search params
      const searchParams = new URLSearchParams({
        q: trimmedQuery, // Use trimmedQuery here
        filters: JSON.stringify(searchPayload.filters),
      });

      router.push(`/results?${searchParams.toString()}`);
    } catch (error) {
      console.error("Search error:", error);
      alert("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown) {
        const currentDropdownRef = dropdownRefs[openDropdown];
        if (
          currentDropdownRef.current &&
          !currentDropdownRef.current.contains(event.target)
        ) {
          let clickedOnButton = false;
          document.querySelectorAll(".filter-button").forEach((button) => {
            if (button.contains(event.target)) clickedOnButton = true;
          });
          if (!clickedOnButton) setOpenDropdown(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  const applyFilter = (dropdownName) => {
    console.log(`Applying filter for ${dropdownName}:`, filters);
    setOpenDropdown(null);
  };

  const clearFilter = (dropdownName) => {
    const option = filterOptions.find((opt) => opt.id === dropdownName);
    if (option) {
      if (option.type === "multi") {
        setFilters((prev) => ({ ...prev, [dropdownName]: [] }));
      } else if (option.type === "range") {
        setFilters((prev) => ({
          ...prev,
          minExperience: "",
          maxExperience: "",
        }));
      } else {
        setFilters((prev) => ({ ...prev, [dropdownName]: "" }));
      }
    }
    console.log(`Cleared filter for ${dropdownName}`);
  };

  const isFilterActive = (filterId) => {
    const filterValue = filters[filterId];
    if (filterId === "experience") {
      return filters.minExperience !== "" || filters.maxExperience !== "";
    }
    if (Array.isArray(filterValue)) {
      return filterValue.length > 0;
    }
    return filterValue !== "";
  };

  const getActiveFilterDisplayItems = () => {
    const activeItems = [];
    filterOptions.forEach((option) => {
      if (option.type === "multi") {
        filters[option.id].forEach((item) => {
          activeItems.push({
            id: option.id,
            label: option.label,
            value: item,
            displayValue: item,
          });
        });
      } else if (option.type === "single" && filters[option.id]) {
        activeItems.push({
          id: option.id,
          label: option.label,
          value: filters[option.id],
          displayValue: `${option.label}: ${filters[option.id]}`,
        });
      } else if (option.type === "range" && option.id === "experience") {
        if (filters.minExperience) {
          activeItems.push({
            id: option.id,
            label: "Min Experience",
            value: `Min: ${filters.minExperience} yrs`,
            displayValue: `Min Exp: ${filters.minExperience} yrs`,
          });
        }
        if (filters.maxExperience) {
          activeItems.push({
            id: option.id,
            label: "Max Experience",
            value: `Max: ${filters.maxExperience} yrs`,
            displayValue: `Max Exp: ${filters.maxExperience} yrs`,
          });
        }
      }
    });
    return activeItems;
  };

  const activeFilterDisplayItems = getActiveFilterDisplayItems();

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: `New Chat ${chatHistory.length + 1}`,
      lastMessage: "Just started...",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      // Note: This generic chat does not have 'searchParameters' initially
      // or could be initialized with blank ones if desired for consistency.
    };
    setChatHistory((prev) => [newChat, ...prev]);
    // setSearchQuery(""); // Optionally clear search query for the new chat context
    // setFilters(initialFilters); // Optionally clear filters
    setIsChatHistoryOpen(true);
  };

  const handleDeleteChat = (chatIdToDelete, event) => {
    event.stopPropagation();
    if (window.confirm("Are you sure you want to delete this chat?")) {
      setChatHistory((prev) =>
        prev.filter((chat) => chat.id !== chatIdToDelete)
      );
    }
  };

  const handleSelectChat = (chatId) => {
    const selectedChat = chatHistory.find((chat) => chat.id === chatId);
    if (selectedChat) {
      console.log("Selected chat:", selectedChat.title);
      if (selectedChat.searchParameters) {
        setSearchQuery(selectedChat.searchParameters.query);
        // Ensure filters are fully replaced, not merged, and handle undefined gracefully
        const newFilters = {
          ...initialFilters,
          ...selectedChat.searchParameters.filters,
        };
        setFilters(newFilters);
        console.log("Loaded search parameters for:", selectedChat.title);
      } else {
        // For chats created by "+ New Chat" that haven't been searched with yet,
        // you might want to clear the search or leave as is.
        // setSearchQuery("");
        // setFilters(initialFilters);
        console.log(
          "Selected chat does not have specific search parameters (e.g., a generic 'New Chat')."
        );
      }
      // setIsChatHistoryOpen(false); // Optionally close panel after selection
    }
  };

  return (
    <div className="relative h-full">
      <div
        className={`transition-all duration-300 ${
          isChatHistoryOpen ? "md:mr-80" : "md:mr-0"
        }`}
      >
        <div className=" transition-all duration-300">
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
              {/* PeopleGPT Header */}
              <div className="mb-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="mb-2 flex items-center justify-center">
                    <svg
                      className="h-12 w-12 text-purple-600"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    HireGPT by JobFu
                  </h1>
                  <p className="mt-2 text-gray-600">
                    Find exactly who you're looking for, in seconds.{" "}
                    <a
                      href="/documentation"
                      className="text-purple-600 hover:underline"
                    >
                      See how it works.
                    </a>
                  </p>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="mx-auto max-w-3xl">
                <div className="relative mb-6">
                  <div className="flex items-center rounded-lg border border-gray-300 bg-white shadow-sm">
                    <input
                      type="text"
                      placeholder="Search by name, company, keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      className="flex-1 border-none px-4 py-3 text-lg outline-none rounded-l-lg"
                    />
                    <button
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="rounded-r-lg bg-purple-600 px-6 py-3 text-lg text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSearching ? "Searching..." : "Search"}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  {filterOptions.map((filter) => (
                    <div
                      key={filter.id}
                      className="relative filter-button-container"
                    >
                      <button
                        onClick={() => toggleDropdown(filter.id)}
                        className={`filter-button flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-300 ${
                          isFilterActive(filter.id)
                            ? "border-purple-500 bg-purple-50 text-purple-700"
                            : "border-gray-300 bg-white text-gray-700"
                        }`}
                      >
                        {isFilterActive(filter.id) && (
                          <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                        )}
                        <span>{filter.label}</span> <DropdownIcon />
                      </button>
                      {openDropdown === filter.id && (
                        <div
                          ref={dropdownRefs[filter.id]}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 origin-top-center rounded-md bg-white shadow-xl z-20 border border-gray-200"
                        >
                          <div className="p-4 space-y-3">
                            <h4 className="text-sm font-medium text-gray-600 border-b pb-2">
                              Filter by {filter.label}
                            </h4>
                            {filter.type === "single" && (
                              <input
                                type="text"
                                placeholder={`Enter ${filter.label.toLowerCase()}`}
                                value={filters[filter.id]}
                                onChange={(e) =>
                                  handleInputChange(filter.id, e.target.value)
                                }
                                className="w-full rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:ring-purple-500"
                              />
                            )}
                            {filter.type === "range" &&
                              filter.id === "experience" && (
                                <div className="space-y-2">
                                  <input
                                    type="number"
                                    placeholder="Min years"
                                    value={filters.minExperience}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "minExperience",
                                        e.target.value
                                      )
                                    }
                                    className="w-full rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                  />
                                  <input
                                    type="number"
                                    placeholder="Max years"
                                    value={filters.maxExperience}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "maxExperience",
                                        e.target.value
                                      )
                                    }
                                    className="w-full rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                  />
                                </div>
                              )}
                            {filter.type === "multi" && (
                              <div>
                                <div className="flex gap-2 mb-2">
                                  <input
                                    type="text"
                                    placeholder={`Add ${filter.label
                                      .slice(0, -1)
                                      .toLowerCase()}`}
                                    value={
                                      currentMultiInputValue[filter.id] || ""
                                    }
                                    onChange={(e) =>
                                      handleMultiInputCurrentChange(
                                        filter.id,
                                        e.target.value
                                      )
                                    }
                                    onKeyPress={(e) =>
                                      e.key === "Enter" &&
                                      addMultiValueItem(filter.id)
                                    }
                                    className="flex-grow rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                  />
                                  <button
                                    onClick={() => addMultiValueItem(filter.id)}
                                    className="rounded-md bg-purple-100 px-3 py-2 text-xs font-medium text-purple-700 hover:bg-purple-200 focus:outline-none"
                                  >
                                    Add
                                  </button>
                                </div>
                                <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto">
                                  {filters[filter.id].map((item, index) => (
                                    <span
                                      key={index}
                                      className="flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700"
                                    >
                                      {item}
                                      <button
                                        onClick={() =>
                                          removeMultiValueItem(filter.id, item)
                                        }
                                        className="text-purple-500 hover:text-purple-700"
                                      >
                                        <CloseIcon />
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            <div className="flex justify-end gap-2 pt-2 border-t mt-2">
                              <button
                                onClick={() => clearFilter(filter.id)}
                                className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                              >
                                Clear
                              </button>
                              <button
                                onClick={() => applyFilter(filter.id)}
                                className="rounded-md bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                              >
                                Apply
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {activeFilterDisplayItems.length > 0 && (
                  <div className="mt-8 pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">
                      Active Filters:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {activeFilterDisplayItems.map((item, index) => (
                        <span
                          key={`${item.id}-${item.value}-${index}`}
                          className="flex items-center gap-1.5 rounded-full bg-gray-100 border border-gray-300 px-3 py-1 text-xs text-gray-700 shadow-sm"
                        >
                          {item.displayValue}
                          <button
                            onClick={() =>
                              removeActiveFilterItem(item.id, item.value)
                            }
                            className="text-gray-400 hover:text-gray-600"
                            aria-label={`Remove filter ${item.displayValue}`}
                          >
                            <CloseIcon />
                          </button>
                        </span>
                      ))}
                      <button
                        onClick={() => setFilters(initialFilters)}
                        className="text-xs text-purple-600 hover:text-purple-800 hover:underline ml-auto self-center"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default Page;
