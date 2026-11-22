import { useState, useEffect } from "react";

export default function Navbar({ safelogVersion }) {
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const installCmd = "npm install safelog-js";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const copyInstall = async () => {
    await navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(13,17,23,0.95)"
          : "rgba(13,17,23,0.7)",
        backdropFilter: "blur(16px)",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-bg-primary font-bold text-sm"
            style={{ background: "linear-gradient(135deg, #4ade80, #22d3ee)" }}
          >
            SL
          </div>
          <span className="font-bold text-text-primary text-lg">
            safe<span style={{ color: "#4ade80" }}>log</span>
            <span className="text-text-muted font-normal text-sm">-js</span>
          </span>
          {safelogVersion && (
            <span className="badge badge-green hidden sm:inline-flex">
              v{safelogVersion}
            </span>
          )}
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {[
            { label: "Playground", id: "playground" },
            { label: "API Docs", id: "api-reference" },
            { label: "Quick Start", id: "quickstart" },
          ].map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Install command */}
          <button
            onClick={copyInstall}
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#8b949e",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(74,222,128,0.3)";
              e.currentTarget.style.color = "#4ade80";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "#8b949e";
            }}
          >
            <span style={{ color: "#4ade80" }}>$</span>
            {installCmd}
            <span style={{ color: copied ? "#4ade80" : "#484f58" }}>
              {copied ? "✓" : "⎘"}
            </span>
          </button>

          {/* GitHub */}
          <a
            href="https://github.com/Srikar1824/safelog"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 btn-secondary text-xs py-2 px-3"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
