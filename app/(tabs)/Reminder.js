import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Reminder() {
  const navigation = useNavigation();

  // Dummy data reminder
  const upcomingReminders = [
    { id: '1', title: 'Minum air' },
    { id: '2', title: 'Pupuk tanaman' },
    { id: '3', title: 'Sirami tanaman' },
    { id: '4', title: 'Ganti pot' },
  ];

  const allReminders = [
    { id: '1', title: 'Minum air jam 8 pagi' },
    { id: '2', title: 'Pupuk tanaman jam 10 pagi' },
    { id: '3', title: 'Sirami tanaman jam 3 sore' },
    { id: '4', title: 'Ganti pot jam 5 sore' },
    { id: '5', title: 'Reminder tambahan lainnya' },
    { id: '6', title: 'Reminder tanam pohon pisang' },
    { id: '7', title: 'Siram whitie' },
    { id: '8', title: 'Mupuki whitie' },
    { id: '9', title: 'Tanam kangkung' },
    { id: '10', title: 'Siram kangkung' },
  ];

  const userName = 'Bodhi'; // Ganti ini kalau mau pakai nama user dinamis

  const handleAdd = () => {
    navigation.navigate('addReminder');
  };

  return (
    <View style={styles.container}>
      {/* Sambutan */}
      <Text style={styles.welcomeText}>Welcome, {'\n'}{userName}</Text>

      {/* Reminder mendatang */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.upcomingContainer}>
        {upcomingReminders.map((reminder) => (
          <View key={reminder.id} style={styles.upcomingItem}>
            <Text style={styles.reminderTitle}>{reminder.title}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Label section */}
      <Text style={styles.sectionLabel}>Alarm</Text>

      {/* List semua reminder */}
      <FlatList
        data={allReminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reminderItem}>
            <Text style={styles.reminderTitle}>{item.title}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 80 }} // Supaya tidak ketutupan tombol +
        style={{ height: 400, marginBottom: 20 }}
      />

      {/* Tombol + */}
      <TouchableOpacity style={styles.fab} onPress={handleAdd}>
        {/* Placeholder for your add icon. Replace with your actual image. */}
        <Image
          source={require('../../assets/images/add.png')} // <--- You need to add this image asset
          style={styles.fabIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 50,
  },
  upcomingContainer: {
    marginBottom: 10,
    marginTop: 10,
    height: 50,
    // borderColor: 'red',
    // borderWidth: 2
  },
  upcomingItem: {
    backgroundColor: '#8BAF2B',
    padding: 10,
    height: 170,
    borderRadius: 10,
    marginRight: 10,
    minWidth: 120,
    justifyContent: 'center',
    alignItems: 'center',
    // borderColor: 'blue',
    // borderWidth: 2
  },
  reminderTitle: {
    color: '#fff',
    fontSize: 14,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reminderItem: {
    backgroundColor: '#6CB45E',
    padding: 16,
    height: 120,            // ditambahkan agar kotak lebih tinggi
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'center', // agar teks selalu center secara vertikal
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 110, // Adjusted to be above the BottomNavBar (assuming navbar height ~80)
    // backgroundColor: '#fff', // Green background
    borderRadius: 30, // Makes it a perfect circle
    elevation: 8, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  fabIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    // tintColor: 'white', // Makes the icon white
  },
});
