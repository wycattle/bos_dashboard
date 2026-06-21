import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`
      SELECT
        WY_id,
        status,
        to_char(last_stop_date,  'YYYY-MM-DD') AS last_stop_date,
        stop_calf_num,
        to_char(last_calf_bdate, 'YYYY-MM-DD') AS last_calf_bdate,
        last_calf_num,
        days_milking,
        i_calf_num,
        to_char(i_date,          'YYYY-MM-DD') AS i_date,
        age_insem,
        u_calf_num,
        to_char(u_date,          'YYYY-MM-DD') AS u_date,
        u_read,
        age_ultra,
        to_char(expected_bdate,  'YYYY-MM-DD') AS expected_bdate,
        to_char(exp_drydate,     'YYYY-MM-DD') AS exp_drydate,
        i_check,
        u_check1,
        u_check2
      FROM allx
    `;
    return NextResponse.json(rows);
  } catch (err) {
    console.error("API /api/aggregates/allx error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
