"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Crown, Check, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { sidebarData } from "@/constants/sidebar-data";

const Sidebar = ({ isCollapsed = false }) => {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState(null);

  const isActive = (route) => {
    return pathname === route;
  };

  return (
    <div className="relative h-screen max-md:hidden">
      <motion.div
        className={`h-screen flex flex-col py-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200/60 dark:border-gray-800/60 shadow-lg ${
          isCollapsed ? "w-20 px-3" : "w-64 px-5"
        }`}
        initial={{ width: isCollapsed ? "5rem" : "16rem" }}
        animate={{ width: isCollapsed ? "5rem" : "16rem" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex flex-col h-full">
          {/* Logo section */}
          <div
            className={`flex mb-8 ${isCollapsed ? "justify-center" : "px-1"}`}
          >
            {isCollapsed ? (
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">H</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    JobFu
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Hire like a master
                  </p>
                </div>
              </div>
            )}
          </div>

          <nav className="flex-grow overflow-y-auto pr-1">
            <ul className="space-y-1">
              {sidebarData.map((item, index) => (
                <li
                  key={index}
                  className="w-full mb-4"
                  onMouseEnter={() => setHoveredItem(item.title)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    href={item.route}
                    className={`relative h-11 flex items-center gap-3 py-2.5 rounded-xl transition-all duration-300 ${
                      isCollapsed ? "justify-center px-0" : "px-4"
                    } ${
                      isActive(item.route)
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/60"
                    }`}
                  >
                    {isActive(item.route) && (
                      <motion.div
                        className="absolute inset-0 bg-white/20 rounded-xl"
                        layoutId="activeIndicator"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}

                    <item.icon
                      className={`h-5 w-5 ${
                        isActive(item.route)
                          ? "text-white"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                      strokeWidth={isActive(item.route) ? 2.5 : 2}
                    />

                    {!isCollapsed && (
                      <motion.span
                        className="text-md font-medium truncate"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        {item.title}
                      </motion.span>
                    )}

                    {isCollapsed && hoveredItem === item.title && (
                      <motion.div
                        className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md shadow-lg whitespace-nowrap z-50"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        {item.title}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-0 border-r-4 border-solid border-r-gray-900 border-t-transparent border-b-transparent"></div>
                      </motion.div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <motion.div
            className="w-full mt-4 px-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 border border-purple-400/30 dark:border-purple-700/30 p-4 shadow-xl">
              <motion.div
                className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/10 filter blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-indigo-300/20 filter blur-lg"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />

              <motion.div
                className="absolute top-3 right-4 h-1.5 w-1.5 rounded-full bg-yellow-300"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-6 left-4 h-1 w-1 rounded-full bg-white/60"
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              />
              <motion.div
                className="absolute top-8 left-6 h-1 w-1 rounded-full bg-indigo-200"
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.4, 0.9, 0.4],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.8,
                }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <motion.div className="relative" whileHover={{ rotate: 10 }}>
                    <Crown className="h-5 w-5 text-yellow-300" />
                    <motion.div
                      className="absolute -inset-1 bg-yellow-300/20 rounded-full blur-sm"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                  <h3 className="text-sm font-bold text-white">
                    Premium Features
                  </h3>
                  <motion.span
                    className="ml-auto text-xs font-bold bg-white/20 text-white px-2.5 py-1 rounded-full backdrop-blur-sm"
                    whileHover={{ scale: 1.05 }}
                  >
                    PRO
                  </motion.span>
                </div>

                <p className="text-xs text-white/90 mb-4">
                  Unlock advanced AI recruitment tools and analytics
                </p>

                <div className="space-y-2.5 mb-5">
                  {[
                    "Unlimited candidate searches",
                    "Priority AI matching",
                    "Advanced analytics",
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-2.5"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="relative">
                        <Check className="h-3.5 w-3.5 text-green-300" />
                        <motion.div
                          className={`absolute -inset-1 bg-green-300/20 rounded-full blur-sm`}
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.3,
                          }}
                        />
                      </div>
                      <span className="text-xs text-white/95 font-medium">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <motion.div whileHover={{ scale: 1.01 }}>
                  <Button
                    className="w-full group relative overflow-hidden h-10 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold shadow-lg transition-all duration-300 backdrop-blur-sm cursor-pointer"
                    onClick={() => router.push(`/billing`)}
                  >
                    <motion.span
                      className="absolute inset-0 w-0 h-full bg-white/10 skew-x-12 transform group-hover:w-full"
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.7 }}
                    />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Zap className="h-4 w-4 fill-current" />
                      Upgrade Now
                    </span>
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
