/** components/shared/InputBox.tsx */
"use client";
import React, { useState } from "react";

interface InputBoxProps {
  onSubmit: (value: string) => void;
  initialValue?: string;
  placeholder?: string;
  label?: string;
  autoFocus?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export default function InputBox({
  onSubmit,
  initialValue = "",
  placeholder,
  label,
  autoFocus,
  inputRef,
}: InputBoxProps) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = () => {
    if (value.trim()) onSubmit(value.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const hasInput = value.trim() !== "";

  return (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <style suppressHydrationWarning>{`
        @keyframes pulseGlow {
          0%, 100% {
            border-color: #52b18e;
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
          50% {
            border-color: #862561;
            box-shadow: 0 0 8px 2px rgba(59, 130, 246, 0.6);
          }
        }
      `}</style>

      {label && <label>{label}</label>}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        style={{
          padding: "0.4rem",
          borderRadius: "6px",
          border: "1px solid #475569",
          outline: "none",
          ...(!hasInput && {
            animation: "pulseGlow 1.5s ease-in-out infinite",
          }),
        }}
      />
      <button
        type="button"
        onClick={handleSubmit}
        style={{
          padding: "1rem",
          borderRadius: "6px",
          border: "1px solid #475569",
          background: "#1e293b",
          color: "#f8fafc",
          cursor: "pointer",
        }}
      >
        Submit
      </button>
    </div>
  );
}