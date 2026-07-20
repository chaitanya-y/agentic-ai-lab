import type { Metadata } from "next";
import { SiteHeader } from "./components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agentic AI Lab",
  description: "A portfolio dashboard for LangChain, LangGraph, Deep Agents, RAG, SQL, voice, and multi-agent systems."
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
      </body>
    </html>
  );
}
