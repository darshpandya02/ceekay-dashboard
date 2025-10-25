import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

interface KPICardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon, color }) => {
  const theme = useTheme();

  return (
    <Card style={[styles.card, { width: '48%', marginBottom: 8 }]}>
      <Card.Content style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={[styles.icon, { color }]}>📊</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.value} numberOfLines={1}>
            {value}
          </Text>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    elevation: 2,
    borderRadius: 8,
  },
  content: {
    padding: 12,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    alignItems: 'center',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default KPICard;
