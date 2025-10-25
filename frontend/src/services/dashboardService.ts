import { api } from './api';

export interface DashboardData {
  totalRevenue: number;
  totalProducts: number;
  totalCategories: number;
  topProducts: Array<{ name: string; revenue: number }>;
  topCategories: Array<{ name: string; revenue: number }>;
  monthlyTrend: Array<{ month: number; revenue: number }>;
  categoryBreakdown: Array<{ name: string; value: number; percentage: number }>;
  turnoverData: Array<{ product: string; turnover: number }>;
}

export interface DashboardResponse {
  success: boolean;
  year: number;
  data: DashboardData;
}

export interface YearsResponse {
  success: boolean;
  years: number[];
}

export const dashboardService = {
  async getAvailableYears(): Promise<YearsResponse> {
    const response = await api.get('/dashboard/years');
    return response.data;
  },

  async getDashboardData(year: number): Promise<DashboardResponse> {
    const response = await api.get(`/dashboard/${year}`);
    return response.data;
  },

  async getProductDetails(year: number, productName: string) {
    const response = await api.get(`/dashboard/${year}/products/${encodeURIComponent(productName)}`);
    return response.data;
  },
};
