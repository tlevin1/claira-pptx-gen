import { loadCredentials } from "../api/credentials";
import { authenticate } from "../api/auth";
import { ClairaClient } from "../api/clairaClient";
import { generatePresentation } from "../ppt/generatePresentation";

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

  const token = await authenticate(
    creds.auth_url,
    creds.email,
    creds.password
  );

  const client = new ClairaClient(creds.api_url, token);

  // get first deal (for now)
  const deals = await client.listDeals();

  if (!deals.length) {
    throw new Error("No deals found.");
  }

  const input = process.argv.slice(2).join(" ").trim();

  printJson(
    "DEALS",
    deals.map((d) => ({ id: d.id, asset_name: d.asset_name }))
  );
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
  const dashboards = await client.getDashboards(deal.id);

  if (!dashboards.length) {
    throw new Error("No dashboards found.");
  }

  const defaultDashboard =
    dashboards.find((d) => d.is_default) ?? dashboards[0];

  const sections = await client.getSections(defaultDashboard.id);

  const outputPath = await generatePresentation(deal, sections);

  console.log(`✅ Generated PPT: ${outputPath}`);
}

main().catch((err) => {
  console.error("Error:", err);
});