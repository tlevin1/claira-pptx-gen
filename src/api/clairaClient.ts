import axios, { AxiosInstance } from "axios";
import { Dashboard, Deal, Section } from "./types";

export class ClairaClient {
  private client: AxiosInstance;

  constructor(apiUrl: string, token: string) {
    this.client = axios.create({
      baseURL: apiUrl,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private async get<T>(path: string): Promise<T> {
    const response = await this.client.get(`/${path}`);
    return response.data.data as T;
  }

  async listDeals(): Promise<Deal[]> {
    const data = await this.get<{ deals: Deal[] }>("credit_analysis/deals/");
    return data.deals ?? [];
  }

  async getDeal(dealId: string): Promise<Deal> {
    return this.get<Deal>(`credit_analysis/deals/${dealId}/`);
  }

  async getDashboards(dealId: string): Promise<Dashboard[]> {
    return this.get<Dashboard[]>(`credit_analysis/dashboards/${dealId}/`);
  }

  async getSections(dashboardId: string): Promise<Section[]> {
    return this.get<Section[]>(
      `credit_analysis/dashboard-sections/${dashboardId}/`
    );
  }
}