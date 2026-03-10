"""
Claira API Explorer — Example Script

This script demonstrates how to authenticate with the Claira API
and fetch deal/dashboard data. Use it to understand the data structures
before building your solution.

Usage:
    1. Copy credentials.example.json to credentials.json
    2. Fill in your credentials
    3. Run: python example_api_usage.py
"""

import json
import sys

import requests


def load_credentials(path="credentials.json"):
    """Load API credentials from a JSON file."""
    try:
        with open(path) as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: {path} not found.")
        print("Copy credentials.example.json to credentials.json and fill in your credentials.")
        sys.exit(1)


def authenticate(auth_url, email, password):
    """Authenticate and return the access token."""
    response = requests.post(
        f"{auth_url}/login/",
        json={"email": email, "password": password},
    )
    response.raise_for_status()
    data = response.json()["data"]
    print(f"Authenticated successfully. Token expires in ~15 minutes.\n")
    return data["access_token"]


def api_get(api_url, path, token):
    """Make an authenticated GET request to the Claira API."""
    response = requests.get(
        f"{api_url}/{path}",
        headers={"Authorization": f"Bearer {token}"},
    )
    response.raise_for_status()
    return response.json()["data"]


def print_json(label, data, max_items=3):
    """Pretty-print JSON data with a label, truncating long lists."""
    print(f"\n{'='*60}")
    print(f"  {label}")
    print(f"{'='*60}")

    if isinstance(data, list) and len(data) > max_items:
        print(f"  (Showing {max_items} of {len(data)} items)\n")
        data = data[:max_items]

    print(json.dumps(data, indent=2, default=str))


def main():
    creds = load_credentials()

    # 1. Authenticate
    print("Authenticating...")
    token = authenticate(creds["auth_url"], creds["email"], creds["password"])

    # 2. List deals
    print("Fetching deals...")
    deals_response = api_get(creds["api_url"], "credit_analysis/deals/", token)
    deals = deals_response.get("deals", [])
    print_json("DEALS", [{"id": d["id"], "asset_name": d["asset_name"]} for d in deals])

    if not deals:
        print("\nNo deals found. Check your credentials and permissions.")
        return

    # 3. Pick the first deal and get its details
    deal_id = deals[0]["id"]
    print(f"\nFetching details for deal: {deal_id}")
    deal = api_get(creds["api_url"], f"credit_analysis/deals/{deal_id}/", token)
    print_json(f"DEAL DETAILS — {deal.get('asset_name', 'Unknown')}", deal)

    # 4. Get dashboards for this deal
    print(f"\nFetching dashboards for deal: {deal_id}")
    dashboards = api_get(creds["api_url"], f"credit_analysis/dashboards/{deal_id}/", token)
    print_json("DASHBOARDS", dashboards)

    if not dashboards:
        print("\nNo dashboards found for this deal.")
        return

    # 5. Get sections for the first dashboard
    dashboard_id = dashboards[0]["id"]
    dashboard_title = dashboards[0].get("title", "Unknown")
    print(f"\nFetching sections for dashboard: {dashboard_title} ({dashboard_id})")
    sections = api_get(creds["api_url"], f"credit_analysis/dashboard-sections/{dashboard_id}/", token)
    print_json(f"DASHBOARD SECTIONS — {dashboard_title}", sections)

    print(f"\n{'='*60}")
    print("  Done! Use this data structure knowledge to build your solution.")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    main()
