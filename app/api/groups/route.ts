import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`
      SELECT
        "WY_id",
        "group"            AS group_name,
        "avg"              AS average,
        "u_read"
      FROM wb_groups_formatted
      ORDER BY "avg" DESC
    `;
    return NextResponse.json(rows);
  } catch (err) {
    console.error("API /api/groups error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
