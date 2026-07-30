import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { searchParams } = new URL(request.url);
    const wy_id = searchParams.get("wy_id");

    if (!wy_id) {
      return NextResponse.json({ error: "Missing wy_id parameter" }, { status: 400 });
    }

    const rows = await sql`
      SELECT *
      FROM iu_merge_formatted
      WHERE wy_id = ${wy_id}
      ORDER BY datex
    `;
    return NextResponse.json(rows);
  } catch (err) {
    console.error("API /api/iu_merge error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}