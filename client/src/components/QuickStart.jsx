import { useState } from "react";

const STEPS = [
  {
    step: "01",
    title: "Install",
    code: `npm install safelog-js`,
    lang: "bash",
    color: "#4ade80",
    note: "Requires Node.js ≥ 18",
  },
  {
    step: "02",
    title: "Import",
    code: `const { redact, createRedactor, sanitizeString, createExpressMiddleware } = require("safelog-js");
// or ES modules:
import { redact } from "safelog-js";`,
    lang: "js",
    color: "#22d3ee",
  },
  {
    step: "03",
    title: "Redact objects",
    code: `const user = {
  name: "Alice",
  password: "s3cr3t",
  apiKey: "sk_live_abc123",
  profile: { city: "Pune", accessToken: "eyJhbGci..." }
};

console.log(redact(user));
// { name: "Alice", password: "******", apiKey: "******",
//   profile: { city: "Pune", accessToken: "******" } }`,
    lang: "js",
    color: "#4ade80",
  },
  {
    step: "04",
    title: "Sanitize raw strings",
    code: `const rawLog = "Login: Bearer eyJhbGciOiJIUzI1NiJ9.payload.sig";
console.log(sanitizeString(rawLog));
// "Login: Bearer [REDACTED]"`,
    lang: "js",
    color: "#a78bfa",
  },
  {
    step: "05",
    title: "Use in Express",
    code: `app.use(express.json());
app.use(createExpressMiddleware());

app.post("/login", (req, res) => {
  console.log(req.safeBody); // Safe to log!
  authenticate(req.body.username, req.body.password); // Real data intact
});`,
    lang: "js",
    color: "#fb923c",
  },
];

export default function QuickStart() {
  const [copiedIdx, setCopiedIdx] = useState(null);

  const copy = async (code, idx) => {
    await navigator.clipboard.writeText(code);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <section id="quickstart" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="section-label mb-3">Get Started</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">Quick Start</h2>
          <p className="text-text-secondary">Up and running in under a minute.</p>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {STEPS.map((step, i) => (
            <div key={step.step} className="flex gap-5 group">
              {/* Step number + line */}
              <div className="flex flex-col items-center gap-1 pt-1">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: `${step.color}20`, color: step.color, border: `1px solid ${step.color}30` }}
                >
                  {step.step}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-px flex-1 mt-1" style={{ background: `${step.color}20`, minHeight: "24px" }} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-6">
                <h3
                  className="font-semibold text-text-primary mb-3 flex items-center gap-2"
                >
                  {step.title}
                  {step.note && (
                    <span className="badge" style={{ background: `${step.color}10`, border: `1px solid ${step.color}20`, color: step.color, fontSize: "0.65rem" }}>
                      {step.note}
                    </span>
                  )}
                </h3>
                <div className="relative group/code">
                  <pre
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.8rem",
                      lineHeight: 1.75,
                      background: "#010409",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "10px",
                      padding: "16px 20px",
                      overflowX: "auto",
                      color: "#e6edf3",
                      borderLeft: `3px solid ${step.color}`,
                    }}
                  >
                    <code>{step.code}</code>
                  </pre>
                  <button
                    onClick={() => copy(step.code, i)}
                    className="copy-btn"
                    style={{ opacity: 0 }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    {copiedIdx === i ? "✓ Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="mt-12 p-6 rounded-2xl text-center"
          style={{
            background: "linear-gradient(135deg, rgba(74,222,128,0.08) 0%, rgba(34,211,238,0.06) 100%)",
            border: "1px solid rgba(74,222,128,0.2)",
          }}
        >
          <h3 className="text-xl font-bold text-text-primary mb-2">Ready to secure your logs?</h3>
          <p className="text-text-secondary text-sm mb-6">
            Start protecting sensitive data in minutes. Free and open source under the MIT license.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              id="quickstart-npm-link"
              href="https://www.npmjs.com/package/safelog-js"
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              View on NPM →
            </a>
            <a
              id="quickstart-github-link"
              href="https://github.com/Srikar1824/safelog"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
              </svg>
              Star on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
