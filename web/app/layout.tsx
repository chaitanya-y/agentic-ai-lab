import type { Metadata } from "next";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://agentic-ai-lab.chaitanya-yarramsett.chatgpt.site"
  ),
  title: {
    default: "Agentic AI engineering Lab for software engineers",
    template: "%s | Agentic AI engineering Lab"
  },
  description:
    "A 150–200 hour, project-first roadmap for software engineers transitioning into agentic engineering.",
  openGraph: {
    title: "Agentic AI engineering Lab for software engineers",
    description: "A practical roadmap from software engineering to production-minded agentic engineering.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Agentic AI Lab — Software Engineer to Agentic Engineer"
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Agentic AI engineering Lab for software engineers",
    description: "A 150–200 hour roadmap from software engineering to agentic engineering.",
    images: ["/og.png"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
