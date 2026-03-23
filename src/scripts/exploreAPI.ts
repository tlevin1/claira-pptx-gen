import { loadCredentials } from "../api/credentials";
import { authenticate } from "../api/auth";
import { ClairaClient } from "../api/clairaClient";

function printJson(label: string, data: unknown, maxItems = 3) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`  ${label}`);
  console.log(`${"=".repeat(60)}`);

  if (Array.isArray(data) && data.length > maxItems) {
    console.log(`  (Showing ${maxItems} of ${data.length} items)\n`);
    console.log(JSON.stringify(data.slice(0, maxItems), null, 2));
    return;
  }

  console.log(JSON.stringify(data, null, 2));
}

async function main() {
  const creds = loadCredentials();

  console.log("Authenticating...");
  const token = await authenticate(
    creds.auth_url,
    creds.email,
    creds.password
  );

  const client = new ClairaClient(creds.api_url, token);

  console.log("Fetching deals...");
  const deals = await client.listDeals();
  printJson(
    "DEALS",
    deals.map((d) => ({ id: d.id, asset_name: d.asset_name }))
  );

  if (!deals.length) {
    console.log("No deals found.");
    return;
  }

  const dealId = deals[0].id;
  console.log(`Fetching details for deal: ${dealId}`);
  const deal = await client.getDeal(dealId);
  printJson(`DEAL DETAILS — ${deal.asset_name}`, deal);

  console.log(`Fetching dashboards for deal: ${dealId}`);
  const dashboards = await client.getDashboards(dealId);
  printJson("DASHBOARDS", dashboards);

  if (!dashboards.length) {
    console.log("No dashboards found for this deal.");
    return;
  }

  const dashboardId = dashboards[0].id;
  const dashboardTitle = dashboards[0].title ?? "Unknown";

  console.log(`Fetching sections for dashboard: ${dashboardTitle} (${dashboardId})`);
  const sections = await client.getSections(dashboardId);
  printJson(`DASHBOARD SECTIONS — ${dashboardTitle}`, sections);
}

main().catch((err) => {
  console.error("Error:", err?.response?.data || err.message || err);
  process.exit(1);
});