/*
 * POST /api/fullday
 *
 *
 * Intended final purpose:
 *   Receive a POST trigger from Apps Script. Read the `am_liters`, `am_wy`,
 *   `pm_liters`, and `pm_wy` tables from Neon, compute fullday totals per
 *   (date, WY_id) by combining AM and PM half-day records, then upsert the
 *   aggregated results into a `fullday` table in Neon.
 *
 * Current state: tail-only compute — recomputes only the last 30 distinct dates
 * from am_liters, accumulates liters per (date, WY_id) across AM and PM, then
 * upserts those rows into the fullday table. Historical rows are never touched.
 */

import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`
      SELECT date, data
      FROM fullday
      ORDER BY date DESC
    `;
    return NextResponse.json(rows);
  } catch (err) {
    console.error("API GET /api/fullday error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    // Step 1: get the last 30 distinct dates
    const tailRows = await sql`
      SELECT DISTINCT date FROM am_liters ORDER BY date DESC LIMIT 30
    `;
    const tailDates = tailRows.map((r) => String(r.date).slice(0, 10));
    if (tailDates.length === 0) {
      return NextResponse.json({ status: "ok", rows_upserted: 0, dates: [] });
    }

    // Step 2: fetch only those dates from all four source tables in parallel
    const [amWy, amLiters, pmWy, pmLiters] = await Promise.all([
      sql`SELECT * FROM am_wy WHERE date = ANY(${tailDates}) ORDER BY date`,
      sql`SELECT * FROM am_liters WHERE date = ANY(${tailDates}) ORDER BY date`,
      sql`SELECT * FROM pm_wy WHERE date = ANY(${tailDates}) ORDER BY date`,
      sql`SELECT * FROM pm_liters WHERE date = ANY(${tailDates}) ORDER BY date`,
    ]);

    // Step 3: accumulate liters per (date, WY_id)
    const totals = new Map<string, Map<string, number>>();

    function accumulate(
      wyRows: Record<string, unknown>[],
      literRows: Record<string, unknown>[],
    ) {
      const litByDate = new Map(
        literRows.map((r) => [String(r.date).slice(0, 10), r]),
      );
      for (const wyRow of wyRows) {
        const date = String(wyRow.date).slice(0, 10);
        const litRow = litByDate.get(date);
        if (!litRow) continue;

        for (const col of Object.keys(wyRow)) {
          if (col === "date") continue;
          const wyId = wyRow[col];
          const liters = litRow[col];
          if (wyId == null || liters == null) continue;

          const wyKey = String(wyId);
          const litVal = Number(liters);
          if (isNaN(litVal)) continue;

          if (!totals.has(date)) totals.set(date, new Map());
          const byWy = totals.get(date)!;
          byWy.set(wyKey, (byWy.get(wyKey) ?? 0) + litVal);
        }
      }
    }

    accumulate(
      amWy as Record<string, unknown>[],
      amLiters as Record<string, unknown>[],
    );
    accumulate(
      pmWy as Record<string, unknown>[],
      pmLiters as Record<string, unknown>[],
    );

    // Step 4 & 5: round to 2dp and upsert one row per date
    let rows_upserted = 0;
    for (const [date, byWy] of totals.entries()) {
      const data: Record<string, number> = {};
      for (const [wyId, total] of byWy.entries()) {
        data[wyId] = Math.round(total * 100) / 100;
      }
      await sql`
        INSERT INTO fullday (date, data)
        VALUES (${date}, ${JSON.stringify(data)}::jsonb)
        ON CONFLICT (date)
        DO UPDATE SET data = EXCLUDED.data, updated_at = now()
      `;
      rows_upserted++;
    }

    const sortedDates = [...totals.keys()].sort();
    return NextResponse.json({
      status: "ok",
      rows_upserted,
      dates: [sortedDates[0], sortedDates[sortedDates.length - 1]],
    });
  } catch (err) {
    console.error("API POST /api/fullday error:", err);
    return NextResponse.json(
      {
        status: "error",
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
