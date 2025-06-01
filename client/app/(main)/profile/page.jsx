"use client";

import React, { useState, useEffect } from "react";
import { Save, User, Mail, Phone, Building, Check, X } from "lucide-react";
import { FaXTwitter, FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { Label } from "@/components/ui/label";
import { useCurrentUserImage } from "@/hooks/use-current-user-image";
import { useCurrentUserName } from "@/hooks/use-current-user-name";
import { useCurrentUserId } from "@/hooks/use-current-user-id";
import { Button } from "@/components/ui/button";
import { logout } from "@/utils/supabase/auth";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";

const ProfilePage = () => {
  const [user, setUser] = useState({
    _id: "",
    name: "",
    email: "user@example.com",
    phone: "",
    avatar: "",
    organization: "",
    role: "recruiter",
    linkedinUrl: "",
    githubUrl: "",
    twitterUrl: "",
    notificationPreferences: {
      email: true,
      push: false,
    },
    profileCompleted: false,
    emailVerified: true,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const profileImage = useCurrentUserImage();
  const userName = useCurrentUserName();
  const userId = useCurrentUserId();
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/users/me/${userId}`
        );
        const data = await response.json();

        if (response.ok) {
          setUser(data.user[0]);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setUser((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setUser((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/users/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.name,
            phone: user.phone,
            organization: user.organization,
            role: user.role,
            linkedinUrl: user.linkedinUrl,
            githubUrl: user.githubUrl,
            twitterUrl: user.twitterUrl,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSaveStatus("success");
        setIsEditing(false);
        setUser(data.user);
        setTimeout(() => setSaveStatus(""), 3000);
      } else {
        throw new Error(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/api/users/me/${userId}`
        );
        const data = await response.json();
        if (response.ok) {
          setUser(data.user[0]);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  };

  const profileCompletion = () => {
    const fields = [user.name, user.phone, user.organization];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="h-screen bg-transparent overflow-auto">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-purple-800/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Profile Completion
            </h3>
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {profileCompletion()}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${profileCompletion()}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Complete your profile to unlock all features
          </p>
        </div>

        {saveStatus && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              saveStatus === "success"
                ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
            }`}
          >
            {saveStatus === "success" ? <Check size={20} /> : <X size={20} />}
            <span className="font-medium">
              {saveStatus === "success"
                ? "Profile updated successfully!"
                : "Failed to update profile. Please try again."}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-purple-100 dark:border-purple-800/30">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : user.name ? (
                      user.name.charAt(0).toUpperCase()
                    ) : (
                      <User size={48} />
                    )}
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-4">
                  {userName || user.name || "Add your name"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2 mt-1">
                  <Mail size={14} />
                  {user.email}
                  {user.emailVerified && (
                    <Check size={14} className="text-green-500" />
                  )}
                </p>
              </div>

              <div className="text-center mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 capitalize">
                  {user.role?.replace("_", " ")}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Building size={16} className="text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {user.organization || "No organization"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {user.phone || "No phone number"}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="h-10 w-full flex items-center justify-center gap-2 transition-all duration-200 border-none hover:bg-red-50/80 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-300 group cursor-pointer"
                >
                  <FiLogOut className="h-4 w-4 text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300 transition-colors" />
                  <span className="text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300 transition-colors">
                    Sign Out
                  </span>
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-purple-800/30">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Profile Information
                </h3>
                <div className="flex gap-3">
                  {isEditing ? (
                    <>
                      <Button
                        variant="primary"
                        onClick={handleCancel}
                        className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors cursor-pointer"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                      >
                        {isSaving ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Save size={16} />
                        )}
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg cursor-pointer"
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </Label>
                      <input
                        type="text"
                        value={user.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </Label>
                      <input
                        type="tel"
                        value={user.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="Enter your phone number"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Organization
                      </Label>
                      <input
                        type="text"
                        value={user.organization}
                        onChange={(e) =>
                          handleInputChange("organization", e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="Enter your organization"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Role
                      </Label>
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleInputChange("role", e.target.value)
                        }
                        disabled={!isEditing}
                        className="w-full h-12.5 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      >
                        <option value="recruiter">Recruiter</option>
                        <option value="hiring_manager">Hiring Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Social Links
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        LinkedIn URL
                      </Label>
                      <div className="relative">
                        <FaLinkedinIn
                          size={16}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="url"
                          value={user.linkedinUrl}
                          onChange={(e) =>
                            handleInputChange("linkedinUrl", e.target.value)
                          }
                          disabled={!isEditing}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        GitHub URL
                      </Label>
                      <div className="relative">
                        <FaGithub
                          size={16}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="url"
                          value={user.githubUrl}
                          onChange={(e) =>
                            handleInputChange("githubUrl", e.target.value)
                          }
                          disabled={!isEditing}
                          placeholder="https://github.com/username"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Twitter URL
                      </Label>
                      <div className="relative">
                        <FaXTwitter
                          size={16}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="url"
                          value={user.twitterUrl}
                          onChange={(e) =>
                            handleInputChange("twitterUrl", e.target.value)
                          }
                          disabled={!isEditing}
                          placeholder="https://twitter.com/username"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
