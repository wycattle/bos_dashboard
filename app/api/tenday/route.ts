import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql`
    SELECT wy_id, run_date, dates, average, dev_from_avg
    FROM tenday
    ORDER BY run_date DESC
  `;
  return NextResponse.json(rows);
}
