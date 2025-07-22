// Lokasi file: app/register.js

import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

// --- PERBAIKAN: Gunakan path yang benar (hanya satu '..') ---
import UsernameIcon from '../assets/icons/username_icon.svg';
import EmailIcon from '../assets/icons/email_icon.svg';
import PasswordIcon from '../assets/icons/password_icon.svg';

import FacebookLogo from '../assets/icons/logos_facebook.svg';
import GoogleLogo from '../assets/icons/logos_google.svg';
import XLogo from '../assets/icons/logos_x.svg';


// Komponen InputWithIcon sekarang lebih sederhana karena hanya menangani SVG kustom
const InputWithIcon = ({ IconComponent, placeholder, value, onChangeText, secureTextEntry = false }) => {
  return (
    <View style={styles.inputContainer}>
      {/* Tampilkan komponen ikon yang dilewatkan sebagai prop */}
      <IconComponent width={20} height={20} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#757575"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
    </View>
  );
};

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => { /* ... logika tidak berubah ... */ };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.topBar} />

            <View style={styles.formContainer}>
              <Text style={styles.title}>Register</Text>
              <Text style={styles.subtitle}>Create your new account</Text>

              {/* --- PERUBAHAN 2: Gunakan komponen SVG kustom untuk setiap input --- */}
              <InputWithIcon 
                IconComponent={UsernameIcon}
                placeholder="Username" 
                value={username} 
                onChangeText={setUsername} 
              />
              <InputWithIcon 
                IconComponent={EmailIcon}
                placeholder="Email" 
                value={email} 
                onChangeText={setEmail} 
              />
              <InputWithIcon 
                IconComponent={PasswordIcon}
                placeholder="Password" 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry={true} 
              />
              <InputWithIcon 
                IconComponent={PasswordIcon}
                placeholder="Confirm Password" 
                value={confirmPassword} 
                onChangeText={setConfirmPassword} 
                secureTextEntry={true} 
              />
              
              <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.registerButtonText}>Register</Text>
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or register with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* --- PERUBAHAN 3: Gunakan komponen SVG untuk logo sosial --- */}
              <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton}>
                  <FacebookLogo width={40} height={40} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <GoogleLogo width={40} height={40} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <XLogo width={40} height={40} />
                </TouchableOpacity>
              </View>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// StyleSheet tidak berubah sama sekali, hanya socialIcon yang tidak lagi diperlukan
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#282828' },
  scrollContainer: { flexGrow: 1, justifyContent: 'space-between' },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  topBar: { height: 35, backgroundColor: '#D9D9D9' },
  formContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 50,
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50', 
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8DC', 
    borderRadius: 15,
    width: '100%',
    height: 55,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#757575',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 40,
  },
  socialButton: {
    marginHorizontal: 15,
  },
  /* socialIcon style tidak lagi dibutuhkan karena kita menggunakan SVG */
  loginContainer: {
    flexDirection: 'row',
  },
  loginText: {
    color: '#757575',
  },
  loginLink: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});