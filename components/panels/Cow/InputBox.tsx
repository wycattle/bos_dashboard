"use client";
import React, { useState, useEffect } from "react";

interface InputBoxProps {
  onSubmit?: (wyId: string) => void;
  initialValue?: string;
}

export default function InputBox({ onSubmit, initialValue = "" }: InputBoxProps) {
  const [wyId, setWyId] = useState(initialValue);

  useEffect(() => {
    setWyId(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (wyId.trim() && onSubmit) {
      onSubmit(wyId.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        WY_id:
        <input
          value={wyId}
          onChange={(e) => setWyId(e.target.value)}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}