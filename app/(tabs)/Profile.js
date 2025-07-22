// profile.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext'; 

export default function ProfilePage() {
  const router = useRouter();
  // Ambil userName dan setUserName dari UserContext
  const { userName, setUserName, profilePicture, setProfilePicture } = useUser();

  // Gunakan state lokal untuk input yang dapat diedit, diinisialisasi dari context
  const [tempName, setTempName] = useState(userName);
  const [tempProfilePicture, setTempProfilePicture] = useState(profilePicture);

  // State lokal untuk data profil lainnya yang belum diintegrasikan ke context
  const [otherProfileData, setOtherProfileData] = useState({
    username: '@kejugoreng',
    email: 'annplant@mail.com',
    phoneNumber: '0822287162883',
  });

  // Sinkronkan state lokal tempName dan tempProfilePicture dengan context saat context berubah
  useEffect(() => {
    setTempName(userName);
    setTempProfilePicture(profilePicture);
  }, [userName, profilePicture]);

  const [isEditing, setIsEditing] = useState(false);

  // Fungsi untuk menangani perubahan input
  const handleChange = (key, value) => {
    if (key === 'name') {
      setTempName(value);
    } else if (key === 'profilePicture') {
      setTempProfilePicture(value);
    } else {
      setOtherProfileData((prev) => ({ ...prev, [key]: value }));
    }
  };

  // Fungsi untuk memilih gambar dari galeri
  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert('Izin Ditolak', 'Kami memerlukan izin akses galeri!');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      handleChange('profilePicture', result.assets[0].uri);
    }
  };

  // Fungsi untuk menyimpan perubahan profil
  const handleSaveChanges = () => {
    // Perbarui nama pengguna dan gambar profil di context
    setUserName(tempName);
    setProfilePicture(tempProfilePicture);

    // Anda bisa menambahkan logika penyimpanan data lain ke database/AsyncStorage di sini
    // Contoh: AsyncStorage.setItem('userOtherData', JSON.stringify(otherProfileData));

    Alert.alert('Profil Diperbarui', 'Profil Anda telah berhasil diperbarui!');
    setIsEditing(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('/Home')}>
            <Ionicons name="chevron-back" size={24} color="#444" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileImageWrapper}>
          {/* Tampilkan gambar profil dari context */}
          <Image source={{ uri: profilePicture }} style={styles.profileImage} />
        </View>

        {isEditing ? (
          <TouchableOpacity onPress={handleImagePick}>
            <Text style={styles.changePicText}>Ubah Gambar</Text>
          </TouchableOpacity>
        ) : (
          <>
            {/* Tampilkan nama pengguna dari context */}
            <Text style={styles.name}>{userName}</Text>
            {/* Username, email, dan phone number masih menggunakan state lokal */}
            <Text style={styles.username}>{otherProfileData.username}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Text style={styles.editButtonText}>edit profil</Text>
            </TouchableOpacity>
          </>
        )}

        {!isEditing && (
          <View style={styles.accountHeader}>
            <Text style={styles.accountHeaderText}>Akun Saya</Text>
          </View>
        )}

        <View style={styles.card}>
          {isEditing ? (
            <>
              {/* Input untuk Nama (menggunakan tempName dari context) */}
              <LabelledInput
                label="Nama"
                value={tempName}
                onChangeText={(text) => handleChange('name', text)}
              />
              {/* Input untuk Username */}
              <LabelledInput
                label="Username"
                value={otherProfileData.username}
                onChangeText={(text) => handleChange('username', text)}
              />
              {/* Input untuk Email */}
              <LabelledInput
                label="Email"
                value={otherProfileData.email}
                onChangeText={(text) => handleChange('email', text)}
              />
              {/* Input untuk Nomor Telepon */}
              <LabelledInput
                label="Nomor Telepon"
                value={otherProfileData.phoneNumber}
                onChangeText={(text) => handleChange('phoneNumber', text)}
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Tampilkan informasi dari context dan state lokal */}
              <InfoItem label="Nama" value={userName} />
              <InfoItem label="Username" value={otherProfileData.username} />
              <InfoItem label="Email" value={otherProfileData.email} />
              <InfoItem label="Nomor Telepon" value={otherProfileData.phoneNumber} />
              <TouchableOpacity style={styles.logoutButton}>
                <Text style={styles.logoutText}>Keluar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Komponen pembantu untuk input berlabel
function LabelledInput({ label, value, onChangeText }) {
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} style={styles.textInput} />
    </View>
  );
}

// Komponen pembantu untuk menampilkan informasi
function InfoItem({ label, value }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 20,
    paddingTop: 0,
  },
  header: {
    width: '100%',
    height: 120,
    backgroundColor: '#f6eac2',
    justifyContent: 'flex-start',
    paddingLeft: 20,
    paddingTop: 40,
  },
  backButton: {
    width: 30,
    height: 30,
  },
  profileImageWrapper: {
    marginTop: -50,
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#fff',
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  changePicText: {
    color: '#4caf50',
    fontWeight: '600',
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#448461',
    marginTop: 10,
  },
  username: {
    fontSize: 16,
    color: '#448461',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  editButton: {
    borderWidth: 1,
    borderColor: '#694B40',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  editButtonText: {
    color: '#694B40',
    fontWeight: '600',
  },
  accountHeader: {
    width: '100%',
    backgroundColor: '#7c9e82',
    paddingVertical: 10,
    alignItems: 'flex-start', // Menggunakan flex-start untuk rata kiri
    marginTop: 0,
    paddingLeft: 40,
  },
  accountHeaderText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 5,
    marginBottom: 50,
  },
  infoItem: {
    marginBottom: 14,
  },
  infoLabel: {
    color: '#444',
    marginBottom: 2,
  },
  infoValue: {
    fontStyle: 'italic',
    color: '#4f704f',
  },
  inputWrapper: {
    marginBottom: 12,
  },
  inputLabel: {
    fontWeight: '500',
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#8bc34a',
    borderRadius: 6,
    padding: 10,
    color: '#7F995E'
  },
  saveButton: {
    borderWidth: 1,
    borderColor: '#694B40',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  saveButtonText: {
    color: '#694B40',
    fontWeight: '600',
  },
  logoutButton: {
    borderColor: '#694B40',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  logoutText: {
    color: '#694B40',
    fontWeight: '600',
  },
});
