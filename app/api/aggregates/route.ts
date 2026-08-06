import { NextResponse } from 'next/server';

// Dummy list of available aggregate tables
const aggregatesList = [
  { name: 'allx', description: 'Allx Table' },
  { name: 'ipiv', description: 'Ipiv Table' },
  { name: 'ultrasound', description: 'Ultrasound schedule' }
  // Add more aggregates here as needed
];

export async function GET() {
  return NextResponse.json(aggregatesList);
}
