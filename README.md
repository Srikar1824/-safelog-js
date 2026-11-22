# safelog-js Demo Website

> An interactive showcase website for the [safelog-js](https://www.npmjs.com/package/safelog-js) NPM package.

[![Live Demo](https://img.shields.io/badge/Live-Demo-4ade80?style=for-the-badge)](https://safelog-demo.onrender.com)
[![NPM](https://img.shields.io/npm/v/safelog-js?style=for-the-badge&color=cb3837)](https://www.npmjs.com/package/safelog-js)
[![GitHub](https://img.shields.io/badge/Package-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/Srikar1824/safelog)

---

## What This Is

This is a full-stack demo app that **installs and uses the real `safelog-js` NPM package** to demonstrate all four of its features through an interactive playground UI.

---

## Features Demonstrated

| Feature | Description |
|---|---|
| `redact()` | Deep-redact sensitive fields in JSON objects |
| `createRedactor()` | Create a pre-configured redactor instance |
| `sanitizeString()` | Mask JWTs, credit cards, SSNs, AWS keys in log strings |
| `createExpressMiddleware()` | Simulate Express middleware attaching `req.safeBody` |

---

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Package**: [safelog-js](https://www.npmjs.com/package/safelog-js) (installed from NPM)

---

## Project Structure

```
project/
├── client/          ← React + Vite + Tailwind CSS frontend
│   └── src/
│       └── components/
└── server/          ← Express API server using safelog-js
    └── index.js
```

---

## Running Locally

### 1. Start the API server

```bash
cd server
npm install
node index.js
# Runs on http://localhost:3001
```

### 2. Start the frontend

```bash
cd client
npm install
npm run dev
# Runs on http://localhost:5173
```

Then open **http://localhost:5173** in your browser.

---

## API Endpoints

All endpoints are powered by the real `safelog-js` package:

| Method | Endpoint | Calls |
|---|---|---|
| GET | `/api/health` | Returns safelog-js version |
| POST | `/api/redact` | `redact(data, options)` |
| POST | `/api/create-redactor` | `createRedactor(options)` |
| POST | `/api/sanitize-string` | `sanitizeString(str, options)` |
| POST | `/api/middleware-demo` | `createExpressMiddleware(options)` |

---

## Related

- 📦 [safelog-js on NPM](https://www.npmjs.com/package/safelog-js)
- 🐙 [safelog-js on GitHub](https://github.com/Srikar1824/safelog)

---

MIT License © Srikar
