import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  FAB,
  useTheme,
  Chip,
  ActivityIndicator,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
  fetchAvailableYears,
  fetchDashboardData,
  setSelectedYear,
  clearError,
} from '../../store/slices/dashboardSlice';
import { logout } from '../../store/slices/authSlice';

import KPICard from '../../components/dashboard/KPICard';
import YearSelector from '../../components/dashboard/YearSelector';
import SalesChart from '../../components/dashboard/SalesChart';
import TopProductsChart from '../../components/dashboard/TopProductsChart';
import CategoryBreakdownChart from '../../components/dashboard/CategoryBreakdownChart';
import MonthlyTrendChart from '../../components/dashboard/MonthlyTrendChart';

const { width } = Dimensions.get('window');

const DashboardScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data, selectedYear, availableYears, isLoading, error } = useSelector(
    (state: RootState) => state.dashboard
  );

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchAvailableYears());
  }, [dispatch]);

  useEffect(() => {
    if (selectedYear) {
      dispatch(fetchDashboardData(selectedYear));
    }
  }, [selectedYear, dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchAvailableYears()).unwrap();
      if (selectedYear) {
        await dispatch(fetchDashboardData(selectedYear)).unwrap();
      }
    } catch (error) {
      // Error handled by slice
    } finally {
      setRefreshing(false);
    }
  };

  const handleYearChange = (year: number) => {
    dispatch(setSelectedYear(year));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  if (isLoading && !data) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.headerContent}>
              <View>
                <Title style={styles.headerTitle}>CEEKAY DASHBOARD</Title>
                <Paragraph style={styles.headerSubtitle}>
                  Sales Performance Analytics
                </Paragraph>
              </View>
              <Chip
                mode="outlined"
                textStyle={styles.roleChip}
                style={styles.roleChipContainer}
              >
                {user?.role}
              </Chip>
            </View>
          </Card.Content>
        </Card>

        {/* Year Selector */}
        <YearSelector
          years={availableYears}
          selectedYear={selectedYear}
          onYearChange={handleYearChange}
        />

        {/* KPI Cards */}
        {data && (
          <View style={styles.kpiContainer}>
            <KPICard
              title="Total Revenue"
              value={`₹${(data.totalRevenue / 10000000).toFixed(1)}Cr`}
              icon="currency-inr"
              color={theme.colors.primary}
            />
            <KPICard
              title="Active Products"
              value={data.totalProducts.toString()}
              icon="package-variant"
              color={theme.colors.success}
            />
            <KPICard
              title="Categories"
              value={data.totalCategories.toString()}
              icon="tag-multiple"
              color={theme.colors.info}
            />
            <KPICard
              title="Avg Turnover"
              value={`${data.turnoverData.length > 0 ? (data.turnoverData.reduce((sum, item) => sum + item.turnover, 0) / data.turnoverData.length).toFixed(1) : '0'}x`}
              icon="chart-line"
              color={theme.colors.warning}
            />
          </View>
        )}

        {/* Charts */}
        {data && (
          <>
            <MonthlyTrendChart data={data.monthlyTrend} />
            <TopProductsChart data={data.topProducts} />
            <CategoryBreakdownChart data={data.categoryBreakdown} />
            <SalesChart data={data.turnoverData} />
          </>
        )}

        {/* Empty State */}
        {!data && !isLoading && (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Text style={styles.emptyText}>
                No data available for the selected year
              </Text>
              <Paragraph style={styles.emptySubtext}>
                Upload CSV data to get started
              </Paragraph>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="logout"
        style={styles.fab}
        onPress={handleLogout}
        label="Logout"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  headerCard: {
    margin: 16,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  roleChip: {
    fontSize: 12,
  },
  roleChipContainer: {
    backgroundColor: '#e3f2fd',
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  emptyCard: {
    margin: 16,
    elevation: 2,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#e74c3c',
  },
});

export default DashboardScreen;
