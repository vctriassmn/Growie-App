// Lokasi file: app/Notifications.js

import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
// --- PERUBAHAN 1: Ganti impor ikon ---
import BackIcon from '../assets/icons/back.svg'; // Pastikan path ini benar!

// Data dummy untuk notifikasi (tidak berubah)
const notificationsData = [
  {
    id: '1',
    type: 'success',
    title: 'Water Baby Spinach! - 07.30',
    message: 'You watered your Baby Spinach!',
  },
  {
    id: '2',
    type: 'missed',
    title: 'Missed Reminder! - 10.30',
    message: "You didn't fertilize Monstera!",
  },
  {
    id: '3',
    type: 'success',
    title: 'Prune Water Lily! - 16.00',
    message: 'You pruned your Water Lily',
  },
];

// Komponen NotificationCard (tidak berubah)
const NotificationCard = ({ item }) => {
  const isSuccess = item.type === 'success';

  return (
    <View style={[
      styles.notificationCard,
      isSuccess ? styles.cardSuccess : styles.cardMissed,
      shadowStyle
    ]}>
      <Text style={[
        styles.titleText,
        isSuccess ? styles.titleSuccess : styles.titleMissed
      ]}>
        {item.title}
      </Text>
      <Text style={styles.messageText}>{item.message}</Text>
    </View>
  );
};


export default function NotificationsPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          {/* --- PERUBAHAN 2: Ganti komponen ikon di sini --- */}
          <BackIcon width={30} height={30} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>NOTIFICATIONS</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {notificationsData.map((item) => (
          <NotificationCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// Properti Shadow (tidak berubah)
const shadowStyle = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2, },
  shadowOpacity: 0.1,
  shadowRadius: 3.84,
  elevation: 5,
};

// StyleSheet (tidak berubah)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    height: 30,
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    fontFamily: 'Nunito-Regular',
  },
  headerTitle: {
    fontSize: 22,
    color: '#000000',
    fontFamily: 'Nunito-Extrabold',
  },
  backButton: {
    padding: 5,
  },
  notificationCard: {
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  cardSuccess: {
    backgroundColor: '#D9ECE1',
  },
  cardMissed: {
    backgroundColor: '#E6BDBD',
  },
  titleText: {
    fontSize: 16,
    marginBottom: 4,
    fontFamily: 'Nunito-Extrabold',
  },
  titleSuccess: {
    color: '#448461',
    fontFamily: 'Nunito-Extrabold',
  },
  titleMissed: {
    color: '#AE0000',
    fontFamily: 'Nunito-Extrabold',
  },
  messageText: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Nunito-Regular',
  },
});