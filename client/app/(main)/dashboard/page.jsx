// pages/AnalyticsPage.js (or your main page file)
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image"; // For user avatar and company logos

// Assuming your chart components are in this path
import { AreaChart } from "@/components/charts/AreaChart";
// You'll need to create/adapt HorizontalBarChart for Countries Insight
// import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart";

// Lucide React Icons
import {
  Users,
  UserPlus,
  UserMinus,
  Briefcase,
  Bell,
  Mail,
  MoreHorizontal,
  Phone,
  CalendarDays,
  MapPin,
} from "lucide-react";

// Mock data structure similar to the image
const analyticsData = {
  user: {
    name: "Maria",
    avatarUrl: "/placeholder-avatar.jpg", // Replace with actual path or use a placeholder service
  },
  stats: [
    {
      title: "Total employees",
      value: "418",
      change: "+7%",
      changeType: "positive",
      icon: <Users size={20} className="text-gray-500" />,
    },
    {
      title: "New employees",
      value: "21",
      change: "+7%",
      changeType: "positive",
      icon: <UserPlus size={20} className="text-gray-500" />,
    },
    {
      title: "Resigned employees",
      value: "14",
      change: "+4%",
      changeType: "positive",
      icon: <UserMinus size={20} className="text-gray-500" />,
    }, // Change type might be negative in reality
    {
      title: "Job applicants",
      value: "261",
      change: "+12%",
      changeType: "positive",
      icon: <Briefcase size={20} className="text-gray-500" />,
    },
  ],
  upcomingInterview: {
    name: "Jordan Maccan",
    role: "Front-End Developer",
    time: "11:30 AM - 12:45 AM",
    company: "PayPal",
    companyLogoUrl: "/paypal-logo.png", // Replace
    avatarUrl: "/jordan-maccan.jpg", // Replace
  },
  vacancyTrends: {
    // Using your 'sales' data structure for AreaChart
    vacancies: [
      // Blue line
      { date: "2023-01-15", value: 10 },
      { date: "2023-02-15", value: 15 },
      { date: "2023-03-15", value: 25 },
      { date: "2023-04-15", value: 20 },
      { date: "2023-05-15", value: 30 },
      { date: "2023-06-15", value: 45.83 },
      { date: "2023-07-15", value: 40 },
      { date: "2023-08-15", value: 38 },
      { date: "2023-09-15", value: 42 },
      { date: "2023-10-15", value: 35 },
    ],
    candidates: [
      // Red line
      { date: "2023-01-15", value: 25 },
      { date: "2023-02-15", value: 20 },
      { date: "2023-03-15", value: 18 },
      { date: "2023-04-15", value: 22 },
      { date: "2023-05-15", value: 20 },
      { date: "2023-06-15", value: 23 },
      { date: "2023-07-15", value: 25 },
      { date: "2023-08-15", value: 22 },
      { date: "2023-09-15", value: 18 },
      { date: "2023-10-15", value: 20 },
    ],
  },
  countriesInsight: [
    {
      name: "United States",
      flagUrl: "/flags/us.png",
      percentage: 74,
      color: "bg-blue-500",
    }, // Replace flag paths
    {
      name: "France",
      flagUrl: "/flags/fr.png",
      percentage: 43,
      color: "bg-indigo-500",
    },
    {
      name: "Japan",
      flagUrl: "/flags/jp.png",
      percentage: 38,
      color: "bg-red-500",
    },
    {
      name: "Sweden",
      flagUrl: "/flags/se.png",
      percentage: 24,
      color: "bg-yellow-500",
    },
    {
      name: "Spain",
      flagUrl: "/flags/es.png",
      percentage: 16,
      color: "bg-orange-500",
    },
  ],
  employees: [
    {
      id: "E421",
      name: "Kevin Michel",
      avatarUrl: "/avatars/kevin.png",
      email: "kevinmichel@gmail.com",
      role: "Sr / Developer",
    },
    {
      id: "E422",
      name: "Tanisha Combs",
      avatarUrl: "/avatars/tanisha.png",
      email: "tanicom@gmail.com",
      role: "Jn / UX Designer",
    },
    {
      id: "E423",
      name: "Aron Armstrong",
      avatarUrl: "/avatars/aron.png",
      email: "armsaron@gmail.com",
      role: "Md / QA automation",
    },
    {
      id: "E424",
      name: "Josh Wiggins",
      avatarUrl: "/avatars/josh.png",
      email: "wiggijo@gmail.com",
      role: "Sr / Analytics",
    },
  ],
  currentVacancies: [
    {
      title: "Financial Analyst",
      companyLogoUrl: "/logos/hm.png",
      company: "H&M",
    },
    {
      title: "Software Developer",
      companyLogoUrl: "/logos/w.png",
      company: "Wayfair",
    },
    {
      title: "Project Manager",
      companyLogoUrl: "/logos/twitch.png",
      company: "Twitch",
    },
  ],
};

