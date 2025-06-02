// src/components/GitHubProfileTab.js
"use client";
import React, { useState } from "react";
import {
  Github,
  Users,
  Eye,
  GitFork,
  Star,
  Code,
  BookOpen,
  Link2,
  MapPin,
  Globe,
  Briefcase,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle as HealthCheckCircle,
  Tag,
  GitCommit,
  Database as RepoSizeIcon,
  FileText as FileTypeIcon,
  GitBranch,
  Copy,
  Sparkles,
  ListChecks,
  Target,
  Heart,
} from "lucide-react";

const StatCard = ({
  icon: Icon,
  label,
  value,
  colorClass = "text-gray-700",
}) => (
  <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex items-center space-x-3">
    <div className={`p-2 rounded-full bg-gray-100 ${colorClass}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-800">{value ?? "N/A"}</p>
    </div>
  </div>
);

const LanguagePill = ({ language, percentage }) => {
  const langColorMap = {
    JavaScript: "bg-yellow-400",
    C: "bg-gray-500",
    Python: "bg-blue-500",
    CSS: "bg-blue-400",
    HTML: "bg-orange-500",
    TypeScript: "bg-blue-600",
    "Jupyter Notebook": "bg-orange-600",
    Shell: "bg-green-500",
    Java: "bg-red-500",
    Go: "bg-teal-500",
    Ruby: "bg-red-600",
    PHP: "bg-indigo-500",
    default: "bg-gray-400",
  };
  const color = langColorMap[language] || langColorMap.default;
  return (
    <div className="flex items-center text-xs text-gray-600 mr-3 mb-1">
      <span className={`w-3 h-3 rounded-full mr-1.5 ${color}`}></span>
      {language} <span className="ml-1 text-gray-500">{percentage}</span>
    </div>
  );
};

const AiAnalysisSection = ({ analysis }) => {
  if (!analysis) return null;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left text-indigo-700 font-medium"
      >
        <div className="flex items-center gap-2">
          <Sparkles size={18} />
          AI Analysis
        </div>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {isOpen && (
        <div className="mt-3 space-y-3 text-sm text-indigo-800/90">
          {analysis.purpose && (
            <div>
              <strong>Purpose:</strong>{" "}
              <p className="text-xs mt-0.5">{analysis.purpose}</p>
            </div>
          )}
          {analysis.technology_stack &&
            analysis.technology_stack.length > 0 && (
              <div>
                <strong>Tech Stack:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {analysis.technology_stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          {analysis.key_features && analysis.key_features.length > 0 && (
            <div>
              <strong className="flex items-center gap-1">
                <ListChecks size={14} />
                Key Features:
              </strong>
              <ul className="list-disc list-inside ml-1 space-y-0.5 text-xs mt-1">
                {analysis.key_features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
          {analysis.use_cases && analysis.use_cases.length > 0 && (
            <div>
              <strong className="flex items-center gap-1">
                <Target size={14} />
                Use Cases:
              </strong>
              <ul className="list-disc list-inside ml-1 space-y-0.5 text-xs mt-1">
                {analysis.use_cases.map((useCase) => (
                  <li key={useCase}>{useCase}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const RepositoryCard = ({ repo, username }) => {
  const getHealthColor = (score) => {
    if (score >= 75) return "text-green-600 bg-green-100";
    if (score >= 50) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-blue-600 hover:underline">
            <a
              href={`https://github.com/${username}/${repo.name}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {repo.name}
            </a>
          </h3>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${getHealthColor(
              repo.health_score || repo.healthScore
            )}`}
          >
            Health: {repo.healthScore || repo.health_score}%
          </span>
        </div>
        {repo.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
            {repo.description}
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Star size={14} className="text-yellow-500" /> Stars: {repo.stars}
          </span>
          <span className="flex items-center gap-1">
            <GitFork size={14} className="text-gray-600" /> Forks: {repo.forks}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={14} className="text-blue-500" /> Watchers:{" "}
            {repo.watchers}
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} className="text-green-500" /> Contrib:{" "}
            {repo.contributors}
          </span>
          <span className="flex items-center gap-1">
            <AlertCircle size={14} className="text-orange-500" /> Issues:{" "}
            {repo.open_issues}
          </span>
          <span className="flex items-center gap-1">
            <FileTypeIcon size={14} className="text-purple-500" />{" "}
            {repo.primary_language}
          </span>
        </div>

        {repo.language_breakdown && (
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-700 mb-1">Languages:</p>
            <div className="flex flex-wrap">
              {Object.entries(repo.language_breakdown).map(([lang, perc]) => (
                <LanguagePill key={lang} language={lang} percentage={perc} />
              ))}
            </div>
          </div>
        )}
        {repo.topics && repo.topics.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-700 mb-1.5">Topics:</p>
            <div className="flex flex-wrap gap-1.5">
              {repo.topics.map((topic) => (
                <span
                  key={topic}
                  className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-300"
                >
                  #{topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-3 mt-auto">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <GitCommit size={14} /> {repo.recent_commits} commits
          </span>
          <span>
            Updated: {new Date(repo.last_updated).toLocaleDateString()}
          </span>
        </div>
        {repo.ai_analysis && <AiAnalysisSection analysis={repo.ai_analysis} />}
      </div>
    </div>
  );
};

const GitHubProfileTab = ({ githubData }) => {
  if (!githubData || !githubData.profile_data) {
    return (
      <div className="p-6 text-center text-gray-500">
        <Github size={48} className="mx-auto mb-4 text-gray-400" />
        GitHub profile data not available or still loading.
      </div>
    );
  }

  const { profile_data, repository_summary, repositories, social_activity } =
    githubData;

  return (
    <div className="space-y-8 p-1">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col sm:flex-row items-center gap-6">
        <img
          src={`https://github.com/${profile_data.username}.png`}
          alt={profile_data.name || profile_data.username}
          className="w-24 h-24 rounded-full border-2 border-gray-300"
          onError={(e) => {
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
              profile_data.name || profile_data.username || "GH"
            )}&background=24292f&color=ffffff&font-size=0.5&bold=true`;
          }}
        />
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-bold text-gray-800">
            {profile_data.name || profile_data.username}
          </h2>
          <p className="text-lg text-gray-500">@{profile_data.username}</p>
          {profile_data.bio && (
            <p className="mt-2 text-sm text-gray-700 max-w-xl">
              {profile_data.bio}
            </p>
          )}
          <div className="mt-3 flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-2 text-sm text-gray-600">
            {profile_data.location && (
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {profile_data.location}
              </span>
            )}
            {profile_data.website && (
              <a
                href={
                  profile_data.website.startsWith("http")
                    ? profile_data.website
                    : `https://${profile_data.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:underline"
              >
                <Globe size={14} />{" "}
                {profile_data.website.replace(/^https?:\/\//, "")}
              </a>
            )}
            <span className="flex items-center gap-1">
              <BookOpen size={14} /> {profile_data.public_repos} Repos
            </span>
            <span className="flex items-center gap-1">
              <Users size={14} /> {profile_data.followers} Followers
            </span>
            <span className="flex items-center gap-1">
              <Heart size={14} /> Following {profile_data.following}
            </span>
          </div>
        </div>
      </div>

      {repository_summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={BookOpen}
            label="Total Repositories"
            value={repository_summary.total_repositories}
            colorClass="text-blue-600"
          />
          <StatCard
            icon={Star}
            label="Total Stars"
            value={repository_summary.total_stars}
            colorClass="text-yellow-500"
          />
          <StatCard
            icon={GitFork}
            label="Total Forks"
            value={repository_summary.total_forks}
            colorClass="text-green-600"
          />
          <StatCard
            icon={Eye}
            label="Total Watchers"
            value={repository_summary.total_watchers}
            colorClass="text-indigo-600"
          />
        </div>
      )}
      {repository_summary?.top_10_stats && (
        <div className="p-4 bg-gray-50 rounded-lg border">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Top 10 Repositories Stats:
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <p>
              <strong>Stars:</strong>{" "}
              {repository_summary.top_10_stats.total_stars}
            </p>
            <p>
              <strong>Forks:</strong>{" "}
              {repository_summary.top_10_stats.total_forks}
            </p>
            <p>
              <strong>Contributors:</strong>{" "}
              {repository_summary.top_10_stats.total_contributors}
            </p>
            <p>
              <strong>Avg. Health:</strong>{" "}
              {repository_summary.top_10_stats.avg_health_score}%
            </p>
          </div>
        </div>
      )}

      {repositories && repositories.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <Github size={24} className="text-gray-700" /> Repositories (
            {repositories.length})
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {repositories.map((repo) => (
              <RepositoryCard
                key={repo.rank || repo.name}
                repo={repo}
                username={profile_data.username}
              />
            ))}
          </div>
        </div>
      )}

      {social_activity && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {social_activity.followers && (
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h4 className="text-lg font-semibold text-gray-700 mb-3">
                Followers ({social_activity.followers.count})
              </h4>
              <div className="flex flex-wrap gap-2">
                {social_activity.followers.top_followers?.slice(0, 10).map(
                  (
                    f // Show top 10
                  ) => (
                    <span
                      key={f}
                      className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
                    >
                      {f}
                    </span>
                  )
                )}
              </div>
            </div>
          )}
          {social_activity.following && (
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h4 className="text-lg font-semibold text-gray-700 mb-3">
                Following ({social_activity.following.count})
              </h4>
              <div className="flex flex-wrap gap-2">
                {social_activity.following.sample_following?.slice(0, 10).map(
                  (
                    f // Show sample 10
                  ) => (
                    <span
                      key={f}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                    >
                      {f}
                    </span>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GitHubProfileTab;
