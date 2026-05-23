"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const API_BASE_URL = 'http://127.0.0.1:8000';

type IUMergeRow = Record<string, unknown>;

type IUMergeResult = {
  wy_id: string;
  count: number;
  rows: IUMergeRow[];
};

/**
 * CowPage component displays I_U_merge results for a single cow.
 *
 * Features:
 * - Renders the Sidebar for navigation and WY_id input.
 * - Handles WY_id submission and fetches I_U_merge results (placeholder logic).
 * - Displays loading, error, and result states.
 *
 * Note: This is a Client Component (uses useState and effects).
 */
const CowPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  // State for the WY_id input field
  const [inputValue, setInputValue] = useState('');
  // State for the current WY_id
  const [wyId, setWyId] = useState<string | null>(null);
  // State for the fetched I_U_merge result
  const [result, setResult] = useState<IUMergeResult | null>(null);
  // Loading state
  const [loading, setLoading] = useState(false);
  // Error state
  const [error, setError] = useState<string | null>(null);

  const columns = result && result.rows.length > 0
    ? Object.keys(result.rows[0])
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      router.push(`/cow?wyId=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  const fetchIUMerge = async (id: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/iu-merge/${encodeURIComponent(id)}`,
      );

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        const detail =
          errorPayload && typeof errorPayload.detail === 'string'
            ? errorPayload.detail
            : 'Failed to fetch data';

        throw new Error(detail);
      }

      const data: IUMergeResult = await response.json();
      setResult(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const requestedWyId = searchParams.get('wyId');
    if (!requestedWyId || requestedWyId === wyId) {
      return;
    }

    setWyId(requestedWyId);
    fetchIUMerge(requestedWyId);
  }, [searchParams, wyId]);

  return (
      <main className="app-main">
        <Link href="/" style={{ display: "inline-block", marginBottom: "1rem", fontSize: "0.9em" }}>← Back to Homepage</Link>
        <h1 className="page-title">Individual Cow</h1>
        {/* WY_id input form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <label htmlFor="wyId" className="form-label">WY_id:</label>
          <input
            id="wyId"
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            className="text-input"
          />
          <button type="submit" className="primary-button">Submit</button>
        </form>
        {/* Show current WY_id */}
        {wyId && <p className="page-meta">Showing results for WY_id: <b>{wyId}</b></p>}
        {/* Loading state */}
        {loading && <p className="page-meta">Loading...</p>}
        {/* Error state */}
        {error && <p className="error-text">{error}</p>}
        {/* Result display */}
        {result && (
          <section>
            <p className="page-meta">
              Found <b>{result.count}</b> row{result.count === 1 ? '' : 's'}.
            </p>
            {result.rows.length > 0 && (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      {columns.map((column) => (
                        <th key={column}>
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, index) => (
                      <tr key={`${result.wy_id}-${index}`}>
                        {columns.map((column) => (
                          <td key={column}>
                            {String(row[column] ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>
  );
};

const CowPage = () => {
  return (
    <Suspense fallback={<main className="app-main"><p className="page-meta">Loading...</p></main>}>
      <CowPageContent />
    </Suspense>
  );
};

export default CowPage;