// Reusable Card Component
const Card = ({ children, className = "", title, menuAction }) => (
  <div
    className={`bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-xl shadow-lg ${className}`}
  >
    {(title || menuAction) && (
      <div className="flex justify-between items-center mb-4">
        {title && (
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            {title}
          </h2>
        )}
        {menuAction && (
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <MoreHorizontal size={20} />
          </button>
        )}
      </div>
    )}
    {children}
  </div>
);

const AnalyticsPage = () => {
  const {
    user,
    stats,
    upcomingInterview,
    vacancyTrends,
    countriesInsight,
    employees,
    currentVacancies,
  } = analyticsData;

  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const handleCandidates = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/candidates`
      );
      const data = await response.json();
      setCandidates(data);
    };
    handleCandidates();
  }, []);
  console.log(candidates);

  const cityCountMap = {};

  candidates.forEach((candidate) => {
    const location = candidate?.contact_information?.location;
    if (location) {
      const city = location.split(",")[0].trim(); // Extract city name
      if (cityCountMap[city]) {
        cityCountMap[city]++;
      } else {
        cityCountMap[city] = 1;
      }
    }
  });

  const totalCandidates = candidates.length;

  const cityPercentages = Object.entries(cityCountMap).map(([city, count]) => ({
    city,
    count,
    percentage: ((count / totalCandidates) * 100).toFixed(2), // 2 decimal places
  }));

  // Optional: Sort descending by percentage
  cityPercentages.sort((a, b) => b.percentage - a.percentage);

  console.log(cityPercentages);

  return (
    <div className="min-h-screen overflow-scroll bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <header className="flex justify-between items-center bg-white dark:bg-transparent rounded-md mb-8 p-10 text-3xl font-bold">
        Recruitment Analytics Dashboard
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Stats, Upcoming Interview, Employees) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <div className="flex items-center text-slate-500 dark:text-slate-400 mb-1">
                  {stat.icon}
                  <span className="ml-2 text-sm">{stat.title}</span>
                </div>
                <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                  {stat.value}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    stat.changeType === "positive"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {stat.change} last month
                </p>
              </Card>
            ))}
          </div>

          {/* Vacancy Trends */}
          <Card title="Vacancy Trends" className="h-[400px]">
            {" "}
            {/* Explicit height for chart container */}
            <div className="flex justify-end items-center gap-4 text-xs mb-2">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-indigo-500"></span>{" "}
                Vacancies
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-rose-500"></span>{" "}
                Candidates
              </span>
            </div>
            <div className="h-[300px] relative">
              <AreaChart sales={vacancyTrends.vacancies} />
              <div
                className="absolute h-full border-l border-slate-400 dark:border-slate-600"
                style={{ left: "55%", top: 0 }}
              >
                {" "}
                {/* Approximate position */}
                <span
                  className="absolute -top-2 -left-5 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-md shadow-lg"
                  style={{ transform: "translateX(-50%)" }}
                >
                  45.83
                </span>
              </div>
            </div>
          </Card>

          {/* Employees Table */}
          <Card title="Employees" menuAction>
            <div className="overflow-x-auto grid-cols-4 col-span-4">
              <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Employee name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Employee ID
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.splice(0, 7).map((emp) => (
                    <tr
                      key={emp.id}
                      className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-700/30"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap flex items-center gap-3">
                        <Image
                          src={emp.linkedin_data.profile_data.profile_photo}
                          alt={emp.linkedin_data.profile_data.profile_photo}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                        {emp.candidate_name}
                      </td>
                      <td className="px-6 py-4">{emp._id}</td>
                      <td className="px-6 py-4">
                        {emp.contact_information.email}
                      </td>
                      <td className="px-6 py-4">
                        {emp.skills.technical_skills.programming_languages[0]}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-indigo-600 dark:text-indigo-400 hover:underline">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column (Countries Insight, Current Vacancies) */}
        <div className="lg:col-span-1 space-y-6">
          <Card title="Countries Insight" menuAction>
            <div className="space-y-4">
              {cityPercentages.splice(0, 5).map((country) => (
                <div key={country.city}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-full w-10 h-10 flex justify-center">
                        {country.city.charAt(0)}
                      </div>
                      <span className="text-sm text-slate-700 dark:text-slate-200">
                        {country.city}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      {country.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                    <div
                      className={`bg-purple-600 h-1.5 rounded-full`}
                      style={{ width: `${country.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Current vacancies" menuAction>
            <div className="space-y-4">
              {currentVacancies.map((vacancy, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-full w-10 h-10 flex justify-center">
                    {vacancy.title.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-700 dark:text-slate-200">
                      {vacancy.title}
                    </p>
                    <a
                      href="#"
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Key Insights" menuAction>
            <div className="space-y-4">
              {candidates.slice(0, 1).map((cen) => (
                <div key={cen._id} className="flex items-center gap-3">
                  <div>
                    <p className="font-semibold text-sm text-slate-700 dark:text-slate-200">
                      {cen.candidate_name}
                    </p>
                    <a
                      href="#"
                      className="text-xs text-gray-600 dark:text-gray-400 hover:underline"
                    >
                      {cen.ai_summary_data.summary}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
