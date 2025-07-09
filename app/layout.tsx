import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FloatingGithub } from "@/components/Github";
// import { FloatingAdminAccess } from "@/components/AdminAccess";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GitaX AI Playground – Interactive Machine Learning Platform",
  description:
    "An interactive ML learning platform with visualizations, real-time experimentation, and AI-powered explanations. Explore supervised, unsupervised, neural networks, and reinforcement learning interactively.",
  keywords: [
    "machine learning",
    "interactive AI",
    "ML visualization",
    "neural networks",
    "reinforcement learning",
    "data science education",
    "GitaX AI Playground",
    "Next.js",
    "educational platform",
    "Gemini API"
  ],
  metadataBase: new URL("https://gitax-ai-playground.vercel.app"), // change to your domain
  themeColor: "#ffffff",
  openGraph: {
    title: "GitaX AI Playground – Interactive ML Learning Platform",
    description:
      "Explore ML concepts hands-on with real-time visualizations, data experimentation, and Gemini-powered AI explanations.",
    url: "https://gitax-ai-playground.vercel.app", // change if deployed on a custom domain
    siteName: "GitaX AI Playground",
    images: [
      {
        url: "/https://i.ibb.co/27cs8BPP/image.png", // place og-image.png in /public
        width: 1200,
        height: 630,
        alt: "GitaX AI Playground – Visual ML Platform",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GitaX AI Playground",
    description:
      "Interactive platform for exploring and learning machine learning with real-time visualizations and AI explanations.",
    images: ["https://i.ibb.co/27cs8BPP/image.png"],
    creator: "@your_twitter_handle", // optional
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) { 
  return (
    <html lang="en">
      <body
        className={`bg-white`}
      >
        {children}
        <FloatingGithub/>
      </body>
    </html>
  );
}
