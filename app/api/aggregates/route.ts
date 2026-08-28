import { NextResponse } from 'next/server';

// Dummy list of available aggregate tables
const aggregatesList = [
  { name: 'allx', description: 'Allx Table' },
  { name: 'ipiv', description: 'Ipiv Table' },
  { name: 'ultrasound', description: 'Ultrasound schedule' },
  { name: 'net revenue', description: 'Net Revenue Table' },
  // Add more aggregates here as needed
];

export async function GET() {
  return NextResponse.json(aggregatesList);
}
