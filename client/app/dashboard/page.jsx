"use client";
import React, { useState } from "react";
import Sidebar from "../../components/ui/Sidebar";

const DashboardPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Main Content */}
      <div className="ml-64 transition-all duration-300">
        <div className="mb-8 h-screen flex items-center justify-between">
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-2 flex items-center justify-center">
                  <svg
                    className="h-12 w-12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold">PeopleGPT by Juicebox</h1>
                <p className="mt-2 text-gray-600">
                  Find exactly who you're looking for, in seconds.{" "}
                  <a href="#" className="text-purple-600 hover:underline">
                    See how it works.
                  </a>
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-3xl">
              <div className="relative">
                <div className="flex items-center rounded-lg border border-gray-300 bg-white p-2">
                  <input
                    type="text"
                    placeholder="Who are you looking for?"
                    className="flex-1 border-none px-3 py-2 outline-none"
                  />
                  <button className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
                    Search
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100">
                    <span>Location</span>
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button className="flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100">
                    <span>Job Title</span>
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button className="flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100">
                    <span>Years of Experience</span>
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button className="flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100">
                    <span>Industry</span>
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button className="flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100">
                    <span>Skills</span>
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Search Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-[900px] rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Edit Your Search Filters
              </h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">1M+ matches</span>
                <button
                  className="rounded-md bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Save Changes
                </button>
              </div>
            </div>

            <div className="flex gap-6">
              {/* Left Sidebar */}
              <div className="w-64 border-r border-gray-200 pr-4">
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search filters"
                    className="w-full rounded-md border border-gray-200 p-2 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <button className="flex w-full items-center gap-2 rounded-md p-2 hover:bg-gray-100">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    General
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-md p-2 hover:bg-gray-100">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Locations
                  </button>
                  {/* Add other filter categories */}
                </div>
              </div>

              {/* Right Content */}
              <div className="flex-1">
                <div className="space-y-6">
                  {/* Experience Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Min Experience (Years)
                      </label>
                      <input
                        type="text"
                        placeholder="0"
                        className="w-full rounded-md border border-gray-200 p-2"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Max Experience (Years)
                      </label>
                      <input
                        type="text"
                        placeholder="Example: 10 years"
                        className="w-full rounded-md border border-gray-200 p-2"
                      />
                    </div>
                  </div>

                  {/* Required Contact Info */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium">
                        Required Contact Info
                      </label>
                      <button className="text-sm text-gray-600">
                        Match Any
                      </button>
                    </div>
                    <select className="w-full rounded-md border border-gray-200 p-2">
                      <option>Select contact info types</option>
                    </select>
                  </div>

                  {/* Connections */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium">
                        Only Connections
                      </label>
                      <button className="text-sm text-blue-600">
                        Learn more
                      </button>
                    </div>
                    <select className="w-full rounded-md border border-gray-200 p-2">
                      <option>Don't restrict to connections</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium">Location(s)</label>
                      <button className="text-sm text-gray-600">
                        Within 25 miles
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Examples: San Francisco / United States / NYC / ..."
                      className="w-full rounded-md border border-gray-200 p-2"
                    />
                    <p className="mt-2 text-sm text-yellow-600">
                      ⚠ No locations added
                    </p>
                  </div>

                  {/* Past Locations */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Past Locations
                    </label>
                    <input
                      type="text"
                      placeholder="Examples: San Francisco / United States / NYC / ..."
                      className="w-full rounded-md border border-gray-200 p-2"
                    />
                  </div>

                  {/* Job Titles */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium">Job Titles</label>
                      <button className="text-sm text-gray-600">
                        Current Only
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Start typing a job title and select from the list"
                      className="w-full rounded-md border border-gray-200 p-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add button to open dialog */}
      <button
        onClick={() => setIsDialogOpen(true)}
        className="mt-4 rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
      >
        Manual Search
      </button>
    </div>
  );
};

export default DashboardPage;
