"use client";
import CandidateCarousel from "@/components/landing-page/candidate-carousel";
import PricingSection from "@/components/landing-page/pricing-section";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  FiSun,
  FiMoon,
  FiSearch,
  FiPhone,
  FiUser,
  FiAward,
  FiMail,
  FiGitBranch,
  FiBriefcase,
  FiActivity,
  FiMenu,
  FiX,
} from "react-icons/fi";

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700">
    <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

const LandingPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleNavigateLogin = () => {
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 transition-colors duration-300">
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-5xl z-50 rounded-2xl backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
              <FiActivity className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-400">
              HireAI
            </span>
          </div>

          <div className="hidden lg:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors font-medium"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors font-medium"
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors font-medium"
            >
              Testimonials
            </a>
            <a
              href="#pricing"
              className="text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors font-medium"
            >
              Pricing
            </a>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <FiSun className="w-5 h-5" />
              ) : (
                <FiMoon className="w-5 h-5" />
              )}
            </Button>

            <Button
              onClick={handleNavigateLogin}
              className="hidden lg:flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-purple-500/25 dark:shadow-purple-900/30 font-semibold cursor-pointer"
            >
              <span>Get Started</span>
            </Button>

            <Button
              onClick={handleNavigateLogin}
              className="lg:hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-purple-500/25 text-sm font-semibold"
            >
              Start
            </Button>

            <button
              className="lg:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <FiX className="w-5 h-5" />
              ) : (
                <FiMenu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-b-2xl">
            <div className="flex flex-col space-y-4">
              <a
                href="#features"
                className="text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className="text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 pt-48 pb-20">
        {/* Hero Section */}
        <section className="text-center mb-24">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-semibold px-4 py-1 rounded-full inline-block mb-6">
            AI-POWERED RECRUITING
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
            Find Specialized AI Talent in{" "}
            <span className="underline decoration-purple-500">Seconds</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            HireAI is your end-to-end hiring copilot that finds, screens, and
            recruits specialized AI talent 10x faster with zero bias.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <button
              onClick={handleNavigateLogin}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/20 dark:shadow-purple-900/30 text-lg font-medium flex items-center justify-center cursor-pointer"
            >
              <FiSearch className="mr-2" /> Start Searching
            </button>
            <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 px-8 py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-lg shadow-gray-500/10 dark:shadow-gray-900/30 text-lg font-medium flex items-center justify-center">
              <FiPhone className="mr-2" /> Book a Demo
            </button>
          </div>

          <CandidateCarousel />
        </section>

        {/* Problem Statement */}
        <section className="mb-24">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
              The AI Talent Crisis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-100 dark:border-red-900/30">
                <div className="text-red-500 dark:text-red-400 text-4xl font-bold mb-2">
                  60+ days
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Average time-to-hire for specialized AI roles
                </p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                <div className="text-yellow-500 dark:text-yellow-400 text-4xl font-bold mb-2">
                  75%
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Of AI roles remain unfilled after 3 months
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border border-purple-100 dark:border-purple-900/30">
                <div className="text-purple-500 dark:text-purple-400 text-4xl font-bold mb-2">
                  42%
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Recruiters report bias in hiring processes
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-900/30">
                <div className="text-blue-500 dark:text-blue-400 text-4xl font-bold mb-2">
                  $25k+
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Average cost per AI role vacancy
                </p>
              </div>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Companies struggle to quickly fill specialized AI roles due to
              scarcity of qualified candidates, manual sourcing, inefficient
              screening, and bias. The average time-to-hire stretches beyond 60
              days, increasing costs and reducing productivity.
            </p>
            <div className="bg-purple-50 dark:bg-purple-900/10 border-l-5 border-purple-500 dark:border-purple-400 p-4 rounded-r-lg rounded-l-lg">
              <p className="text-purple-800 dark:text-purple-200 italic">
                "We were spending 80% of our time just screening resumes for AI
                roles. HireAI reduced that to 5 minutes per candidate."
              </p>
              <p className="text-purple-700 dark:text-purple-300 mt-2">
                — Sarah Johnson, Head of Talent at TechCorp AI
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="mb-24">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-800 dark:text-white">
            The PeopleGPT Experience
          </h2>
          <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-16 max-w-2xl mx-auto">
            Natural-language talent search combined with AI-powered screening
            and outreach
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FiSearch className="w-6 h-6" />}
              title="Natural Language Search"
              description="Type plain-English queries like 'Find senior Gen-AI engineers with LangChain + RAG experience in Europe'"
            />
            <FeatureCard
              icon={<FiUser className="w-6 h-6" />}
              title="Automated Resume Parsing"
              description="Extract skills, experience, and qualifications from resumes with 99% accuracy"
            />
            <FeatureCard
              icon={<FiAward className="w-6 h-6" />}
              title="Candidate Ranking"
              description="AI-powered scoring based on recruiter criteria and job requirements"
            />
            <FeatureCard
              icon={<FiMail className="w-6 h-6" />}
              title="Personalized Outreach"
              description="Automatically generate and send personalized messages to top candidates"
            />
            <FeatureCard
              icon={<FiGitBranch className="w-6 h-6" />}
              title="Multi-Source Search"
              description="Search across LinkedIn, GitHub, professional networks, and your own database"
            />
            <FeatureCard
              icon={<FiBriefcase className="w-6 h-6" />}
              title="Bias Elimination"
              description="Remove unconscious bias with anonymized screening and standardized scoring"
            />
          </div>
        </section>

        <PricingSection />
      </div>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="bg-purple-500 w-8 h-8 rounded-lg flex items-center justify-center">
                <FiActivity className="text-white text-lg" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-400">
                HireAI
              </span>
            </div>

            <div className="flex space-x-6 mb-6 md:mb-0">
              <a
                href="#"
                className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
              >
                Contact
              </a>
            </div>

            <div className="text-gray-600 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} HireAI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
