import { useState } from "react";

export default function CopyButton({ text, className = "" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <button onClick={handleCopy} className={`copy-btn ${className}`}>
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}
