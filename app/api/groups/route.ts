
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`
      SELECT wy_id, group_name, average, u_read
      FROM wb_groups_formatted
      ORDER BY average DESC
    `;
    return NextResponse.json(rows);
  } catch (err) {
    console.error("API /api/groups error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
