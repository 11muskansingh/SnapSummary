import Link from "next/link";
import Button from "@/components/Button";
import { FileText, Cpu, Zap, Star } from "lucide-react";

export default function HomePage() {
  return (
    <div className="homepage">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to <span className="hero-accent">SnapSummary</span>
            </h1>
            <p className="hero-description">
              Your intelligent assistant for summarizing documents. We use
              cutting-edge AI to distill long-form content into concise,
              easy-to-read summaries.
            </p>

            <div className="hero-actions">
              <Link href="/summarize">
                <Button size="large" variant="primary">
                  Get Started
                </Button>
              </Link>
              <Link href="/about">
                <Button size="large" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">
                <FileText size={40} />
              </div>
              <h3>Upload Your Document</h3>
              <p>
                Drag and drop your file (PDF, DOCX, TXT) or paste the content
                directly.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">
                <Cpu size={40} />
              </div>
              <h3>AI-Powered Analysis</h3>
              <p>
                Our intelligent system analyzes the content, identifying key
                points and main ideas.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">
                <Zap size={40} />
              </div>
              <h3>Get Your Summary</h3>
              <p>
                Receive a concise, easy-to-read summary in just a few seconds.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
