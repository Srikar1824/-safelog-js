import { useState } from "react";

const API_DATA = [
  {
    id: "redact",
    name: "redact()",
    color: "#4ade80",
    icon: "🛡️",
    signature: "redact(data, [options])",
    desc: "Deep-clones data and replaces the values of any sensitive keys with the replacement string. The original is never mutated.",
    returns: "A deep-cloned, redacted copy of data.",
    throws: "TypeError if options is not a plain object, sensitiveKeys is not a string array, or replacement is not a string.",
    params: [
      { name: "data", type: "any", default: "—", desc: "The value to sanitize. Can be an object, array, or any primitive." },
      { name: "options.sensitiveKeys", type: "string[]", default: "[]", desc: "Additional key names to redact (merged with the built-in list)." },
      { name: "options.replacement", type: "string", default: '"******"', desc: "The string used to replace redacted values." },
    ],
    example: `const { redact } = require("safelog-js");

redact({ username: "alice", password: "secret" });
// => { username: "alice", password: "******" }

redact({ name: "Alice", pin: "1234" }, { sensitiveKeys: ["pin"] });
// => { name: "Alice", pin: "******" }

redact({ token: "abc" }, { replacement: "[REDACTED]" });
// => { token: "[REDACTED]" }`,
  },
  {
    id: "create-redactor",
    name: "createRedactor()",
    color: "#22d3ee",
    icon: "⚙️",
    signature: "createRedactor([options])",
    desc: "Creates a pre-configured redactor function. Configure once at startup, call everywhere — perfect for project-wide safe logging.",
    returns: "function(data) → * — a bound redact that always uses the specified options.",
    throws: "TypeError on invalid options (at creation time, not call time).",
    params: [
      { name: "options.sensitiveKeys", type: "string[]", default: "[]", desc: "Extra key names to redact." },
      { name: "options.replacement", type: "string", default: '"******"', desc: "Replacement string." },
    ],
    example: `const { createRedactor } = require("safelog-js");

const safeLog = createRedactor({
  sensitiveKeys: ["pin", "dob"],
  replacement: "[HIDDEN]"
});

safeLog({ name: "Alice", pin: "1234", dob: "1990-01-01" });
// => { name: "Alice", pin: "[HIDDEN]", dob: "[HIDDEN]" }

safeLog({ name: "Bob", password: "pass", pin: "9999" });
// => { name: "Bob", password: "[HIDDEN]", pin: "[HIDDEN]" }`,
  },
  {
    id: "sanitize-string",
    name: "sanitizeString()",
    color: "#a78bfa",
    icon: "🔍",
    signature: "sanitizeString(str, [options])",
    desc: "Scans a raw string (e.g. a log line) for built-in sensitive patterns and replaces them. Detects JWTs, credit cards, SSNs, AWS keys, and PEM blocks.",
    returns: "A new string with sensitive patterns replaced.",
    throws: "TypeError if str is not a string, options is not a plain object, replacement is not a string, or patterns is not an array.",
    params: [
      { name: "str", type: "string", default: "—", desc: "The string to sanitize." },
      { name: "options.replacement", type: "string", default: '"[REDACTED]"', desc: "Replacement text." },
      { name: "options.patterns", type: "Array<{name, pattern}>", default: "[]", desc: "Additional patterns. Each pattern must be a global RegExp." },
    ],
    example: `const { sanitizeString } = require("safelog-js");

const rawLog = "Login with Bearer eyJhbGciOiJIUzI1NiJ9.payload.sig";
sanitizeString(rawLog);
// => "Login with Bearer [REDACTED]"

// Custom pattern
sanitizeString("Employee: EMP-9999 checked in", {
  patterns: [{ name: "empId", pattern: /EMP-\\d+/g }]
});
// => "Employee: [REDACTED] checked in"`,
  },
  {
    id: "middleware",
    name: "createExpressMiddleware()",
    color: "#fb923c",
    icon: "🔌",
    signature: "createExpressMiddleware([options])",
    desc: "Creates an Express middleware that attaches req.safeBody — a redacted clone of req.body — to every incoming request.",
    returns: "function(req, res, next) — standard Express middleware.",
    throws: "TypeError on invalid options (at creation time).",
    params: [
      { name: "options.sensitiveKeys", type: "string[]", default: "[]", desc: "Extra key names to redact." },
      { name: "options.replacement", type: "string", default: '"******"', desc: "Replacement string." },
    ],
    example: `const express = require("express");
const { createExpressMiddleware } = require("safelog-js");

const app = express();
app.use(express.json());
app.use(createExpressMiddleware());

app.post("/login", (req, res) => {
  // Safe to log — passwords are masked
  console.log("Login attempt:", req.safeBody);
  // => { username: "alice", password: "******" }

  // req.body still has the real values
  authenticate(req.body.username, req.body.password);
  res.send("ok");
});`,
  },
];

