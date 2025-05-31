"use client";

import { Sidebar } from "lucide-react";

const AgentsPage = () => {
  const agents = [
    {
      category: "Email Integration",
      description: "Connect your email accounts to send automated sequences",
      items: [
        {
          name: "Gmail",
          icon: "/icons/gmail.svg",
          domain: "gmail.com",
          action: "Sign in with Gmail",
          buttonType: "signin",
        },
        {
          name: "Microsoft",
          icon: "/icons/microsoft.svg",
          domain: "outlook.com",
          action: "Sign in with Microsoft",
          buttonType: "signin",
        },
        {
          name: "Invite External User",
          icon: "/icons/user-plus.svg",
          domain: "Google or Microsoft",
          action: "Click to Invite",
          buttonType: "invite",
        },
      ],
    },
    {
      category: "Connections",
      description: "Import your LinkedIn connections to the platform.",
      items: [
        {
          name: "LinkedIn",
          icon: "/icons/linkedin.svg",
          action: "Import",
          buttonType: "import",
        },
        {
          name: "Juicebox Chrome Extension",
          icon: "/icons/chrome.svg",
          action: "Install",
          buttonType: "install",
        },
      ],
    },
    {
      category: "Applicant Tracking Systems (ATS)",
      description:
        "ATS integrations help you export candidates from the platform to your ATS.",
      items: [
        {
          name: "Greenhouse",
          icon: "/icons/greenhouse.svg",
          action: "Activate",
          buttonType: "activate",
        },
        {
          name: "Lever",
          icon: "/icons/lever.svg",
          action: "Activate",
          buttonType: "activate",
        },
        {
          name: "Ashby",
          icon: "/icons/ashby.svg",
          action: "Activate",
          buttonType: "activate",
        },
        {
          name: "ApplicantStack",
          icon: "/icons/applicantstack.svg",
          action: "Activate",
          buttonType: "activate",
        },
      ],
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Integrations Marketplace</h1>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          Request Integration
        </button>
      </div>

      <div className="space-y-8">
        {agents.map((category) => (
          <div
            key={category.category}
            className="bg-white rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-2">{category.category}</h2>
            <p className="text-gray-600 mb-6">{category.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {category.items.map((item) => (
                <div
                  key={item.name}
                  className="border rounded-lg p-4 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.icon}
                        alt={item.name}
                        className="w-8 h-8"
                      />
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        {item.domain && (
                          <p className="text-sm text-gray-500">{item.domain}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto flex justify-between items-center">
                    <button
                      className={`px-4 py-2 rounded-lg w-full ${
                        item.buttonType === "signin"
                          ? "border border-gray-200 hover:bg-gray-50"
                          : "text-purple-600 hover:bg-purple-50"
                      }`}
                    >
                      {item.action}
                    </button>
                    <a
                      href="#"
                      className="text-sm text-gray-500 ml-2 hover:text-gray-700"
                    >
                      Learn More
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentsPage;
