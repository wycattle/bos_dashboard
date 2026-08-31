/** app/api/aggregates/cost_x_feed/route.ts */
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`
      SELECT
        TO_CHAR(datex, 'YYYY-MM-DD') AS datex,
        SUM(CASE WHEN desc_1 = 'electricity'  THEN value ELSE 0 END) AS electricity,
        SUM(CASE WHEN desc_1 = 'equipment'    THEN value ELSE 0 END) AS equipment,
        SUM(CASE WHEN desc_1 = 'fuel'         THEN value ELSE 0 END) AS fuel,
        SUM(CASE WHEN desc_1 = 'interest'     THEN value ELSE 0 END) AS interest,
        SUM(CASE WHEN desc_1 = 'labor'        THEN value ELSE 0 END) AS labor,
        SUM(CASE WHEN desc_1 = 'maintenance'  THEN value ELSE 0 END) AS maintenance,
        SUM(CASE WHEN desc_1 = 'materials'    THEN value ELSE 0 END) AS materials,
        SUM(CASE WHEN desc_1 = 'medical'      THEN value ELSE 0 END) AS medical,
        SUM(CASE WHEN desc_1 = 'milk_truck'   THEN value ELSE 0 END) AS milk_truck,
        SUM(CASE WHEN desc_1 = 'misc'         THEN value ELSE 0 END) AS misc,
        SUM(CASE WHEN desc_1 = 'repair'       THEN value ELSE 0 END) AS repair,
        SUM(CASE WHEN desc_1 = 'supplies'     THEN value ELSE 0 END) AS supplies,
        SUM(CASE WHEN desc_1 = '?'            THEN value ELSE 0 END) AS unknown
      FROM cost_x_feed_formatted
      GROUP BY datex
      ORDER BY datex
    `;
    return NextResponse.json(rows);
  } catch (err) {
    console.error("API /api/aggregates/costxfeed error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}