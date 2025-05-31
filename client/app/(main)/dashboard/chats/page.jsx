"use client";

import React, { useState, useEffect, useRef } from "react";

// Reusable Dropdown Icon
const DropdownIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

// Close icon for tags
const CloseIcon = () => (
  <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const Page = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [currentMultiInputValue, setCurrentMultiInputValue] = useState({});

  const initialFilters = {
    location: [],
    jobTitle: "",
    minExperience: "",
    maxExperience: "",
    industry: "",
    skills: [],
  };
  const [filters, setFilters] = useState(initialFilters);

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

  const handleInputChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handleMultiInputCurrentChange = (filterId, value) => {
    setCurrentMultiInputValue((prev) => ({ ...prev, [filterId]: value }));
  };

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

  const removeMultiValueItem = (filterId, itemToRemove) => {
    setFilters((prev) => ({
      ...prev,
      [filterId]: prev[filterId].filter((item) => item !== itemToRemove),
    }));
  };

  // New function to remove a specific filter value from the global active filters display
  const removeActiveFilterItem = (filterId, itemValue = null) => {
    const option = filterOptions.find((opt) => opt.id === filterId);
    if (option) {
      if (option.type === "multi" && itemValue) {
        removeMultiValueItem(filterId, itemValue);
      } else if (option.id === "experience") {
        // Special handling for range
        if (itemValue === `Min: ${filters.minExperience} yrs`)
          setFilters((prev) => ({ ...prev, minExperience: "" }));
        else if (itemValue === `Max: ${filters.maxExperience} yrs`)
          setFilters((prev) => ({ ...prev, maxExperience: "" }));
      } else {
        // Single value filters
        setFilters((prev) => ({ ...prev, [filterId]: "" }));
      }
    }
  };

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
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

  // Function to get all active filter items for display
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

  return (
    <div>
      <div className="md:ml-64 transition-all duration-300">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
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
                  PeopleGPT by Juicebox
                </h1>
                <p className="mt-2 text-gray-600">
                  Find exactly who you're looking for, in seconds.{" "}
                  <a href="#" className="text-purple-600 hover:underline">
                    See how it works.
                  </a>
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-3xl">
              <div className="relative mb-6">
                <div className="flex items-center rounded-lg border border-gray-300 bg-white shadow-sm">
                  <input
                    type="text"
                    placeholder="Search by name, company, keywords..."
                    className="flex-1 border-none px-4 py-3 text-lg outline-none rounded-l-lg"
                  />
                  <button className="rounded-r-lg bg-purple-600 px-6 py-3 text-lg text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50">
                    Search
                  </button>
                </div>
              </div>

              {/* Filter Buttons Area */}
              <div className="flex flex-wrap justify-center gap-3">
                {filterOptions.map((filter) => (
                  <div
                    key={filter.id}
                    className="relative filter-button-container"
                  >
                    <button
                      onClick={() => toggleDropdown(filter.id)}
                      className={`filter-button flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-300
                        ${
                          isFilterActive(filter.id)
                            ? "border-purple-500 bg-purple-50 text-purple-700"
                            : "border-gray-300 bg-white text-gray-700"
                        }`}
                    >
                      {isFilterActive(filter.id) && (
                        <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                      )}
                      <span>{filter.label}</span>
                      <DropdownIcon />
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

                          {/* Single Value Input */}
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

                          {/* Range Input (Experience) */}
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

                          {/* Multi Value Input (Skills, Location) */}
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

              {/* Active Filters Display Area */}
              {activeFilterDisplayItems.length > 0 && (
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Active Filters:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {activeFilterDisplayItems.map((item, index) => (
                      <span
                        key={`${item.id}-${item.value}-${index}`} // More unique key
                        className="flex items-center gap-1.5 rounded-full bg-gray-100 border border-gray-300 px-3 py-1 text-xs text-gray-700 shadow-sm"
                      >
                        {item.displayValue}
                        <button
                          onClick={() =>
                            removeActiveFilterItem(item.id, item.value)
                          } // Pass item.value for multi-select items
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
  );
};

export default Page;
