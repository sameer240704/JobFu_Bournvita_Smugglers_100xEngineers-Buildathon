"use client";

import React, { useState } from "react";
import {
  Moon,
  Sun,
  Bell,
  Mail,
  Shield,
  User,
  Globe,
  Smartphone,
  Volume2,
  Eye,
  Lock,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [publicProfile, setPublicProfile] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const router = useRouter();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const ToggleSwitch = ({ enabled, onToggle, size = "default" }) => {
    const sizeClasses = size === "large" ? "w-10 h-6" : "w-10 h-6";
    const thumbClasses = size === "large" ? "w-4 h-4" : "w-4 h-4";
    const translateClasses =
      size === "large" ? "translate-x-7" : "translate-x-5";

    return (
      <button
        onClick={onToggle}
        className={`relative inline-flex cursor-pointer ${sizeClasses} items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
          enabled ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        <span
          className={`${thumbClasses} inline-block transform rounded-full bg-white transition-transform duration-300 shadow-lg ${
            enabled ? translateClasses : "translate-x-1"
          }`}
        />
      </button>
    );
  };

  const SettingCard = ({
    icon: Icon,
    title,
    description,
    children,
    highlight = false,
  }) => (
    <div
      className={`rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${
        highlight
          ? "bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700"
          : "bg-card border-border hover:border-purple-300 dark:hover:border-purple-600"
      } p-6`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-start space-x-4">
          <div
            className={`rounded-lg p-2 ${
              highlight
                ? "bg-purple-500 text-white"
                : "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400"
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3
              className={`font-semibold ${
                highlight
                  ? "text-purple-900 dark:text-purple-100"
                  : "text-foreground"
              }`}
            >
              {title}
            </h3>
            <p
              className={`text-sm mt-1 ${
                highlight
                  ? "text-purple-700 dark:text-purple-300"
                  : "text-muted-foreground"
              }`}
            >
              {description}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-transparent overflow-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Settings Grid */}
        <div className="space-y-6">
          {/* Appearance Section */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Palette className="w-5 h-5 mr-2 text-purple-600" />
              Appearance
            </h2>
            <div className="space-y-4">
              <SettingCard
                icon={darkMode ? Moon : Sun}
                title="Theme"
                description="Switch between light and dark mode"
                highlight={true}
              >
                <ToggleSwitch
                  enabled={darkMode}
                  onToggle={toggleDarkMode}
                  size="large"
                />
              </SettingCard>
            </div>
          </div>

          {/* Notifications Section */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-purple-600" />
              Notifications
            </h2>
            <div className="space-y-4">
              <SettingCard
                icon={Mail}
                title="Email Notifications"
                description="Receive notifications via email"
              >
                <ToggleSwitch
                  enabled={emailNotifications}
                  onToggle={() => setEmailNotifications(!emailNotifications)}
                />
              </SettingCard>

              <SettingCard
                icon={Smartphone}
                title="Push Notifications"
                description="Get push notifications on your device"
              >
                <ToggleSwitch
                  enabled={pushNotifications}
                  onToggle={() => setPushNotifications(!pushNotifications)}
                />
              </SettingCard>

              <SettingCard
                icon={Volume2}
                title="Sound Notifications"
                description="Play sounds for notifications"
              >
                <ToggleSwitch
                  enabled={soundEnabled}
                  onToggle={() => setSoundEnabled(!soundEnabled)}
                />
              </SettingCard>

              <SettingCard
                icon={Mail}
                title="Marketing Emails"
                description="Receive updates about new features and offers"
              >
                <ToggleSwitch
                  enabled={marketingEmails}
                  onToggle={() => setMarketingEmails(!marketingEmails)}
                />
              </SettingCard>
            </div>
          </div>

          {/* Privacy & Security Section */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-purple-600" />
              Privacy & Security
            </h2>
            <div className="space-y-4">
              <SettingCard
                icon={Lock}
                title="Two-Factor Authentication"
                description="Add an extra layer of security to your account"
                highlight={!twoFactorAuth}
              >
                <ToggleSwitch
                  enabled={twoFactorAuth}
                  onToggle={() => setTwoFactorAuth(!twoFactorAuth)}
                />
              </SettingCard>

              <SettingCard
                icon={Eye}
                title="Public Profile"
                description="Make your profile visible to other users"
              >
                <ToggleSwitch
                  enabled={publicProfile}
                  onToggle={() => setPublicProfile(!publicProfile)}
                />
              </SettingCard>
            </div>
          </div>

          {/* Account Section */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-purple-600" />
              Account
            </h2>
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-6 hover:shadow-lg hover:scale-[1.01] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        Profile Settings
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Update your personal information
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => router.push("/profile")}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm font-medium cursor-pointer"
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 hover:shadow-lg hover:scale-[1.01] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        Language & Region
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Set your preferred language and region
                      </p>
                    </div>
                  </div>
                  <Button className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200 text-sm font-medium cursor-pointer">
                    Configure
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div>
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Danger Zone
            </h2>
            <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-red-800 dark:text-red-200">
                    Delete Account
                  </h3>
                  <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <button className="px-4 py-2 bg-red-600/40 text-white rounded-lg hover:bg-red-700/60 transition-colors duration-200 text-sm font-medium cursor-not-allowed">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>Settings are automatically saved</p>
            <p>Last updated: Just now</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
