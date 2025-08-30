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

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Core Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FileText size={32} />
              </div>
              <h3>Versatile Uploads</h3>
              <p>Upload PDFs, DOCX, or simply paste text to get started.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Cpu size={32} />
              </div>
              <h3>Advanced AI</h3>
              <p>
                Our models are trained to understand context and extract key
                information.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Zap size={32} />
              </div>
              <h3>Blazing Fast</h3>
              <p>
                Receive your summaries in seconds, thanks to our optimized
                infrastructure.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Star size={32} />
              </div>
              <h3>High Quality</h3>
              <p>
                Get human-like summaries that are accurate and easy to
                understand.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
