"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Save,
  Mail,
  Shield,
  CreditCard,
  Bell,
  RefreshCw,
} from "lucide-react";

export default function AdminSettingsPage() {
  // State für Tabs und Settings
  // State für Tabs und Settings
  const [settings, setSettings] = useState(null);
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Settings und Tabs vom Backend laden
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        setSettings(data.settings);
        setTabs(data.tabs);
      } catch (err) {
        setMessage("Fehler beim Laden der Einstellungen.");
      }
    }
    fetchSettings();
  }, []);

  // Input-Änderungen
  function handleInputChange(section, key, value) {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  }

  // Einstellungen speichern
  async function saveSettings() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (res.ok) {
        setMessage("Einstellungen erfolgreich gespeichert.");
      } else {
        setMessage("Fehler beim Speichern der Einstellungen.");
      }
    } catch (err) {
      setMessage("Fehler beim Speichern der Einstellungen.");
    }
    setSaving(false);
  }

  if (!settings) {
    return (
      <div className="text-center text-gray-400">Lade Einstellungen...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="w-8 h-8 flex items-center justify-center bg-purple-500 rounded-full">
            <Settings className="w-6 h-6 text-white" />
          </span>
          <div>
            <h1 className="text-3xl font-bold text-white">
              System-Einstellungen
            </h1>
            <p className="text-gray-400">
              Konfigurieren Sie Ihre Plattform-Einstellungen
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all duration-200 flex items-center disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? "Speichern..." : "Speichern"}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.includes("Fehler")
              ? "bg-red-500/10 border border-red-500/30 text-red-400"
              : "bg-green-500/10 border border-green-500/30 text-green-400"
          }`}
        >
          {message}
        </div>
      )}

      {/* Einstellungen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-[#1e293b] border border-gray-800 rounded-lg p-4 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-all duration-150 text-gray-300 hover:bg-purple-600 hover:text-white ${
                  activeTab === tab.id ? "bg-purple-700 text-white" : ""
                }`}
              >
                <span className="mr-2">
                  {tab.icon === "Settings" && <Settings className="w-5 h-5" />}
                  {tab.icon === "CreditCard" && (
                    <CreditCard className="w-5 h-5" />
                  )}
                  {tab.icon === "Mail" && <Mail className="w-5 h-5" />}
                  {tab.icon === "Shield" && <Shield className="w-5 h-5" />}
                  {tab.icon === "Bell" && <Bell className="w-5 h-5" />}
                </span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-6">
            {/* General Settings */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Allgemeine Einstellungen
                </h2>
                {/* ...existing code... */}
              </div>
            )}
            {/* ...existing code für andere Tabs... */}
            {activeTab === "payment" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Zahlungseinstellungen
                </h2>
                {/* ...existing code... */}
              </div>
            )}
            {activeTab === "email" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  E-Mail Einstellungen
                </h2>
                {/* ...existing code... */}
              </div>
            )}
            {activeTab === "security" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Sicherheitseinstellungen
                </h2>
                {/* ...existing code... */}
              </div>
            )}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Benachrichtigungseinstellungen
                </h2>
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={
                        settings.notifications.enableNewUserNotifications
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "notifications",
                          "enableNewUserNotifications",
                          e.target.checked
                        )
                      }
                      className="mr-3 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-300">
                      Benachrichtigung bei neuen Benutzern
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={
                        settings.notifications.enableNewEventNotifications
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "notifications",
                          "enableNewEventNotifications",
                          e.target.checked
                        )
                      }
                      className="mr-3 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-300">
                      Benachrichtigung bei neuen Events
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={
                        settings.notifications.enablePaymentNotifications
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "notifications",
                          "enablePaymentNotifications",
                          e.target.checked
                        )
                      }
                      className="mr-3 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-300">
                      Benachrichtigung bei Zahlungen
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.notifications.enableErrorNotifications}
                      onChange={(e) =>
                        handleInputChange(
                          "notifications",
                          "enableErrorNotifications",
                          e.target.checked
                        )
                      }
                      className="mr-3 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-300">
                      Benachrichtigung bei Fehlern
                    </span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Discord Webhook URL
                  </label>
                  <input
                    type="url"
                    value={settings.notifications.discordWebhook}
                    onChange={(e) =>
                      handleInputChange(
                        "notifications",
                        "discordWebhook",
                        e.target.value
                      )
                    }
                    placeholder="https://discord.com/api/webhooks/..."
                    className="w-full px-3 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Slack Webhook URL
                  </label>
                  <input
                    type="url"
                    value={settings.notifications.slackWebhook}
                    onChange={(e) =>
                      handleInputChange(
                        "notifications",
                        "slackWebhook",
                        e.target.value
                      )
                    }
                    placeholder="https://hooks.slack.com/services/..."
                    className="w-full px-3 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
