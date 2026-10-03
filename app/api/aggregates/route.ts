/** app/api/aggregates/route.ts */
import { NextResponse } from "next/server";

// Registry of aggregate tables. `category` = folder under /aggregates,
// `name` = folder under the category (also the /api/aggregates/<name> endpoint).
const aggregatesList = [
  { category: "insem_related",   name: "allx",        description: "Allx Table" },
  { category: "insem_related",   name: "ipiv",        description: "Ipiv Table" },
  { category: "insem_related",   name: "ultrasound",  description: "Ultrasound schedule" },
  { category: "finance_related", name: "net_revenue", description: "Net Revenue Table" },
  { category: "finance_related", name: "cost_x_feed", description: "Cost X Feed Table" },
  { category: "milk_related",    name: "fullday",     description: "Fullday Table" },
  { category: "milk_related",    name: "wy_cp_diff",  description: "WY_CP_diff Table" },
].map((t) => ({
  ...t,
  href: `/aggregates/${t.category}/${t.name}`, // page route
  api: `/api/aggregates/${t.name}`,            // data endpoint
}));

export async function GET() {
  return NextResponse.json(aggregatesList);
}
