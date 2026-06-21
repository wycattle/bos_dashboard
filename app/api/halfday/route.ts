import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`
      SELECT "WY_id", "AM" as am, "PM" as pm
      FROM halfday_formatted
      ORDER BY "WY_id" ASC
    `;
    return NextResponse.json(rows);
  } catch (err) {
    console.error("API /api/halfday error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
