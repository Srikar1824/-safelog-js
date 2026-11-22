import { useState } from "react";
import axios from "axios";
import ChipInput from "./ChipInput";
import CopyButton from "./CopyButton";

const DEFAULT_INPUTS = `{ "name": "Alice", "pin": "1234", "dob": "1990-01-01" }
{ "name": "Bob", "password": "hunter2", "pin": "9999" }
{ "name": "Carol", "ssn": "123-45-6789", "creditCard": "4111111111111111" }`;

export default function CustomRedactorTab() {
  const [sensitiveKeys, setSensitiveKeys] = useState(["pin", "dob"]);
  const [replacement, setReplacement] = useState("[HIDDEN]");
  const [inputsText, setInputsText] = useState(DEFAULT_INPUTS);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setError("");
    setResult(null);
    setLoading(true);

    // Parse each line as a separate JSON object
    const lines = inputsText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const inputs = [];
    for (const line of lines) {
      try {
        inputs.push(JSON.parse(line));
      } catch {
        setError(`Invalid JSON on line: ${line}`);
        setLoading(false);
        return;
      }
    }

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL || ""}/api/create-redactor`, {
        sensitiveKeys,
        replacement: replacement || "[HIDDEN]",
        inputs,
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="glass-card p-4 flex items-start gap-3">
        <span className="text-xl">⚙️</span>
        <div>
          <p className="text-sm text-text-primary font-medium mb-1">
            <code className="font-mono text-cyan-400">createRedactor(options)</code>
          </p>
          <p className="text-xs text-text-secondary leading-relaxed">
            Creates a <strong className="text-text-primary">pre-configured</strong> redactor function. Configure once at startup, then reuse it everywhere in your project. All inputs below go through the same configured redactor instance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Config */}
        <div className="space-y-4">
          <div
            className="p-4 rounded-xl space-y-4"
            style={{ background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.15)" }}
          >
            <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
              Redactor Configuration
            </p>
            <ChipInput
              label="Extra Sensitive Keys"
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
                placeholder="[HIDDEN]"
              />
            </div>
            <div
              className="text-xs font-mono rounded-lg p-3"
              style={{ background: "#010409", color: "#8b949e" }}
            >
              <span style={{ color: "#ff7b72" }}>const </span>
              <span style={{ color: "#79c0ff" }}>safeLog</span>
              <span> = </span>
              <span style={{ color: "#d2a8ff" }}>createRedactor</span>
              <span>{"({\n  "}</span>
              <span style={{ color: "#79c0ff" }}>sensitiveKeys</span>
              <span>{": ["}</span>
              <span style={{ color: "#a5d6ff" }}>
                {sensitiveKeys.map((k) => `"${k}"`).join(", ")}
              </span>
              <span>{"],\n  "}</span>
              <span style={{ color: "#79c0ff" }}>replacement</span>
              <span>{": "}</span>
              <span style={{ color: "#a5d6ff" }}>"{replacement}"</span>
              <span>{"\n});"}  </span>
            </div>
          </div>

          <div>
            <label className="section-label">Test Inputs (one JSON object per line)</label>
            <textarea
              className="code-area"
              style={{ minHeight: "160px" }}
              value={inputsText}
              onChange={(e) => setInputsText(e.target.value)}
              spellCheck={false}
            />
          </div>

          <button
            id="create-redactor-run-btn"
            onClick={run}
            disabled={loading}
            className="btn-primary w-full"
            style={{ background: "linear-gradient(135deg, #22d3ee, #0ea5e9)" }}
          >
            {loading ? <span className="spinner" /> : "⚙️"}
            {loading ? "Running…" : "Run createRedactor()"}
          </button>
        </div>

        {/* Right: Results */}
        <div className="space-y-3">
          <label className="section-label">Results — Each Input Through the Same Redactor</label>
          {error && (
            <div
              className="p-3 rounded-lg text-sm"
              style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}
            >
              {error}
            </div>
          )}
          {result ? (
            result.results.map((r, i) => (
              <div key={i} className="glass-card p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted font-mono">Input #{i + 1}</span>
                  <CopyButton text={JSON.stringify(r.redacted, null, 2)} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-text-muted mb-1">Original</p>
                    <div className="output-panel text-text-secondary" style={{ minHeight: "auto", padding: "8px" }}>
                      {JSON.stringify(r.original, null, 2)}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: "#4ade80" }}>Redacted ✅</p>
                    <div className="output-panel" style={{ minHeight: "auto", padding: "8px", color: "#4ade80", borderColor: "rgba(74,222,128,0.2)" }}>
                      {JSON.stringify(r.redacted, null, 2)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="output-panel flex items-center justify-center" style={{ minHeight: "240px" }}>
              <span className="text-text-muted text-center text-sm">
                Configure the redactor and run to see all inputs processed through the same instance
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
