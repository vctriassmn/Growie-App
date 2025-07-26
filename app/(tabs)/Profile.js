// Lokasi file: app/Profile.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext'; 

export default function ProfilePage() {
  const router = useRouter();
  // --- UBAH INI: Ambil juga phoneNumber dan setPhoneNumber ---
  const {
    userName, setUserName,
    profilePicture, setProfilePicture,
    userHandle, setUserHandle,
    email, setEmail,
    phoneNumber, setPhoneNumber
  } = useUser();

  const [tempName, setTempName] = useState(userName);
  const [tempProfilePicture, setTempProfilePicture] = useState(profilePicture);
  const [tempUserHandle, setTempUserHandle] = useState(userHandle);
  const [tempEmail, setTempEmail] = useState(email);
  // --- TAMBAHKAN INI: State temporary untuk nomor telepon ---
  const [tempPhoneNumber, setTempPhoneNumber] = useState(phoneNumber);

  // --- HAPUS otherProfileData ---

  // Sinkronkan SEMUA state lokal dengan context
  useEffect(() => {
    setTempName(userName);
    setTempProfilePicture(profilePicture);
    setTempUserHandle(userHandle);
    setTempEmail(email);
    setTempPhoneNumber(phoneNumber); // Sinkronkan juga nomor telepon
  }, [userName, profilePicture, userHandle, email, phoneNumber]); // Tambahkan phoneNumber

  const [isEditing, setIsEditing] = useState(false);

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Izin Ditolak', 'Kami memerlukan izin akses galeri!');
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, aspect: [1, 1], quality: 1, allowsEditing: true });
    if (!result.canceled) setTempProfilePicture(result.assets[0].uri);
  };

  const handleSaveChanges = () => {
    setUserName(tempName);
    setProfilePicture(tempProfilePicture);
    setUserHandle(tempUserHandle);
    setEmail(tempEmail);
    // --- TAMBAHKAN INI: Simpan perubahan nomor telepon ke context ---
    setPhoneNumber(tempPhoneNumber);
    Alert.alert('Profil Diperbarui', 'Profil Anda telah berhasil diperbarui!');
    setIsEditing(false);
  };

  const handleLogout = () => {
    router.replace('/Login'); 
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}><TouchableOpacity style={styles.backButton} onPress={() => router.back()}><Ionicons name="chevron-back" size={24} color="#444" /></TouchableOpacity></View>
        <View style={styles.profileImageWrapper}><Image source={typeof tempProfilePicture === 'string' ? { uri: tempProfilePicture } : tempProfilePicture} style={styles.profileImage} /></View>
        {isEditing ? (
          <TouchableOpacity onPress={handleImagePick}><Text style={styles.changePicText}>Ubah Gambar</Text></TouchableOpacity>
        ) : (
          <>
            <Text style={styles.name}>{userName}</Text>
            <Text style={styles.username}>{userHandle}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}><Text style={styles.editButtonText}>edit profil</Text></TouchableOpacity>
          </>
        )}
        {!isEditing && (<View style={styles.accountHeader}><Text style={styles.accountHeaderText}>Akun Saya</Text></View>)}
        <View style={styles.card}>
          {isEditing ? (
            <>
              <LabelledInput label="Nama" value={tempName} onChangeText={setTempName} />
              <LabelledInput label="Username" value={tempUserHandle} onChangeText={setTempUserHandle} />
              <LabelledInput label="Email" value={tempEmail} onChangeText={setTempEmail} />
              {/* --- UBAH INI: Hubungkan ke tempPhoneNumber --- */}
              <LabelledInput label="Nomor Telepon" value={tempPhoneNumber} onChangeText={setTempPhoneNumber} />
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}><Text style={styles.saveButtonText}>Simpan Perubahan</Text></TouchableOpacity>
            </>
          ) : (
            <>
              <InfoItem label="Nama" value={userName} />
              <InfoItem label="Username" value={userHandle} />
              <InfoItem label="Email" value={email} />
              {/* --- UBAH INI: Tampilkan phoneNumber dari context --- */}
              <InfoItem label="Nomor Telepon" value={phoneNumber} />
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}><Text style={styles.logoutText}>Keluar</Text></TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function LabelledInput({ label, value, onChangeText }) {
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} style={styles.textInput} />
    </View>
  );
}

function InfoItem({ label, value }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', backgroundColor: '#fff', paddingBottom: 20, paddingTop: 0 }, header: { width: '100%', height: 120, backgroundColor: '#f6eac2', justifyContent: 'flex-start', paddingLeft: 20, paddingTop: 40 }, backButton: { width: 30, height: 30 }, profileImageWrapper: { marginTop: -50, borderRadius: 100, overflow: 'hidden', borderWidth: 4, borderColor: '#fff', marginBottom: 10 }, profileImage: { width: 120, height: 120, borderRadius: 60 }, changePicText: { color: '#4caf50', marginBottom: 16, fontFamily: 'Nunito-SemiBold' }, name: { fontSize: 22, color: '#448461', marginTop: 10, fontFamily: 'Nunito-ExtraBold' }, username: { fontSize: 16, color: '#448461', marginBottom: 10, fontFamily: 'Nunito-SemiBold' }, editButton: { borderWidth: 1, borderColor: '#694B40', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 16 }, editButtonText: { color: '#694B40', fontFamily: 'Nunito-Regular' }, accountHeader: { width: '100%', backgroundColor: '#7c9e82', paddingVertical: 10, alignItems: 'flex-start', marginTop: 0, paddingLeft: 40 }, accountHeaderText: { color: '#ffffff', fontSize: 16, fontFamily: 'Nunito-ExtraBold' }, card: { width: '90%', backgroundColor: '#fff', borderRadius: 12, padding: 20, marginTop: 5, marginBottom: 50 }, inputWrapper: { marginBottom: 12 }, inputLabel: { marginBottom: 4, fontFamily: 'Nunito-Regular' }, textInput: { borderWidth: 1, borderColor: '#8bc34a', borderRadius: 6, padding: 10, color: '#7F995E', fontFamily: 'Nunito-Regular' }, infoItem: { marginBottom: 14 }, infoLabel: { color: '#444', marginBottom: 2, fontFamily: 'Nunito-Regular' }, infoValue: { fontStyle: 'italic', color: '#4f704f', fontFamily: 'Nunito-Regular' }, saveButton: { borderWidth: 1, borderColor: '#694B40', borderRadius: 20, paddingVertical: 10, alignItems: 'center', marginTop: 12 }, saveButtonText: { color: '#694B40', fontFamily: 'Nunito-SemiBold' }, logoutButton: { borderColor: '#694B40', borderWidth: 1, borderRadius: 20, paddingVertical: 10, alignItems: 'center', marginTop: 24 }, logoutText: { color: '#694B40', fontFamily: 'Nunito-SemiBold' },
});