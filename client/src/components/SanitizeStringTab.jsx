import { useState } from "react";
import axios from "axios";
import CopyButton from "./CopyButton";

const BUILT_IN_PATTERNS = [
  { name: "JWT tokens", example: "eyJhbGci..." },
  { name: "Credit card numbers", example: "4111 1111 1111 1111" },
  { name: "US Social Security Numbers", example: "123-45-6789" },
  { name: "AWS Access Key IDs", example: "AKIAIOSFODNN7EXAMPLE" },
  { name: "PEM private key blocks", example: "-----BEGIN RSA PRIVATE KEY-----" },
];

const DEFAULT_STR = `User alice logged in. Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbGljZSJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c for session. Card: 4111-1111-1111-1111. SSN: 987-65-4321. AWS Key: AKIAIOSFODNN7EXAMPLE detected.`;

export default function SanitizeStringTab() {
  const [input, setInput] = useState(DEFAULT_STR);
  const [replacement, setReplacement] = useState("[REDACTED]");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setError("");
    setResult(null);
    setLoading(true);

    if (!input.trim()) {
      setError("Please enter a string to sanitize.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post("/api/sanitize-string", {
        str: input,
        replacement: replacement || "[REDACTED]",
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setInput(DEFAULT_STR);
    setReplacement("[REDACTED]");
    setResult(null);
    setError("");
  };

  // Highlight differences
  const highlightDiff = (original, sanitized) => {
    if (!original || !sanitized) return sanitized;
    // Simple: show sanitized with [REDACTED] highlighted in purple
    return sanitized.split(replacement).map((part, i, arr) => (
      <span key={i}>
        {part}
        {i < arr.length - 1 && (
          <mark
            style={{
              background: "rgba(167,139,250,0.2)",
              color: "#a78bfa",
              borderRadius: "4px",
              padding: "0 4px",
            }}
          >
            {replacement}
          </mark>
        )}
      </span>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="glass-card p-4 flex items-start gap-3">
        <span className="text-xl">🔍</span>
        <div>
          <p className="text-sm text-text-primary font-medium mb-1">
            <code className="font-mono text-purple-400">sanitizeString(str, options)</code>
          </p>
          <p className="text-xs text-text-secondary leading-relaxed">
            Scans a <strong className="text-text-primary">raw string</strong> (e.g. a log line) for
            sensitive patterns and replaces them. Automatically detects JWTs, credit card numbers,
            SSNs, AWS access keys, and PEM private key blocks.
          </p>
        </div>
      </div>

      {/* Built-in patterns */}
      <div>
        <label className="section-label">Built-in Detected Patterns</label>
        <div className="flex flex-wrap gap-2">
          {BUILT_IN_PATTERNS.map((p) => (
            <div
              key={p.name}
              className="glass-card px-3 py-2 flex flex-col gap-0.5"
              style={{ borderColor: "rgba(167,139,250,0.2)" }}
            >
              <span className="text-xs font-medium text-purple-400">{p.name}</span>
              <span className="text-xs font-mono text-text-muted">{p.example}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input */}
        <div className="space-y-4">
          <div>
            <label className="section-label">Raw Log String</label>
            <textarea
              className="code-area"
              style={{ minHeight: "200px" }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Replacement Text
            </label>
            <input
              type="text"
              className="input-field"
              value={replacement}
              onChange={(e) => setReplacement(e.target.value)}
              placeholder="[REDACTED]"
            />
          </div>

          <div className="flex gap-3">
            <button
              id="sanitize-string-run-btn"
              onClick={run}
              disabled={loading}
              className="btn-primary flex-1"
              style={{ background: "linear-gradient(135deg, #a78bfa, #7c3aed)" }}
            >
              {loading ? <span className="spinner" /> : "🔍"}
              {loading ? "Sanitizing…" : "Run sanitizeString()"}
            </button>
            <button onClick={reset} className="btn-secondary">
              Reset
            </button>
          </div>
        </div>

        {/* Right: Output */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="section-label">Original String</label>
              {result && <CopyButton text={result.original} />}
            </div>
            <div
              className="output-panel text-text-secondary"
              style={{ minHeight: "100px", whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              {result ? result.original : (
                <span className="text-text-muted">Your log string will appear here…</span>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="section-label" style={{ color: "#a78bfa" }}>
                ✅ Sanitized Output
              </label>
              {result && <CopyButton text={result.sanitized} />}
            </div>
            <div
              className="output-panel"
              style={{
                minHeight: "100px",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                borderColor: result ? "rgba(167,139,250,0.2)" : undefined,
              }}
            >
              {error ? (
                <span style={{ color: "#f87171" }}>{error}</span>
              ) : result ? (
                <span style={{ lineHeight: 1.8 }}>
                  {highlightDiff(result.original, result.sanitized)}
                </span>
              ) : (
                <span className="text-text-muted">Sensitive patterns will be highlighted after sanitization…</span>
              )}
            </div>
          </div>

          {result && (
            <div
              className="text-xs p-3 rounded-lg"
              style={{ background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.15)", color: "#8b949e" }}
            >
              💡 Highlighted sections in purple are where the package replaced sensitive patterns.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
