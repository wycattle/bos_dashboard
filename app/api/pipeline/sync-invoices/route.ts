import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const BASEROW_FEED_INVOICES_TABLE_ID = "996856";
const BASEROW_API_BASE_URL = "https://baserow.io/api/database/rows/table";

interface BaserowFeedInvoiceRecord {
  id: number;
  year: number | null;
  invoice_date: string | null;
  payment_date: string | null;
  feed_type: string;
  invoice_amount: number | null;
  additional_cost: number | null;
  total_cost: number | null;
  bags: number | null;
  weight_per_bag: number | null;
  price_per_bag: number | null;
  weight: number | null;
  price_per_kg: number | null;
  delivered_price_per_kg: number | null;
}

interface NeonFeedInvoiceTuple {
  year: number | null;
  invoice_date: string | null;
  payment_date: string | null;
  feed_type: string;
  invoice_amount: number;
  additional_cost: number;
  total_cost: number;
  bags: number;
  weight_per_bag: number;
  price_per_bag: number;
  weight: number;
  price_per_kg: number;
  delivered_price_per_kg: number;
}

async function fetchAllBaserowInvoicePages(): Promise<BaserowFeedInvoiceRecord[]> {
  const baserow_api_token = process.env.BASEROW_API_TOKEN;
  if (!baserow_api_token) {
    throw new Error("Missing required environment variable: BASEROW_API_TOKEN");
  }

  const baserow_auth_headers = {
    Authorization: `Token ${baserow_api_token}`,
    "Content-Type": "application/json",
  };

  let raw_invoice_matrix: BaserowFeedInvoiceRecord[] = [];
  let next_page_url: string | null =
    `${BASEROW_API_BASE_URL}/${BASEROW_FEED_INVOICES_TABLE_ID}/?user_field_names=true&size=200`;

  while (next_page_url !== null) {
    const baserow_page_response = await fetch(next_page_url, {
      headers: baserow_auth_headers,
    });

    if (!baserow_page_response.ok) {
      throw new Error(
        `Baserow API request failed — status ${baserow_page_response.status}: ${await baserow_page_response.text()}`
      );
    }

    const baserow_page_payload = await baserow_page_response.json();
    const baserow_invoice_page_records: BaserowFeedInvoiceRecord[] =
      baserow_page_payload.results ?? [];

    raw_invoice_matrix = raw_invoice_matrix.concat(baserow_invoice_page_records);
    next_page_url = baserow_page_payload.next ?? null;
  }

  return raw_invoice_matrix;
}

function parseNullableFloat(raw_field_value: number | null | undefined): number {
  if (raw_field_value === null || raw_field_value === undefined) return 0.0;
  const parsed_float_value = parseFloat(String(raw_field_value));
  return isNaN(parsed_float_value) ? 0.0 : parsed_float_value;
}

function parseNullableInt(raw_field_value: number | null | undefined): number {
  if (raw_field_value === null || raw_field_value === undefined) return 0;
  const parsed_int_value = parseInt(String(raw_field_value), 10);
  return isNaN(parsed_int_value) ? 0 : parsed_int_value;
}

function parseNullableDateString(raw_date_string: string | null | undefined): string | null {
  if (!raw_date_string || raw_date_string.trim() === "") return null;
  return raw_date_string.trim();
}

export async function POST(): Promise<NextResponse> {
  try {
    const raw_invoice_matrix = await fetchAllBaserowInvoicePages();

    const consolidated_invoice_tuples: NeonFeedInvoiceTuple[] = raw_invoice_matrix.map(
      (baserow_invoice_record) => ({
        year: baserow_invoice_record.year ?? null,
        invoice_date: parseNullableDateString(baserow_invoice_record.invoice_date),
        payment_date: parseNullableDateString(baserow_invoice_record.payment_date),
        feed_type: baserow_invoice_record.feed_type,
        invoice_amount: parseNullableFloat(baserow_invoice_record.invoice_amount),
        additional_cost: parseNullableFloat(baserow_invoice_record.additional_cost),
        total_cost: parseNullableFloat(baserow_invoice_record.total_cost),
        bags: parseNullableInt(baserow_invoice_record.bags),
        weight_per_bag: parseNullableFloat(baserow_invoice_record.weight_per_bag),
        price_per_bag: parseNullableFloat(baserow_invoice_record.price_per_bag),
        weight: parseNullableFloat(baserow_invoice_record.weight),
        price_per_kg: parseNullableFloat(baserow_invoice_record.price_per_kg),
        delivered_price_per_kg: parseNullableFloat(baserow_invoice_record.delivered_price_per_kg),
      })
    );

    const neon_database_url = process.env.DATABASE_URL;
    if (!neon_database_url) {
      throw new Error("Missing required environment variable: DATABASE_URL");
    }

    const neon_sql_client = neon(neon_database_url);

    // Wipe out stale ledger records before re-syncing the full invoice dataset
    await neon_sql_client`DELETE FROM feed_invoice_ledger`;

    let inserted_invoice_count = 0;

    for (const invoice_tuple of consolidated_invoice_tuples) {
      await neon_sql_client`
        INSERT INTO feed_invoice_ledger (
          year,
          invoice_date,
          payment_date,
          feed_type,
          invoice_amount,
          additional_cost,
          total_cost,
          bags,
          weight_per_bag,
          price_per_bag,
          weight,
          price_per_kg,
          delivered_price_per_kg
        ) VALUES (
          ${invoice_tuple.year},
          ${invoice_tuple.invoice_date},
          ${invoice_tuple.payment_date},
          ${invoice_tuple.feed_type},
          ${invoice_tuple.invoice_amount},
          ${invoice_tuple.additional_cost},
          ${invoice_tuple.total_cost},
          ${invoice_tuple.bags},
          ${invoice_tuple.weight_per_bag},
          ${invoice_tuple.price_per_bag},
          ${invoice_tuple.weight},
          ${invoice_tuple.price_per_kg},
          ${invoice_tuple.delivered_price_per_kg}
        )
      `;
      inserted_invoice_count++;
    }

    return NextResponse.json({
      success: true,
      inserted_invoice_count,
      message: `Successfully synced ${inserted_invoice_count} feed invoice records from Baserow into Neon feed_invoice_ledger.`,
    });
  } catch (pipeline_sync_error) {
    const error_message =
      pipeline_sync_error instanceof Error
        ? pipeline_sync_error.message
        : "Unknown pipeline sync error";

    console.error("[sync-invoices] Pipeline failure:", error_message);

    return NextResponse.json(
      {
        success: false,
        inserted_invoice_count: 0,
        error: error_message,
      },
      { status: 500 }
    );
  }
}
