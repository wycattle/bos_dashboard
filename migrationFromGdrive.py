'''migrationFromGdrive.py'''
import io
import os
import csv
import json
import requests
import keyring
import psycopg2
from google.oauth2 import service_account
from googleapiclient.discovery import build

# ====================================================================
# 1. ARCHITECTURE SETUP & CONFIGURATION
# ====================================================================
BASEROW_API_URL = "https://api.baserow.io/api/database" 
BASEROW_TOKEN = os.getenv("BASEROW_TOKEN", "5moYh2EjItjbWTuzBZwDkWjJdP0oXxo4")
BASEROW_INVOICE_TABLE_ID = "998130"

HEADERS = {
    "Authorization": f"Token {BASEROW_TOKEN}",
    "Content-Type": "application/json"
}

SCOPES = [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/spreadsheets.readonly'
]

MASTER_SPREADSHEET_ID = "1uLuKSNkfyqPSyIHPpaYGuJhaNmnjwp2nmwuO_eT7yg4"

FEED_INVOICE_FILES_MAP = {
    "straw": "straw",
    "NaHCO3": "NaHCO3",
    "power_starch": "power_starch",
    "milk2": "milk2",
    "CP_973GM": "CP_973GM",
    "CP_970_Plus": "CP_970_Plus",
    "CP_005_DSW": "CP_005_DSW",
    "CP_005_21P": "CP_005_21P",
    "corn": "corn",
    "cassava": "cassava",
    "bypass_fat": "bypass_fat",
    "beans": "beans"
}

# ====================================================================
# 2. NEON POSTGRES MIRROR ENGINE
# ====================================================================
def push_batch_to_neon_database(data_rows):
    """Connects directly to Neon and inserts clean record dictionaries in a secure batch transaction."""
    if not data_rows:
        return

    neon_connection_string = os.getenv("NEON_DATABASE_URL")
    if not neon_connection_string:
        print("⚠️ Neon Warning: 'NEON_DATABASE_URL' environment string not found. Skipping SQL ledger mirror.")
        return

    insert_query = """
        INSERT INTO public.feed_invoice_ledger (
            year, invoice_date, payment_date, feed_type, invoice_amount, 
            additional_cost, total_cost, bags, weight_per_bag, 
            price_per_bag, weight, price_per_kg, delivered_price_per_kg
        ) VALUES (
            %(year)s, %(invoice_date)s, %(payment_date)s, %(feed_type)s, %(invoice_amount)s,
            %(additional_cost)s, %(total_cost)s, %(bags)s, %(weight_per_bag)s,
            %(price_per_bag)s, %(weight)s, %(price_per_kg)s, %(delivered_price_per_kg)s
        );
    """

    try:
        with psycopg2.connect(neon_connection_string) as connection:
            with connection.cursor() as cursor:
                cursor.executemany(insert_query, data_rows)
                connection.commit()
        print(f"✓ Successfully mirrored {len(data_rows)} rows straight into Neon Postgres ledger.")
    except Exception as error:
        print(f"❌ Neon Database Transaction Rejected. Details: {error}")


# ====================================================================
# 3. SERVICE ACCOUNT CREDENTIAL RESOLVER (Environment with Keyring Fallback)
# ====================================================================
print("Resolving Google Cloud Engine service account credentials...")
service_account_dictionary = None

# Safety Track A: Check local file pathway variable from environment configurations first
env_json_path = os.getenv("BOS_GDRIVE_JSON_PATH") or os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if env_json_path and os.path.exists(env_json_path):
    try:
        with open(env_json_path, 'r') as secret_file:
            service_account_dictionary = json.load(secret_file)
        print("✓ Verified credentials loaded directly from local file track.")
    except Exception as parse_error:
        print(f"⚠️ Environment File Parse Notice: {parse_error}. Shifting to storage fallback...")

# Safety Track B: Fallback directly to system vault if file variables are unassigned
if not service_account_dictionary:
    print("Pulling secure service account keys from OS keyring...")
    encrypted_keyring_string = keyring.get_password('bos_gdrive', 'bos_service_account')
    if not encrypted_keyring_string:
        raise ValueError("❌ Initialization Failure: Unable to locate authorization credentials via Environment or Keyring.")
    service_account_dictionary = json.loads(encrypted_keyring_string)

google_credentials = service_account.Credentials.from_service_account_info(
    service_account_dictionary, 
    scopes=SCOPES
)

print("✓ Google credentials loaded. Initializing Drive engine...")
google_drive_service = build('drive', 'v3', credentials=google_credentials)


# ====================================================================
# 4. INGESTION DATA HANDLING ENGINE (Case and Space Insensitive Parser)
# ====================================================================
def download_cloud_csv_text(spreadsheet_id, tab_name):
    """Exports a specific tab from the Master Sheet into memory as a raw CSV string."""
    request = google_drive_service.files().export(fileId=spreadsheet_id, mimeType='text/csv')
    request.uri += f"&gid=0&sheet={tab_name}"
    return request.execute().decode('utf-8')


