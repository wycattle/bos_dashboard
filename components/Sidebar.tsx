"use client";
import React, { useState } from 'react';
import Link from 'next/link';

/**
 * Props for the Sidebar component.
 * @property onWYIdSubmit - Callback function to handle WY_id submission.
 */
interface SidebarProps {
  onWYIdSubmit: (wyId: string) => void;
}

/**
 * Sidebar navigation component for the BOS Dashboard.
 *
 * Features:
 * - Navigation links to Home and Cow I_U_merge pages.
 * - Input form for submitting a WY_id (calls onWYIdSubmit prop).
 * - Simple inline styling for layout and appearance.
 *
 * @param {SidebarProps} props - The props for Sidebar.
 * @returns {JSX.Element} The rendered sidebar.
 */
const Sidebar: React.FC<SidebarProps> = ({ onWYIdSubmit }) => {
  // Local state for the WY_id input field
  const [wyId, setWyId] = useState('');

  /**
   * Handles form submission for WY_id input.
   * Prevents default form behavior and calls onWYIdSubmit if input is not empty.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wyId.trim()) {
      onWYIdSubmit(wyId.trim());
    }
  };

  return (
    <aside className="app-sidebar">
      {/* Dashboard title */}
      <h2>BOS Dashboard</h2>
      {/* Navigation links */}
      <nav>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/tenday">Ten-Day Records</Link></li>
          <li><Link href="/cow">Individual Cow</Link></li>
        </ul>
      </nav>
      {/* WY_id input form */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="wyId" className="form-label">
          WY_id:
        </label>
        <input
          id="wyId"
          type="text"
          value={wyId}
          onChange={e => setWyId(e.target.value)}
          className="text-input"
        />
        <button type="submit" className="primary-button">
          Submit
        </button>
      </form>
    </aside>
  );
};

export default Sidebar;
