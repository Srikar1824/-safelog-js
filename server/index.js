const express = require("express");
const cors = require("cors");
const {
  redact,
  createRedactor,
  sanitizeString,
  createExpressMiddleware,
} = require("safelog-js");

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  const pkg = require("safelog-js/package.json");
  res.json({ status: "ok", safelogVersion: pkg.version });
});

// ─── POST /api/redact ─────────────────────────────────────────────────────────
// Body: { data: any, sensitiveKeys?: string[], replacement?: string }
app.post("/api/redact", (req, res) => {
  try {
    const { data, sensitiveKeys = [], replacement = "******" } = req.body;

    if (data === undefined) {
      return res.status(400).json({ error: "Missing required field: data" });
    }

    const options = {};
    if (sensitiveKeys.length > 0) options.sensitiveKeys = sensitiveKeys;
    if (replacement) options.replacement = replacement;

    const original = data;
    const redacted = redact(data, options);

    res.json({ original, redacted });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ─── POST /api/create-redactor ────────────────────────────────────────────────
// Body: { sensitiveKeys?: string[], replacement?: string, inputs: any[] }
app.post("/api/create-redactor", (req, res) => {
  try {
    const { sensitiveKeys = [], replacement = "******", inputs = [] } = req.body;

    if (!Array.isArray(inputs)) {
      return res.status(400).json({ error: "inputs must be an array" });
    }

    const options = {};
    if (sensitiveKeys.length > 0) options.sensitiveKeys = sensitiveKeys;
    if (replacement) options.replacement = replacement;

    const safeRedact = createRedactor(options);
    const results = inputs.map((input) => ({
      original: input,
      redacted: safeRedact(input),
    }));

    res.json({ config: options, results });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ─── POST /api/sanitize-string ────────────────────────────────────────────────
// Body: { str: string, replacement?: string, patterns?: { name: string, pattern: string }[] }
app.post("/api/sanitize-string", (req, res) => {
  try {
    const { str, replacement = "[REDACTED]", patterns = [] } = req.body;

    if (typeof str !== "string") {
      return res.status(400).json({ error: "str must be a string" });
    }

    // Reconstruct RegExp objects from serialised { name, pattern } pairs
    const compiledPatterns = patterns.map(({ name, pattern }) => ({
      name,
      pattern: new RegExp(pattern, "g"),
    }));

    const options = { replacement };
    if (compiledPatterns.length > 0) options.patterns = compiledPatterns;

    const original = str;
    const sanitized = sanitizeString(str, options);

    res.json({ original, sanitized });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ─── POST /api/middleware-demo ────────────────────────────────────────────────
// Body: { body: object, sensitiveKeys?: string[], replacement?: string }
// Simulates what createExpressMiddleware does to req.body → returns req.safeBody
app.post("/api/middleware-demo", (req, res) => {
  try {
    const { body: simulatedBody, sensitiveKeys = [], replacement = "******" } = req.body;

    if (!simulatedBody || typeof simulatedBody !== "object") {
      return res.status(400).json({ error: "body must be a JSON object" });
    }

    const options = {};
    if (sensitiveKeys.length > 0) options.sensitiveKeys = sensitiveKeys;
    if (replacement) options.replacement = replacement;

    // Simulate exactly what the middleware does:
    // creates a middleware, then applies it to a mock req
    const middleware = createExpressMiddleware(options);
    const mockReq = { body: simulatedBody };
    const mockRes = {};
    let nextCalled = false;
    middleware(mockReq, mockRes, () => {
      nextCalled = true;
    });

    if (!nextCalled) {
      return res.status(500).json({ error: "Middleware did not call next()" });
    }

    res.json({
      originalBody: simulatedBody,
      safeBody: mockReq.safeBody,
      middlewareNote:
        "req.safeBody is safe to log; req.body still contains the real values for business logic.",
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  const pkg = require("safelog-js/package.json");
  console.log(`✅  SafeLog API server running on http://localhost:${PORT}`);
  console.log(`📦  Using safelog-js v${pkg.version}`);
});
