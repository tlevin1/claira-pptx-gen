import fs from "fs";
import path from "path";
import { loadCredentials } from "../api/credentials";
import { authenticate } from "../api/auth";
import { ClairaClient } from "../api/clairaClient";

function printJson(label: string, data: unknown, maxItems = 3) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`  ${label}`);
  console.log(`${"=".repeat(60)}`);

  if (Array.isArray(data) && data.length > maxItems) {
    console.log(`(Showing ${maxItems} of ${data.length} items)\n`);
    console.log(JSON.stringify(data.slice(0, maxItems), null, 2));
    return;
  }

  console.log(JSON.stringify(data, null, 2));
}

async function main() {
  const creds = loadCredentials();
  const token = await authenticate(creds.auth_url, creds.email, creds.password);
  const client = new ClairaClient(creds.api_url, token);

  const input = process.argv.slice(2).join(" ").trim();

  const deals = await client.listDeals();
  printJson(
    "DEALS",
    deals.map((d) => ({ id: d.id, asset_name: d.asset_name }))
  );

  if (!deals.length) {
    console.log("No deals found.");
    return;
  }

  let selectedDeal;

  if (input) {
    selectedDeal = deals.find(
      (d) =>
        d.id === input ||
        d.asset_name.toLowerCase() === input.toLowerCase()
    );

    if (!selectedDeal) {
      selectedDeal = deals.find((d) =>
        d.asset_name.toLowerCase().includes(input.toLowerCase())
      );
    }

    if (!selectedDeal) {
      console.log(`No deal found matching: "${input}"`);
      return;
    }
  } else {
    selectedDeal = deals[0];
  }

  console.log(`\nUsing deal: ${selectedDeal.asset_name} (${selectedDeal.id})`);

  const dealId = selectedDeal.id;
  const deal = await client.getDeal(dealId);
  const dashboards = await client.getDashboards(dealId);

  printJson("DEAL", deal);
  printJson("DASHBOARDS", dashboards);

  if (!dashboards.length) {
    console.log("No dashboards found.");
    return;
  }

  const firstDashboard = dashboards[0];
  const sections = await client.getSections(firstDashboard.id);
  printJson(`SECTIONS - ${firstDashboard.title || firstDashboard.id}`, sections, 2);

  const dumpDir = path.resolve("debug");
  if (!fs.existsSync(dumpDir)) fs.mkdirSync(dumpDir, { recursive: true });

  fs.writeFileSync(path.join(dumpDir, "deal.json"), JSON.stringify(deal, null, 2));
  fs.writeFileSync(
    path.join(dumpDir, "dashboards.json"),
    JSON.stringify(dashboards, null, 2)
  );
  fs.writeFileSync(
    path.join(dumpDir, "sections.json"),
    JSON.stringify(sections, null, 2)
  );

  console.log("\nWrote debug JSON files to ./debug");
}

main().catch((err) => {
  console.error("Error:", err?.response?.data || err.message || err);
  process.exit(1);
});