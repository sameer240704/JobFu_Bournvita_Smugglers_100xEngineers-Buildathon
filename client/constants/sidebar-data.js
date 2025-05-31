import {
    LayoutDashboard,
    UserCheck,
    Clock,
    Bot,
    User,
    Settings,
    BookOpenText
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
        title: "Follow-Ups",
        route: "/follow-ups",
        icon: Clock,
    },
    {
        title: "Settings",
        route: "/settings",
        icon: Settings,
    },
    {
        title: "Documentation",
        route: "/documentation",
        icon: BookOpenText,
    },
    {
        title: "Profile",
        route: "/profile",
        icon: User,
    },
];