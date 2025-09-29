"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  FaGoogle,
  FaMicrosoft,
  FaApple,
  FaAmazon,
  FaStripe,
  FaUber,
  FaAirbnb,
  FaSpotify,
} from "react-icons/fa";
import { FaMeta } from "react-icons/fa6";
import { SiOpenai, SiNetflix, SiTesla } from "react-icons/si";

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

export default function JobSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    location: "",
    company: "",
    role: "",
    type: "",
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showJobListings, setShowJobListings] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");

  // Hardcoded job data - Expanded with more companies per role
  const jobListings = [
    // Software Engineer Roles
    {
      id: 1,
      title: "Software Engineer Intern",
      company: "Google",
      location: "Mountain View, CA",
      type: "Internship",
      salary: "₹6,60,000/month",
      logo: <FaGoogle className="text-4xl text-purple-600" />,
      description: `Google Overview:
Google is a multinational technology company that specializes in Internet-related services and products, which include online advertising technologies, a search engine, cloud computing, software, and hardware. Google's mission is to organize the world's information and make it universally accessible and useful.

At Google, we're committed to building products that help create opportunities for everyone, whether down the street or across the globe. From Google Ads to Chrome, Android to YouTube, Social to Local, Google engineers are changing the world one technological achievement after another.

Role & Responsibilities:
As a Software Engineer Intern at Google, you will:
• Design, develop, test, deploy, maintain, and enhance software solutions
• Work on massive, complex distributed systems that serve billions of users
• Collaborate with cross-functional teams including product managers, UX designers, and other engineers
• Participate in design reviews with peers and stakeholders to decide amongst available technologies
• Review code developed by other developers and provide feedback to ensure best practices
• Contribute to engineering excellence through improving engineering standards, tooling, and processes

Technical Competencies:
• Programming fundamentals in one or more languages (Java, C++, Python, JavaScript, Go)
• Experience with algorithms, data structures, and software design
• Understanding of distributed systems and scalability principles
• Knowledge of web technologies, mobile development, or machine learning
• Experience with version control systems and collaborative development

The internship program includes mentorship, professional development opportunities, and the chance to work on real products used by billions of people worldwide. Successful interns often receive full-time offers to join Google's engineering teams.

Requirements:
• Bachelor's or Master's in Computer Science, Engineering, or related technical field
• Proficiency in one or more programming languages (Java, C++, Python, JavaScript, Go)
• Strong foundation in algorithms, data structures, and software design principles
• Experience with version control systems (Git) and collaborative development practices
• Understanding of distributed systems, scalability, and performance optimization
• Knowledge of web technologies, mobile development, or machine learning frameworks
• Strong problem-solving skills and ability to work in a fast-paced environment
• Excellent communication skills and ability to work effectively in cross-functional teams`,
      requirements: [
        "Computer Science or related field",
        "Proficiency in Java, Python, or C++",
        "Strong problem-solving skills",
        "Experience with algorithms and data structures",
      ],
      benefits: [
        "Free meals",
        "Transportation",
        "Housing stipend",
        "Mentorship program",
        "Full-time conversion opportunity",
      ],
      applicationDeadline: "March 15, 2025",
      postedDate: "January 15, 2025",
      applicants: 1247,
      matchScore: 95,
      easyApply: true,
      companyInfo: {
        name: "Google",
        industry: "Technology",
        employees: "100,000+",
        headquarters: "Mountain View, CA",
        founded: "1998",
        website: "google.com",
        description:
          "Google's mission is to organize the world's information and make it universally accessible and useful.",
        culture: ["Innovation", "Collaboration", "Impact", "Diversity"],
        techStack: ["Go", "Java", "Python", "C++", "JavaScript", "TensorFlow"],
      },
    },
    {
      id: 2,
      title: "Software Engineer Intern",
      company: "Meta",
      location: "Menlo Park, CA",
      type: "Internship",
      salary: "₹6,45,000/month",
      logo: <FaMeta className="text-4xl text-purple-600" />,
      description: `Meta Overview:
Meta is a social technology company that enables people to connect, find communities, and grow businesses. When Facebook launched in 2004, it changed the way people connect. Apps like Messenger, Instagram and WhatsApp further empowered billions around the world. Now, Meta is moving beyond 2D screens toward immersive experiences like augmented and virtual reality to help build the next evolution in social technology.

Meta's mission is to give people the power to build community and bring the world closer together. Our global teams are constantly iterating, solving problems, and working together to empower people around the world to build community and connect in meaningful ways.

Role & Responsibilities:
As a Software Engineer Intern at Meta, you will:
• Design and build innovative user-facing features for billions of users
• Work with cross-functional teams including product, design, and data science
• Write well-structured, reliable, efficient, and easily maintainable code
• Build efficient and reusable front-end systems and abstractions
• Optimize components for maximum performance across devices and browsers
• Collaborate with backend engineers to build robust APIs and data models
• Participate in design and code reviews to maintain high development standards

Technical Competencies:
• Strong programming skills in languages such as Python, Java, C++, or JavaScript
• Experience with web development technologies including HTML, CSS, React
• Knowledge of computer science fundamentals including algorithms and data structures
• Understanding of software engineering best practices including testing and debugging
• Experience with version control systems like Git
• Familiarity with mobile development (iOS/Android) is a plus

Professional Development:
• Mentorship from experienced engineers and industry leaders
• Access to cutting-edge technology and infrastructure
• Opportunities to work on products that impact billions of users
• Comprehensive learning and development programs
• Potential for full-time conversion upon successful completion

The internship program at Meta provides hands-on experience with real-world challenges while building the future of social connection and immersive technologies.

Requirements:
• Bachelor's or Master's degree in Computer Science, Engineering, or related field
• Strong programming skills in languages such as Python, Java, C++, or JavaScript
• Experience with web development technologies including HTML, CSS, React, or similar frameworks
• Knowledge of computer science fundamentals including algorithms, data structures, and software design
• Understanding of software engineering best practices including testing, debugging, and code reviews
• Experience with version control systems like Git and collaborative development workflows
• Familiarity with mobile development (iOS/Android) or VR/AR technologies is a plus
• Strong problem-solving abilities and passion for building products that connect people globally`,
      requirements: [
        "CS degree or bootcamp",
        "React/JavaScript experience",
        "System design knowledge",
        "Passion for connecting people",
      ],
      benefits: [
        "Free meals",
        "Gym membership",
        "Mental health support",
        "Learning budget",
        "Stock options",
      ],
      applicationDeadline: "February 28, 2025",
      postedDate: "January 10, 2025",
      applicants: 892,
      matchScore: 92,
      easyApply: true,
      companyInfo: {
        name: "Meta",
        industry: "Social Media",
        employees: "50,000+",
        headquarters: "Menlo Park, CA",
        founded: "2004",
        website: "meta.com",
        description:
          "Meta builds technologies that help people connect, find communities, and grow businesses.",
        culture: ["Move Fast", "Be Bold", "Focus on Impact", "Be Open"],
        techStack: ["React", "PyTorch", "GraphQL", "PHP", "Hack", "Python"],
      },
    },
    {
      id: 3,
      title: "Software Engineer",
      company: "Microsoft",
      location: "Redmond, WA",
      type: "Full-time",
      salary: "₹1,16,00,000/year",
      logo: <FaMicrosoft className="text-4xl text-purple-600" />,
      description:
        "Join Microsoft's mission to empower every person and organization on the planet to achieve more.",
      requirements: [
        "Bachelor's in Computer Science",
        "3+ years experience",
        "C# or .NET knowledge",
        "Cloud computing experience",
      ],
      benefits: [
        "Stock options",
        "Health insurance",
        "Flexible work",
        "Learning resources",
        "Parental leave",
      ],
      applicationDeadline: "Rolling basis",
      postedDate: "January 20, 2025",
      applicants: 543,
      matchScore: 89,
      easyApply: false,
      companyInfo: {
        name: "Microsoft",
        industry: "Technology",
        employees: "200,000+",
        headquarters: "Redmond, WA",
        founded: "1975",
        website: "microsoft.com",
        description:
          "Microsoft's mission is to empower every person and organization on the planet to achieve more.",
        culture: ["Respect", "Integrity", "Accountability", "Inclusive"],
        techStack: ["C#", ".NET", "Azure", "TypeScript", "Python", "React"],
      },
    },
    {
      id: 4,
      title: "Software Engineer",
      company: "Amazon",
      location: "Seattle, WA",
      type: "Full-time",
      salary: "₹1,11,75,000/year",
      logo: <FaAmazon className="text-4xl text-orange-500" />,
      description:
        "Build scalable systems that serve millions of customers at Amazon. Work on challenging distributed systems.",
      requirements: [
        "CS degree",
        "Java/Python proficiency",
        "AWS experience",
        "System design skills",
      ],
      benefits: [
        "Stock grants",
        "Health benefits",
        "Career growth",
        "Employee discounts",
        "Relocation assistance",
      ],
      applicationDeadline: "Rolling basis",
      postedDate: "January 18, 2025",
      applicants: 678,
      matchScore: 87,
      easyApply: true,
      companyInfo: {
        name: "Amazon",
        industry: "E-commerce/Cloud",
        employees: "1,500,000+",
        headquarters: "Seattle, WA",
        founded: "1994",
        website: "amazon.com",
        description:
          "Amazon is guided by four principles: customer obsession, ownership, invent and simplify, and are right, a lot.",
        culture: [
          "Customer Obsession",
          "Ownership",
          "Invent and Simplify",
          "Learn and Be Curious",
        ],
        techStack: ["Java", "Python", "AWS", "DynamoDB", "Lambda", "EC2"],
      },
    },
    {
      id: 5,
      title: "Software Engineer",
      company: "Apple",
      location: "Cupertino, CA",
      type: "Full-time",
      salary: "₹1,20,12,500/year",
      logo: <FaApple className="text-4xl text-gray-800" />,
      description:
        "Create extraordinary products at Apple. Work on software that delights millions of users worldwide.",
      requirements: [
        "Strong CS fundamentals",
        "Swift/Objective-C",
        "iOS development",
        "Attention to detail",
      ],
      benefits: [
        "Employee stock plan",
        "Health benefits",
        "Product discounts",
        "Fitness center",
        "Commuter benefits",
      ],
      applicationDeadline: "Rolling basis",
      postedDate: "January 22, 2025",
      applicants: 756,
      matchScore: 91,
      easyApply: false,
      companyInfo: {
        name: "Apple",
        industry: "Consumer Electronics",
        employees: "150,000+",
        headquarters: "Cupertino, CA",
        founded: "1976",
        website: "apple.com",
        description:
          "Apple designs and creates iPod and iTunes, Mac laptop and desktop computers, OS X, and professional software.",
        culture: ["Think Different", "Simplicity", "Excellence", "Innovation"],
        techStack: ["Swift", "Objective-C", "React", "Python", "C++", "Metal"],
      },
    },
    {
      id: 6,
      title: "Software Engineer",
      company: "Netflix",
      location: "Los Gatos, CA",
      type: "Full-time",
      salary: "₹1,49,00,000/year",
      logo: <SiNetflix className="text-4xl text-red-600" />,
      description: `Netflix Overview:
Netflix is the world's leading streaming entertainment service with over 200 million paid memberships in more than 190 countries enjoying TV series, documentaries and feature films across a wide variety of genres and languages. Members can watch as much as they want, anytime, anywhere, on any internet-connected screen.

Netflix's engineering culture is built on freedom and responsibility, where engineers are empowered to make decisions that drive innovation and scale. We operate one of the largest content delivery networks in the world, serving billions of hours of content each week to our global member base.

Role & Responsibilities:
As a Software Engineer at Netflix, you will:
• Build and maintain highly scalable backend systems that serve content to millions of users
• Design and implement microservices architecture for streaming platform components
• Optimize system performance and reliability for global content distribution
• Collaborate with cross-functional teams including product, data science, and content teams
• Participate in on-call rotations to ensure 24/7 service availability
• Contribute to architectural decisions and technical strategy for streaming infrastructure

Requirements:
• Bachelor's or Master's degree in Computer Science, Engineering, or related field
• 5+ years of experience in backend software development
• Expert-level proficiency in Java, Scala, or similar JVM-based languages
• Deep understanding of microservices architecture and distributed systems
• Experience with cloud platforms (preferably AWS) and containerization technologies
• Knowledge of database systems, caching strategies, and message queuing
• Experience with monitoring, logging, and observability tools
• Strong understanding of system design principles and scalability patterns
• Experience with A/B testing and experimentation frameworks is a plus`,
      requirements: [
        "5+ years backend experience",
        "Java/Scala expertise",
        "Microservices architecture",
        "AWS/Cloud experience",
      ],
      benefits: [
        "Unlimited vacation",
        "Stock options",
        "Health benefits",
        "Free Netflix",
        "Learning budget",
      ],
      applicationDeadline: "Rolling basis",
      postedDate: "February 1, 2025",
      applicants: 445,
      matchScore: 89,
      easyApply: false,
      companyInfo: {
        name: "Netflix",
        industry: "Entertainment",
        employees: "12,000+",
        headquarters: "Los Gatos, CA",
        founded: "1997",
        website: "netflix.com",
        description:
          "Netflix is the world's leading streaming entertainment service with over 200 million paid memberships.",
        culture: [
          "Freedom & Responsibility",
          "High Performance",
          "Inclusion",
          "Innovation",
        ],
        techStack: [
          "Java",
          "Scala",
          "Python",
          "JavaScript",
          "Go",
          "Kubernetes",
        ],
      },
    },
    {
      id: 7,
      title: "Software Engineer",
      company: "Stripe",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "₹1,24,25,000/year",
      logo: <FaStripe className="text-4xl text-purple-600" />,
      description:
        "Build beautiful, intuitive user interfaces for Stripe's payment platform used by millions of businesses worldwide.",
      requirements: [
        "3+ years frontend experience",
        "React/Vue.js expertise",
        "TypeScript proficiency",
        "Design system experience",
      ],
      benefits: [
        "Equity package",
        "Unlimited PTO",
        "Health insurance",
        "Remote work options",
        "Professional development",
      ],
      applicationDeadline: "Rolling basis",
      postedDate: "January 20, 2025",
      applicants: 324,
      matchScore: 82,
      easyApply: false,
      companyInfo: {
        name: "Stripe",
        industry: "Fintech",
        employees: "4,000+",
        headquarters: "San Francisco, CA",
        founded: "2010",
        website: "stripe.com",
        description:
          "Stripe builds economic infrastructure for the internet, helping businesses accept payments and grow revenue.",
        culture: [
          "User First",
          "Operate with Rigor",
          "Think Rigorously",
          "Move with Urgency",
        ],
        techStack: ["Ruby", "JavaScript", "Go", "Scala", "React", "TypeScript"],
      },
    },

    // Data Science Roles
    {
      id: 8,
      title: "Data Science Intern",
      company: "Meta",
      location: "Menlo Park, CA",
      type: "Internship",
      salary: "₹6,20,000/month",
      logo: <FaMeta className="text-4xl text-purple-600" />,
      description:
        "Work with Meta's data science team to analyze user behavior and improve product experiences across Facebook, Instagram, and WhatsApp.",
      requirements: [
        "Statistics, Data Science, or related field",
        "Python and R proficiency",
        "Machine Learning experience",
        "SQL knowledge",
      ],
      benefits: [
        "Free meals",
        "Gym membership",
        "Mental health support",
        "Learning budget",
        "Networking opportunities",
      ],
      applicationDeadline: "February 28, 2025",
      postedDate: "January 10, 2025",
      applicants: 892,
      matchScore: 88,
      easyApply: true,
      companyInfo: {
        name: "Meta",
        industry: "Social Media",
        employees: "50,000+",
        headquarters: "Menlo Park, CA",
        founded: "2004",
        website: "meta.com",
        description:
          "Meta builds technologies that help people connect, find communities, and grow businesses.",
        culture: ["Move Fast", "Be Bold", "Focus on Impact", "Be Open"],
        techStack: ["React", "PyTorch", "GraphQL", "PHP", "Hack", "Python"],
      },
    },
    {
      id: 9,
      title: "Data Scientist",
      company: "Google",
      location: "Mountain View, CA",
      type: "Full-time",
      salary: "₹1,36,62,500/year",
      logo: <FaGoogle className="text-4xl text-purple-600" />,
      description:
        "Apply machine learning and statistical analysis to solve complex problems across Google's products.",
      requirements: [
        "PhD in Data Science/Statistics",
        "Python/R expertise",
        "TensorFlow/PyTorch",
        "Statistical modeling",
      ],
      benefits: [
        "Stock options",
        "Free meals",
        "Health insurance",
        "Learning opportunities",
        "20% time",
      ],
      applicationDeadline: "Rolling basis",
      postedDate: "January 25, 2025",
      applicants: 567,
      matchScore: 94,
      easyApply: true,
      companyInfo: {
        name: "Google",
        industry: "Technology",
        employees: "100,000+",
        headquarters: "Mountain View, CA",
        founded: "1998",
        website: "google.com",
        description:
          "Google's mission is to organize the world's information and make it universally accessible and useful.",
        culture: ["Innovation", "Collaboration", "Impact", "Diversity"],
        techStack: ["Go", "Java", "Python", "C++", "JavaScript", "TensorFlow"],
      },
    },
    {
      id: 10,
      title: "Data Scientist",
      company: "Netflix",
      location: "Los Gatos, CA",
      type: "Full-time",
      salary: "$155,000/year",
      logo: <SiNetflix className="text-4xl text-red-600" />,
      description:
        "Drive data-driven decision making for Netflix's recommendation algorithms and content strategy.",
      requirements: [
        "MS in Data Science",
        "Python/Scala",
        "Spark/Hadoop",
        "A/B testing experience",
      ],
      benefits: [
        "Unlimited PTO",
        "Stock options",
        "Premium health",
        "Free Netflix",
        "Flexible hours",
      ],
      applicationDeadline: "March 1, 2025",
      postedDate: "January 30, 2025",
      applicants: 445,
      matchScore: 90,
      easyApply: false,
      companyInfo: {
        name: "Netflix",
        industry: "Entertainment",
        employees: "12,000+",
        headquarters: "Los Gatos, CA",
        founded: "1997",
        website: "netflix.com",
        description:
          "Netflix is the world's leading streaming entertainment service with over 200 million paid memberships.",
        culture: [
          "Freedom & Responsibility",
          "High Performance",
          "Inclusion",
          "Innovation",
        ],
        techStack: [
          "Java",
          "Scala",
          "Python",
          "JavaScript",
          "Go",
          "Kubernetes",
        ],
      },
    },
    {
      id: 11,
      title: "Data Scientist",
      company: "Uber",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "₹1,22,64,000/year",
      logo: <FaUber className="text-4xl text-black" />,
      description:
        "Optimize Uber's marketplace algorithms and improve rider/driver experiences through data insights.",
      requirements: [
        "Advanced degree in quantitative field",
        "Python/SQL",
        "Machine learning",
        "Business acumen",
      ],
      benefits: [
        "Equity",
        "Health benefits",
        "Uber credits",
        "Flexible work",
        "Learning budget",
      ],
      applicationDeadline: "Rolling basis",
      postedDate: "February 5, 2025",
      applicants: 389,
      matchScore: 86,
      easyApply: true,
      companyInfo: {
        name: "Uber",
        industry: "Transportation",
        employees: "25,000+",
        headquarters: "San Francisco, CA",
        founded: "2009",
        website: "uber.com",
        description:
          "Uber's mission is to create opportunity through movement by connecting people and communities.",
        culture: [
          "We Build Globally",
          "We Act Like Owners",
          "We Do The Right Thing",
          "We Persevere",
        ],
        techStack: ["Go", "Python", "Java", "React", "PostgreSQL", "Redis"],
      },
    },
    {
      id: 12,
      title: "Data Scientist",
      company: "Airbnb",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "₹1,25,76,000/year",
      logo: <FaAirbnb className="text-4xl text-red-500" />,
      description:
        "Shape Airbnb's product decisions through data analysis and machine learning models.",
      requirements: [
        "MS/PhD in related field",
        "Python/R",
        "Experimentation",
        "Communication skills",
      ],
      benefits: [
        "Annual travel credit",
        "Equity",
        "Health benefits",
        "Remote work",
        "Sabbatical program",
      ],
      applicationDeadline: "February 20, 2025",
      postedDate: "January 28, 2025",
      applicants: 423,
      matchScore: 88,
      easyApply: false,
      companyInfo: {
        name: "Airbnb",
        industry: "Travel/Hospitality",
        employees: "6,000+",
        headquarters: "San Francisco, CA",
        founded: "2008",
        website: "airbnb.com",
        description:
          "Airbnb's mission is to help create a world where you can belong anywhere.",
        culture: [
          "Belong Anywhere",
          "Champion the Mission",
          "Be a Host",
          "Embrace the Adventure",
        ],
        techStack: ["Ruby", "React", "Python", "Kafka", "Druid", "Airflow"],
      },
    },
    {
      id: 13,
      title: "Data Scientist",
      company: "Spotify",
      location: "New York, NY",
      type: "Full-time",
      salary: "₹1,20,12,500/year",
      logo: <FaSpotify className="text-4xl text-green-500" />,
      description:
        "Enhance music discovery and user engagement through advanced analytics and machine learning.",
      requirements: [
        "Quantitative degree",
        "Python/Scala",
        "ML frameworks",
        "Music industry interest",
      ],
      benefits: [
        "Spotify Premium",
        "Flexible hours",
        "Health benefits",
        "Learning budget",
        "Concert tickets",
      ],
      applicationDeadline: "March 15, 2025",
      postedDate: "February 3, 2025",
      applicants: 356,
      matchScore: 85,
      easyApply: true,
      companyInfo: {
        name: "Spotify",
        industry: "Music/Entertainment",
        employees: "9,000+",
        headquarters: "Stockholm, Sweden",
        founded: "2006",
        website: "spotify.com",
        description:
          "Spotify's mission is to unlock the potential of human creativity by giving millions access to music.",
        culture: [
          "Play to Win",
          "Be Yourself",
          "Grow Together",
          "Do It Together",
        ],
        techStack: ["Python", "Java", "Scala", "React", "PostgreSQL", "Kafka"],
      },
    },

    // Product Manager Roles
    {
      id: 14,
      title: "Product Manager Intern",
      company: "Microsoft",
      location: "Redmond, WA",
      type: "Internship",
      salary: "₹5,80,000/month",
      logo: <FaMicrosoft className="text-4xl text-purple-600" />,
      description:
        "Drive product strategy and roadmap for Microsoft's cloud services, working closely with engineering and design teams.",
      requirements: [
        "MBA or related field",
        "Product management experience",
        "Analytical skills",
        "Technical background preferred",
      ],
      benefits: [
        "Housing stipend",
        "Relocation assistance",
        "Mentorship",
        "Full-time conversion",
        "Stock options",
      ],
      applicationDeadline: "March 30, 2025",
      postedDate: "January 25, 2025",
      applicants: 567,
      matchScore: 91,
      easyApply: true,
      companyInfo: {
        name: "Microsoft",
        industry: "Technology",
        employees: "200,000+",
        headquarters: "Redmond, WA",
        founded: "1975",
        website: "microsoft.com",
        description:
          "Microsoft's mission is to empower every person and organization on the planet to achieve more.",
        culture: ["Respect", "Integrity", "Accountability", "Inclusive"],
        techStack: ["C#", ".NET", "Azure", "TypeScript", "Python", "React"],
      },
    },
    {
      id: 15,
      title: "Product Manager",
      company: "Amazon",
      location: "Seattle, WA",
      type: "Full-time",
      salary: "$155,000/year",
      logo: <FaAmazon className="text-4xl text-orange-500" />,
      description:
        "Lead product development for Amazon's e-commerce platform, driving innovation in customer experience.",
      requirements: [
        "5+ years PM experience",
        "Technical background",
        "Customer obsession",
        "Data-driven mindset",
      ],
      benefits: [
        "Stock grants",
        "Health benefits",
        "Career growth",
        "Employee discounts",
        "Flexible work",
      ],
      applicationDeadline: "Rolling basis",
      postedDate: "February 1, 2025",
      applicants: 445,
      matchScore: 89,
      easyApply: false,
      companyInfo: {
        name: "Amazon",
        industry: "E-commerce/Cloud",
        employees: "1,500,000+",
        headquarters: "Seattle, WA",
        founded: "1994",
        website: "amazon.com",
        description:
          "Amazon is guided by four principles: customer obsession, ownership, invent and simplify, and are right, a lot.",
        culture: [
          "Customer Obsession",
          "Ownership",
          "Invent and Simplify",
          "Learn and Be Curious",
        ],
        techStack: ["Java", "Python", "AWS", "DynamoDB", "Lambda", "EC2"],
      },
    },
    {
      id: 16,
      title: "Product Manager",
      company: "Google",
      location: "Mountain View, CA",
      type: "Full-time",
      salary: "$170,000/year",
      logo: "🔍",
      description:
        "Shape the future of Google's consumer products, working on features used by billions of people.",
      requirements: [
        "Technical PM experience",
        "CS background preferred",
        "Leadership skills",
        "User empathy",
      ],
      benefits: [
        "Stock options",
        "Free meals",
        "Health insurance",
        "Learning opportunities",
        "Flexible hours",
      ],
      applicationDeadline: "Rolling basis",
      postedDate: "January 30, 2025",
      applicants: 678,
      matchScore: 93,
      easyApply: true,
      companyInfo: {
        name: "Google",
        industry: "Technology",
        employees: "100,000+",
        headquarters: "Mountain View, CA",
        founded: "1998",
        website: "google.com",
        description:
          "Google's mission is to organize the world's information and make it universally accessible and useful.",
        culture: ["Innovation", "Collaboration", "Impact", "Diversity"],
        techStack: ["Go", "Java", "Python", "C++", "JavaScript", "TensorFlow"],
      },
    },
    {
      id: 17,
      title: "Product Manager",
      company: "Meta",
      location: "Menlo Park, CA",
      type: "Full-time",
      salary: "$165,000/year",
      logo: "📘",
      description:
        "Drive product strategy for Meta's family of apps, focusing on connecting people worldwide.",
      requirements: [
        "Product strategy experience",
        "Data analysis",
        "Cross-functional leadership",
        "User research",
      ],
      benefits: [
        "RSUs",
        "Free meals",
        "Mental health support",
        "Parental leave",
        "Learning stipend",
      ],
      applicationDeadline: "March 1, 2025",
      postedDate: "February 5, 2025",
      applicants: 523,
      matchScore: 90,
      easyApply: false,
      companyInfo: {
        name: "Meta",
        industry: "Social Media",
        employees: "50,000+",
        headquarters: "Menlo Park, CA",
        founded: "2004",
        website: "meta.com",
        description:
          "Meta builds technologies that help people connect, find communities, and grow businesses.",
        culture: ["Move Fast", "Be Bold", "Focus on Impact", "Be Open"],
        techStack: ["React", "PyTorch", "GraphQL", "PHP", "Hack", "Python"],
      },
    },

    // UX Design Roles
    {
      id: 18,
      title: "UX Design Intern",
      company: "Apple",
      location: "Cupertino, CA",
      type: "Internship",
      salary: "₹5,37,500/month",
      logo: <FaApple className="text-4xl text-gray-800" />,
      description:
        "Design intuitive user experiences for Apple's next-generation products, from iOS apps to new hardware interfaces.",
      requirements: [
        "Design portfolio",
        "Figma/Sketch proficiency",
        "User research experience",
        "Prototyping skills",
      ],
      benefits: [
        "Product discounts",
        "Free lunch",
        "Fitness center",
        "Employee store access",
        "Mentorship",
      ],
      applicationDeadline: "February 15, 2025",
      postedDate: "January 5, 2025",
      applicants: 756,
      matchScore: 87,
      easyApply: true,
      companyInfo: {
        name: "Apple",
        industry: "Consumer Electronics",
        employees: "150,000+",
        headquarters: "Cupertino, CA",
        founded: "1976",
        website: "apple.com",
        description:
          "Apple designs and creates iPod and iTunes, Mac laptop and desktop computers, OS X, and professional software.",
        culture: ["Think Different", "Simplicity", "Excellence", "Innovation"],
        techStack: ["Swift", "Objective-C", "React", "Python", "C++", "Metal"],
      },
    },
    {
      id: 19,
      title: "UX Designer",
      company: "Airbnb",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "₹1,03,50,000/year",
      logo: "AB",
      description:
        "Create delightful user experiences for Airbnb's global community of hosts and guests.",
      requirements: [
        "5+ years UX experience",
        "Design systems",
        "User research",
        "Prototyping",
      ],
      benefits: [
        "Annual travel credit",
        "Health benefits",
        "Design conferences",
        "Flexible work",
        "Equity",
      ],
      applicationDeadline: "March 10, 2025",
      postedDate: "February 2, 2025",
      applicants: 434,
      matchScore: 85,
      easyApply: false,
      companyInfo: {
        name: "Airbnb",
        industry: "Travel/Hospitality",
        employees: "6,000+",
        headquarters: "San Francisco, CA",
        founded: "2008",
        website: "airbnb.com",
        description:
          "Airbnb's mission is to help create a world where you can belong anywhere.",
        culture: [
          "Belong Anywhere",
          "Champion the Mission",
          "Be a Host",
          "Embrace the Adventure",
        ],
        techStack: ["Ruby", "React", "Python", "Kafka", "Druid", "Airflow"],
      },
    },
    {
      id: 20,
      title: "UX Designer",
      company: "Spotify",
      location: "New York, NY",
      type: "Full-time",
      salary: "$120,000/year",
      logo: "🎵",
      description:
        "Design music experiences that connect artists and listeners through innovative interfaces.",
      requirements: [
        "UX/UI design experience",
        "Music industry knowledge",
        "Prototyping tools",
        "User empathy",
      ],
      benefits: [
        "Spotify Premium",
        "Concert tickets",
        "Health benefits",
        "Creative time",
        "Learning budget",
      ],
      applicationDeadline: "Rolling basis",
      postedDate: "January 28, 2025",
      applicants: 367,
      matchScore: 82,
      easyApply: true,
      companyInfo: {
        name: "Spotify",
        industry: "Music/Entertainment",
        employees: "9,000+",
        headquarters: "Stockholm, Sweden",
        founded: "2006",
        website: "spotify.com",
        description:
          "Spotify's mission is to unlock the potential of human creativity by giving millions access to music.",
        culture: [
          "Play to Win",
          "Be Yourself",
          "Grow Together",
          "Do It Together",
        ],
        techStack: ["Python", "Java", "Scala", "React", "PostgreSQL", "Kafka"],
      },
    },

    // Machine Learning / AI Roles
    {
      id: 21,
      title: "Machine Learning Engineer",
      company: "OpenAI",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "₹1,66,00,000/year",
      logo: <SiOpenai className="text-4xl text-green-600" />,
      description:
        "Develop and deploy state-of-the-art AI models that push the boundaries of artificial intelligence.",
      requirements: [
        "PhD in ML/AI or equivalent",
        "Deep learning expertise",
        "Python/PyTorch",
        "Research publications preferred",
      ],
      benefits: [
        "Equity",
        "Health insurance",
        "Unlimited PTO",
        "GPU credits",
        "Conference budget",
      ],
      applicationDeadline: "Rolling basis",
      postedDate: "January 30, 2025",
      applicants: 189,
      matchScore: 94,
      easyApply: false,
      companyInfo: {
        name: "OpenAI",
        industry: "Artificial Intelligence",
        employees: "1,000+",
        headquarters: "San Francisco, CA",
        founded: "2015",
        website: "openai.com",
        description:
          "OpenAI's mission is to ensure that artificial general intelligence benefits all of humanity.",
        culture: [
          "Safety First",
          "Broad Benefit",
          "Cooperative",
          "Long-term Safety",
        ],
        techStack: [
          "Python",
          "PyTorch",
          "TensorFlow",
          "Kubernetes",
          "React",
          "TypeScript",
        ],
      },
    },
    {
      id: 22,
      title: "ML Engineer",
      company: "Tesla",
      location: "Austin, TX",
      type: "Full-time",
      salary: "₹1,44,87,500/year",
      logo: <SiTesla className="text-4xl text-red-600" />,
      description:
        "Build autonomous driving systems and energy optimization algorithms for Tesla's vehicle and energy products.",
      requirements: [
        "ML/AI expertise",
        "Computer vision",
        "Python/C++",
        "Autonomous systems",
      ],
      benefits: [
        "Stock purchase plan",
        "Health insurance",
        "Vehicle discount",
        "Gym membership",
        "Innovation time",
      ],
      applicationDeadline: "March 10, 2025",
      postedDate: "January 28, 2025",
      applicants: 267,
      matchScore: 91,
      easyApply: true,
      companyInfo: {
        name: "Tesla",
        industry: "Automotive/Energy",
        employees: "100,000+",
        headquarters: "Austin, TX",
        founded: "2003",
        website: "tesla.com",
        description:
          "Tesla's mission is to accelerate the world's transition to sustainable energy.",
        culture: ["Innovation", "Excellence", "Sustainability", "Speed"],
        techStack: [
          "Python",
          "C++",
          "JavaScript",
          "Linux",
          "Docker",
          "Kubernetes",
        ],
      },
    },
    {
      id: 4,
      title: "Product Manager Intern",
      company: "Microsoft",
      location: "Redmond, WA",
      type: "Internship",
      salary: "$7,000/month",
      logo: "MS",
      description:
        "Drive product strategy and roadmap for Microsoft's cloud services, working closely with engineering and design teams.",
      requirements: [
        "MBA or related field",
        "Product management experience",
        "Analytical skills",
        "Technical background preferred",
      ],
      benefits: [
        "Housing stipend",
        "Relocation assistance",
        "Mentorship",
        "Full-time conversion",
        "Stock options",
      ],
      applicationDeadline: "March 30, 2025",
      postedDate: "January 25, 2025",
      applicants: 567,
      matchScore: 91,
      easyApply: true,
      companyInfo: {
        name: "Microsoft",
        industry: "Technology",
        employees: "200,000+",
        headquarters: "Redmond, WA",
        founded: "1975",
        website: "microsoft.com",
        description:
          "Microsoft's mission is to empower every person and organization on the planet to achieve more.",
        culture: ["Respect", "Integrity", "Accountability", "Inclusive"],
        techStack: ["C#", ".NET", "Azure", "TypeScript", "Python", "React"],
      },
    },
    {
      id: 5,
      title: "Machine Learning Engineer",
      company: "OpenAI",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$200,000/year",
      logo: "🤖",
      description:
        "Develop and deploy state-of-the-art AI models that push the boundaries of artificial intelligence.",
      requirements: [
        "PhD in ML/AI or equivalent",
        "Deep learning expertise",
        "Python/PyTorch",
        "Research publications preferred",
      ],
      benefits: [
        "Equity",
        "Health insurance",
        "Unlimited PTO",
        "GPU credits",
        "Conference budget",
      ],
      applicationDeadline: "Rolling basis",
      postedDate: "January 30, 2025",
      applicants: 189,
      matchScore: 94,
      easyApply: false,
      companyInfo: {
        name: "OpenAI",
        industry: "Artificial Intelligence",
        employees: "1,000+",
        headquarters: "San Francisco, CA",
        founded: "2015",
        website: "openai.com",
        description:
          "OpenAI's mission is to ensure that artificial general intelligence benefits all of humanity.",
        culture: [
          "Safety First",
          "Broad Benefit",
          "Cooperative",
          "Long-term Safety",
        ],
        techStack: [
          "Python",
          "PyTorch",
          "TensorFlow",
          "Kubernetes",
          "React",
          "TypeScript",
        ],
      },
    },
    {
      id: 6,
      title: "UX Design Intern",
      company: "Apple",
      location: "Cupertino, CA",
      type: "Internship",
      salary: "$6,500/month",
      logo: <FaApple className="text-4xl text-gray-800" />,
      description:
        "Design intuitive user experiences for Apple's next-generation products, from iOS apps to new hardware interfaces.",
      requirements: [
        "Design portfolio",
        "Figma/Sketch proficiency",
        "User research experience",
        "Prototyping skills",
      ],
      benefits: [
        "Product discounts",
        "Free lunch",
        "Fitness center",
        "Employee store access",
        "Mentorship",
      ],
      applicationDeadline: "February 15, 2025",
      postedDate: "January 5, 2025",
      applicants: 756,
      matchScore: 87,
      easyApply: true,
      companyInfo: {
        name: "Apple",
        industry: "Consumer Electronics",
        employees: "150,000+",
        headquarters: "Cupertino, CA",
        founded: "1976",
        website: "apple.com",
        description:
          "Apple designs and creates iPod and iTunes, Mac laptop and desktop computers, OS X, and professional software.",
        culture: ["Think Different", "Simplicity", "Excellence", "Innovation"],
        techStack: ["Swift", "Objective-C", "React", "Python", "C++", "Metal"],
      },
    },
    {
      id: 7,
      title: "Backend Engineer",
      company: "Netflix",
      location: "Los Gatos, CA",
      type: "Full-time",
      salary: "$180,000/year",
      logo: "🎬",
      description:
        "Build scalable backend systems that serve content to 200+ million subscribers worldwide.",
      requirements: [
        "5+ years backend experience",
        "Java/Scala expertise",
        "Microservices architecture",
        "AWS/Cloud experience",
      ],
      benefits: [
        "Unlimited vacation",
        "Stock options",
        "Health benefits",
        "Free Netflix",
        "Learning budget",
      ],
      applicationDeadline: "Rolling basis",
      postedDate: "February 1, 2025",
      applicants: 445,
      matchScore: 89,
      easyApply: false,
      companyInfo: {
        name: "Netflix",
        industry: "Entertainment",
        employees: "12,000+",
        headquarters: "Los Gatos, CA",
        founded: "1997",
        website: "netflix.com",
        description:
          "Netflix is the world's leading streaming entertainment service with over 200 million paid memberships.",
        culture: [
          "Freedom & Responsibility",
          "High Performance",
          "Inclusion",
          "Innovation",
        ],
        techStack: [
          "Java",
          "Scala",
          "Python",
          "JavaScript",
          "Go",
          "Kubernetes",
        ],
      },
    },
    {
      id: 8,
      title: "Cybersecurity Analyst",
      company: "Tesla",
      location: "Austin, TX",
      type: "Full-time",
      salary: "₹1,03,50,000/year",
      logo: <SiTesla className="text-4xl text-red-600" />,
      description:
        "Protect Tesla's autonomous vehicle systems and energy infrastructure from cyber threats.",
      requirements: [
        "Cybersecurity degree or certification",
        "Network security experience",
        "Incident response skills",
        "Python scripting",
      ],
      benefits: [
        "Stock purchase plan",
        "Health insurance",
        "Gym membership",
        "Employee vehicle discount",
        "401k matching",
      ],
      applicationDeadline: "March 10, 2025",
      postedDate: "January 28, 2025",
      applicants: 267,
      matchScore: 85,
      easyApply: true,
      companyInfo: {
        name: "Tesla",
        industry: "Automotive/Energy",
        employees: "100,000+",
        headquarters: "Austin, TX",
        founded: "2003",
        website: "tesla.com",
        description:
          "Tesla's mission is to accelerate the world's transition to sustainable energy.",
        culture: ["Innovation", "Excellence", "Sustainability", "Speed"],
        techStack: [
          "Python",
          "C++",
          "JavaScript",
          "Linux",
          "Docker",
          "Kubernetes",
        ],
      },
    },
  ];

  const filteredJobs = jobListings.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation =
      !selectedFilters.location ||
      job.location.includes(selectedFilters.location);
    const matchesCompany =
      !selectedFilters.company || job.company === selectedFilters.company;
    const matchesRole =
      !selectedFilters.role ||
      job.title.toLowerCase().includes(selectedFilters.role.toLowerCase());
    const matchesType =
      !selectedFilters.type || job.type === selectedFilters.type;

    return (
      matchesSearch &&
      matchesLocation &&
      matchesCompany &&
      matchesRole &&
      matchesType
    );
  });

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const handleApply = (job, isEasyApply) => {
    if (isEasyApply) {
      alert(`Easy Apply submitted for ${job.title} at ${job.company}! 🎉`);
    } else {
      alert(`Redirecting to ${job.company}'s career page...`);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setShowJobListings(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Show initial search interface
  if (!showJobListings) {
    return (
      <div className="min-h-screen bg-transparent overscroll-none overflow-x-hidden">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="text-6xl font-bold text-purple-700 mb-4">
                Disha AI
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Find Your Dream Job
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Search through thousands of opportunities from top companies
                worldwide
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8">
              <div className="flex items-center rounded-md border border-gray-300 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 bg-white shadow-sm">
                <div className="pl-4 text-gray-400">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search for jobs, companies, or roles... (e.g., 'Software Engineer', 'Data Scientist', 'Google')"
                  className="flex-1 px-4 py-3 text-lg outline-none rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button
                  onClick={handleSearch}
                  className="bg-purple-600 text-white px-6 py-5 rounded-md font-semibold hover:bg-purple-700 transition-all duration-200 mr-2"
                >
                  Search Jobs
                </Button>
              </div>
            </div>

            {/* Quick Search Suggestions */}
            <div className="text-center">
              <p className="text-gray-600 mb-4">Popular searches:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  "Software Engineer",
                  "Data Scientist",
                  "Product Manager",
                  "UX Designer",
                  "Machine Learning",
                  "Google",
                  "Meta",
                  "Apple",
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      setShowJobListings(true);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-700">500+</div>
                <div className="text-gray-600">Job Openings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-700">50+</div>
                <div className="text-gray-600">Top Companies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-700">95%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 overscroll-none overflow-x-hidden">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowJobListings(false)}
                className="text-3xl font-bold text-purple-700 hover:text-purple-800 transition-colors"
              >
                HireAI
              </button>
              <div className="text-sm text-gray-600">Find your dream job</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">Welcome, Student!</div>
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                S
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!showJobDetails ? (
          <>
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Search jobs, companies, locations..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-colors text-gray-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 focus:outline-none transition-colors"
                  value={selectedFilters.location}
                  onChange={(e) =>
                    setSelectedFilters({
                      ...selectedFilters,
                      location: e.target.value,
                    })
                  }
                >
                  <option value="">All Locations</option>
                  <option value="CA">California</option>
                  <option value="WA">Washington</option>
                  <option value="TX">Texas</option>
                  <option value="NY">New York</option>
                </select>
                <select
                  className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 focus:outline-none transition-colors"
                  value={selectedFilters.company}
                  onChange={(e) =>
                    setSelectedFilters({
                      ...selectedFilters,
                      company: e.target.value,
                    })
                  }
                >
                  <option value="">All Companies</option>
                  <option value="Google">Google</option>
                  <option value="Meta">Meta</option>
                  <option value="Apple">Apple</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="Netflix">Netflix</option>
                  <option value="Tesla">Tesla</option>
                  <option value="OpenAI">OpenAI</option>
                  <option value="Stripe">Stripe</option>
                </select>
                <select
                  className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 focus:outline-none transition-colors"
                  value={selectedFilters.role}
                  onChange={(e) =>
                    setSelectedFilters({
                      ...selectedFilters,
                      role: e.target.value,
                    })
                  }
                >
                  <option value="">All Roles</option>
                  <option value="Engineer">Engineer</option>
                  <option value="Data">Data Science</option>
                  <option value="Product">Product</option>
                  <option value="Design">Design</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                </select>
                <select
                  className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 focus:outline-none transition-colors"
                  value={selectedFilters.type}
                  onChange={(e) =>
                    setSelectedFilters({
                      ...selectedFilters,
                      type: e.target.value,
                    })
                  }
                >
                  <option value="">All Types</option>
                  <option value="Internship">Internship</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                </select>
              </div>
            </div>

            {/* Job Results */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {filteredJobs.length} Job Opportunities Found
              </h2>
              <p className="text-gray-600">
                Perfect matches for your career journey
              </p>
            </div>

            {/* Job Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => handleJobClick(job)}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 hover:border-purple-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-4xl flex items-center justify-center w-12 h-12">
                          {job.logo}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">
                            {job.company}
                          </h3>
                          <div className="text-sm text-gray-500">
                            {job.location}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            job.type === "Internship"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {job.type}
                        </div>
                        <div className="text-green-600 font-bold text-sm">
                          {job.matchScore}% Match
                        </div>
                      </div>
                    </div>

                    <h4 className="font-bold text-xl text-gray-900 mb-2">
                      {job.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {job.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-lg font-bold text-green-600">
                        {job.salary}
                      </div>
                      <div className="text-sm text-gray-500">
                        {job.applicants} applicants
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {job.easyApply && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApply(job, true);
                          }}
                          className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-purple-700 transition-all duration-200 text-sm"
                        >
                          Easy Apply
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApply(job, false);
                        }}
                        className="flex-1 border-2 border-purple-600 text-purple-600 py-2 px-4 rounded-md font-semibold hover:bg-purple-600 hover:text-white transition-all duration-200 text-sm"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Job Detail View */
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="bg-purple-600 text-white p-8">
              <button
                onClick={() => setShowJobDetails(false)}
                className="mb-4 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-md transition-colors"
              >
                ← Back to Jobs
              </button>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-6">
                  <div className="text-6xl bg-white/20 p-4 rounded-lg">
                    {selectedJob.logo}
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold mb-2">
                      {selectedJob.title}
                    </h1>
                    <h2 className="text-2xl mb-2">
                      {selectedJob.companyInfo.name}
                    </h2>
                    <div className="flex items-center space-x-4 text-lg">
                      <span>{selectedJob.location}</span>
                      <span>{selectedJob.salary}</span>
                      <span className="bg-white/20 px-3 py-1 rounded-full">
                        {selectedJob.type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold mb-2">
                    {selectedJob.matchScore}%
                  </div>
                  <div className="text-lg">Match Score</div>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                {selectedJob.easyApply && (
                  <button
                    onClick={() => handleApply(selectedJob, true)}
                    className="bg-white text-purple-600 px-8 py-3 rounded-md font-bold hover:bg-gray-100 transition-colors"
                  >
                    Easy Apply
                  </button>
                )}
                <button
                  onClick={() => handleApply(selectedJob, false)}
                  className="border-2 border-white text-white px-8 py-3 rounded-md font-bold hover:bg-white hover:text-purple-600 transition-colors"
                >
                  Apply on Company Site
                </button>
                <button className="border-2 border-white text-white px-6 py-3 rounded-md font-bold hover:bg-white hover:text-purple-600 transition-colors">
                  Save Job
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex space-x-8 px-8">
                {[
                  { id: "summary", label: "Job Details" },
                  { id: "company", label: "Company" },
                  { id: "requirements", label: "Requirements" },
                  { id: "benefits", label: "Benefits" },
                  { id: "apply", label: "How to Apply" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-semibold transition-colors ${
                      activeTab === tab.id
                        ? "border-purple-500 text-purple-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === "summary" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">
                      Job Description
                    </h3>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {selectedJob.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-purple-50 p-6 rounded-xl">
                      <h4 className="font-bold text-lg mb-2 text-purple-800">
                        📅 Posted
                      </h4>
                      <p className="text-gray-700">{selectedJob.postedDate}</p>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-xl">
                      <h4 className="font-bold text-lg mb-2 text-purple-800">
                        ⏰ Deadline
                      </h4>
                      <p className="text-gray-700">
                        {selectedJob.applicationDeadline}
                      </p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-xl">
                      <h4 className="font-bold text-lg mb-2 text-green-800">
                        👥 Applicants
                      </h4>
                      <p className="text-gray-700">
                        {selectedJob.applicants} candidates
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "company" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-4 text-gray-800">
                        About {selectedJob.companyInfo.name}
                      </h3>
                      <p className="text-gray-700 mb-6 leading-relaxed">
                        {selectedJob.companyInfo.description}
                      </p>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-semibold">Industry:</span>
                          <span>{selectedJob.companyInfo.industry}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">Employees:</span>
                          <span>{selectedJob.companyInfo.employees}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">Founded:</span>
                          <span>{selectedJob.companyInfo.founded}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">Website:</span>
                          <span className="text-purple-600">
                            {selectedJob.companyInfo.website}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl font-bold mb-4 text-gray-800">
                        Company Culture
                      </h4>
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {selectedJob.companyInfo.culture.map((value, index) => (
                          <div
                            key={index}
                            className="bg-purple-100 text-purple-800 px-3 py-2 rounded-lg text-center font-semibold"
                          >
                            {value}
                          </div>
                        ))}
                      </div>

                      <h4 className="text-xl font-bold mb-4 text-gray-800">
                        Tech Stack
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.companyInfo.techStack.map(
                          (tech, index) => (
                            <span
                              key={index}
                              className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold"
                            >
                              {tech}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "requirements" && (
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-gray-800">
                    What We're Looking For
                  </h3>
                  <div className="space-y-3">
                    {selectedJob.requirements.map((req, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="text-green-500 text-xl">•</div>
                        <span className="text-gray-700 text-lg">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "benefits" && (
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-gray-800">
                    What We Offer
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedJob.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-purple-50 rounded-xl"
                      >
                        <div className="text-purple-500 text-xl">•</div>
                        <span className="text-gray-700 text-lg font-semibold">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "apply" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">
                      Ready to Apply? 🚀
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedJob.easyApply && (
                        <div className="bg-gradient-to-br from-purple-50 to-purple-50 p-6 rounded-2xl border-2 border-purple-200">
                          <h4 className="text-xl font-bold mb-3 text-purple-800">
                            ⚡ Easy Apply
                          </h4>
                          <p className="text-gray-700 mb-4">
                            Apply with your saved profile in seconds!
                          </p>
                          <ul className="text-sm text-gray-600 mb-6 space-y-1">
                            <li>• Auto-filled application</li>
                            <li>• Instant submission</li>
                            <li>• Fast response time</li>
                          </ul>
                          <button
                            onClick={() => handleApply(selectedJob, true)}
                            className="w-full bg-gradient-to-r from-purple-500 to-purple-500 text-white py-3 px-6 rounded-xl font-bold hover:from-purple-600 hover:to-purple-600 transition-all duration-200"
                          >
                            Apply Now with Easy Apply
                          </button>
                        </div>
                      )}

                      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-2xl border-2 border-purple-200">
                        <h4 className="text-xl font-bold mb-3 text-purple-800">
                          🔗 Company Website
                        </h4>
                        <p className="text-gray-700 mb-4">
                          Apply directly through {selectedJob.company}'s career
                          page
                        </p>
                        <ul className="text-sm text-gray-600 mb-6 space-y-1">
                          <li>• Full application control</li>
                          <li>• Additional company info</li>
                          <li>• Direct HR contact</li>
                        </ul>
                        <button
                          onClick={() => handleApply(selectedJob, false)}
                          className="w-full border-2 border-purple-500 text-purple-600 py-3 px-6 rounded-xl font-bold hover:bg-purple-500 hover:text-white transition-all duration-200"
                        >
                          Visit Company Site
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-2xl">
                    <h4 className="text-lg font-bold mb-3 text-yellow-800">
                      Application Tips
                    </h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>
                        • Tailor your resume to highlight relevant skills and
                        experience
                      </li>
                      <li>
                        • Write a compelling cover letter that shows your
                        passion for the role
                      </li>
                      <li>
                        • Research the company culture and values before
                        applying
                      </li>
                      <li>
                        • Follow up politely if you don't hear back within 2
                        weeks
                      </li>
                      <li>
                        • Prepare for potential technical interviews or coding
                        challenges
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
