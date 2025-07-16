import { NextResponse } from "next/server";

// Standardeinstellungen (bei Bedarf anpassbar)
const defaultSettings = {
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
};

const sidebarTabs = [
  { id: "general", label: "Allgemein", icon: "Settings" },
  { id: "payment", label: "Zahlungen", icon: "CreditCard" },
  { id: "email", label: "E-Mail", icon: "Mail" },
  { id: "security", label: "Sicherheit", icon: "Shield" },
  { id: "notifications", label: "Benachrichtigungen", icon: "Bell" },
];

export async function GET() {
  return NextResponse.json({ settings: defaultSettings, tabs: sidebarTabs });
}

export async function PUT(request) {
  // Hier können die Einstellungen gespeichert werden (z. B. in die Datenbank schreiben)
  // Vorerst geben wir nur die empfangenen Daten zurück
  const body = await request.json();
  return NextResponse.json({ settings: body.settings });
}
