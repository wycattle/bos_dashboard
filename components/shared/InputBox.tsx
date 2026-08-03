"use client";
import React, { useState } from "react";

interface InputBoxProps {
  onSubmit: (value: string) => void;
  initialValue?: string;
  placeholder?: string;
  label?: string;
}

export default function InputBox({
  onSubmit,
  initialValue = "",
  placeholder,
  label,
}: InputBoxProps) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) onSubmit(value.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
    >
      {label && <label>{label}</label>}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        style={{
          padding: "0.4rem",
          borderRadius: "6px",
          border: "1px solid #475569",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "0.4rem 0.8rem",
          borderRadius: "6px",
          border: "1px solid #475569",
          background: "#1e293b",
          color: "#f8fafc",
          cursor: "pointer",
        }}
      >
        Submit
      </button>
    </form>
  );
}