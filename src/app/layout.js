import Navigation from "@/components/Navigation";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SnapSummary - AI-Powered Document Summarization",
  description:
    "Transform your documents into concise, intelligent summaries with AI technology. Upload, process, and get structured summaries in seconds.",
  keywords:
    "PDF summarization, AI document processing, text extraction, document analysis, summarizer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#7C3AED" />
      </head>
      <body className={inter.className}>
        <Navigation />
        <main className="main-content">{children}</main>
        {/* <footer className="footer">
          <p>&copy; 2024 DocuSynth. All rights reserved.</p>
        </footer> */}
      </body>
    </html>
  );
}
