import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  useTheme,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { login, clearError } from '../../store/slices/authSlice';

// Public demo account (seeded with synthetic sample data only)
const DEMO_EMAIL = 'demo@ceekay-demo.dev';
const DEMO_PASSWORD = 'demo-dashboard-2026';

const LoginScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Alert.alert is a no-op in react-native-web, so fall back to the browser dialog
  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await dispatch(login({ email, password })).unwrap();
    } catch (error) {
      // Error is handled by the slice
    }
  };

  React.useEffect(() => {
    if (error) {
      showAlert('Login Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Title style={[styles.title, { color: theme.colors.primary }]}>
            CEEKAY DASHBOARD
          </Title>
          <Paragraph style={styles.subtitle}>
            Internal Sales Monitoring System
          </Paragraph>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Sign In</Title>
            
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              disabled={isLoading}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
              disabled={isLoading}
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
            >
              Sign In
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.demoCard}>
          <Card.Content>
            <Text style={styles.demoTitle}>Public demo</Text>
            <Text style={styles.demoText}>Email: {DEMO_EMAIL}</Text>
            <Text style={styles.demoText}>Password: {DEMO_PASSWORD}</Text>
            <Text style={styles.demoNote}>All sales figures are synthetic sample data.</Text>
            <Button
              mode="outlined"
              onPress={() => {
                setEmail(DEMO_EMAIL);
                setPassword(DEMO_PASSWORD);
              }}
              disabled={isLoading}
              style={styles.demoButton}
            >
              Use demo login
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  card: {
    elevation: 4,
    borderRadius: 12,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 24,
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  demoCard: {
    marginTop: 24,
    borderRadius: 12,
    backgroundColor: '#eef2ff',
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 14,
    marginBottom: 2,
  },
  demoNote: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
  },
  demoButton: {
    marginTop: 12,
    borderRadius: 8,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
});

export default LoginScreen;
