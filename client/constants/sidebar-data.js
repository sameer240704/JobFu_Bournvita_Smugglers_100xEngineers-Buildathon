import {
  LayoutDashboard,
  UserCheck,
  Bot,
  User,
  Settings,
  BookOpenText,
  Newspaper,
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
    title: "News",
    route: "/news",
    icon: Newspaper,
  },
  {
    title: "Documentation",
    route: "/documentation",
    icon: BookOpenText,
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
