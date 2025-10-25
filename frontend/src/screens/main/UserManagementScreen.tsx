import React, { useState, useEffect } from 'react';
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
  FAB,
  List,
  Divider,
  useTheme,
  ActivityIndicator,
  Dialog,
  Portal,
  TextInput,
  Menu,
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const UserManagementScreen: React.FC = () => {
  const theme = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [menuVisible, setMenuVisible] = useState<{ [key: string]: boolean }>({});

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER' as 'ADMIN' | 'USER',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call to fetch users
      // const response = await userService.getUsers();
      // setUsers(response.users);
      
      // Mock data for now
      setUsers([
        {
          id: '1',
          name: 'Admin User',
          email: 'admin@ceekay.com',
          role: 'ADMIN',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Sample User',
          email: 'user@ceekay.com',
          role: 'USER',
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setFormData({ name: '', email: '', password: '', role: 'USER' });
    setShowAddDialog(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
    setShowEditDialog(true);
  };

  const handleDeleteUser = (user: any) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${user.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement delete user API call
            console.log('Delete user:', user.id);
            loadUsers();
          },
        },
      ]
    );
  };

  const handleSaveUser = async () => {
    if (!formData.name || !formData.email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      if (showAddDialog) {
        // TODO: Implement add user API call
        console.log('Add user:', formData);
      } else {
        // TODO: Implement update user API call
        console.log('Update user:', selectedUser.id, formData);
      }
      
      setShowAddDialog(false);
      setShowEditDialog(false);
      loadUsers();
    } catch (error) {
      Alert.alert('Error', 'Failed to save user');
    }
  };

  const toggleMenu = (userId: string) => {
    setMenuVisible(prev => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  if (user?.role !== 'ADMIN') {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content style={styles.accessDenied}>
            <Text style={styles.accessDeniedText}>
              Access Denied. Admin privileges required.
            </Text>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>User Management</Title>
            
            {loading ? (
              <ActivityIndicator size="large" color={theme.colors.primary} />
            ) : (
              <>
                {users.length === 0 ? (
                  <Text style={styles.emptyText}>No users found</Text>
                ) : (
                  users.map((user, index) => (
                    <View key={user.id}>
                      <List.Item
                        title={user.name}
                        description={`${user.email} • ${user.role}`}
                        left={(props) => (
                          <List.Icon 
                            {...props} 
                            icon={user.role === 'ADMIN' ? 'account-cog' : 'account'} 
                          />
                        )}
                        right={(props) => (
                          <Menu
                            visible={menuVisible[user.id] || false}
                            onDismiss={() => toggleMenu(user.id)}
                            anchor={
                              <Button
                                mode="text"
                                onPress={() => toggleMenu(user.id)}
                                icon="dots-vertical"
                              >
                                Actions
                              </Button>
                            }
                          >
                            <Menu.Item
                              onPress={() => {
                                toggleMenu(user.id);
                                handleEditUser(user);
                              }}
                              title="Edit"
                              leadingIcon="pencil"
                            />
                            <Menu.Item
                              onPress={() => {
                                toggleMenu(user.id);
                                handleDeleteUser(user);
                              }}
                              title="Delete"
                              leadingIcon="delete"
                            />
                          </Menu>
                        )}
                      />
                      {index < users.length - 1 && <Divider />}
                    </View>
                  ))
                )}
              </>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleAddUser}
        label="Add User"
      />

      {/* Add User Dialog */}
      <Portal>
        <Dialog visible={showAddDialog} onDismiss={() => setShowAddDialog(false)}>
          <Dialog.Title>Add New User</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              mode="outlined"
              style={styles.dialogInput}
            />
            <TextInput
              label="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              mode="outlined"
              keyboardType="email-address"
              style={styles.dialogInput}
            />
            <TextInput
              label="Password"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              mode="outlined"
              secureTextEntry
              style={styles.dialogInput}
            />
            <TextInput
              label="Role"
              value={formData.role}
              onChangeText={(text) => setFormData({ ...formData, role: text as 'ADMIN' | 'USER' })}
              mode="outlined"
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onPress={handleSaveUser}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Edit User Dialog */}
      <Portal>
        <Dialog visible={showEditDialog} onDismiss={() => setShowEditDialog(false)}>
          <Dialog.Title>Edit User</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              mode="outlined"
              style={styles.dialogInput}
            />
            <TextInput
              label="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              mode="outlined"
              keyboardType="email-address"
              style={styles.dialogInput}
            />
            <TextInput
              label="Password (leave blank to keep current)"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              mode="outlined"
              secureTextEntry
              style={styles.dialogInput}
            />
            <TextInput
              label="Role"
              value={formData.role}
              onChangeText={(text) => setFormData({ ...formData, role: text as 'ADMIN' | 'USER' })}
              mode="outlined"
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onPress={handleSaveUser}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  card: {
    margin: 16,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  accessDenied: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  accessDeniedText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  dialogInput: {
    marginBottom: 16,
  },
});

export default UserManagementScreen;
