"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

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

  /**
   * Fetches I_U_merge results for a given WY_id.
   * @param {string} id - The WY_id to fetch results for.
   */
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
        <h1 className="page-title">I_U_merge Results</h1>
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
