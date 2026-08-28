/** app/api/aggregates/fullday/route.ts */

import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    // app/api/aggregates/fullday/route.ts
    const rows = await sql`
    SELECT * 
    FROM fullday_formatted
    WHERE date >= '2026-01-01'::date
    ORDER BY date ASC 
      `;
    const formatted = rows.map(({ date, ...data }) => ({ date, data }));
    return NextResponse.json(formatted);
  } catch (err) {
    console.error("API /api/aggregates/fullday error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
