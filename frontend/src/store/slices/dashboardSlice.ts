import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { dashboardService } from '../../services/dashboardService';

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

interface DashboardState {
  data: DashboardData | null;
  selectedYear: number | null;
  availableYears: number[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  selectedYear: null,
  availableYears: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchAvailableYears = createAsyncThunk(
  'dashboard/fetchAvailableYears',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getAvailableYears();
      return response.years;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch years');
    }
  }
);

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (year: number, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getDashboardData(year);
      return { year, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch dashboard data');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setSelectedYear: (state, action: PayloadAction<number>) => {
      state.selectedYear = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch available years
      .addCase(fetchAvailableYears.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailableYears.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableYears = action.payload;
        if (action.payload.length > 0 && !state.selectedYear) {
          state.selectedYear = action.payload[0];
        }
      })
      .addCase(fetchAvailableYears.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch dashboard data
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
        state.selectedYear = action.payload.year;
        state.error = null;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedYear, clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
