import { useState } from "react";
import axios from "axios";
import ChipInput from "./ChipInput";
import CopyButton from "./CopyButton";

const DEFAULT_INPUT = `{
  "username": "alice",
  "password": "s3cr3t123",
  "apiKey": "sk_live_abc123XYZ",
  "profile": {
    "city": "Pune",
    "accessToken": "eyJhbGciOiJIUzI1NiJ9.payload.sig",
    "refreshToken": "tok_refresh_xyz"
  },
  "accounts": [
    { "id": 1, "pin": "4321" },
    { "id": 2, "pin": "9999" }
  ]
}`;

export default function RedactTab() {
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [sensitiveKeys, setSensitiveKeys] = useState([]);
  const [replacement, setReplacement] = useState("******");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setError("");
    setResult(null);
    setLoading(true);

    let parsed;
    try {
      parsed = JSON.parse(input);
    } catch {
      setError("Invalid JSON — please check your input.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL || ""}/api/redact`, {
        data: parsed,
        sensitiveKeys,
        replacement: replacement || "******",
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setInput(DEFAULT_INPUT);
    setSensitiveKeys([]);
    setReplacement("******");
    setResult(null);
    setError("");
  };

  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="glass-card p-4 flex items-start gap-3">
        <span className="text-xl">🛡️</span>
        <div>
          <p className="text-sm text-text-primary font-medium mb-1">
            <code className="font-mono text-accent-green">redact(data, options)</code>
          </p>
          <p className="text-xs text-text-secondary leading-relaxed">
            Deep-clones your data and replaces sensitive field values. The original object is{" "}
            <strong className="text-text-primary">never mutated</strong>. Handles nested objects,
            arrays, circular references, and built-in sensitive keys automatically.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input */}
        <div className="space-y-4">
          <div>
            <label className="section-label">Input JSON</label>
            <textarea
              className="code-area"
              style={{ minHeight: "220px" }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
            />
          </div>

          <ChipInput
            label="Extra Sensitive Keys (merged with built-ins)"
            chips={sensitiveKeys}
            onChange={setSensitiveKeys}
            placeholder="e.g. pin, dob, employeeId…"
          />

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Replacement String
            </label>
            <input
              type="text"
              className="input-field"
              value={replacement}
              onChange={(e) => setReplacement(e.target.value)}
              placeholder='e.g. ****** or [REDACTED]'
            />
          </div>

          <div className="flex gap-3">
            <button
              id="redact-run-btn"
              onClick={run}
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? (
                <span className="spinner" />
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
              {loading ? "Redacting…" : "Run redact()"}
            </button>
            <button onClick={reset} className="btn-secondary">
              Reset
            </button>
          </div>
        </div>

        {/* Right: Output */}
        <div className="space-y-4">
          {/* Original */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="section-label">Original (never mutated)</label>
              {result && <CopyButton text={JSON.stringify(result.original, null, 2)} />}
            </div>
            <div
              className="output-panel"
              style={{ minHeight: "100px", color: "#8b949e" }}
            >
              {result
                ? JSON.stringify(result.original, null, 2)
                : <span className="text-text-muted">Run redact() to see output…</span>}
            </div>
          </div>

          {/* Redacted */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="section-label" style={{ color: "#4ade80" }}>
                ✅ Redacted (safe to log)
              </label>
              {result && <CopyButton text={JSON.stringify(result.redacted, null, 2)} />}
            </div>
            <div
              className="output-panel"
              style={{ minHeight: "100px", borderColor: result ? "rgba(74,222,128,0.2)" : undefined }}
            >
              {error ? (
                <span style={{ color: "#f87171" }}>{error}</span>
              ) : result ? (
                <span style={{ color: "#4ade80" }}>
                  {JSON.stringify(result.redacted, null, 2)}
                </span>
              ) : (
                <span className="text-text-muted">Sensitive values will appear masked here…</span>
              )}
            </div>
          </div>

          {/* Keys info */}
          {result && (
            <div
              className="text-xs text-text-muted p-3 rounded-lg"
              style={{ background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.1)" }}
            >
              🔑 Built-in sensitive keys include: password, apiKey, token, accessToken, secret, pin, cvv, ssn, and{" "}
              <a
                href="#api-reference"
                className="text-accent-green underline underline-offset-2"
              >
                40+ more
              </a>
              .{sensitiveKeys.length > 0 && ` Plus your custom: ${sensitiveKeys.join(", ")}.`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
