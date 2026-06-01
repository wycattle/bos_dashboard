import { NextResponse } from 'next/server';

// Dummy data for demonstration. Replace with DB query in production.
const allxData = [
  {
    WY_id: 94,
    status: 'D',
    last_stop_date: '2025-04-17',
    stop_calf_num: 4,
    last_calf_bdate: '2025-08-25',
    last_calf_num: 5,
    days_milking: 268,
    i_calf_num: 6,
    i_date: '2025-12-31',
    age_insem: 140,
    u_calf_num: 6,
    u_date: '2026-03-13',
    u_read: 'ok',
    age_ultra: 68,
    expected_bdate: '2026-10-09',
    exp_drydate: '2026-08-09',
    i_check: 1,
    u_check1: 1,
    u_check2: 72
  }
  // Add more rows as needed
];

export async function GET() {
  return NextResponse.json(allxData);
}
