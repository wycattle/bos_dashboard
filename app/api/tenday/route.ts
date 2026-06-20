
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
