import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { GlobalKeyboardShortcuts } from "@/components/ui/KeyboardShortcuts";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { KeyboardShortcutsPanel } from "@/components/ui/KeyboardShortcutsPanel";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kukiwrite - AI Content Automation Platform",
  description: "AI Content Automation for Creators & Teams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <ToastProvider>
            <GlobalKeyboardShortcuts />
            <CommandPalette />
            <KeyboardShortcutsPanel />
            {children}
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
