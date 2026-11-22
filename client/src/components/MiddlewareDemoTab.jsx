import { useState } from "react";
import axios from "axios";
import ChipInput from "./ChipInput";
import CopyButton from "./CopyButton";

const DEFAULT_BODY = `{
  "username": "alice",
  "password": "s3cr3tP@ssw0rd",
  "rememberMe": true,
  "device": "iPhone 15"
}`;

const EXPRESS_CODE = `const express = require("express");
const { createExpressMiddleware } = require("safelog-js");

const app = express();
app.use(express.json());
app.use(createExpressMiddleware()); // attaches req.safeBody

app.post("/login", (req, res) => {
  // ✅ Safe to log — passwords are masked
  console.log("Login attempt:", req.safeBody);

  // req.body still has the real values for business logic
  authenticate(req.body.username, req.body.password);
  res.send("ok");
});`;

export default function MiddlewareDemoTab() {
  const [bodyText, setBodyText] = useState(DEFAULT_BODY);
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
      parsed = JSON.parse(bodyText);
    } catch {
      setError("Invalid JSON — please check the simulated request body.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post("/api/middleware-demo", {
        body: parsed,
        sensitiveKeys,
        replacement: replacement || "******",
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setBodyText(DEFAULT_BODY);
    setSensitiveKeys([]);
    setReplacement("******");
    setResult(null);
    setError("");
  };

  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="glass-card p-4 flex items-start gap-3">
        <span className="text-xl">🔌</span>
        <div>
          <p className="text-sm text-text-primary font-medium mb-1">
            <code className="font-mono text-orange-400">createExpressMiddleware(options)</code>
          </p>
          <p className="text-xs text-text-secondary leading-relaxed">
            Creates an Express middleware that attaches{" "}
            <code className="text-text-primary font-mono">req.safeBody</code> — a redacted clone of{" "}
            <code className="text-text-primary font-mono">req.body</code> — to every incoming request.
            The original <code className="font-mono">req.body</code> is{" "}
            <strong className="text-text-primary">never modified</strong> and remains available for
            your business logic.
          </p>
        </div>
      </div>

      {/* Express code sample */}
      <div>
        <label className="section-label mb-3 block">How it works in Express</label>
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div
            className="flex items-center gap-2 px-4 py-2 justify-between"
            style={{ background: "#1c2128", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-400 opacity-70" />
              <span className="text-xs text-text-muted font-mono">server.js</span>
            </div>
            <CopyButton text={EXPRESS_CODE} />
          </div>
          <pre
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.75rem",
              lineHeight: 1.75,
              background: "#010409",
              padding: "16px 20px",
              overflowX: "auto",
              color: "#e6edf3",
            }}
          >
            <code>{EXPRESS_CODE}</code>
          </pre>
        </div>
      </div>

      <div className="divider" />

      <p className="text-sm font-semibold text-text-primary">🔬 Live Simulation</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Simulated request */}
        <div className="space-y-4">
          <div
            className="p-4 rounded-xl space-y-4"
            style={{ background: "rgba(251,146,60,0.04)", border: "1px solid rgba(251,146,60,0.15)" }}
          >
            <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest">
              Simulated POST Request Body (req.body)
            </p>
            <textarea
              className="code-area"
              style={{ minHeight: "160px" }}
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              spellCheck={false}
            />
          </div>

          <ChipInput
            label="Extra Sensitive Keys"
            chips={sensitiveKeys}
            onChange={setSensitiveKeys}
            placeholder="e.g. deviceId, sessionKey…"
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
              placeholder="******"
            />
          </div>

          <div className="flex gap-3">
            <button
              id="middleware-run-btn"
              onClick={run}
              disabled={loading}
              className="btn-primary flex-1"
              style={{ background: "linear-gradient(135deg, #fb923c, #ea580c)" }}
            >
              {loading ? <span className="spinner" /> : "🔌"}
              {loading ? "Simulating…" : "Simulate Middleware"}
            </button>
            <button onClick={reset} className="btn-secondary">
              Reset
            </button>
          </div>
        </div>

        {/* Right: Results */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="section-label text-orange-400">req.body (untouched)</label>
              {result && <CopyButton text={JSON.stringify(result.originalBody, null, 2)} />}
            </div>
            <div
              className="output-panel text-text-secondary"
              style={{ minHeight: "120px", borderColor: result ? "rgba(251,146,60,0.2)" : undefined }}
            >
              {result
                ? JSON.stringify(result.originalBody, null, 2)
                : <span className="text-text-muted">req.body will appear here…</span>}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="section-label" style={{ color: "#4ade80" }}>
                ✅ req.safeBody (safe to log)
              </label>
              {result && <CopyButton text={JSON.stringify(result.safeBody, null, 2)} />}
            </div>
            <div
              className="output-panel"
              style={{
                minHeight: "120px",
                color: result ? "#4ade80" : undefined,
                borderColor: result ? "rgba(74,222,128,0.2)" : undefined,
              }}
            >
              {error ? (
                <span style={{ color: "#f87171" }}>{error}</span>
              ) : result ? (
                JSON.stringify(result.safeBody, null, 2)
              ) : (
                <span className="text-text-muted">req.safeBody will appear here after simulation…</span>
              )}
            </div>
          </div>

          {result && (
            <div
              className="text-xs p-3 rounded-lg space-y-1"
              style={{ background: "rgba(251,146,60,0.06)", border: "1px solid rgba(251,146,60,0.15)" }}
            >
              <p className="font-semibold text-orange-400">💡 Key Takeaway</p>
              <p className="text-text-muted">{result.middlewareNote}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
