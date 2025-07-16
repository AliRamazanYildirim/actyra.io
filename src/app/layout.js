import {
  ClerkProvider
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";

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
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="de" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
          suppressHydrationWarning
        >
          <ConditionalLayout>{children}</ConditionalLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
