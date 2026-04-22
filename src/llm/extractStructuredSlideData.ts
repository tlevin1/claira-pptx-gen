import OpenAI from "openai";

const client = new OpenAI();

export interface LlmExtractionRequest {
  sectionTitle: string;
  sectionType: string;
  rawHtml: string;
  targetSchema: "company_overview" | "credit_risks" | "transaction_overview";
}

export async function extractStructuredSlideData(
  request: LlmExtractionRequest
): Promise<any> {
  const prompt = buildPrompt(request);

  const response = await client.responses.create({
    model: "gpt-4o",
    input: prompt,
    text: { format: { type: "json_object" } },
  });

  return JSON.parse(response.output_text);
}

function buildPrompt(request: LlmExtractionRequest): string {
  if (request.targetSchema === "company_overview") {
    return `
You are extracting structured presentation content from a credit analysis section.

Return valid JSON only.

Schema:
{
  "companyName": "string",
  "businessDescription": ["string"],
  "productsServices": ["string"],
  "revenueSegmentation": [{"label": "string", "value": "string"}],
  "endMarkets": ["string"],
  "keyCustomers": ["string"],
  "watchpoints": ["string"]
}

Rules:
- Use only facts from the provided HTML
- No invented content
- Keep bullets concise
- Max 4 bullets per array where practical

Section title: ${request.sectionTitle}
Section type: ${request.sectionType}

HTML:
${request.rawHtml}
`.trim();
  }

  if (request.targetSchema === "credit_risks") {
    return `
You are extracting structured credit risks from a credit analysis section.

Return valid JSON only.

Schema:
{
  "rows": [
    {
      "risk": "string",
      "description": "string",
      "mitigant": "string"
    }
  ]
}

Rules:
- Use only facts from the provided HTML
- No invented content
- If mitigants are not explicitly stated, summarize existing balancing factors conservatively
- Max 5 rows

Section title: ${request.sectionTitle}
Section type: ${request.sectionType}

HTML:
${request.rawHtml}
`.trim();
  }

  return `
You are extracting transaction overview content from a credit analysis section.

Return valid JSON only.

Schema:
{
  "summaryBullets": ["string"],
  "transactionDetails": [{"label": "string", "value": "string"}]
}

Rules:
- Use only facts from the provided HTML
- No invented content
- Prefer explicit transaction fields where present
- Keep bullets concise
- Max 6 summary bullets
- Max 8 detail rows

Section title: ${request.sectionTitle}
Section type: ${request.sectionType}

HTML:
${request.rawHtml}
`.trim();
}