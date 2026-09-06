import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { GlobalFooter, GlobalNav } from "../components/global-chrome";
import { LanguageProvider } from "../components/language-context";
import { AuthProvider } from "../components/auth-context";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ayush-skillsync.example"),
  title: {
    default: "AYUSH SkillSync | Competency Exchange",
    template: "%s | AYUSH SkillSync",
  },
  description: "Real-Time Competency Metrics, Skill-Gap Analysis, and explainable opportunities for the AYUSH ecosystem.",
  openGraph: {
    title: "AYUSH SkillSync | Competency Exchange",
    description: "A trusted platform for skill mapping, internships, and placement across AYUSH education and industry.",
    type: "website",
    siteName: "AYUSH SkillSync",
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/zeroday-logo.jpeg", apple: "/zeroday-logo.jpeg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LanguageProvider><AuthProvider>
          <GlobalNav />
          <div id="main-content">{children}</div>
          <GlobalFooter />
        </AuthProvider></LanguageProvider>
      </body>
    </html>
  );
}
