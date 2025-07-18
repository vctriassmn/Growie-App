import React, { useState } from 'react';
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

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState({
    name: 'Ann',
    username: '@kejugoreng',
    email: 'annplant@mail.com',
    phoneNumber: '0822287162883',
    profilePicture: 'https://placehold.co/150x150/E0E0E0/333333?text=Ann',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert('Permission Denied', 'We need camera roll permission!');
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

  const handleSaveChanges = () => {
    Alert.alert('Profile Updated', 'Your profile has been updated successfully!');
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
          <Image source={{ uri: profile.profilePicture }} style={styles.profileImage} />
        </View>

        {isEditing ? (
          <TouchableOpacity onPress={handleImagePick}>
            <Text style={styles.changePicText}>Change Picture</Text>
          </TouchableOpacity>
        ) : (
          <>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.username}>{profile.username}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Text style={styles.editButtonText}>edit profile</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Account header */}
        {!isEditing && (
          <View style={styles.accountHeader}>
            <Text style={styles.accountHeaderText}>My Account</Text>
          </View>
        )}

        <View style={styles.card}>
          {isEditing ? (
            <>
              <LabelledInput label="Name" value={profile.name} onChangeText={(text) => handleChange('name', text)} />
              <LabelledInput label="Username" value={profile.username} onChangeText={(text) => handleChange('username', text)} />
              <LabelledInput label="Email" value={profile.email} onChangeText={(text) => handleChange('email', text)} />
              <LabelledInput label="Phone number" value={profile.phoneNumber} onChangeText={(text) => handleChange('phoneNumber', text)} />
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <InfoItem label="Name" value={profile.name} />
              <InfoItem label="Username" value={profile.username} />
              <InfoItem label="Email" value={profile.email} />
              <InfoItem label="Phone Number" value={profile.phoneNumber} />
              <TouchableOpacity style={styles.logoutButton}>
                <Text style={styles.logoutText}>Log Out</Text>
              </TouchableOpacity>
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
    alignItems: 'left',
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
