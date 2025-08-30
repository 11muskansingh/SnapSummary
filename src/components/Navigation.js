"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { BookText, Menu, X } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();
  const isOnSummaryPage = pathname === "/summarize";
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleNewFileClick = (e) => {
    if (isOnSummaryPage) {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent("resetSummaryPage"));
    }
    if (isMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`main-header ${isScrolled ? "scrolled" : ""}`}>
      <nav className="navigation-container">
        <Link href="/" className="nav-logo">
          <BookText size={32} className="logo-icon" />
          <span className="logo-text">SnapSummary</span>
        </Link>

        <div className="nav-menu-container">
          <ul className={`nav-links ${isMobileMenuOpen ? "open" : ""}`}>
            <li>
              <Link
                href="/"
                className={`nav-link ${pathname === "/" ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/summarize"
                className={`nav-link ${
                  pathname === "/summarize" ? "active" : ""
                }`}
                onClick={handleNewFileClick}
              >
                Summarize
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`nav-link ${pathname === "/about" ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
            </li>
          </ul>
        </div>

        <button
          className="nav-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>
    </header>
  );
}
