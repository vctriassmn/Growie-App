// Lokasi file: context/UserContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const defaultAvatar = require('../assets/images/avatar.png');

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState('Ann');
  const [profilePicture, setProfilePicture] = useState(defaultAvatar);
  const [userHandle, setUserHandle] = useState('');
  const [email, setEmail] = useState('');
  // --- UBAH INI: Nilai awal sekarang adalah '-' ---
  const [phoneNumber, setPhoneNumber] = useState('-');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('userName');
        const storedProfilePicture = await AsyncStorage.getItem('profilePicture');
        const storedUserHandle = await AsyncStorage.getItem('userHandle');
        const storedEmail = await AsyncStorage.getItem('email');
        const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');

        if (storedName) setUserName(storedName);
        if (storedProfilePicture) setProfilePicture(storedProfilePicture);
        else setProfilePicture(defaultAvatar);
        if (storedUserHandle) setUserHandle(storedUserHandle);
        if (storedEmail) setEmail(storedEmail);
        
        // --- UBAH INI: Logika untuk mengatur nomor telepon ---
        if (storedPhoneNumber) {
          setPhoneNumber(storedPhoneNumber);
        } else {
          setPhoneNumber('-'); // Jika tidak ada apa-apa di storage, pastikan nilainya '-'
        }

      } catch (error) {
        console.error('Gagal memuat data pengguna dari AsyncStorage', error);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    if (phoneNumber !== null && phoneNumber !== undefined) {
      AsyncStorage.setItem('phoneNumber', phoneNumber).catch(err => console.error(err));
    }
  }, [phoneNumber]);

  useEffect(() => { if (userName) AsyncStorage.setItem('userName', userName).catch(err => console.error(err)); }, [userName]);
  useEffect(() => { if (typeof profilePicture === 'string') AsyncStorage.setItem('profilePicture', profilePicture).catch(err => console.error(err)); }, [profilePicture]);
  useEffect(() => { if (userHandle) AsyncStorage.setItem('userHandle', userHandle).catch(err => console.error(err)); }, [userHandle]);
  useEffect(() => { if (email) AsyncStorage.setItem('email', email).catch(err => console.error(err)); }, [email]);

  return (
    <UserContext.Provider value={{
      userName, setUserName,
      profilePicture, setProfilePicture,
      userHandle, setUserHandle,
      email, setEmail,
      phoneNumber, setPhoneNumber
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};