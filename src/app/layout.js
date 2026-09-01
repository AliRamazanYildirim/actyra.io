import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import DynamicStars from "@/components/DynamicStars";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Actyra",
  description: "Entdecke soziale Events mit Wirkung",
  icons: {
    icon: [
      { url: "/logo-actyra.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/logo-actyra.png",
    shortcut: "/logo-actyra.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          modalBackdrop: "!flex !items-center !justify-center !min-h-screen",
          modalContent: "!m-auto !flex !items-center !justify-center",
          cardBox: "!m-auto",
        },
      }}
    >
      <html lang="de" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col relative`}
          suppressHydrationWarning
        >
          <DynamicStars />
          <ConditionalLayout>{children}</ConditionalLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