const DEFAULT_KEYS = `password, passwd, pwd, pass, secret, clientSecret, privateKey, encryptionKey,
token, accessToken, refreshToken, idToken, bearerToken, authToken, sessionToken,
csrfToken, apiKey, apiSecret, appSecret, authorization, auth, bearer,
cookie, sessionId, session, creditCard, cardNumber, cvv, cvc, pan,
ssn, sin, taxId, driverLicense, passport, nationalId, otp, mfaCode,
totpSecret, pin`;

export default function ApiReference() {
  const [expanded, setExpanded] = useState("redact");
  const [showKeys, setShowKeys] = useState(false);

  const toggle = (id) => setExpanded(expanded === id ? null : id);

  return (
    <section id="api-reference" className="py-24 px-6" style={{ background: "rgba(22,27,34,0.5)" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="section-label mb-3">Documentation</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">API Reference</h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Complete documentation for all four safelog-js functions.
          </p>
        </div>

        {/* API cards */}
        <div className="space-y-3">
          {API_DATA.map((api) => (
            <div
              key={api.id}
              className="glass-card overflow-hidden"
              style={{
                borderColor: expanded === api.id ? `${api.color}30` : "rgba(255,255,255,0.06)",
                transition: "border-color 0.2s",
              }}
            >
              {/* Header row */}
              <button
                id={`api-${api.id}`}
                onClick={() => toggle(api.id)}
                className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
                    style={{ background: `${api.color}15` }}
                  >
                    {api.icon}
                  </div>
                  <div>
                    <code
                      className="font-mono font-semibold text-base"
                      style={{ color: api.color }}
                    >
                      {api.name}
                    </code>
                    <p className="text-xs text-text-muted mt-0.5">{api.desc.slice(0, 70)}…</p>
                  </div>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-text-muted transition-transform"
                  style={{ transform: expanded === api.id ? "rotate(180deg)" : "rotate(0)" }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {/* Expanded content */}
              {expanded === api.id && (
                <div
                  className="border-t px-5 pb-5 pt-4 space-y-5"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                  {/* Signature */}
                  <div>
                    <label className="section-label">Signature</label>
                    <code
                      className="block font-mono text-sm mt-1 p-3 rounded-lg"
                      style={{ background: "#010409", color: api.color }}
                    >
                      {api.signature}
                    </code>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-text-secondary leading-relaxed">{api.desc}</p>

                  {/* Parameters table */}
                  <div>
                    <label className="section-label">Parameters</label>
                    <div
                      className="mt-2 rounded-lg overflow-hidden"
                      style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <table className="w-full text-xs">
                        <thead>
                          <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                            {["Parameter", "Type", "Default", "Description"].map((h) => (
                              <th
                                key={h}
                                className="text-left px-3 py-2 text-text-muted font-medium"
                                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {api.params.map((p, i) => (
                            <tr key={p.name} style={{ background: i % 2 === 1 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                              <td className="px-3 py-2.5">
                                <code style={{ color: api.color }} className="font-mono">{p.name}</code>
                              </td>
                              <td className="px-3 py-2.5">
                                <code className="text-cyan-400 font-mono">{p.type}</code>
                              </td>
                              <td className="px-3 py-2.5">
                                <code className="text-text-muted font-mono">{p.default}</code>
                              </td>
                              <td className="px-3 py-2.5 text-text-secondary">{p.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Returns & Throws */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="section-label">Returns</label>
                      <p className="text-xs text-text-secondary mt-1">{api.returns}</p>
                    </div>
                    <div>
                      <label className="section-label">Throws</label>
                      <p className="text-xs text-text-secondary mt-1">{api.throws}</p>
                    </div>
                  </div>

                  {/* Example */}
                  <div>
                    <label className="section-label">Example</label>
                    <div className="code-block-wrapper mt-2">
                      <pre
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.75rem",
                          lineHeight: 1.75,
                          background: "#010409",
                          border: "1px solid rgba(255,255,255,0.06)",
                          borderRadius: "8px",
                          padding: "16px",
                          overflowX: "auto",
                          color: "#e6edf3",
                        }}
                      >
                        <code>{api.example}</code>
                      </pre>
                      <button
                        onClick={() => navigator.clipboard.writeText(api.example)}
                        className="copy-btn"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Default sensitive keys */}
        <div className="mt-8 glass-card p-6">
          <button
            id="default-keys-toggle"
            className="w-full flex items-center justify-between"
            onClick={() => setShowKeys(!showKeys)}
          >
            <div>
              <h3 className="font-semibold text-text-primary">Default Sensitive Keys</h3>
              <p className="text-xs text-text-secondary mt-0.5">
                These keys are automatically redacted (case-insensitive, ignoring hyphens/underscores)
              </p>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-text-muted transition-transform"
              style={{ transform: showKeys ? "rotate(180deg)" : "rotate(0)" }}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {showKeys && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {DEFAULT_KEYS.split(/,\s*|\n/).map((k) => k.trim()).filter(Boolean).map((key) => (
                  <span key={key} className="chip">
                    {key}
                  </span>
                ))}
              </div>
              <p className="text-xs text-text-muted mt-3">
                Extend this list per-call using <code className="text-accent-green font-mono">options.sensitiveKeys</code>.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
