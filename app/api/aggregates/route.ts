import { NextResponse } from 'next/server';

// Dummy list of available aggregate tables
const aggregatesList = [
  { name: 'allx', description: 'Allx Table (full aggregate)' }
  // Add more aggregates here as needed
];

export async function GET() {
  return NextResponse.json(aggregatesList);
}
