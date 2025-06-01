"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Globe,
  Clock,
  ExternalLink,
  Search,
  Loader,
  Grid,
  List,
  Users,
  Briefcase,
  Code,
  BrainCircuit,
  BarChart2,
  Shield,
  Mail,
  Network,
  Landmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CATEGORIES = [
  {
    id: "all",
    label: "All",
    icon: <Briefcase className="h-4 w-4 mr-2" />,
    searchTerms: [
      "AI recruitment",
      "hiring automation",
      "talent sourcing AI",
      "recruitment technology",
      "AI hiring tools",
    ],
  },
  {
    id: "aiTalent",
    label: "AI Talent",
    icon: <BrainCircuit className="h-4 w-4 mr-2" />,
    searchTerms: [
      "AI engineer shortage",
      "machine learning talent",
      "Gen-AI specialists",
      "LLM developers",
      "AI researcher demand",
    ],
  },
  {
    id: "automation",
    label: "Automation",
    icon: <Code className="h-4 w-4 mr-2" />,
    searchTerms: [
      "automated screening",
      "AI resume parsing",
      "recruitment automation",
      "hiring workflow AI",
      "ATS innovation",
    ],
  },
  {
    id: "bias",
    label: "Bias Reduction",
    icon: <Shield className="h-4 w-4 mr-2" />,
    searchTerms: [
      "unbiased hiring",
      "AI diversity recruiting",
      "fair hiring algorithms",
      "DEI technology",
      "inclusive recruitment",
    ],
  },
  {
    id: "sourcing",
    label: "Talent Sourcing",
    icon: <Users className="h-4 w-4 mr-2" />,
    searchTerms: [
      "AI talent matching",
      "candidate sourcing",
      "passive candidate AI",
      "recruiter tools",
      "talent pool management",
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart2 className="h-4 w-4 mr-2" />,
    searchTerms: [
      "hiring metrics",
      "recruitment analytics",
      "talent intelligence",
      "hiring dashboard",
      "workforce planning",
    ],
  },
  {
    id: "outreach",
    label: "Outreach",
    icon: <Mail className="h-4 w-4 mr-2" />,
    searchTerms: [
      "AI recruitment emails",
      "personalized outreach",
      "candidate engagement",
      "automated follow-ups",
      "recruitment marketing",
    ],
  },
  {
    id: "market",
    label: "Market Trends",
    icon: <Landmark className="h-4 w-4 mr-2" />,
    searchTerms: [
      "hiring trends",
      "tech job market",
      "AI skills demand",
      "talent shortage",
      "future of recruitment",
    ],
  },
  {
    id: "platforms",
    label: "Platforms",
    icon: <Network className="h-4 w-4 mr-2" />,
    searchTerms: [
      "recruitment SaaS",
      "hiring platforms",
      "AI HR tech",
      "talent cloud",
      "recruitment startups",
    ],
  },
];

const NewsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const fetchNews = async (category) => {
    setLoading(true);
    setError("");

    try {
      const searchTerms = category.searchTerms
        .map((term) => `"${term}"`)
        .join(" OR ");

      let finalQuery = encodeURIComponent(
        `(${searchTerms}) AND (recruitment OR hiring OR talent OR "AI jobs")`
      );

      const fallbackQuery = encodeURIComponent(
        "AI recruitment OR hiring technology"
      );

      const apiUrl = `https://gnews.io/api/v4/search?q=${finalQuery}&lang=en&max=10&sortby=relevance&apikey=${process.env.NEXT_PUBLIC_GNEWS_API_KEY}`;

      let response = await axios.get(apiUrl);

      if (response.data.articles.length === 0) {
        const fallbackApiUrl = `https://gnews.io/api/v4/search?q=${fallbackQuery}&lang=en&max=10&sortby=relevance&apikey=${process.env.NEXT_PUBLIC_GNEWS_API_KEY}`;
        response = await axios.get(fallbackApiUrl);
      }

      const validArticles = (response.data.articles || []).filter(
        (article) =>
          article.title &&
          article.description &&
          article.url &&
          article.publishedAt
      );

      const uniqueArticles = Array.from(
        new Map(validArticles.map((article) => [article.url, article])).values()
      );

      setNews(uniqueArticles);
    } catch (err) {
      setError("Failed to fetch hiring news. Please try again later.");
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(selectedCategory);
  }, [selectedCategory]);

  const filteredNews = news.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} ${"hours ago"}`;
    } else {
      return `${Math.floor(diffInHours / 24)} ${"days ago"}`;
    }
  };

  const getPlaceholderImage = () => {
    return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80";
  };

  return (
    <div className="bg-transparent py-6 px-4 sm:px-6 lg:px-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500 dark:text-purple-300" />
              <Input
                type="text"
                placeholder={"Search AI recruitment news..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-10 pr-4 py-3 rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-dark-secondary-600 text-purple-900 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300"
                    : "text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                }`}
                aria-label="Grid view"
              >
                <Grid className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg cursor-pointer ${
                  viewMode === "list"
                    ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300"
                    : "text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                }`}
                aria-label="List view"
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {CATEGORIES.map((category) => (
            <Button
              variant="primary"
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory.id === category.id
                  ? "bg-purple-600 text-white dark:bg-purple-500 dark:text-white hover:bg-purple-600 hover:dark:bg-purple-500"
                  : "text-purple-600 dark:text-purple-400"
              }`}
            >
              {category.icon}
              {category.label}
            </Button>
          ))}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader className="h-10 w-10 text-purple-500 dark:text-purple-400 animate-spin mb-4" />
            <span className="text-purple-700 dark:text-purple-300">
              Loading latest hiring technology news...
            </span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center py-12">
            <p className="text-red-600 dark:text-red-300">{error}</p>
            <Button
              onClick={() => fetchNews(selectedCategory)}
              className="mt-4 px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors shadow-sm"
            >
              Try Again
            </Button>
          </div>
        )}

        {!loading && !error && (
          <>
            {viewMode === "grid" && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredNews.map((article, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-dark-secondary-600 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-purple-100 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-500 group"
                  >
                    <div className="aspect-w-16 aspect-h-9 relative">
                      <img
                        src={article.image || getPlaceholderImage()}
                        alt={article.title}
                        className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = getPlaceholderImage();
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-purple-600/90 text-white text-xs rounded-md">
                        {selectedCategory.label}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center space-x-3 text-xs text-purple-700 dark:text-purple-300 mb-3">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(article.publishedAt)}
                        </div>
                        <div className="flex items-center">
                          <Globe className="h-3 w-3 mr-1" />
                          <span className="truncate max-w-[120px]">
                            {article.source.name}
                          </span>
                        </div>
                      </div>
                      <h2 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2 line-clamp-2">
                        {article.title}
                      </h2>
                      <p className="text-purple-800 dark:text-purple-200 mb-4 line-clamp-3 text-sm">
                        {article.description}
                      </p>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 group-hover:underline"
                      >
                        Read full article
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {viewMode === "list" && (
              <div className="space-y-4">
                {filteredNews.map((article, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-dark-secondary-600 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden group"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-1/3 relative">
                        <img
                          src={article.image || getPlaceholderImage()}
                          alt={article.title}
                          className="object-cover w-full h-48 sm:h-full transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = getPlaceholderImage();
                          }}
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-purple-600/90 text-white text-xs rounded-md">
                          {selectedCategory.label}
                        </div>
                      </div>
                      <div className="sm:w-2/3 p-5">
                        <div className="flex items-center space-x-3 text-xs text-black1 dark:text-white mb-3 font-medium">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(article.publishedAt)}
                          </div>
                          <div className="flex items-center">
                            <Globe className="h-3 w-3 mr-1" />
                            <span className="truncate max-w-[142px]">
                              {article.source.name}
                            </span>
                          </div>
                        </div>
                        <h2 className="text-lg font-bold text-black dark:text-white mb-2">
                          {article.title}
                        </h2>
                        <p className="text-gray-800 dark:text-purple-200 mb-4 line-clamp-2 text-sm font-medium">
                          {article.description}
                        </p>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 group-hover:underline"
                        >
                          Read full article
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {!loading && !error && filteredNews.length === 0 && (
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-8 text-center border border-purple-100 dark:border-purple-800">
            <h3 className="text-xl font-medium text-purple-700 dark:text-purple-300 mb-2">
              No hiring news found
            </h3>
            <p className="text-purple-600 dark:text-purple-400 max-w-md mx-auto">
              We couldn't find any news matching your search. Try adjusting your
              search terms or selecting a different category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
