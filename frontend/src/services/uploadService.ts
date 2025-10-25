import { api } from './api';

export interface UploadResponse {
  success: boolean;
  message: string;
  recordCount: number;
  errors?: string[];
}

export interface UploadHistoryItem {
  id: string;
  fileName: string;
  year: number;
  recordCount: number;
  uploadedBy: string;
  uploadedAt: string;
  status: string;
}

export interface UploadHistoryResponse {
  success: boolean;
  uploads: UploadHistoryItem[];
}

export const uploadService = {
  async uploadCSV(file: any, year: number): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('csvFile', {
      uri: file.uri,
      type: 'text/csv',
      name: file.name || 'sales-data.csv',
    } as any);
    formData.append('year', year.toString());

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async getUploadHistory(): Promise<UploadHistoryResponse> {
    const response = await api.get('/upload/history');
    return response.data;
  },
};
