"use client";
import React, { useState } from "react";

interface InputBoxProps {
  onSubmit?: (wy_id: string) => void;
  initialValue?: string;
}

export default function InputBox({ onSubmit, initialValue = "" }: InputBoxProps) {
  const [wy_id, setwy_id] = useState(initialValue);

  // useEffect(() => {
  //   setwy_id(initialValue);
  // }, [initialValue]);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (wy_id.trim() && onSubmit) {
      onSubmit(wy_id.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        wy_id:
        <input
          value={wy_id}
          onChange={(e) => setwy_id(e.target.value)}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}