# Claira Deal Presentation Generator

This project generates PowerPoint (PPTX) presentations for credit deals using data from the Claira API.

Given a deal ID or name, the tool fetches dashboard data and produces a structured presentation that mirrors the provided template (layout, styling, and content organization).

## Features

- Authenticates with Claira API using JWT
- Fetches deals, dashboards, and sections dynamically
- Transforms raw dashboard data into structured slide content
- Generates PPTX presentations programmatically using `pptxgenjs`
- Matches template layout including:
  - Company Overview slide (custom layout)
  - KPI cards and financial summaries
  - Structured tables (e.g., risks, financials)
- CLI-based input for selecting a deal

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create credentials file:

Copy credentials.example.json → credentials.json and fill in:

{
  "auth_url": "...",
  "api_url": "...",
  "email": "...",
  "password": "..."
}

---

## 4. How to Run


## Usage

Generate a presentation by passing a deal name or ID:

```bash
npx ts-node src/scripts/generate.ts "Project Darner"


Output will be saved to:

/output/<deal_name>.pptx


## Approach

The system is structured into three main layers:

### 1. Data Layer
- Handles authentication and API requests
- Fetches deals, dashboards, and sections from Claira

### 2. Transformation Layer
- Converts raw API data into structured slide data
- Uses section classification (e.g., company overview, financials, risks)
- Extracts key content such as:
  - Bullet summaries
  - KPI metrics
  - Table rows

### 3. Presentation Layer
- Uses `pptxgenjs` to generate slides
- Each slide type has a dedicated renderer
- Layouts are manually constructed to match the provided template

### Slide Ordering
Slides are rendered in a fixed sequence (independent of API order):
1. Company Overview
2. Financials
3. Transaction Overview
4. Credit Risks

## Future Improvements

- Use an LLM to improve content summarization and structuring
- Better handling of additional section types
- Add support for images and charts
- Improve financial data extraction for more accurate KPI generation
- Add a simple web UI for selecting and generating presentations

## Tech Stack

- TypeScript
- Node.js
- pptxgenjs
- Claira REST API

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
