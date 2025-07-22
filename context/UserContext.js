// context/UserContext.js
// File ini akan menyimpan state global untuk nama pengguna dan gambar profil.
import React, { createContext, useState, useContext, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Pastikan Anda sudah menginstal ini

// Buat Context
const UserContext = createContext();

// Buat Provider yang akan membungkus komponen lain
export const UserProvider = ({ children }) => {
  // State untuk nama pengguna dan gambar profil
  // Nilai default akan digunakan jika tidak ada data di AsyncStorage
  const [userName, setUserName] = useState('Ann');
  const [profilePicture, setProfilePicture] = useState('https://placehold.co/150x150/E0E0E0/333333?text=Ann');

  // useEffect untuk memuat data dari AsyncStorage saat komponen dimuat
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('userName');
        const storedProfilePicture = await AsyncStorage.getItem('profilePicture');
        if (storedName) {
          setUserName(storedName);
        }
        if (storedProfilePicture) {
          setProfilePicture(storedProfilePicture);
        }
      } catch (error) {
        console.error('Gagal memuat data pengguna dari AsyncStorage', error);
      }
    };
    loadUserData();
  }, []); // [] berarti hanya dijalankan sekali saat mount

  // useEffect untuk menyimpan nama pengguna ke AsyncStorage setiap kali userName berubah
  useEffect(() => {
    const saveUserName = async () => {
      try {
        await AsyncStorage.setItem('userName', userName);
      } catch (error) {
        console.error('Gagal menyimpan nama pengguna ke AsyncStorage', error);
      }
    };
    saveUserName();
  }, [userName]); // Dijalankan setiap kali userName berubah

  // useEffect untuk menyimpan gambar profil ke AsyncStorage setiap kali profilePicture berubah
  useEffect(() => {
    const saveProfilePicture = async () => {
      try {
        await AsyncStorage.setItem('profilePicture', profilePicture);
      } catch (error) {
        console.error('Gagal menyimpan gambar profil ke AsyncStorage', error);
      }
    };
    saveProfilePicture();
  }, [profilePicture]); // Dijalankan setiap kali profilePicture berubah

  return (
    // Sediakan nilai userName, setUserName, profilePicture, dan setProfilePicture
    // kepada semua komponen anak yang dibungkus oleh Provider ini
    <UserContext.Provider value={{ userName, setUserName, profilePicture, setProfilePicture }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook kustom untuk memudahkan penggunaan context di komponen lain
export const useUser = () => {
  return useContext(UserContext);
};
