import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Button,
  List,
  Divider,
  useTheme,
  Avatar,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => dispatch(logout()),
        },
      ]
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text
            size={80}
            label={getInitials(user?.name || 'U')}
            style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
          />
          <View style={styles.profileInfo}>
            <Title style={styles.userName}>{user?.name}</Title>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <Text style={[styles.userRole, { color: theme.colors.primary }]}>
              {user?.role}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Account Information */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Account Information</Title>
          
          <List.Item
            title="User ID"
            description={user?.id}
            left={(props) => <List.Icon {...props} icon="identifier" />}
          />
          <Divider />
          
          <List.Item
            title="Email"
            description={user?.email}
            left={(props) => <List.Icon {...props} icon="email" />}
          />
          <Divider />
          
          <List.Item
            title="Role"
            description={user?.role}
            left={(props) => <List.Icon {...props} icon="account-cog" />}
          />
        </Card.Content>
      </Card>

      {/* App Information */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>App Information</Title>
          
          <List.Item
            title="Version"
            description="1.0.0"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
          <Divider />
          
          <List.Item
            title="Build"
            description="Production"
            left={(props) => <List.Icon {...props} icon="cog" />}
          />
        </Card.Content>
      </Card>

      {/* Actions */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Actions</Title>
          
          <Button
            mode="outlined"
            onPress={() => Alert.alert('Coming Soon', 'Change password feature will be available soon')}
            style={styles.actionButton}
            icon="lock"
          >
            Change Password
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => Alert.alert('Coming Soon', 'Notifications settings will be available soon')}
            style={styles.actionButton}
            icon="bell"
          >
            Notifications
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => Alert.alert('Coming Soon', 'Help and support will be available soon')}
            style={styles.actionButton}
            icon="help-circle"
          >
            Help & Support
          </Button>
        </Card.Content>
      </Card>

      {/* Logout Button */}
      <Card style={styles.logoutCard}>
        <Card.Content>
          <Button
            mode="contained"
            onPress={handleLogout}
            style={[styles.logoutButton, { backgroundColor: theme.colors.error }]}
            icon="logout"
          >
            Logout
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  profileCard: {
    margin: 16,
    elevation: 4,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  card: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 8,
  },
  logoutCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  logoutButton: {
    marginTop: 8,
  },
});

export default ProfileScreen;
