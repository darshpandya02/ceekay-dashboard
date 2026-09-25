import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Button,
  TextInput,
  useTheme,
  ActivityIndicator,
  List,
  Divider,
} from 'react-native-paper';
import { uploadService } from '../../services/uploadService';

// Alert.alert is a no-op in react-native-web, so fall back to the browser dialog
const notify = (title: string, message: string) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

// react-native-document-picker has no web implementation, so use a file input on web
const pickCsvOnWeb = (): Promise<any> =>
  new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,text/csv';
    input.onchange = () => {
      const file = input.files && input.files[0];
      resolve(file ? { name: file.name, size: file.size, file } : null);
    };
    input.click();
  });

const UploadScreen: React.FC = () => {
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [isUploading, setIsUploading] = useState(false);
  const [uploadHistory, setUploadHistory] = useState<any[]>([]);

  const handleFilePicker = async () => {
    if (Platform.OS === 'web') {
      const file = await pickCsvOnWeb();
      if (file) {
        setSelectedFile(file);
      }
      return;
    }
    // Loaded lazily: the native module crashes react-native-web at import time
    const DocumentPicker = require('react-native-document-picker').default;
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.csv],
      });
      
      if (result.length > 0) {
        setSelectedFile(result[0]);
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // User cancelled the picker
      } else {
        Alert.alert('Error', 'Failed to pick file');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      notify('Error', 'Please select a CSV file');
      return;
    }

    if (!year || isNaN(parseInt(year))) {
      notify('Error', 'Please enter a valid year');
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadService.uploadCSV(selectedFile, parseInt(year));

      if (Platform.OS === 'web') {
        notify('Success', `Successfully uploaded ${response.recordCount} records for year ${year}`);
        setSelectedFile(null);
        loadUploadHistory();
        return;
      }

      Alert.alert(
        'Success',
        `Successfully uploaded ${response.recordCount} records for year ${year}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setSelectedFile(null);
              setYear(new Date().getFullYear().toString());
              loadUploadHistory();
            },
          },
        ]
      );
    } catch (error: any) {
      notify('Upload Error', error.response?.data?.error || error.message || 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const loadUploadHistory = async () => {
    try {
      const response = await uploadService.getUploadHistory();
      setUploadHistory(response.uploads);
    } catch (error) {
      console.error('Failed to load upload history:', error);
    }
  };

  React.useEffect(() => {
    loadUploadHistory();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Upload Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Upload Sales Data</Title>
          
          <TextInput
            label="Year"
            value={year}
            onChangeText={setYear}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            disabled={isUploading}
          />

          <Button
            mode="outlined"
            onPress={handleFilePicker}
            style={styles.fileButton}
            disabled={isUploading}
            icon="file-document"
          >
            {selectedFile ? selectedFile.name : 'Select CSV File'}
          </Button>

          {selectedFile && (
            <Text style={styles.fileInfo}>
              Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </Text>
          )}

          <Button
            mode="contained"
            onPress={handleUpload}
            style={styles.uploadButton}
            loading={isUploading}
            disabled={isUploading || !selectedFile}
            icon="upload"
          >
            {isUploading ? 'Uploading...' : 'Upload Data'}
          </Button>
        </Card.Content>
      </Card>

      {/* Upload History */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Upload History</Title>
          
          {uploadHistory.length === 0 ? (
            <Text style={styles.emptyText}>No uploads yet</Text>
          ) : (
            uploadHistory.map((upload, index) => (
              <View key={upload.id}>
                <List.Item
                  title={upload.fileName}
                  description={`${upload.recordCount} records • ${upload.year} • ${new Date(upload.uploadedAt).toLocaleDateString()}`}
                  left={(props) => <List.Icon {...props} icon="file-document" />}
                  right={(props) => (
                    <View style={styles.statusContainer}>
                      <Text style={[
                        styles.statusText,
                        { color: upload.status === 'completed' ? theme.colors.success : theme.colors.error }
                      ]}>
                        {upload.status}
                      </Text>
                    </View>
                  )}
                />
                {index < uploadHistory.length - 1 && <Divider />}
              </View>
            ))
          )}
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
  input: {
    marginBottom: 16,
  },
  fileButton: {
    marginBottom: 8,
  },
  fileInfo: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  uploadButton: {
    marginTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  statusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default UploadScreen;
