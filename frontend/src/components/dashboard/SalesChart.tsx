import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { BarChart } from 'react-native-chart-kit';

interface SalesChartProps {
  data: Array<{ product: string; turnover: number }>;
}

const { width } = Dimensions.get('window');
const chartWidth = width - 32;

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(item => 
      item.product.length > 12 
        ? item.product.substring(0, 12) + '...' 
        : item.product
    ),
    datasets: [
      {
        data: data.map(item => item.turnover),
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(118, 75, 162, ${opacity})`,
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
        <Text style={styles.title}>Inventory Turnover Analysis</Text>
        <View style={styles.chartContainer}>
          <BarChart
            data={chartData}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            yAxisLabel=""
            yAxisSuffix="x"
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

export default SalesChart;
