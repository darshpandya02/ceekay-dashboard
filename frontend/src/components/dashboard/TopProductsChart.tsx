import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { BarChart } from 'react-native-chart-kit';

interface TopProductsChartProps {
  data: Array<{ name: string; revenue: number }>;
}

const { width } = Dimensions.get('window');
const chartWidth = width - 32;

const TopProductsChart: React.FC<TopProductsChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(item => 
      item.name.length > 15 
        ? item.name.substring(0, 15) + '...' 
        : item.name
    ),
    datasets: [
      {
        data: data.map(item => item.revenue / 10000000), // Convert to crores
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(102, 126, 234, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 10,
    },
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>Top Products by Revenue</Text>
        <View style={styles.chartContainer}>
          <BarChart
            data={chartData}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            yAxisLabel="₹"
            yAxisSuffix="Cr"
            showValuesOnTopOfBars
            fromZero
          />
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default TopProductsChart;
