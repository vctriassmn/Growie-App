// Lokasi file: app/register.js

import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../context/UserContext';
// Menggunakan ikon yang relevan untuk Full Name dan Password
import UsernameIcon from '../assets/icons/username_icon.svg'; // Bisa digunakan untuk Full Name
import PasswordIcon from '../assets/icons/password_icon.svg';

// Import kembali logo media sosial
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

export default function LoginPage() {
  const router = useRouter();
   const { setUserName } = useUser();
  const [fullName, setFullName] = useState(''); // State untuk Full Name
  const [password, setPassword] = useState(''); // State untuk Password
  const [errorMessage, setErrorMessage] = useState(''); // State untuk pesan error

  const handleLogin = () => { // Nama fungsi ini masih handleRegister, tapi akan berfungsi sebagai handleLogin
    // Validasi: Pastikan Full Name dan Password tidak kosong
    if (!fullName.trim() || !password.trim()) {
      setErrorMessage('Username and Password are required.'); // Pesan error disesuaikan
      return; // Hentikan proses jika ada bidang yang kosong
    }

    // Jika validasi berhasil, bersihkan pesan error dan navigasi
    setErrorMessage('');
    setUserName(fullName);
    router.replace('/(tabs)/Home');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <KeyboardAvoidingView
  behavior={Platform.OS === "ios" ? "padding" : "padding"}
  keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
  style={{ flex: 1 }}
>

        <ScrollView
  keyboardShouldPersistTaps="handled"
  contentContainerStyle={{ flexGrow: 1 }}
>

          <View style={styles.container}>
            <View style={styles.topBar} />

            <View style={styles.formContainer}>
              <Text style={styles.title}>Login</Text>
              <Text style={styles.subtitle}>Sign In to Your account</Text>

              {/* Input untuk Full Name (digunakan sebagai Username) */}
              <InputWithIcon
                IconComponent={UsernameIcon}
                placeholder="Username"
                value={fullName}
                onChangeText={setFullName}
              />
              {/* Input untuk Password */}
              <InputWithIcon
                IconComponent={PasswordIcon}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
              />

              {/* Tampilkan pesan error jika ada */}
              {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

              <TouchableOpacity style={styles.LoginButton} onPress={handleLogin}>
                <Text style={styles.LoginButtonText}>Login</Text>
              </TouchableOpacity>

              {/* Bagian "Or Login with" */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or Login with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Bagian logo sosial media */}
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

              {/* Bagian "Don't have an account? Register" dengan perbaikan nesting */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>
                  Don't have an account?{' '}
                  <Text style={styles.loginLink} onPress={() => router.push('/Register')}>
                    Register
                  </Text>
                </Text>
              </View>

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


// Stylesheet tidak perlu diubah
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#282828' },
  scrollContainer: { flexGrow: 1},
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  topBar: { height: 35, backgroundColor: '#D9D9D9' },
  formContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 170,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Nunito-Black',
    color: '#448461',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#757575',
    marginBottom: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8DC',
    borderRadius: 15,
    width: '100%',
    height: 55,
    paddingHorizontal: 15,
    marginBottom: 25,
    fontFamily: 'Nunito-Regular',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Nunito-SemiBold',
  },
  errorMessage: {
    color: '#FF0000',
    marginBottom: 15,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Nunito-SemiBold',
  },
  LoginButton: {
    backgroundColor: '#448461',
    borderRadius: 30,
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  LoginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Nunito-ExtraBold',
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
    fontFamily: 'Nunito-Regular',
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
  loginContainer: {
    flexDirection: 'row',
  },
  loginText: {
    color: '#757575',
    fontFamily: 'Nunito-SemiBold',
  },
  loginLink: {
    color: '#448461',
    fontFamily: 'Nunito-ExtraBold',
  },
});