import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';

interface YearSelectorProps {
  years: number[];
  selectedYear: number | null;
  onYearChange: (year: number) => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({
  years,
  selectedYear,
  onYearChange,
}) => {
  const theme = useTheme();

  const pickerItems = years.map(year => ({
    label: year.toString(),
    value: year,
  }));

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.container}>
          <Text style={styles.label}>Select Year:</Text>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={onYearChange}
              items={pickerItems}
              value={selectedYear}
              style={{
                inputIOS: styles.pickerInput,
                inputAndroid: styles.pickerInput,
                placeholder: styles.pickerPlaceholder,
              }}
              placeholder={{ label: 'Select a year...', value: null }}
            />
          </View>
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
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  pickerContainer: {
    flex: 1,
    marginLeft: 16,
  },
  pickerInput: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    color: '#2c3e50',
    backgroundColor: '#fff',
  },
  pickerPlaceholder: {
    color: '#999',
  },
});

export default YearSelector;
