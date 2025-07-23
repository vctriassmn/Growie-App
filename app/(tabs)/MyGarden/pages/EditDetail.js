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
  const [condition, setCondition] = useState(plant.condition);
  const [waterLevel, setWaterLevel] = useState(String(plant.waterLevel));
  const [waterFrequency, setWaterFrequency] = useState(String(plant.waterFrequency));

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
      condition,
      waterLevel: parseInt(waterLevel),
      waterFrequency: parseInt(waterFrequency),

    };
    console.log('Updated plant:', updatedPlant);
    router.replace(`/MyGarden/plant/${plant.id}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#694B40' }}>
      <StatusBar style="light"/>
      <ScrollView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push(`/plant/${id}`)}
        >
          <BackIcon width={40} height={40} />
        </TouchableOpacity>

        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={getImage(plant.image)}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.overlay} />
            <TouchableOpacity style={styles.editIconContainer} onPress={handleImagePick}>
              <Edit1Icon width={40} height={40} />
            </TouchableOpacity>
          </View>
        </View>


        <View style={styles.isi}>
          <Text style={[styles.label, {alignSelf: 'center', fontSize: 20}]}>Edit Plant Details</Text>
          <TextInput
            style={[styles.input, { backgroundColor: 'transparent', borderBottomWidth: 1, borderColor: '#448461', color: '#448461', borderRadius: 0 }]}
            placeholder="Plant Name"
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.label}>Water Level</Text>
          <View style={{ flexDirection: 'row', marginHorizontal: 16, marginBottom: 16, alignItems: 'center' }}>
            <TextInput
              style={[styles.input, {backgroundColor: '#D7F6F4', color: '#316569'}]}
              placeholder="Water Level"
              value={waterLevel}
              keyboardType="numeric"
              onChangeText={setWaterLevel}
            />
            <Text style={[styles.input, { color: '#316569', backgroundColor: 'transparent', marginHorizontal: 0 }]}>%</Text>
            <View style={{ height: '90%', backgroundColor: '#316569', width: 1.5, marginHorizontal: 12, alignSelf: 'center' }}/>
            <Text style={[styles.input, { color: '#316569', backgroundColor: 'transparent', marginHorizontal: 0 }]}>Every</Text>
            <TextInput
              style={[styles.input, {backgroundColor: '#D7F6F4', color: '#316569'}]}
              placeholder="Water Frequency (days)"
              value={waterFrequency}
              keyboardType="numeric"
              onChangeText={setWaterFrequency}
            />
            <Text style={[styles.input, { color: '#316569', backgroundColor: 'transparent', marginHorizontal: 0 }]}>Days</Text>
          </View>

          <Text style={styles.label}>Age</Text>
          <View style={{ flexDirection: 'row', marginHorizontal: 16, marginBottom: 16, alignItems: 'center' }}>
            <TextInput
              style={[styles.input, {backgroundColor: '#FBF2D6', color: '#694231'}]}
              placeholder="Age (days)"
              value={age}
              keyboardType="numeric"
              onChangeText={setAge}
            />
            <Text style={[styles.input, { color: '#694231', backgroundColor: 'transparent', marginHorizontal: 0 }]}>Days</Text>
          </View>

          <Text style={styles.label}>Condition</Text>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, {backgroundColor: '#D3E6DB', color: '#448461', height: 100, fontSize: 14 }]}
            placeholder="Notes"
            value={notes}
            multiline
            onChangeText={setNotes}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
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

  // Image ==================================================================
  imageContainer: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#D3E6DB',
  },
  imageWrapper: {
    width: screenWidth,
    height: screenWidth * 7 / 9,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenWidth * 7 / 9,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 2,
  },

  // edit icon =========================================================
  editIconContainer: {
    position: 'absolute',
    top: '50%',
    transform: [ { translateY: -20 }],
    alignSelf: 'center',
    padding: 6,
    zIndex: 3,
  },

  // isi ==================================================================
  isi: {
        padding: 30,
        paddingTop: 20,
        backgroundColor: '#FAFFFB',
    },

  // input =========================================================
  label: {
    fontSize: 12,
    fontWeight: 'semibold',
    marginBottom: 8,
    color: '#284E43',
  },
  input: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 8,
    fontSize: 20,
  },

  // save =========================================================
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