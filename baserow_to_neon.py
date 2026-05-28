'''baserow_to_neon.py'''
import os
import io
import csv
import json
import requests
import psycopg2
from psycopg2.extras import execute_values

# ====================================================================
# 🛡️ AUTOMATED ENVIRONMENT LOADER (.local.env / .env)
# ====================================================================
def bootstrap_local_environment():
    """Explicitly parses local text files to inject variables into Python process memory."""
    for env_filename in [".local.env", ".env"]:
        if os.path.exists(env_filename):
            with open(env_filename, "r") as env_file:
                for line in env_file:
                    clean_line = line.strip()
                    if not clean_line or clean_line.startswith("#") or "=" not in clean_line:
                        continue
                    key, value = clean_line.split("=", 1)
                    os.environ[key.strip()] = value.strip().strip('"').strip("'")
            print(f"✓ Seamlessly loaded environment profiles directly from target file: '{env_filename}'")
            return
    print("⚠️ Environment Warning: No '.local.env' or '.env' target found on disk root tracking.")

# Fire the environment loader right away at script boot phase
bootstrap_local_environment()

# ====================================================================
# 1. PLATFORM CONFIGURATION ASSIGNMENTS
# ====================================================================
BASEROW_TOKEN = os.getenv("BASEROW_TOKEN", "5moYh2EjItjbWTuzBZwDkWjJdP0oXxo4")
NEON_DATABASE_URL = os.getenv("NEON_DATABASE_URL")

BASEROW_TABLE_ID = "998130"
BASEROW_API_URL = f"https://api.baserow.io/api/database/rows/table/{BASEROW_TABLE_ID}/?size=200&user_field_names=true"

HEADERS = {
    "Authorization": f"Token {BASEROW_TOKEN}",
    "Content-Type": "application/json"
}

# ====================================================================
# 2. DATA EXTRACTION & INTEGRATION PIPELINE
# ====================================================================
def sync_baserow_to_neon():
    if not NEON_DATABASE_URL:
        raise ValueError("❌ Connection Error: 'NEON_DATABASE_URL' is missing from your environment configurations.")

    print("Fetching active records from your Baserow staging table...")
    response = requests.get(BASEROW_API_URL, headers=HEADERS, timeout=15)
    
    if response.status_code != 200:
        raise RuntimeError(f"❌ Baserow Fetch Failed: Status {response.status_code} | Details: {response.text}")
    
    baserow_rows = response.json().get("results", [])
    print(f"✓ Found {len(baserow_rows)} rows in Baserow view. Formatting database mapping layer...")

    mapped_records = []
    for row in baserow_rows:
        record_tuple = (
            int(row["year"]) if row.get("year") else None,
            row.get("invoice date") or None,
            row.get("payment date") or None,
            row.get("feed_type") or None,
            float(row["invoice amt"]) if row.get("invoice amt") else 0.0,
            float(row["additional cost"]) if row.get("additional cost") else 0.0,
            float(row["total cost"]) if row.get("total cost") else 0.0,
            int(row["bags"]) if row.get("bags") else 0,
            float(row["weight/bag"]) if row.get("weight/bag") else 0.0,
            float(row["price/bag"]) if row.get("price/bag") else 0.0,
            float(row["weight"]) if row.get("weight") else 0.0,
            float(row["price/kg"]) if row.get("price/kg") else 0.0,
            float(row["delivered price/kg"]) if row.get("delivered price/kg") else 0.0
        )
        mapped_records.append(record_tuple)

    insert_query = """
        INSERT INTO public.feed_invoice_ledger (
            year, invoice_date, payment_date, feed_type, invoice_amount, 
            additional_cost, total_cost, bags, weight_per_bag, 
            price_per_bag, weight, price_per_kg, delivered_price_per_kg
        ) VALUES %s;
    """

    print("Opening secure connection channel to Neon PostgreSQL cluster...")
    try:
        with psycopg2.connect(NEON_DATABASE_URL) as connection:
            with connection.cursor() as cursor:
                print("Clearing out old ledger data in Neon to prevent duplicate entries...")
                cursor.execute("TRUNCATE TABLE public.feed_invoice_ledger;")
                
                print("Executing batch SQL record insertion matrix...")
                execute_values(cursor, insert_query, mapped_records)
                connection.commit()
                
        print(f"🚀 Success! All {len(mapped_records)} rows cleanly mapped, securely linked, and written to Neon!")
    except Exception as error:
        print(f"❌ Neon Link Failed: Database cluster rejected the data. Details: {error}")

if __name__ == "__main__":
    sync_baserow_to_neon()
