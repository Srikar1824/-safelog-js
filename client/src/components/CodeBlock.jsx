import { useState } from "react";
import CopyButton from "./CopyButton";

export default function CodeBlock({ code, language = "javascript" }) {
  // Simple syntax highlighting via CSS classes
  return (
    <div className="code-block-wrapper">
      <pre
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.8rem",
          lineHeight: 1.7,
          background: "#010409",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "10px",
          padding: "20px",
          overflowX: "auto",
          color: "#e6edf3",
          whiteSpace: "pre",
        }}
      >
        <code>{code}</code>
      </pre>
      <CopyButton text={code} />
    </div>
  );
}
