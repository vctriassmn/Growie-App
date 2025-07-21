import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

import { plants } from '../data'; // sesuaikan path
import { getImage } from '../getImage';

import BackIcon from '../../../../assets/icons/back.svg';
import Edit1Icon from '../../../../assets/icons/editdetail.svg';

export default function EditPlant() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const plant = plants.find(p => p.id === parseInt(id));

  const [imageSource, setImageSource] = useState(getImage(plant.image));
  const [name, setName] = useState(plant.name);
  const [age, setAge] = useState(String(plant.age));
  const [notes, setNotes] = useState(plant.notes);

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert('Permission Denied', 'We need camera roll permission!');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImageSource({ uri: result.assets[0].uri });
    }
  };

  const handleSave = () => {
    const updatedPlant = {
      ...plant,
      name,
      age: parseInt(age),
      notes,
      image: imageSource.uri || plant.image, // simpan uri baru jika ada
    };
    console.log('Updated plant:', updatedPlant);
    router.replace(`/MyGarden/plant/${plant.id}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#694B40' }}>
      <StatusBar style="light" backgroundColor="#694B40" />
      <ScrollView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push(`/MyGarden/plant/${id}`)}
        >
          <BackIcon width={40} height={40} />
        </TouchableOpacity>

        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={imageSource}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.overlay} />
            <TouchableOpacity style={styles.editIconContainer} onPress={handleImagePick}>
              <Edit1Icon width={32} height={32} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.label}>Edit Plant Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Plant Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Age (days)"
          value={age}
          keyboardType="numeric"
          onChangeText={setAge}
        />
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Notes"
          value={notes}
          multiline
          onChangeText={setNotes}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAFFFB',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 999,
  },
  imageContainer: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#D3E6DB',
    alignItems: 'center',
  },
  imageWrapper: {
    width: screenWidth,
    height: screenWidth * 7 / 9,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenWidth * 7 / 9,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    zIndex: 2,
  },
  editIconContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 6,
    borderRadius: 20,
    zIndex: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
    marginHorizontal: 16,
  },
  input: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    marginHorizontal: 16,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  saveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});