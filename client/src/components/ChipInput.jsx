import { useState } from "react";

export default function ChipInput({ label, chips, onChange, placeholder }) {
  const [inputVal, setInputVal] = useState("");

  const addChip = (val) => {
    const trimmed = val.trim();
    if (trimmed && !chips.includes(trimmed)) {
      onChange([...chips, trimmed]);
    }
    setInputVal("");
  };

  const removeChip = (chip) => {
    onChange(chips.filter((c) => c !== chip));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addChip(inputVal);
    } else if (e.key === "Backspace" && !inputVal && chips.length > 0) {
      removeChip(chips[chips.length - 1]);
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {label}
        </label>
      )}
      <div
        className="flex flex-wrap gap-2 p-2 rounded-lg min-h-[44px] cursor-text"
        style={{
          background: "#0d1117",
          border: "1px solid rgba(255,255,255,0.08)",
          transition: "border-color 0.2s",
        }}
        onClick={(e) => e.currentTarget.querySelector("input").focus()}
      >
        {chips.map((chip) => (
          <span key={chip} className="chip">
            {chip}
            <button onClick={() => removeChip(chip)}>✕</button>
          </span>
        ))}
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (inputVal.trim()) addChip(inputVal); }}
          placeholder={chips.length === 0 ? placeholder || "Type and press Enter…" : ""}
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#e6edf3",
            fontSize: "0.8rem",
            fontFamily: "'JetBrains Mono', monospace",
            flexGrow: 1,
            minWidth: "120px",
            padding: "2px 4px",
          }}
        />
      </div>
      <p className="text-xs text-text-muted mt-1">Press Enter or comma to add</p>
    </div>
  );
}
