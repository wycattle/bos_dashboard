/**
 * GET /api/tenday
 *
 * Fetches all rows from the `tenday_formatted` view.
 * Returns a JSON array of objects, one per WY group, with columns:
 *   wy_id, avg, pct chg from avg, days milking, u_read, expected bdate,
 *   and date‑specific columns (e.g. "06‑21" for each day in the period).
 *
 * Response:
 *   200 – Array of TendayRow objects
 *   500 – { error: string }
 */
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`
      SELECT *
      FROM tenday_formatted
      
    `;
    return NextResponse.json(rows);
  } catch (err) {
    console.error("API /api/tenday error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
