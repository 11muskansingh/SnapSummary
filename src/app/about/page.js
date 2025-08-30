import { Target, Layers, Zap, Cloud, Users } from "lucide-react";

export default function About() {
  return (
    <div className="about-container">
      <section className="about-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            About <span className="text-primary">SnapSummary</span>
          </h1>
          <p className="hero-subtitle">
            An intelligent assistant to help you digest and understand your
            documents faster.
          </p>
        </div>
      </section>

      <section className="about-section">
        <div className="section-content">
          <div className="section-icon">
            <Target size={48} />
          </div>
          <h2 className="section-title">Our Mission</h2>
          <p className="section-text">
            In a world overflowing with information, our mission is to provide a
            powerful yet simple tool that helps users quickly extract the
            essence of any document. We aim to boost productivity and facilitate
            learning by making information more accessible and manageable.
          </p>
        </div>
      </section>

      <section className="about-section feature-section">
        <h2 className="section-title text-center">Core Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Zap size={32} />
            </div>
            <h3 className="feature-title">Interactive Summaries</h3>
            <p>
              Engage with summaries by clicking on sentences to see their
              context in the original document.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <Cloud size={32} />
            </div>
            <h3 className="feature-title">Cloud Integration</h3>
            <p>
              Seamlessly import documents from and save summaries to your
              favorite cloud storage services.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <Users size={32} />
            </div>
            <h3 className="feature-title">Team Collaboration</h3>
            <p>
              Share summaries with your team, leave comments, and work together
              in real-time.
            </p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="section-content">
          <div className="section-icon">
            <Layers size={48} />
          </div>
          <h2 className="section-title">Technology Stack</h2>
          <p className="section-text">
            SnapSummary is built with a modern, robust technology stack to
            ensure a seamless and responsive experience:
          </p>
          <ul className="tech-stack-list">
            <li>
              <strong>Frontend:</strong> Next.js & React
            </li>
            <li>
              <strong>Backend:</strong> Node.js with Express
            </li>
            <li>
              <strong>AI Integration:</strong> Hugging Face Transformers
            </li>
            <li>
              <strong>Styling:</strong> Modern CSS with CSS Variables
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
