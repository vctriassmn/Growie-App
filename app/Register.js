// Lokasi file: app/register.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../context/UserContext';

import UsernameIcon from '../assets/icons/username_icon.svg';
import EmailIcon from '../assets/icons/email_icon.svg';
import PasswordIcon from '../assets/icons/password_icon.svg';
import FacebookLogo from '../assets/icons/logos_facebook.svg';
import GoogleLogo from '../assets/icons/logos_google.svg';
import XLogo from '../assets/icons/logos_x.svg';

const InputWithIcon = ({ IconComponent, placeholder, value, onChangeText, secureTextEntry = false }) => {
  return (
    <View style={styles.inputContainer}>
      <IconComponent width={20} height={20} style={styles.icon} />
      <TextInput style={styles.input} placeholder={placeholder} placeholderTextColor="#757575" value={value} onChangeText={onChangeText} secureTextEntry={secureTextEntry} autoCapitalize="none" />
    </View>
  );
};

export default function RegisterPage() {
  const { setUserName, setUserHandle, setEmail, setProfilePicture, setPhoneNumber } = useUser();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = () => {
    setErrorMessage('');

    if (!username.trim() || !emailInput.trim() || !password.trim() || !confirmPassword.trim()) { setErrorMessage('All fields are required.'); return; }
    if (username.trim().length < 3) { setErrorMessage('Username must be at least 3 characters long.'); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) { setErrorMessage('Please enter a valid email address.'); return; }
    if (password.length < 6) { setErrorMessage('Password must be at least 6 characters long.'); return; }
    if (password !== confirmPassword) { setErrorMessage('Passwords do not match.'); return; }

    const finalUsername = username.trim();
    const finalEmail = emailInput.trim();

    setProfilePicture(require('../assets/images/avatar.png'));
    setUserName(finalUsername);
    setUserHandle(`@${finalUsername.toLowerCase().replace(/\s/g, '')}`);
    setEmail(finalEmail);
    // --- UBAH INI: Atur nomor telepon menjadi '-' untuk pengguna baru ---
    setPhoneNumber('-');

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
              <Text style={styles.title}>Register</Text>
              <Text style={styles.subtitle}>Create your new account</Text>
              <InputWithIcon IconComponent={UsernameIcon} placeholder="Username" value={username} onChangeText={setUsername} />
              <InputWithIcon IconComponent={EmailIcon} placeholder="Email" value={emailInput} onChangeText={setEmailInput} keyboardType="email-address" />
              <InputWithIcon IconComponent={PasswordIcon} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={true} />
              <InputWithIcon IconComponent={PasswordIcon} placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={true} />
              {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
              <TouchableOpacity style={styles.registerButton} onPress={handleRegister}><Text style={styles.registerButtonText}>Register</Text></TouchableOpacity>
              <View style={styles.dividerContainer}><View style={styles.dividerLine} /><Text style={styles.dividerText}>Or register with</Text><View style={styles.dividerLine} /></View>
              <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton}><FacebookLogo width={40} height={40} /></TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}><GoogleLogo width={40} height={40} /></TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}><XLogo width={40} height={40} /></TouchableOpacity>
              </View>
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/Login')}><Text style={styles.loginLink}>Login</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#282828',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    height: 35,
    backgroundColor: '#D9D9D9',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 70,
    paddingBottom: 30,
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
    color: '#757575',
    marginBottom: 40,
    fontFamily: 'Nunito-SemiBold',
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
    fontFamily: 'Nunito-SemiBold',
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
    fontFamily: 'Nunito-Regular',
  },
  registerButton: {
    backgroundColor: '#448461',
    borderRadius: 30,
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,

  },
  registerButtonText: {
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
    fontFamily: 'Nunito-SemiBold',
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