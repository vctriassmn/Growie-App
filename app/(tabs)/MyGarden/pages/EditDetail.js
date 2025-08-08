import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

import { getImage } from '../getImage';
import { usePlant } from '../../../../context/PlantContext'; // ✅ pakai context

import BackIcon from '../../../../assets/icons/back.svg';
import Edit1Icon from '../../../../assets/icons/editdetail.svg';

export default function EditDetail() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const { id } = useLocalSearchParams();
  const { editPlant, plants } = usePlant();
  const plant = plants.find(p => p.id === parseInt(id));

  const [imageSource, setImageSource] = useState(
    typeof plant.image === 'string' && plant.image.startsWith('file')
      ? { uri: plant.image }
      : getImage(plant.image || 'placeholder')
  );
  const [name, setName] = useState(plant.name || '');
  const [age, setAge] = useState(plant.age?.toString() || '');
  const [notes, setNotes] = useState(plant.notes || '');
  const [condition, setCondition] = useState(() => plant.condition );
  const [waterLevel, setWaterLevel] = useState(plant.waterLevel?.toString() || '');
  const [waterFrequency, setWaterFrequency] = useState(plant.waterFrequency?.toString() || '');

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

    const handleSave = async () => {
        const updatedPlant = {
            ... plant,
            name,
            age: parseInt(age),
            waterLevel: parseInt(waterLevel),
            waterFrequency: parseInt(waterFrequency),
            condition,
            notes,
            image: imageSource.uri || plant.image,
        };

        if (!name || !age || !condition || !waterLevel || !waterFrequency) {
          Alert.alert("Data Tidak Lengkap", "Isi semua kolom sebelum menyimpan.");
          return;
        }


        // try {
            await editPlant(updatedPlant);
            console.log('Sesudah simpan:', updatedPlant);
            console.log('Sesudah simpan:', plants.length);
            router.replace(`/plant/${id}`); // Navigasi ke halaman MyGarden setelah simpan
        // } catch (error) {
        //     console.error('Gagal simpan tanaman:', error);
        // }
    };

  return (
    <SafeAreaProvider>
      <View
        style={{
          paddingTop: insets.top,
          backgroundColor: '#694B40',
        }}
      >
        <StatusBar barStyle="light-content" />
        {/* Header atau title */}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={-90} // bisa disesuaikan
      >

        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 50 }} // biar bisa scroll sampai bawah
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
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
                <Edit1Icon width={80} height={80} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.isi}>
            <Text style={[styles.label, { alignSelf: 'center', fontSize: 20, fontFamily: 'Nunito-ExtraBold' }]}>Edit Plant Details</Text>

            <TextInput
              style={[styles.input, { padding: 5, backgroundColor: 'transparent', borderBottomWidth: 1, borderColor: '#448461', color: '#448461', borderRadius: 0, marginBottom: 16}]}
              placeholder="Plant Name"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Water Level</Text>
            <View style={{ flexDirection: 'row', marginHorizontal: 16, marginBottom: 16, alignItems: 'center' }}>
              <View style={{ flexDirection: 'col', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row' }}>
                  <TextInput
                    style={[styles.input, { backgroundColor: '#D7F6F4', color: '#316569' }]}
                    placeholder="0"
                    value={waterLevel}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      const num = parseInt(text, 10);
                      if (text === '' || (!isNaN(num) && num <= 100)) {
                        setWaterLevel(text);
                      }
                    }}
                  />
                  <Text style={[styles.input, { color: '#316569', backgroundColor: 'transparent', marginHorizontal: 0 }]}>%</Text>
                </View>

                <Text style={[styles.label, { justifyContent: 'center' }]}>Maximum 100</Text>
              </View>

              <View style={{ height: '90%', backgroundColor: '#316569', width: 1.5, marginHorizontal: 12, alignSelf: 'top' }} />

              <View style={{ flexDirection: 'col', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[styles.input, { color: '#316569', backgroundColor: 'transparent', marginHorizontal: 0 }]}>Every</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: '#D7F6F4', color: '#316569' }]}
                    placeholder="0"
                    value={waterFrequency}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      const num = parseInt(text, 10);
                      if (text === '' || (!isNaN(num) && num <= 30)) {
                        setWaterFrequency(text);
                      }
                    }}
                  />
                  <Text style={[styles.input, { color: '#316569', backgroundColor: 'transparent', marginHorizontal: 0 }]}>Days</Text>
                </View>

                <Text style={[styles.label, { justifyContent: 'center' }]}>Maximum 30</Text>
              </View>
            </View>

            <Text style={styles.label}>Age</Text>
            <View style={{ flexDirection: 'row', marginHorizontal: 16, marginBottom: 16, alignItems: 'center' }}>
              <TextInput
                style={[styles.input, { backgroundColor: '#FBF2D6', color: '#694231' }]}
                placeholder="0"
                value={age}
                keyboardType="numeric"
                onChangeText={setAge}
              />
              <Text style={[styles.input, { color: '#694231', backgroundColor: 'transparent', marginHorizontal: 0 }]}>Days</Text>
            </View>

            <Text style={styles.label}>Condition</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, marginLeft: 16, gap: 10 }}>
              {['Healthy', 'Sick', 'Dying'].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.conditionBox,
                    condition === item && styles.selectedConditionBox
                  ]}
                  onPress={() => setCondition(item)}
                >
                  <Image
                    source={getImage(item)}
                    style={styles.conditionImage}
                  />
                  <Text style={styles.conditionLabel}>{item.charAt(0).toUpperCase() + item.slice(1)}</Text>
                </TouchableOpacity>
              ))}
            </View>


            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, { backgroundColor: '#D3E6DB', color: '#448461', minHeight: 100, marginLeft: 16, fontSize: 14, marginBottom: 16 }]}
              placeholder="..."
              value={notes}
              multiline
              onChangeText={setNotes}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
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
  editIconContainer: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -40 }],
    alignSelf: 'center',
    padding: 6,
    zIndex: 3,
  },
  isi: {
    padding: 30,
    paddingTop: 20,
    backgroundColor: '#FAFFFB',
  },
  label: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    marginBottom: 8,
    color: '#284E43',
  },
  input: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 8,
    fontSize: 20,
    fontFamily: 'Nunito-SemiBold',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    marginHorizontal: 70,
    marginBottom: 24,
  },
  saveText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Nunito-ExtraBold',
  },

  conditionBox: {
  backgroundColor: '#7BAB91',
  padding: 10,
  borderRadius: 12,
  alignItems: 'center',
  width: screenWidth / 4,
  },
  selectedConditionBox: {
    opacity: 1, // full terang
    backgroundColor: '#358459', // hijau lebih cerah
    transform: [{ scale: 1.05 }], // sedikit membesar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  conditionImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 6,
  },
  conditionLabel: {
    color: 'white',
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
  },
});