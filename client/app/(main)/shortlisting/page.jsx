"use client";
import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import { Download, Github, Linkedin, NotepadText } from "lucide-react";

const Page = () => {
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [allCandidates, setAllCandidates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    role: "",
    organization: "",
    location: "",
    education: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Initialize data
  useEffect(() => {
    // Your existing candidates data
    setAllCandidates([
      {
        id: 1,
        name: "Mohit Agarwal",
        title: "Software Development Engineer 3 at Amazon",
        location: "Pune, Maharashtra, India",
        education:
          "Bachelor of Technology, Computer Science at Orissa Engineering College, Bhubaneswar",
        experience: "over 5 years of experience in the IT industry",
        description:
          "Mohit Agarwal has over 5 years of experience in the IT industry and has worked extensively with NodeJS, Express, and JavaScript technologies.",
        skills: ["NodeJS", "Express", "JavaScript", "React", "AWS"],
        linkedin: "https://linkedin.com/in/mohitagarwal",
        github: "https://github.com/mohitagarwal",
        twitter: null,
        website: "https://mohitagarwal.dev",
        email: "mohit@example.com",
        phone: "+91 98765 43210",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        rating: 4.8,
        availability: "Available in 2 weeks",
      },
      {
        id: 2,
        name: "Chandan Mistry",
        title: "Senior Software Engineer at Digital Aptech PVT. LTD.",
        location: "Kolkata, West Bengal, India",
        education: "Masters, Computer Application at University of Technology",
        experience: "Senior Software Engineer with over 5 years of experience",
        description:
          "Chandan Mistry is a Senior Software Engineer with over 5 years of experience in IT, proficient in Node.js (Express.js) and has been developing full-stack applications using technologies like Angular, Vue.js, and Laravel.",
        skills: ["Node.js", "Express.js", "Angular", "Vue.js", "Laravel"],
        linkedin: "https://linkedin.com/in/chandanmistry",
        github: "https://github.com/chandanmistry",
        twitter: "https://twitter.com/chandanmistry",
        website: null,
        email: "chandan@example.com",
        phone: "+91 98765 43211",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        rating: 4.9,
        availability: "Immediately available",
      },
      {
        id: 3,
        name: "Dharamdeo Choudhary",
        title: "Senior Software Engineer at Netsmartz",
        location: "Chandigarh, Chandigarh, India",
        education: "Masters Sikkim Manipal University - Distance Education",
        experience:
          "over 10 years of industry experience in Full Stack Development",
        description:
          "Dharamdeo Choudhary has over 10 years of industry experience in Full Stack Development and is an expert in node.js, with a strong background in Angular and React. He has consistently taken on multiple projects from beginning to completion and has a proven track record of working under pressure deadlines.",
        skills: ["Node.js", "Angular", "React", "Full Stack", "JavaScript"],
        linkedin: "https://linkedin.com/in/dharamdeochoudhary",
        github: "https://github.com/dharamdeo",
        twitter: null,
        website: "https://dharamdeo.dev",
        email: "dharamdeo@example.com",
        phone: "+91 98765 43212",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        rating: 4.7,
        availability: "Available in 1 month",
      },
      {
        id: 4,
        name: "Husain Bharaj",
        title: "Senior Software Engineer at Synechron",
        location: "Lucknow, Uttar Pradesh, India",
        education: "Masters Indira Gandhi National Open University",
        experience: "over 10 years of experience in Software Development",
        description:
          "Husain Bharaj has over 10 years of experience in Software Development with a strong focus on Node.js technology in the finance and banking domain. He has worked on Microservice architecture, Rest API, and Node.js in various IT and telecommunications projects.",
        skills: ["Node.js", "Microservices", "REST API", "Finance", "Banking"],
        linkedin: "https://linkedin.com/in/husainbharaj",
        github: "https://github.com/husainbharaj",
        twitter: "https://twitter.com/husainbharaj",
        website: null,
        email: "husain@example.com",
        phone: "+91 98765 43213",
        avatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
        rating: 4.6,
        availability: "Available in 3 weeks",
      },
      {
        id: 5,
        name: "Kiran Sarella",
        title: "Senior Software Engineer at Tech Mahindra",
        location: "Hyderabad, Telangana, India",
        education:
          "Bachelor of Technology, Computer Science at Gudlavalleru Engineering College, Seshadri Rao Gudlavalleru",
        experience: "over 12 years of experience",
        description:
          "Kiran Sarella has worked on various technologies in Node.js, MongoDB, Swagger, React.js for more than 12 years and has expertise in developing Microservices, REST APIs using Node.js along with strong skills in Docker and MongoDB.",
        skills: ["Node.js", "MongoDB", "React.js", "Microservices", "Docker"],
        linkedin: "https://linkedin.com/in/kiransarella",
        github: "https://github.com/kiransarella",
        twitter: null,
        website: "https://kiransarella.tech",
        email: "kiran@example.com",
        phone: "+91 98765 43214",
        avatar:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
        rating: 4.8,
        availability: "Available immediately",
      },
    ]);
    setSelectedCandidates([
      {
        id: 1,
        name: "Mohit Agarwal",
        title: "Software Development Engineer 3 at Amazon",
        location: "Pune, Maharashtra, India",
        education:
          "Bachelor of Technology, Computer Science at Orissa Engineering College, Bhubaneswar",
        experience: "over 5 years of experience in the IT industry",
        description:
          "Mohit Agarwal has over 5 years of experience in the IT industry and has worked extensively with NodeJS, Express, and JavaScript technologies.",
        skills: ["NodeJS", "Express", "JavaScript", "React", "AWS"],
        linkedin: "https://linkedin.com/in/mohitagarwal",
        github: "https://github.com/mohitagarwal",
        twitter: null,
        website: "https://mohitagarwal.dev",
        email: "mohit@example.com",
        phone: "+91 98765 43210",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        rating: 4.8,
        availability: "Available in 2 weeks",
      },
      {
        id: 2,
        name: "Chandan Mistry",
        title: "Senior Software Engineer at Digital Aptech PVT. LTD.",
        location: "Kolkata, West Bengal, India",
        education: "Masters, Computer Application at University of Technology",
        experience: "Senior Software Engineer with over 5 years of experience",
        description:
          "Chandan Mistry is a Senior Software Engineer with over 5 years of experience in IT, proficient in Node.js (Express.js) and has been developing full-stack applications using technologies like Angular, Vue.js, and Laravel.",
        skills: ["Node.js", "Express.js", "Angular", "Vue.js", "Laravel"],
        linkedin: "https://linkedin.com/in/chandanmistry",
        github: "https://github.com/chandanmistry",
        twitter: "https://twitter.com/chandanmistry",
        website: null,
        email: "chandan@example.com",
        phone: "+91 98765 43211",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        rating: 4.9,
        availability: "Immediately available",
      },
      {
        id: 3,
        name: "Dharamdeo Choudhary",
        title: "Senior Software Engineer at Netsmartz",
        location: "Chandigarh, Chandigarh, India",
        education: "Masters Sikkim Manipal University - Distance Education",
        experience:
          "over 10 years of industry experience in Full Stack Development",
        description:
          "Dharamdeo Choudhary has over 10 years of industry experience in Full Stack Development and is an expert in node.js, with a strong background in Angular and React. He has consistently taken on multiple projects from beginning to completion and has a proven track record of working under pressure deadlines.",
        skills: ["Node.js", "Angular", "React", "Full Stack", "JavaScript"],
        linkedin: "https://linkedin.com/in/dharamdeochoudhary",
        github: "https://github.com/dharamdeo",
        twitter: null,
        website: "https://dharamdeo.dev",
        email: "dharamdeo@example.com",
        phone: "+91 98765 43212",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        rating: 4.7,
        availability: "Available in 1 month",
      },
      {
        id: 4,
        name: "Husain Bharaj",
        title: "Senior Software Engineer at Synechron",
        location: "Lucknow, Uttar Pradesh, India",
        education: "Masters Indira Gandhi National Open University",
        experience: "over 10 years of experience in Software Development",
        description:
          "Husain Bharaj has over 10 years of experience in Software Development with a strong focus on Node.js technology in the finance and banking domain. He has worked on Microservice architecture, Rest API, and Node.js in various IT and telecommunications projects.",
        skills: ["Node.js", "Microservices", "REST API", "Finance", "Banking"],
        linkedin: "https://linkedin.com/in/husainbharaj",
        github: "https://github.com/husainbharaj",
        twitter: "https://twitter.com/husainbharaj",
        website: null,
        email: "husain@example.com",
        phone: "+91 98765 43213",
        avatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
        rating: 4.6,
        availability: "Available in 3 weeks",
      },
      {
        id: 5,
        name: "Kiran Sarella",
        title: "Senior Software Engineer at Tech Mahindra",
        location: "Hyderabad, Telangana, India",
        education:
          "Bachelor of Technology, Computer Science at Gudlavalleru Engineering College, Seshadri Rao Gudlavalleru",
        experience: "over 12 years of experience",
        description:
          "Kiran Sarella has worked on various technologies in Node.js, MongoDB, Swagger, React.js for more than 12 years and has expertise in developing Microservices, REST APIs using Node.js along with strong skills in Docker and MongoDB.",
        skills: ["Node.js", "MongoDB", "React.js", "Microservices", "Docker"],
        linkedin: "https://linkedin.com/in/kiransarella",
        github: "https://github.com/kiransarella",
        twitter: null,
        website: "https://kiransarella.tech",
        email: "kiran@example.com",
        phone: "+91 98765 43214",
        avatar:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
        rating: 4.8,
        availability: "Available immediately",
      },
    ]);
  }, []);

  // Filter and search function
  const filterCandidates = () => {
    return allCandidates.filter((candidate) => {
      // Search query filter
      const searchMatch =
        searchQuery.toLowerCase() === "" ||
        Object.values(candidate).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        );

      // Filters match
      const roleMatch =
        filters.role === "" ||
        candidate.title.toLowerCase().includes(filters.role.toLowerCase());
      const orgMatch =
        filters.organization === "" ||
        candidate.title
          .toLowerCase()
          .includes(filters.organization.toLowerCase());
      const locationMatch =
        filters.location === "" ||
        candidate.location
          .toLowerCase()
          .includes(filters.location.toLowerCase());
      const educationMatch =
        filters.education === "" ||
        candidate.education
          .toLowerCase()
          .includes(filters.education.toLowerCase());

      return (
        searchMatch && roleMatch && orgMatch && locationMatch && educationMatch
      );
    });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedCandidates(filterCandidates());
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSelectedCandidates(filterCandidates());
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      role: "",
      organization: "",
      location: "",
      education: "",
    });
    setSearchQuery("");
    setSelectedCandidates(allCandidates);
  };
  const exportToCSV = () => {
    const headers = [
      "Name",
      "Title",
      "Location",
      "Education",
      "Experience",
      "Skills",
      "Rating",
      "Availability",
    ];
    const csvData = selectedCandidates.map((candidate) => [
      candidate.name,
      candidate.title,
      candidate.location,
      candidate.education,
      candidate.experience,
      candidate.skills.join(", "),
      candidate.rating,
      candidate.availability,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "shortlisted_candidates.csv");
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageCandidates = selectedCandidates.slice(startIndex, endIndex);
  const totalPages = Math.ceil(selectedCandidates.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    let yPos = 20;

    selectedCandidates.forEach((candidate, index) => {
      if (index > 0) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(16);
      doc.text(candidate.name, 20, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.text(`Title: ${candidate.title}`, 20, yPos);
      yPos += 10;
      doc.text(`Location: ${candidate.location}`, 20, yPos);
      yPos += 10;
      doc.text(`Education: ${candidate.education}`, 20, yPos);
      yPos += 10;
      doc.text(`Experience: ${candidate.experience}`, 20, yPos);
      yPos += 10;
      doc.text(`Skills: ${candidate.skills.join(", ")}`, 20, yPos);
      yPos += 10;
      doc.text(`Rating: ${candidate.rating}`, 20, yPos);
      yPos += 10;
      doc.text(`Availability: ${candidate.availability}`, 20, yPos);
    });

    doc.save("shortlisted_candidates.pdf");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by name, company, etc."
            className="px-3 py-2 border rounded-lg"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-500 text-white rounded"
          >
            {showFilters ? "Hide Filters" : "Add Filter"}
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 flex gap-2 text-sm border rounded-lg"
          >
            <Download className="w-5 h-5" /> Export
          </button>
          <button
            onClick={exportToPDF}
            className="px-4 py-2 flex gap-2 text-sm border rounded-lg"
          >
            <NotepadText className="w-5 h-5" />
            Report
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <input
                type="text"
                value={filters.role}
                onChange={(e) => handleFilterChange("role", e.target.value)}
                placeholder="Filter by role"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Organization
              </label>
              <input
                type="text"
                value={filters.organization}
                onChange={(e) =>
                  handleFilterChange("organization", e.target.value)
                }
                placeholder="Filter by organization"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                placeholder="Filter by location"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Education
              </label>
              <input
                type="text"
                value={filters.education}
                onChange={(e) =>
                  handleFilterChange("education", e.target.value)
                }
                placeholder="Filter by education"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto border">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-black/80">
            <tr>
              <th className="px-4 py-2 border text-left">Full Name</th>
              <th className="px-4 py-2 border text-left">Profiles</th>
              <th className="px-4 py-2 border text-left">Status</th>
              <th className="px-4 py-2 border text-left">Date</th>
              <th className="px-4 py-2 border text-left">Current Role</th>
              <th className="px-4 py-2 border text-left">Organization</th>
              <th className="px-4 py-2 border text-left">Education</th>
              <th className="px-4 py-2 border text-left">Location</th>
            </tr>
          </thead>
          <tbody>
            {selectedCandidates.map((candidate) => (
              <tr
                key={candidate.id}
                className="border-t hover:bg-gray-100 hover:dark:bg-gray-800"
              >
                <td className="px-4 py-2 h-16 flex items-center gap-2">
                  <img
                    src={candidate.avatar}
                    alt={candidate.name}
                    className="w-8 h-8 rounded-full"
                  />
                  {candidate.name}
                </td>
                <td className="px-4 py-2 border-x">
                  <div className="flex gap-2">
                    {candidate.linkedin && (
                      <a
                        href={candidate.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="w-5 h-5 text-blue-400" />
                      </a>
                    )}
                    {candidate.github && (
                      <a
                        href={candidate.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="w-5 h-5 text-gray-400" />
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 border-x">
                  <select
                    className="px-2 py-1 text-sm rounded border"
                    defaultValue="Not Contacted"
                  >
                    <option className="bg-yellow-100 text-yellow-800">
                      Not Contacted
                    </option>
                    <option className="bg-blue-100 text-blue-800">
                      In Progress
                    </option>
                    <option className="bg-green-100 text-green-800">
                      Contacted
                    </option>
                    <option className="bg-gray-100 text-gray-800">
                      Complete
                    </option>
                  </select>
                </td>
                <td className="px-4 py-2 border-x">
                  {new Date().toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border-x">
                  {candidate.title.split(" at ")[0]}
                </td>
                <td className="px-4 py-2 border-x">
                  {candidate.title.split(" at ")[1]}
                </td>
                <td className="px-4 py-2 border-x">
                  {candidate.education.split(" at ")[1]}
                </td>
                <td className="px-4 py-2">{candidate.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {`${currentPage * itemsPerPage - itemsPerPage + 1}-${Math.min(
            currentPage * itemsPerPage,
            selectedCandidates.length
          )} of ${selectedCandidates.length}`}
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 hover:bg-gray-100"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>
          <button
            className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 hover:bg-gray-100"
            disabled={
              currentPage >= Math.ceil(selectedCandidates.length / itemsPerPage)
            }
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
