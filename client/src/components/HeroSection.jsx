import { useEffect, useRef } from "react";

const FEATURES = [
  {
    icon: "🛡️",
    title: "redact()",
    desc: "Deep-clone & mask sensitive fields in any JS object — nested, arrays, circular refs all handled.",
    color: "#4ade80",
  },
  {
    icon: "⚙️",
    title: "createRedactor()",
    desc: "Configure once, call everywhere. Create a project-wide safe redactor with preset options.",
    color: "#22d3ee",
  },
  {
    icon: "🔍",
    title: "sanitizeString()",
    desc: "Scan raw log strings and auto-detect JWTs, credit cards, SSNs, and AWS access keys.",
    color: "#a78bfa",
  },
  {
    icon: "🔌",
    title: "createExpressMiddleware()",
    desc: "Drop-in Express middleware that attaches req.safeBody on every request automatically.",
    color: "#fb923c",
  },
];

export default function HeroSection({ safelogVersion }) {
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    heroRef.current?.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToPlayground = () => {
    document.getElementById("playground")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center hero-grid overflow-hidden pt-20"
    >
      {/* Background glow orbs */}
      <div
        className="glow-orb"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%)",
          top: "-100px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
      <div
        className="glow-orb"
        style={{
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(88,166,255,0.08) 0%, transparent 70%)",
          bottom: "100px",
          right: "-100px",
        }}
      />
      <div
        className="glow-orb"
        style={{
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)",
          bottom: "200px",
          left: "-50px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Top badge */}
        <div
          className="fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{
            background: "rgba(74,222,128,0.08)",
            border: "1px solid rgba(74,222,128,0.2)",
            transitionDelay: "0ms",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
          <span className="text-xs font-medium text-accent-green">
            Now on NPM {safelogVersion ? `· v${safelogVersion}` : ""}
          </span>
        </div>

        {/* Headline */}
        <h1
          className="fade-up text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
          style={{ transitionDelay: "80ms", letterSpacing: "-0.02em" }}
        >
          <span className="text-text-primary">Stop leaking secrets</span>
          <br />
          <span className="shimmer-text">into your logs.</span>
        </h1>

        {/* Subheading */}
        <p
          className="fade-up text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ transitionDelay: "160ms" }}
        >
          <strong className="text-text-primary">safelog-js</strong> deep-clones your objects and
          automatically redacts passwords, tokens, API keys, and PII — so sensitive data{" "}
          <em>never</em> appears in your logs.
        </p>

        {/* CTA Buttons */}
        <div
          className="fade-up flex flex-wrap items-center justify-center gap-4 mb-16"
          style={{ transitionDelay: "240ms" }}
        >
          <button
            id="hero-try-playground"
            onClick={scrollToPlayground}
            className="btn-primary text-base px-6 py-3"
          >
            <span>Try the Playground</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <a
            href="https://www.npmjs.com/package/safelog-js"
            target="_blank"
            rel="noreferrer"
            id="hero-npm-link"
            className="btn-secondary text-base px-6 py-3"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect fill="#cb3837" width="24" height="24" rx="4" />
              <path fill="white" d="M3 3h18v18H3z" />
              <path fill="#cb3837" d="M4 4h16v16H4z" />
              <path fill="white" d="M6 6h12v12H6z" />
              <path fill="#cb3837" d="M8 8h8v8H8z" />
              <rect fill="white" x="6" y="6" width="12" height="12" />
              <rect fill="#cb3837" x="8" y="8" width="4" height="8" />
              <rect fill="#cb3837" x="14" y="8" width="2" height="4" />
            </svg>
            View on NPM
          </a>
        </div>

        {/* Live demo terminal preview */}
        <div
          className="fade-up text-left max-w-2xl mx-auto"
          style={{ transitionDelay: "320ms" }}
        >
          <div
            className="rounded-xl overflow-hidden"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(74,222,128,0.05)",
            }}
          >
            {/* Terminal title bar */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ background: "#1c2128", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span className="w-3 h-3 rounded-full bg-red-500 opacity-70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500 opacity-70" />
              <span className="w-3 h-3 rounded-full bg-green-500 opacity-70" />
              <span className="text-xs text-text-muted ml-2 font-mono">demo.js</span>
            </div>
            {/* Code */}
            <pre
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.78rem",
                lineHeight: 1.75,
                background: "#010409",
                padding: "20px 24px",
                overflowX: "auto",
              }}
            >
              <code>
                <span style={{ color: "#6e7681" }}>{"// Your actual login request body\n"}</span>
                <span style={{ color: "#ff7b72" }}>const </span>
                <span style={{ color: "#79c0ff" }}>user</span>
                <span style={{ color: "#e6edf3" }}>{" = {\n"}</span>
                <span style={{ color: "#e6edf3" }}>{"  username: "}</span>
                <span style={{ color: "#a5d6ff" }}>"alice"</span>
                <span style={{ color: "#e6edf3" }}>{",\n  password: "}</span>
                <span style={{ color: "#a5d6ff" }}>"s3cr3t123"</span>
                <span style={{ color: "#e6edf3" }}>{",\n  apiKey:   "}</span>
                <span style={{ color: "#a5d6ff" }}>"sk_live_abc123"</span>
                <span style={{ color: "#e6edf3" }}>{",\n  profile:  { accessToken: "}</span>
                <span style={{ color: "#a5d6ff" }}>"eyJhbGci..."</span>
                <span style={{ color: "#e6edf3" }}>{" }\n};\n\n"}</span>
                <span style={{ color: "#6e7681" }}>{"// ✅ Safe to log — never mutates original\n"}</span>
                <span style={{ color: "#79c0ff" }}>console</span>
                <span style={{ color: "#e6edf3" }}>.log(</span>
                <span style={{ color: "#d2a8ff" }}>redact</span>
                <span style={{ color: "#e6edf3" }}>(user));</span>
                <span style={{ color: "#6e7681" }}>{"\n// ⟹  { username: 'alice',\n"}</span>
                <span style={{ color: "#6e7681" }}>{"//       password: '******',\n"}</span>
                <span style={{ color: "#4ade80" }}>{"//       apiKey:   '******',\n"}</span>
                <span style={{ color: "#4ade80" }}>{"//       profile:  { accessToken: '******' } }"}</span>
              </code>
            </pre>
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 mt-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="fade-up glass-card p-5 hover:border-opacity-30 transition-all duration-300 group cursor-default"
              style={{
                transitionDelay: `${400 + i * 80}ms`,
                borderColor: "rgba(255,255,255,0.08)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${f.color}30`;
                e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${f.color}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                className="text-2xl mb-3 w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: `${f.color}15` }}
              >
                {f.icon}
              </div>
              <h3
                className="font-mono font-semibold text-sm mb-2"
                style={{ color: f.color }}
              >
                {f.title}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 mt-16 mb-8 flex flex-col items-center gap-2 opacity-40">
        <span className="text-xs text-text-muted">Try the playground</span>
        <div className="w-px h-8 bg-gradient-to-b from-text-muted to-transparent" />
      </div>
    </section>
  );
}
