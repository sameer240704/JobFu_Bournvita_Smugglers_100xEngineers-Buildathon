"use client";

import React, { useState, useEffect, useRef, useCallback } from "react"; // Added useCallback
import { useRouter } from "next/navigation";
import ChatHistoryPanel from "@/components/misc/ChatHistoryPanel"; // Ensure this path is correct
import { useCurrentUserId } from "@/hooks/use-current-user-id"; // Ensure this path is correct
import { Logo } from "@/public";

// --- ICONS ---
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
// Add ChatIcon and TrashIcon if they are used in ChatHistoryPanel, or ensure ChatHistoryPanel imports them.

// --- MAIN PAGE COMPONENT ---
const Page = () => {
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [currentMultiInputValue, setCurrentMultiInputValue] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [pageLoading, setPageLoading] = useState(true); // For initial history load

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
  // const [candidates, setCandidates] = useState([]); // Candidates are handled on results page

  const user = useCurrentUserId();
  const [userId, setUserId] = useState(null); // State for user ID

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/users/me/${user}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.user) {
          setUserId(data.user[0]._id);
        } else {
          console.error("No user data found in the response.");
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [user]);

  // --- Fetch Chat History from API ---
  const fetchChatHistory = useCallback(async () => {
    if (!userId) {
      // console.log("User ID not available yet for fetching chat history.");
      setPageLoading(false); // Stop loading if no user ID, or handle as needed
      return;
    }
    setPageLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/chats/${userId}` // Assuming endpoint per user
      );
      if (!response.ok) {
        throw new Error(`Error fetching chat history: ${response.statusText}`);
      }
      const dbChats = await response.json();
      console.log("Fetched chats:", dbChats);

      // Map DB chat items to the structure expected by ChatHistoryPanel
      const formattedChats = dbChats.data
        .map((chat) => ({
          id: chat._id,
          title: chat.query || "Chat Entry", // Use query as title, or a default
          lastMessage:
            chat.response && chat.response.length > 0
              ? `Found ${chat.response.length} items`
              : "Search performed",
          timestamp: new Date(chat.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          searchParameters: {
            // Store the raw query and filters for restoration
            query: chat.query,
            filters: chat.filters || initialFilters, // Ensure filters object exists
          },
          // Add any other fields your ChatHistoryPanel might need from 'chat'
        }))
        .sort(
          (a, b) =>
            new Date(b.timestampToSort || 0) - new Date(a.timestampToSort || 0)
        ); // Sort by original creation if available
      setChatHistory(formattedChats);
    } catch (error) {
      console.error("Failed to load chat history:", error);
      setChatHistory([]);
    } finally {
      setPageLoading(false);
    }
  }, [userId]); // Depend on userId

  useEffect(() => {
    fetchChatHistory();
  }, [fetchChatHistory]);

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
        setFilters((prev) => ({
          ...prev,
          [filterId]: initialFilters[filterId],
        })); // Reset to initial for single/range
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

  const performSearch = async () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery && !hasActiveFilters()) {
      alert("Please enter a search query or apply filters.");
      return;
    }
    if (!userId) {
      alert("User not identified. Please log in."); // Or handle appropriately
      return;
    }

    setIsSearching(true);

    const cleanFiltersPayload = {
      location: filters.location || [],
      jobTitle: filters.jobTitle || "",
      minExperience: filters.minExperience || "",
      maxExperience: filters.maxExperience || "",
      industry: filters.industry || "",
      skills: filters.skills || [],
    };

    try {
      const searchDataForAI = {
        query: trimmedQuery,
        top_k: 10,
        // If your AI needs filters, pass them from cleanFiltersPayload
        // filters: cleanFiltersPayload,
      };

      const aiResponse = await fetch("http://127.0.0.1:8000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchDataForAI),
      });

      if (!aiResponse.ok) {
        const errorData = await aiResponse
          .json()
          .catch(() => ({ error: "AI search request failed" }));
        throw new Error(
          errorData.error ||
            `AI search failed with status: ${aiResponse.status}`
        );
      }
      const aiData = await aiResponse.json();
      console.log("AI response:", aiData.ranked_candidates);
      if (!aiData || !aiData.success) {
        throw new Error("AI search returned an unexpected response structure.");
      }

      // --- Save to Chat History API ---
      const chatPayloadForDB = {
        user: userId, // Make sure userId is available and correct
        query: trimmedQuery,
        filters: cleanFiltersPayload,
        response: aiData.ranked_candidates.map((can) => can.name), // Assuming aiData.response is an array of candidate IDs or basic info
      };

      const chatResponse = await fetch(
        `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/chats`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(chatPayloadForDB),
        }
      );

      if (!chatResponse.ok) {
        const errorData = await chatResponse
          .json()
          .catch(() => ({ error: "Failed to save chat" }));
        throw new Error(
          errorData.error ||
            `Failed to save chat with status: ${chatResponse.status}`
        );
      }
      const savedChatFromDB = await chatResponse.json();
      console.log("Saved chat to DB:", savedChatFromDB);

      // --- Update Local Chat History State ---
      if (savedChatFromDB && savedChatFromDB._id) {
        // Assuming backend returns the saved chat with _id
        const newChatEntryForUI = {
          id: savedChatFromDB._id,
          title: savedChatFromDB.query || "Search Result",
          lastMessage: `Found ${savedChatFromDB.response?.length || 0} items`,
          timestamp: new Date(savedChatFromDB.createdAt).toLocaleTimeString(
            [],
            { hour: "2-digit", minute: "2-digit" }
          ),
          searchParameters: {
            query: savedChatFromDB.query,
            filters: savedChatFromDB.filters || initialFilters,
          },
        };
        setChatHistory((prev) =>
          [newChatEntryForUI, ...prev].sort(
            (a, b) =>
              new Date(b.timestampToSort || 0) -
              new Date(a.timestampToSort || 0)
          )
        );
      }

      router.push(`/results/${savedChatFromDB.data._id}`);

      // Optional: Open chat history panel after search
      // setIsChatHistoryOpen(true);
    } catch (error) {
      console.error("Search error:", error);
      alert(`Search failed: ${error.message}`);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown) {
        const currentDropdownRef = dropdownRefs[openDropdown];
        if (
          currentDropdownRef?.current && // Check if currentDropdownRef and current exist
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
  }, [openDropdown, dropdownRefs]); // Added dropdownRefs to dependency array

  const applyFilter = (dropdownName) => {
    // console.log(`Applying filter for ${dropdownName}:`, filters);
    setOpenDropdown(null); // Close dropdown after applying
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
        setFilters((prev) => ({
          ...prev,
          [dropdownName]: initialFilters[dropdownName],
        }));
      }
    }
    // console.log(`Cleared filter for ${dropdownName}`);
  };

  const isFilterActive = (filterId) => {
    const filterValue = filters[filterId];
    if (filterId === "experience") {
      return filters.minExperience !== "" || filters.maxExperience !== "";
    }
    if (Array.isArray(filterValue)) {
      return filterValue.length > 0;
    }
    return filterValue !== "" && filterValue !== undefined;
  };

  const getActiveFilterDisplayItems = () => {
    const activeItems = [];
    filterOptions.forEach((option) => {
      if (option.type === "multi" && filters[option.id]?.length > 0) {
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
    // For a DB backed system, "New Chat" might mean clearing current UI state
    // or navigating to a fresh search page, rather than adding a placeholder locally.
    setSearchQuery("");
    setFilters(initialFilters);
    // Potentially, if you have a concept of "active chat ID" in UI, reset it.
    // router.push('/chat-history'); // Or your main search page
    setIsChatHistoryOpen(true); // Or false, depending on desired UX
  };

  const handleDeleteChat = async (chatIdToDelete, event) => {
    event.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this chat?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/chats/${chatIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete chat from server");
      }
      setChatHistory((prev) =>
        prev.filter((chat) => chat.id !== chatIdToDelete)
      );
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("Failed to delete chat.");
    }
  };

  const handleSelectChat = (chatId) => {
    const selectedChat = chatHistory.find((chat) => chat.id === chatId);
    if (selectedChat && selectedChat.searchParameters) {
    }
    setIsChatHistoryOpen(false); // Close panel after selection
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 flex items-center justify-center">
            <svg
              className="h-16 w-16 text-purple-600 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-700">
            Loading Your Space...
          </h1>
          <p className="mt-2 text-gray-500">
            Getting your previous conversations ready.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen flex flex-col">
      {" "}
      {/* Changed to flex-col for sticky footer */}
      <div
        className={`flex-grow transition-all duration-300 ${
          isChatHistoryOpen ? "md:mr-80" : "md:mr-0"
        }`}
      >
        <div className="min-h-full flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
          <div className="w-full max-w-3xl bg-white p-6 sm:p-10 rounded-xl shadow-2xl">
            {/* PeopleGPT Header */}
            <div className="mb-8 text-center">
              <div className="inline-block p-3 bg-purple-100 rounded-full mb-4">
                <img src={Logo} alt="logo" className="w-5 h-5" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                HireAI by JobFu
              </h1>
              <p className="mt-3 text-gray-600">
                Find exactly who you're looking for, in seconds.{" "}
                <a
                  href="/documentation"
                  className="text-purple-600 hover:underline font-medium"
                >
                  See how it works
                </a>
              </p>
            </div>

            {/* Search and Filters */}
            <div className="mx-auto">
              <div className="relative mb-6">
                <div className="flex items-center rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 bg-white shadow-sm">
                  <input
                    type="text"
                    placeholder="Describe your ideal candidate..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && performSearch()}
                    className="flex-1 border-none px-4 py-3 text-md sm:text-lg outline-none rounded-l-lg"
                  />
                  <button
                    onClick={performSearch}
                    disabled={isSearching}
                    className="rounded-r-lg bg-purple-600 px-5 py-3 text-md sm:text-lg text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSearching ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
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
                    ) : (
                      "Search"
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
                {filterOptions.map((filter) => (
                  <div
                    key={filter.id}
                    className="relative filter-button-container"
                  >
                    <button
                      onClick={() => toggleDropdown(filter.id)}
                      className={`filter-button flex items-center gap-1.5 rounded-full border px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                        isFilterActive(filter.id)
                          ? "border-purple-500 bg-purple-50 text-purple-700 font-medium"
                          : "border-gray-300 bg-white text-gray-700"
                      }`}
                    >
                      {isFilterActive(filter.id) && (
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                      )}
                      <span>{filter.label}</span> <DropdownIcon />
                    </button>
                    {openDropdown === filter.id && (
                      <div
                        ref={dropdownRefs[filter.id]}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 sm:w-80 origin-top-center rounded-md bg-white shadow-xl z-30 border border-gray-200"
                      >
                        <div className="p-4 space-y-3">
                          <h4 className="text-sm font-medium text-gray-600 border-b pb-2">
                            Filter by {filter.label}
                          </h4>
                          {filter.type === "single" && (
                            <input
                              type="text"
                              placeholder={`Enter ${filter.label.toLowerCase()}`}
                              value={filters[filter.id] || ""}
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
                                  value={filters.minExperience || ""}
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
                                  value={filters.maxExperience || ""}
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
                              <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto p-1 bg-gray-50 rounded">
                                {(filters[filter.id] || []).map(
                                  (item, index) => (
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
                                  )
                                )}
                              </div>
                            </div>
                          )}
                          <div className="flex justify-end gap-2 pt-3 border-t mt-3">
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
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-500">
                      Active Filters:
                    </h3>
                    <button
                      onClick={() => setFilters(initialFilters)}
                      className="text-xs text-purple-600 hover:text-purple-800 hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {activeFilterDisplayItems.map((item, index) => (
                      <span
                        key={`${item.id}-${item.value}-${index}`}
                        className="flex items-center gap-1.5 rounded-full bg-gray-100 border border-gray-300 px-2.5 py-1 text-xs text-gray-700 shadow-sm"
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
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ChatHistoryPanel
        isOpen={isChatHistoryOpen}
        onClose={() => setIsChatHistoryOpen(false)}
        chatHistory={chatHistory}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onNewChat={handleNewChat}
        title="Search History"
        isLoading={pageLoading && chatHistory.length === 0} // Show loading in panel only if history is empty and page is loading
      />
      {/* Floating button to open chat history */}
      {!isChatHistoryOpen && (
        <button
          onClick={() => setIsChatHistoryOpen(true)}
          className="fixed bottom-6 right-6 bg-purple-600 text-white p-3 rounded-full shadow-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 z-20 transition-transform hover:scale-110"
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

export default Page;
