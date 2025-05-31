"use client";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BarChart2,
  MessageSquare,
  BookmarkPlus,
  Bell,
  Bot,
  Settings,
  BookOpen,
  User
} from "lucide-react";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mainMenuItems = [
    { icon: BarChart2, label: "Analytics", href: "/dashboard/analytics" },
    { icon: MessageSquare, label: "Chats", href: "/dashboard/chats" },
    { icon: BookmarkPlus, label: "Shortlisting", href: "/dashboard/shortlisting" },
    { icon: Bell, label: "Followups", href: "/dashboard/followups" },
    { icon: Bot, label: "AI Agents", href: "/dashboard/agents" },
  ];

  const bottomMenuItems = [
      { icon: BookOpen, label: "Docs", href: "/dashboard/docs" },
      { icon: Settings, label: "Settings", href: "/dashboard/settings" },
      { icon: User, label: "Profile", href: "/dashboard/profile" },
  ];

  const NavItem = ({ item }) => (
    <a
      key={item.label}
      href={item.href}
      className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
        isCollapsed ? "justify-center" : "space-x-3"
      }`}
    >
      <item.icon size={20} />
      {!isCollapsed && <span>{item.label}</span>}
    </a>
  );

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
            <span className="font-semibold text-lg">PeopleGPT</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="p-4">
        <select
          className={`w-full p-2 rounded-lg border border-gray-200 ${
            isCollapsed ? "hidden" : ""
          }`}
        >
          <option>Select Project</option>
          <option>Project 1</option>
          <option>Project 2</option>
        </select>
      </div>

      <nav className="mt-4 flex-grow">
        {mainMenuItems.map((item) => (
          <NavItem key={item.label} item={item} />
        ))}
      </nav>

      <nav className="mt-auto border-t border-gray-200 py-4">
        {bottomMenuItems.map((item) => (
          <NavItem key={item.label} item={item} />
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
