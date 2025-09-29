import {
  LayoutDashboard,
  UserCheck,
  Bot,
  User,
  Settings,
  BookOpenText,
  Newspaper,
  Calendar,
  Earth,
} from "lucide-react";

export const sidebarData = [
  {
    title: "Dashboard",
    route: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Chat History",
    route: "/chat-history",
    icon: Bot,
  },
  {
    title: "Shortlisting",
    route: "/shortlisting",
    icon: UserCheck,
  },
  {
    title: "Calendar",
    route: "/calendar",
    icon: Calendar,
  },
  {
    title: "Resume Editor",
    route: "/documentation",
    icon: BookOpenText,
  },
  {
    title: "Region Distribution",
    route: "/region-distribution",
    icon: Earth,
  },
  {
    title: "News",
    route: "/news",
    icon: Newspaper,
  },
  {
    title: "Settings",
    route: "/settings",
    icon: Settings,
  },
  {
    title: "Profile",
    route: "/profile",
    icon: User,
  },
];
