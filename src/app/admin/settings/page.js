"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Save,
  Database,
  Mail,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Bell,
  Users,
  Key,
  Server,
  Trash2,
  Upload,
  Download,
  RefreshCw,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    general: {
      siteName: "Actyra",
      siteDescription: "Entdecke soziale Events mit Wirkung",
      contactEmail: "admin@actyra.com",
      supportEmail: "support@actyra.com",
      timezone: "Europe/Berlin",
      language: "de",
      maintenanceMode: false,
      enableRegistration: true,
      enableEventCreation: true,
      maxEventsPerUser: 10,
    },
    payment: {
      stripePublishableKey: "",
      stripeSecretKey: "",
      paypalClientId: "",
      enableStripe: true,
      enablePaypal: false,
      defaultCurrency: "EUR",
      minEventPrice: 0,
      maxEventPrice: 10000,
      platformFee: 3.5,
      donationEnabled: true,
    },
    email: {
      smtpHost: "",
      smtpPort: 587,
      smtpUser: "",
      smtpPassword: "",
      fromEmail: "noreply@actyra.com",
      fromName: "Actyra",
      enableEmailNotifications: true,
      welcomeEmailEnabled: true,
      eventReminderEnabled: true,
      ticketConfirmationEnabled: true,
    },
    security: {
      jwtSecret: "",
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      enableTwoFactor: false,
      requireEmailVerification: true,
      passwordMinLength: 8,
      enableCaptcha: false,
      captchaSiteKey: "",
      captchaSecretKey: "",
    },
    notifications: {
      enableNewUserNotifications: true,
      enableNewEventNotifications: true,
      enablePaymentNotifications: true,
      enableErrorNotifications: true,
      webhookUrl: "",
      discordWebhook: "",
      slackWebhook: "",
    },
  });

  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings((prev) => ({ ...prev, ...data.settings }));
      }
    } catch (error) {
      console.error("Fehler beim Laden der Einstellungen:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings }),
      });

      if (response.ok) {
        setMessage("Einstellungen erfolgreich gespeichert!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Fehler beim Speichern der Einstellungen");
      }
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      setMessage("Fehler beim Speichern der Einstellungen");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (category, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "actyra-settings.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          setSettings(importedSettings);
          setMessage("Einstellungen erfolgreich importiert!");
        } catch (error) {
          setMessage("Fehler beim Importieren der Einstellungen");
        }
      };
      reader.readAsText(file);
    }
  };

  const tabs = [
    { id: "general", label: "Allgemein", icon: Settings },
    { id: "payment", label: "Zahlungen", icon: CreditCard },
    { id: "email", label: "E-Mail", icon: Mail },
    { id: "security", label: "Sicherheit", icon: Shield },
    { id: "notifications", label: "Benachrichtigungen", icon: Bell },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="h-64 bg-gray-700 rounded"></div>
            <div className="lg:col-span-3 h-64 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Settings className="w-8 h-8 text-purple-500" />
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
          <input
            type="file"
            accept=".json"
            onChange={importSettings}
            className="hidden"
            id="import-settings"
          />
          <label
            htmlFor="import-settings"
            className="bg-[#1e293b] text-white px-4 py-2 rounded-lg hover:bg-[#334155] transition-colors cursor-pointer flex items-center"
          >
            <Upload className="w-4 h-4 mr-2" />
            Importieren
          </label>

          <button
            onClick={exportSettings}
            className="bg-[#1e293b] text-white px-4 py-2 rounded-lg hover:bg-[#334155] transition-colors flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportieren
          </button>

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

      {/* Message */}
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

      {/* Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-[#0f172a] border border-gray-800 rounded-lg p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                        : "text-gray-300 hover:text-white hover:bg-[#1e293b]"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Seitenname
                    </label>
                    <input
                      type="text"
                      value={settings.general.siteName}
                      onChange={(e) =>
                        handleInputChange("general", "siteName", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Kontakt E-Mail
                    </label>
                    <input
                      type="email"
                      value={settings.general.contactEmail}
                      onChange={(e) =>
                        handleInputChange(
                          "general",
                          "contactEmail",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Seitenbeschreibung
                  </label>
                  <textarea
                    value={settings.general.siteDescription}
                    onChange={(e) =>
                      handleInputChange(
                        "general",
                        "siteDescription",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="w-full px-3 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Zeitzone
                    </label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) =>
                        handleInputChange("general", "timezone", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Europe/Berlin">Europa/Berlin</option>
                      <option value="Europe/Vienna">Europa/Wien</option>
                      <option value="Europe/Zurich">Europa/Zürich</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max. Events pro Benutzer
                    </label>
                    <input
                      type="number"
                      value={settings.general.maxEventsPerUser}
                      onChange={(e) =>
                        handleInputChange(
                          "general",
                          "maxEventsPerUser",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.general.enableRegistration}
                      onChange={(e) =>
                        handleInputChange(
                          "general",
                          "enableRegistration",
                          e.target.checked
                        )
                      }
                      className="mr-3 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-300">
                      Benutzerregistrierung aktivieren
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.general.enableEventCreation}
                      onChange={(e) =>
                        handleInputChange(
                          "general",
                          "enableEventCreation",
                          e.target.checked
                        )
                      }
                      className="mr-3 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-300">
                      Event-Erstellung aktivieren
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.general.maintenanceMode}
                      onChange={(e) =>
                        handleInputChange(
                          "general",
                          "maintenanceMode",
                          e.target.checked
                        )
                      }
                      className="mr-3 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-300">Wartungsmodus</span>
                  </label>
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === "payment" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Zahlungseinstellungen
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">
                      Stripe Konfiguration
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Publishable Key
                        </label>
                        <input
                          type="text"
                          value={settings.payment.stripePublishableKey}
                          onChange={(e) =>
                            handleInputChange(
                              "payment",
                              "stripePublishableKey",
                              e.target.value
                            )
                          }
                          placeholder="pk_test_..."
                          className="w-full px-3 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Secret Key
                        </label>
                        <input
                          type="password"
                          value={settings.payment.stripeSecretKey}
                          onChange={(e) =>
                            handleInputChange(
                              "payment",
                              "stripeSecretKey",
                              e.target.value
                            )
                          }
                          placeholder="sk_test_..."
                          className="w-full px-3 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Standardwährung
                      </label>
                      <select
                        value={settings.payment.defaultCurrency}
                        onChange={(e) =>
                          handleInputChange(
                            "payment",
                            "defaultCurrency",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                        <option value="CHF">CHF</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Plattform-Gebühr (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={settings.payment.platformFee}
                        onChange={(e) =>
                          handleInputChange(
                            "payment",
                            "platformFee",
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Max. Event-Preis
                      </label>
                      <input
                        type="number"
                        value={settings.payment.maxEventPrice}
                        onChange={(e) =>
                          handleInputChange(
                            "payment",
                            "maxEventPrice",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.payment.enableStripe}
                        onChange={(e) =>
                          handleInputChange(
                            "payment",
                            "enableStripe",
                            e.target.checked
                          )
                        }
                        className="mr-3 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-gray-300">Stripe aktivieren</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.payment.donationEnabled}
                        onChange={(e) =>
                          handleInputChange(
                            "payment",
                            "donationEnabled",
                            e.target.checked
                          )
                        }
                        className="mr-3 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-gray-300">Spenden aktivieren</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Email Settings */}
            {activeTab === "email" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  E-Mail Einstellungen
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      SMTP Host
                    </label>
                    <input
                      type="text"
                      value={settings.email.smtpHost}
                      onChange={(e) =>
                        handleInputChange("email", "smtpHost", e.target.value)
                      }
                      placeholder="smtp.gmail.com"
                      className="w-full px-3 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      SMTP Port
                    </label>
                    <input
                      type="number"
                      value={settings.email.smtpPort}
                      onChange={(e) =>
                        handleInputChange(
                          "email",
                          "smtpPort",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      SMTP Benutzer
                    </label>
                    <input
                      type="text"
                      value={settings.email.smtpUser}
                      onChange={(e) =>
                        handleInputChange("email", "smtpUser", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      SMTP Passwort
                    </label>
                    <input
                      type="password"
                      value={settings.email.smtpPassword}
                      onChange={(e) =>
                        handleInputChange(
                          "email",
                          "smtpPassword",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Absender E-Mail
                    </label>
                    <input
                      type="email"
                      value={settings.email.fromEmail}
                      onChange={(e) =>
                        handleInputChange("email", "fromEmail", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Absender Name
                    </label>
                    <input
                      type="text"
                      value={settings.email.fromName}
                      onChange={(e) =>
                        handleInputChange("email", "fromName", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.email.enableEmailNotifications}
                      onChange={(e) =>
                        handleInputChange(
                          "email",
                          "enableEmailNotifications",
                          e.target.checked
                        )
                      }
                      className="mr-3 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-300">
                      E-Mail Benachrichtigungen aktivieren
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.email.welcomeEmailEnabled}
                      onChange={(e) =>
                        handleInputChange(
                          "email",
                          "welcomeEmailEnabled",
                          e.target.checked
                        )
                      }
                      className="mr-3 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-300">
                      Willkommens-E-Mail senden
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.email.ticketConfirmationEnabled}
                      onChange={(e) =>
                        handleInputChange(
                          "email",
                          "ticketConfirmationEnabled",
                          e.target.checked
                        )
                      }
                      className="mr-3 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-300">
                      Ticket-Bestätigung senden
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Sicherheitseinstellungen
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Session Timeout (Stunden)
                    </label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) =>
                        handleInputChange(
                          "security",
                          "sessionTimeout",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max. Login-Versuche
                    </label>
                    <input
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) =>
                        handleInputChange(
                          "security",
                          "maxLoginAttempts",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Min. Passwort-Länge
                  </label>
                  <input
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) =>
                      handleInputChange(
                        "security",
                        "passwordMinLength",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.security.requireEmailVerification}
                      onChange={(e) =>
                        handleInputChange(
                          "security",
                          "requireEmailVerification",
                          e.target.checked
                        )
                      }
                      className="mr-3 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-300">
                      E-Mail Verifizierung erforderlich
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.security.enableTwoFactor}
                      onChange={(e) =>
                        handleInputChange(
                          "security",
                          "enableTwoFactor",
                          e.target.checked
                        )
                      }
                      className="mr-3 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-300">
                      Zwei-Faktor-Authentifizierung aktivieren
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.security.enableCaptcha}
                      onChange={(e) =>
                        handleInputChange(
                          "security",
                          "enableCaptcha",
                          e.target.checked
                        )
                      }
                      className="mr-3 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-300">CAPTCHA aktivieren</span>
                  </label>
                </div>
              </div>
            )}

            {/* Notification Settings */}
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
