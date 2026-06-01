/**
 * app/api/cow/iumerge/route.ts
 * API route for iu_merge table — returns all rows for a given wy_id.
 *
 * Uses raw SQL via the Neon serverless driver tagged-template syntax:
 *   sql`SELECT ... WHERE wy_id = ${wyId}`
 * Parameters are automatically escaped — safe from SQL injection.
 */
import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const wyId = searchParams.get("wy_id");

  if (!wyId) {
    return NextResponse.json({ error: "Missing wy_id parameter" }, { status: 400 });
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`
      SELECT id, wy_id, to_char(datex, 'YYYY-MM-DD') as datex, typex, i_calf_num, u_calf_num, stop_num, readex, try_num
      FROM iu_merge
      WHERE wy_id = ${wyId}
      ORDER BY datex ASC
    `;
    return NextResponse.json(rows);
  } catch (err) {
    console.error("API /api/iumerge error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
