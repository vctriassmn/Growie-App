import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddFolder({ navigation, route }) {
  const [folderName, setFolderName] = useState('');

  const handleAdd = () => {
    if (folderName.trim() === '') {
      Alert.alert('Error', 'Nama folder tidak boleh kosong.');
      return;
    }
    // Panggil fungsi onAdd yang diterima dari ListJournalPage
    if (route.params?.onAdd) {
      route.params.onAdd(folderName);
    }
    navigation.goBack(); // Kembali ke halaman sebelumnya
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Journal Folder</Text>
      <TextInput
        style={styles.input}
        placeholder="Folder Name"
        placeholderTextColor="#888"
        value={folderName}
        onChangeText={setFolderName}
      />
      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add Folder</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f2e0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5c8d5c',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#5c8d5c',
    color: '#333',
  },
  button: {
    backgroundColor: '#5c8d5c',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});