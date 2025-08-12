// Lokasi file: app/(tabs)/MyGarden/pages/[id].js

import React from 'react';
import { SafeAreaView, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Impor context dengan path yang sudah diperbaiki
import { usePlant } from '../../../../context/PlantContext'; 

// Impor KOMPONEN UI DETAIL Anda yang sudah ada
import PlantDetail from './PlantDetail'; 

export default function PlantDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 
  const { plants } = usePlant();

  // Cari tanaman berdasarkan ID dari URL
  const plant = plants.find(p => String(p.id) === id);

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // Kembali ke halaman daftar
      router.push('/(tabs)/MyGarden/pages'); 
    }
  };

  if (!plant) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading plant data...</Text>
      </SafeAreaView>
    );
  }

  return (
    <PlantDetail 
      plant={plant} 
      onBack={handleGoBack} 
    />
  );
}