"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const API_BASE_URL = 'http://127.0.0.1:8000';

type MonthlyRow = {
  year: number;
  month: number;
  revenue: number | null;
  feedcost: number | null;
  net_revenue: number | null;
};

type MonthlyResult = {
  wy_id: string;
  count: number;
  rows: MonthlyRow[];
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const NetRevenuePageContent = () => {
  const searchParams = useSearchParams();
  const [wyId, setWyId] = useState<string | null>(null);
  const [monthly, setMonthly] = useState<MonthlyResult | null>(null);
  const [plotUrl, setPlotUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (id: string) => {
    setLoading(true);
    setError(null);
    setMonthly(null);
    setPlotUrl(null);

    try {
      const res = await fetch(`${API_BASE_URL}/net-revenue/${encodeURIComponent(id)}/monthly`);
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        const detail = payload?.detail ?? 'Failed to fetch monthly data';
        throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
      }
      const data: MonthlyResult = await res.json();
      setMonthly(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }

    // Plot URL — just construct it; the <img> will show or fail gracefully
    setPlotUrl(`${API_BASE_URL}/net-revenue/${encodeURIComponent(id)}/plot`);
  };

  useEffect(() => {
    const requestedWyId = searchParams.get('wyId');
    if (!requestedWyId || requestedWyId === wyId) return;
    setWyId(requestedWyId);
    fetchData(requestedWyId);
  }, [searchParams, wyId]);

  const fmt = (v: number | null) =>
    v == null ? '—' : v.toLocaleString('en-US', { maximumFractionDigits: 0 });

  return (
    <main className="app-main">
      <h1 className="page-title">Net Revenue</h1>
      {wyId && <p className="page-meta">Showing results for WY_id: <b>{wyId}</b></p>}
      {loading && <p className="page-meta">Loading…</p>}
      {error && <p className="error-text">{error}</p>}

      {(monthly || plotUrl) && (
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Monthly table */}
          {monthly && monthly.rows.length > 0 && (
            <div className="table-wrap" style={{ flex: '0 0 auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Month</th>
                    <th>Revenue</th>
                    <th>Feedcost</th>
                    <th>Net Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {monthly.rows.map((row, i) => (
                    <tr key={i}>
                      <td>{row.year}</td>
                      <td>{MONTH_NAMES[(row.month ?? 1) - 1]}</td>
                      <td style={{ textAlign: 'right' }}>{fmt(row.revenue)}</td>
                      <td style={{ textAlign: 'right' }}>{fmt(row.feedcost)}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>{fmt(row.net_revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Plot — image served from local FastAPI, next/image not applicable */}
          {plotUrl && (
            <div style={{ flex: '1 1 600px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={plotUrl}
                alt={`Net revenue plot for WY_id ${wyId}`}
                style={{ maxWidth: '100%', borderRadius: '6px', border: '1px solid var(--surface-border)' }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          )}
        </div>
      )}
    </main>
  );
};

const NetRevenuePage = () => (
  <Suspense fallback={<main className="app-main"><p className="page-meta">Loading…</p></main>}>
    <NetRevenuePageContent />
  </Suspense>
);

export default NetRevenuePage;
