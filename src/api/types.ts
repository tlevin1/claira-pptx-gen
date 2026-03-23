export interface Credentials {
  auth_url: string;
  api_url: string;
  email: string;
  password: string;
}

export interface Deal {
  id: string;
  asset_id?: string;
  asset_name: string;
  data?: Record<string, unknown>;
  created_by_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Dashboard {
  id: string;
  title?: string;
  deal_id: string;
  public?: boolean;
  is_default?: boolean;
  created_at?: string;
  last_modified_at?: string;
}

export interface Citation {
  type?: string;
  document_id?: string;
  document_name?: string;
  section_title?: string | null;
  reference?: string;
  context?: {
    period?: string | null;
    validation_explanation?: string | null;
  };
}

export interface Section {
  id: string;
  dashboard_id: string;
  title?: string;
  type: string;
  draft_prompt?: string;
  value: any;
  citations?: {
    citations?: Citation[];
  } | null;
  position?: number;
  last_modified_at?: string;
}

export type SlideKind =
  | "company_overview"
  | "credit_risks"
  | "generic_narrative"
  | "transaction_overview"
  | "financials"
  | "credit_info"
  | "unsupported";