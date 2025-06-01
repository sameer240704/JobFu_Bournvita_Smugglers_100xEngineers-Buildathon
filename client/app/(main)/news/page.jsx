"use client";
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
  Brain,
  TrendingUp,
  Building,
  Briefcase,
  BarChart3,
} from "lucide-react";

const CATEGORIES = [
  {
    id: "all",
    label: "All News",
    icon: Globe,
    searchTerms: [
      "AI recruitment",
      "hiring technology",
      "talent acquisition AI",
      "recruiting automation",
      "HR technology",
    ],
  },
  {
    id: "aiRecruiting",
    label: "AI Recruiting",
    icon: Brain,
    searchTerms: [
      "artificial intelligence recruitment",
      "AI hiring tools",
      "machine learning recruiting",
      "automated candidate screening",
      "AI resume parsing",
      "intelligent talent matching",
      "predictive hiring analytics",
    ],
  },
  {
    id: "talentAcquisition",
    label: "Talent Acquisition",
    icon: Users,
    searchTerms: [
      "talent acquisition strategy",
      "candidate sourcing",
      "recruitment pipeline",
      "hiring process optimization",
      "talent pool management",
      "candidate experience",
      "recruitment marketing",
    ],
  },
  {
    id: "hrTech",
    label: "HR Technology",
    icon: BarChart3,
    searchTerms: [
      "HR technology trends",
      "recruitment software",
      "applicant tracking systems",
      "hiring platforms",
      "workforce analytics",
      "employee data insights",
      "HR automation tools",
    ],
  },
  {
    id: "aiJobs",
    label: "AI Jobs Market",
    icon: Briefcase,
    searchTerms: [
      "AI job market trends",
      "artificial intelligence careers",
      "machine learning jobs",
      "AI engineer hiring",
      "data scientist recruitment",
      "tech talent shortage",
      "AI skills demand",
    ],
  },
  {
    id: "recruiting",
    label: "Recruiting Trends",
    icon: TrendingUp,
    searchTerms: [
      "recruiting trends 2024",
      "future of recruitment",
      "hiring best practices",
      "remote hiring",
      "diversity recruitment",
      "candidate assessment",
      "recruitment metrics",
    ],
  },
  {
    id: "enterprise",
    label: "Enterprise Hiring",
    icon: Building,
    searchTerms: [
      "enterprise recruitment",
      "corporate hiring strategies",
      "large scale recruiting",
      "talent acquisition enterprise",
      "organizational hiring",
      "workforce planning",
      "strategic recruitment",
    ],
  },
];

const HireAINews = () => {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  // Mock news data since we don't have an actual API key
  const mockNews = [
    {
      title:
        "AI-Powered Recruitment Platforms See 300% Growth in Enterprise Adoption",
      description:
        "Major corporations are rapidly adopting AI-driven hiring tools to streamline their recruitment processes, with companies reporting significant reductions in time-to-hire and improved candidate quality.",
      url: "https://example.com/ai-recruitment-growth",
      image:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      source: { name: "TechRecruit Today" },
    },
    {
      title:
        "The Future of Talent Screening: How Machine Learning is Revolutionizing Candidate Assessment",
      description:
        "New ML algorithms can now predict candidate success with 85% accuracy, analyzing everything from resume patterns to communication styles during interviews.",
      url: "https://example.com/ml-candidate-screening",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80",
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      source: { name: "HR Innovation Weekly" },
    },
    {
      title:
        "Breaking: AI Engineer Salaries Hit Record High as Demand Outpaces Supply",
      description:
        "The average salary for AI engineers has increased by 45% year-over-year, with companies struggling to fill specialized roles in machine learning and natural language processing.",
      url: "https://example.com/ai-engineer-salaries",
      image:
        "https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80",
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      source: { name: "Tech Salary Report" },
    },
    {
      title: "Automated Resume Parsing Technology Reduces Hiring Bias by 60%",
      description:
        "New AI systems that focus on skills and experience rather than traditional markers are helping companies build more diverse teams and eliminate unconscious bias in recruitment.",
      url: "https://example.com/resume-parsing-bias",
      image:
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80",
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      source: { name: "Diversity in Tech" },
    },
    {
      title:
        "Remote Hiring Technologies Enable Global Talent Acquisition at Scale",
      description:
        "Companies are leveraging AI-powered platforms to source, screen, and hire talent from around the world, with remote hiring increasing by 200% in the past year.",
      url: "https://example.com/remote-hiring-tech",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80",
      publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      source: { name: "Remote Work Tribune" },
    },
    {
      title:
        "Personalized Candidate Outreach: How AI is Transforming Recruiter Communication",
      description:
        "Advanced natural language processing enables recruiters to automatically generate personalized messages for candidates, increasing response rates by 75%.",
      url: "https://example.com/ai-candidate-outreach",
      image:
        "https://images.unsplash.com/photo-1553484771-371a605b060b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80",
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      source: { name: "Recruitment Tech News" },
    },
  ];

  const fetchNews = async (category) => {
    setLoading(true);
    setError("");

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Filter mock news based on category
      let filteredNews = mockNews;
      if (category.id !== "all") {
        // Simple filtering based on category keywords
        filteredNews = mockNews.filter((article) => {
          const content =
            `${article.title} ${article.description}`.toLowerCase();
          return category.searchTerms.some((term) =>
            content.includes(term.toLowerCase().split(" ")[0])
          );
        });
      }

      setNews(filteredNews);
    } catch (err) {
      setError("Failed to fetch news. Please try again later.");
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
      return `${diffInHours} hours ago`;
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
  };

  const getPlaceholderImage = () => {
    return "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80";
  };

  return (
    <div className="bg-gray-50 h-screen overflow-scroll py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className=" mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              HireAI News Hub
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search AI recruitment news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                aria-label="Grid view"
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                aria-label="List view"
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6">
          {CATEGORIES.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory.id === category.id
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader className="h-10 w-10 text-blue-500 animate-spin mb-4" />
            <span className="text-gray-600">
              Loading latest recruitment technology news...
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center py-12">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => fetchNews(selectedCategory)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* News Content */}
        {!loading && !error && (
          <>
            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredNews.map((article, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300 group"
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
                    </div>
                    <div className="p-5">
                      <div className="flex items-center space-x-3 text-xs text-gray-500 mb-3">
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
                      <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {article.title}
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                        {article.description}
                      </p>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 group-hover:underline"
                      >
                        Read full article{" "}
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="space-y-4">
                {filteredNews.map((article, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300 group"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-1/3">
                        <img
                          src={article.image || getPlaceholderImage()}
                          alt={article.title}
                          className="object-cover w-full h-48 sm:h-full group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = getPlaceholderImage();
                          }}
                        />
                      </div>
                      <div className="sm:w-2/3 p-5">
                        <div className="flex items-center space-x-3 text-xs text-gray-500 mb-3">
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
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">
                          {article.title}
                        </h2>
                        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                          {article.description}
                        </p>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 group-hover:underline"
                        >
                          Read full article{" "}
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

        {/* Empty State */}
        {!loading && !error && filteredNews.length === 0 && (
          <div className="bg-gray-100 rounded-xl p-8 text-center">
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No articles found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn't find any news matching your search criteria. Try
              adjusting your search terms or selecting a different category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HireAINews;