def clear_stale_baserow_records(target_table_id):
    """Wipes the Baserow staging grid before re-syncing to prevent duplicates."""
    print("Clearing out stale Baserow database staging rows...")
    fetch_url = f"{BASEROW_API_URL}/rows/table/{target_table_id}/?size=200"
    get_response = requests.get(fetch_url, headers=HEADERS, timeout=10)
    
    if get_response.status_code == 200:
        stale_records = get_response.json().get("results", [])
        for record_item in stale_records:
            delete_url = f"{BASEROW_API_URL}/rows/table/{target_table_id}/{record_item['id']}/"
            requests.delete(delete_url, headers=HEADERS, timeout=10)
    else:
        print(f"⚠️ Clear Warning: Unable to fetch old data to wipe. Code: {get_response.status_code}")


def normalize_row_keys(raw_row_dict):
    """Creates a standardized lower-case, space-stripped key index map for cell lookups."""
    return {str(k).strip().lower().replace(" ", ""): v for k, v in raw_row_dict.items()}


def safe_extract(normalized_row, *matching_keys, default_val=None, cast_type=None):
    """Searches through possible header key variants to cleanly extract and cast numeric values."""
    for key in matching_keys:
        clean_target_key = key.strip().lower().replace(" ", "")
        if clean_target_key in normalized_row:
            raw_val = normalized_row[clean_target_key]
            if raw_val is None or str(raw_val).strip() == "":
                return default_val
            if cast_type:
                try:
                    # Clear out currency or comma layout symbols if strings are typed awkwardly
                    cleaned_num_string = str(raw_val).replace("$", "").replace(",", "").strip()
                    return cast_type(cleaned_num_string)
                except ValueError:
                    return default_val
            return raw_val
    return default_val


def migrate_all_feed_invoices():
    """Loops through the 12 CSV targets and pushes clean tuples to Baserow and Neon."""
    clear_stale_baserow_records(BASEROW_INVOICE_TABLE_ID)
    
    for feed_type_label, google_drive_id in FEED_INVOICE_FILES_MAP.items():
        if "GDRIVE_FILE_ID" in google_drive_id:
            print(f"⚠️ Skipping placeholder ID entry for: {feed_type_label}")
            continue
            
        print(f"Processing cloud ingestion layer for feed type: {feed_type_label}...")
        raw_csv_content = download_cloud_csv_text(MASTER_SPREADSHEET_ID, google_drive_id)
        
        csv_string_stream = io.StringIO(raw_csv_content)
        csv_dictionary_reader = csv.DictReader(csv_string_stream)
        
        chunked_invoice_payload = []
        
        for raw_invoice_row in csv_dictionary_reader:
            if not any(raw_invoice_row.values()):
                continue
                
            # Flatten keys to guarantee immune lookups regardless of capital letter variances
            norm_row = normalize_row_keys(raw_invoice_row)
            
            invoice_record_tuple = {
                "year": safe_extract(norm_row, "year", cast_type=int),
                "invoice_date": safe_extract(norm_row, "invoice_date", "invoicedate", "invoice date"),
                "payment_date": safe_extract(norm_row, "payment_date", "paymentdate", "payment date"),
                "feed_type": feed_type_label,
                "invoice_amount": safe_extract(norm_row, "invoice_amount", "invoice_amt", "invoiceamt", "invoice amt", default_val=0.0, cast_type=float),
                "additional_cost": safe_extract(norm_row, "additional_cost", "additionalcost", "additional cost", default_val=0.0, cast_type=float),
                "total_cost": safe_extract(norm_row, "total_cost", "totalcost", "total cost", default_val=0.0, cast_type=float),
                "bags": safe_extract(norm_row, "bags", default_val=0, cast_type=int),
                "weight_per_bag": safe_extract(norm_row, "weight_per_bag", "weight/bag", default_val=0.0, cast_type=float),
                "price_per_bag": safe_extract(norm_row, "price_per_bag", "price/bag", default_val=0.0, cast_type=float),
                "weight": safe_extract(norm_row, "weight", default_val=0.0, cast_type=float),
                "price_per_kg": safe_extract(norm_row, "price_per_kg", "price/kg", default_val=0.0, cast_type=float),
                "delivered_price_per_kg": safe_extract(norm_row, "delivered_price_per_kg", "deliveredprice/kg", "delivered price/kg", default_val=0.0, cast_type=float)
            }
            chunked_invoice_payload.append(invoice_record_tuple)
            
            if len(chunked_invoice_payload) == 200:
                # Engine Core A: Post Batch to Baserow Staging UI
                insertion_url = f"{BASEROW_API_URL}/rows/table/{BASEROW_INVOICE_TABLE_ID}/batch/?user_field_names=true"
                response = requests.post(insertion_url, json={"items": chunked_invoice_payload}, headers=HEADERS, timeout=10)
