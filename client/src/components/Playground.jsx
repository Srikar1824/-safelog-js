import { useState } from "react";
import RedactTab from "./RedactTab";
import CustomRedactorTab from "./CustomRedactorTab";
import SanitizeStringTab from "./SanitizeStringTab";
import MiddlewareDemoTab from "./MiddlewareDemoTab";

const TABS = [
  {
    id: "redact",
    label: "redact()",
    icon: "🛡️",
    color: "#4ade80",
    badge: "Objects",
    component: RedactTab,
  },
  {
    id: "create-redactor",
    label: "createRedactor()",
    icon: "⚙️",
    color: "#22d3ee",
    badge: "Factory",
    component: CustomRedactorTab,
  },
  {
    id: "sanitize-string",
    label: "sanitizeString()",
    icon: "🔍",
    color: "#a78bfa",
    badge: "Strings",
    component: SanitizeStringTab,
  },
  {
    id: "middleware",
    label: "Express Middleware",
    icon: "🔌",
    color: "#fb923c",
    badge: "HTTP",
    component: MiddlewareDemoTab,
  },
];

export default function Playground() {
  const [activeTab, setActiveTab] = useState("redact");

  const ActiveComponent = TABS.find((t) => t.id === activeTab)?.component;
  const activeColor = TABS.find((t) => t.id === activeTab)?.color;

  return (
    <section id="playground" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="section-label mb-3">Interactive Playground</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Try SafeLog-JS Live
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            All operations run through the actual published{" "}
            <code className="font-mono text-accent-green">safelog-js</code> package on our Express
            server. Nothing is simulated.
          </p>
        </div>

        {/* Tab nav */}
        <div
          className="flex flex-wrap gap-2 p-2 rounded-xl mb-6"
          style={{ background: "rgba(28,33,40,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn flex items-center gap-2 ${activeTab === tab.id ? "active" : ""}`}
              style={
                activeTab === tab.id
                  ? {
                      background: `${tab.color}15`,
                      borderColor: `${tab.color}40`,
                      color: tab.color,
                    }
                  : {}
              }
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.icon}</span>
              <span
                className="badge text-xs py-0.5 px-2 hidden md:inline-flex"
                style={{
                  background: `${tab.color}15`,
                  border: `1px solid ${tab.color}30`,
                  color: tab.color,
                }}
              >
                {tab.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div
          className="glass-card p-6 md:p-8"
          style={{ borderColor: activeColor ? `${activeColor}20` : undefined }}
        >
          {ActiveComponent && <ActiveComponent key={activeTab} />}
        </div>

        {/* Footer note */}
        <div className="mt-4 text-center">
          <p className="text-xs text-text-muted">
            Powered by{" "}
            <a
              href="https://www.npmjs.com/package/safelog-js"
              target="_blank"
              rel="noreferrer"
              className="text-accent-green hover:underline"
            >
              safelog-js
            </a>{" "}
            running on an Express server. Source available on{" "}
            <a
              href="https://github.com/Srikar1824/safelog"
              target="_blank"
              rel="noreferrer"
              className="text-accent-green hover:underline"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
