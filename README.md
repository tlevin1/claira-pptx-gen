# Claira Engineering Challenge: Deal Presentation Generator

## Introduction

[Claira](https://claira.io) is a financial document analysis platform. Our clients use it to manage deals, analyze financial documents, and generate insights. Each deal has one or more **dashboards** containing sections of analysis — rich text summaries, financial metrics, tables, and more.

The platform currently supports exporting dashboards to Word (DOCX) documents. We want to explore **PowerPoint (PPTX) generation**.

## The Challenge

You are given:

1. **An example PPTX** (`template.pptx`) — a lending presentation created for a specific deal
2. **API access** to the Claira platform, which contains multiple deals with dashboard data

**Your task:** Build a tool that generates a PPTX presentation for **any given deal** that visually resembles the example presentation — same style, layout, and general structure — but populated with that deal's actual data.

### How you build it is entirely up to you

You may use any library, tool, API, or AI service. We care about the **result** and your **approach**, not the specific technology. Part of what we're evaluating is how you choose to solve the problem.

### What "visually resembles" means

- The output should follow a similar slide structure, layout, and styling as the example
- Same fonts, colors, and general arrangement where feasible
- Content should come from the target deal's dashboard data (not hardcoded)
- Minor formatting differences are fine — we care about fidelity, not pixel-perfection

## Requirements

- Working code that produces a valid `.pptx` file
- Accepts a **deal ID** as input
- Should work with **any deal** available in the platform (not hardcoded to one)
- Include a **README** with: setup instructions, how to run it, and a brief explanation of your approach
- **Bonus:** A simple web UI (deal picker, generate button, download) is a plus but not required

## API Reference

The Claira platform exposes a REST API. All data endpoints require JWT authentication.

### Base URLs

| Service | URL |
|---------|-----|
| Auth | `https://auth.platform.claira.io` |
| Data API | `https://da.platform.claira.io/v2` |

### Authentication

```
POST https://auth.platform.claira.io/login/
Content-Type: application/json

{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

**Response (200):**
```json
{
  "data": {
    "access_token": "eyJhbGciOiJSUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJSUzI1NiIs..."
  }
}
```

Use the `access_token` as a Bearer token in all subsequent requests:

```
Authorization: Bearer <access_token>
```

### List Deals

```
GET https://da.platform.claira.io/v2/credit_analysis/deals/
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "data": {
    "deals": [
      {
        "id": "e794d2df-e5dd-48c2-8bb1-f23742c05649",
        "asset_id": "55728",
        "asset_name": "Acme Corp",
        "data": {
          "status": "active",
          "client_name": "Your Company"
        },
        "created_by_name": "John Smith",
        "created_at": "2023-09-05T18:44:37",
        "updated_at": "2023-09-05T18:44:37"
      }
    ]
  }
}
```

### Get Deal Details

```
GET https://da.platform.claira.io/v2/credit_analysis/deals/{deal_id}/
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "data": {
    "id": "e794d2df-e5dd-48c2-8bb1-f23742c05649",
    "asset_id": "55728",
    "asset_name": "Acme Corp",
    "data": { ... },
    "created_by_name": "John Smith",
    "created_at": "2023-09-05T18:44:37",
    "updated_at": "2023-09-05T18:44:37"
  }
}
```

### Get Dashboards for a Deal

```
GET https://da.platform.claira.io/v2/credit_analysis/dashboards/{deal_id}/
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "abc12345-6789-def0-1234-567890abcdef",
      "title": "Overview",
      "deal_id": "e794d2df-e5dd-48c2-8bb1-f23742c05649",
      "public": true,
      "is_default": true,
      "created_at": "2024-03-14T12:00:00Z",
      "last_modified_at": "2024-03-14T12:00:00Z"
    }
  ]
}
```

### Get Dashboard Sections

This returns all sections for a given dashboard. Sections contain the actual content — rich text, metrics, etc.

```
GET https://da.platform.claira.io/v2/credit_analysis/dashboard-sections/{dashboard_id}/
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "section-uuid-1",
      "dashboard_id": "abc12345-6789-def0-1234-567890abcdef",
      "title": "Executive Summary",
      "type": "Rich Textbox",
      "value": {
        "text": "<p>This is the executive summary with <strong>HTML formatting</strong>...</p>"
      },
      "citations": null,
      "position": 0,
      "last_modified_at": "2024-03-21T10:00:00Z"
    },
    {
      "id": "section-uuid-2",
      "dashboard_id": "abc12345-6789-def0-1234-567890abcdef",
      "title": "Key Metrics",
      "type": "Metrics",
      "value": {
        "metrics": [ ... ]
      },
      "position": 1,
      "last_modified_at": "2024-03-21T10:00:00Z"
    }
  ]
}
```

**Section types you may encounter:**
- `Rich Textbox` — HTML content (summaries, analysis text). The `value.text` field contains HTML.
- `Metrics` — Structured financial metrics/KPIs.
- Other types may appear — explore the data to understand them.

## Getting Started

1. Install dependencies for the example script:
   ```bash
   pip install -r requirements.txt
   ```

2. Copy `credentials.example.json` to `credentials.json` and fill in your credentials (provided separately).

3. Run the example script to explore the API and see the data structure:
   ```bash
   python example_api_usage.py
   ```

4. Open `template.pptx` to study the presentation format you need to replicate.

5. Build your solution!

## Credentials

Your API credentials will be provided separately. Copy them into `credentials.json`:

```json
{
  "auth_url": "https://auth.platform.claira.io",
  "api_url": "https://da.platform.claira.io/v2",
  "email": "your-email",
  "password": "your-password"
}
```

## Evaluation Criteria

| Criteria | What we're looking for |
|----------|----------------------|
| **Output Quality** | Does the generated PPTX look like the example, with correct deal data? |
| **API Integration** | Proper auth, error handling, correct data fetching |
| **Approach** | How did you tackle the problem? What tools/AI did you leverage? What trade-offs did you make? |
| **Code Quality** | Clean, readable, well-organized code |
| **Error Handling** | Graceful handling of missing data, API failures, edge cases |
| **Documentation** | Clear README explaining setup, usage, and design decisions |
| **Bonus** | Tests, extensibility, creative AI integration, web UI, handling of edge cases |

## Questions?

If you have questions about the API or the challenge, reach out to your interviewer.

Good luck!
