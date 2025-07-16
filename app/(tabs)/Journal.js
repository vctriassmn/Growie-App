import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const { width } = Dimensions.get('window');
const SPACING = 15; // Spasi antar item
const ITEM_WIDTH = (width - SPACING * 3) / 2; 

// Data dummy untuk folder jurnal
const journalFolders = [
  {
    id: '1',
    title: 'My Baby Spinach',
    image: 'https://placehold.co/400x400/a8d8a8/5c8d5c?text=Spinach', // Placeholder gambar
  },
  {
    id: '2',
    title: 'Nanem Jagung',
    image: 'https://placehold.co/400x400/a8d8a8/5c8d5c?text=Jagung', // Placeholder gambar
  },
  {
    id: '3',
    title: 'Daily Progress',
    image: 'https://placehold.co/400x400/a8d8a8/5c8d5c?text=Progress', // Placeholder gambar
  },
  {
    id: '4',
    title: 'Beginner Guide',
    image: 'https://placehold.co/400x400/a8d8a8/5c8d5c?text=Guide', // Placeholder gambar
  },
  {
    id: '5',
    title: 'Sayuran Organik',
    image: 'https://placehold.co/400x400/a8d8a8/5c8d5c?text=Organik', // Placeholder gambar
  },
  {
    id: '6',
    title: 'Bunga Hias',
    image: 'https://placehold.co/400x400/a8d8a8/5c8d5c?text=Bunga', // Placeholder gambar
  },
  {
    id: '7',
    title: 'Tanaman Obat',
    image: 'https://placehold.co/400x400/a8d8a8/5c8d5c?text=Obat', // Placeholder gambar
  },
];

export default function ListJournalPage({ navigation }) {
  // Fungsi untuk merender setiap item folder jurnal
  const renderJournalFolder = ({ item }) => (
    <TouchableOpacity
      style={styles.folderContainer}
      onPress={() => {
        console.log(`Folder ${item.title} diklik!`); 
      }}
    >
      <ImageBackground source={{ uri: item.image }} style={styles.folderImage} imageStyle={styles.imageStyle}>
        <View style={styles.overlay} />
        <Text style={styles.folderTitle}>{item.title}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>This is Ann's</Text>
        <Text style={styles.headerTextBold}>Journal</Text>
      </View>

      {/* Daftar Folder Jurnal */}
      <FlatList
        data={journalFolders}
        renderItem={renderJournalFolder}
        keyExtractor={(item) => item.id}
        numColumns={2} // Menampilkan 2 kolom
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />

      {/* Tombol Add Folder */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          // Navigasi ke halaman addFolder.js ketika tombol diklik
          // Pastikan 'AddFolder' adalah nama rute yang benar di navigator Anda
          // navigation.navigate('AddFolder');
          console.log('Tombol Add Folder diklik!'); // Placeholder untuk navigasi
        }}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f2e0', // Warna latar belakang yang mirip gambar
    paddingTop: 20, // Sedikit padding atas
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    color: '#5c8d5c', // Warna teks yang mirip gambar
  },
  headerTextBold: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5c8d5c', // Warna teks yang mirip gambar
  },
  listContainer: {
    paddingHorizontal: SPACING, // Padding horizontal untuk list
  },
  columnWrapper: {
    justifyContent: 'space-between', // Meratakan item di antara kolom
    marginBottom: SPACING, // Spasi antar baris
  },
  folderContainer: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH, // Membuat kotak persegi
    borderRadius: 15, // Sudut membulat
    overflow: 'hidden', // Memastikan gambar dan overlay tidak keluar dari batas
    elevation: 5, // Shadow untuk Android
    shadowColor: '#000', // Shadow untuk iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  folderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    borderRadius: 15, // Sudut membulat pada gambar
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Mengisi seluruh area parent
    backgroundColor: 'rgba(0,0,0,0.3)', // Overlay gelap transparan
    borderRadius: 15,
  },
  folderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: 5, // Padding horizontal untuk judul
  },
  addButton: {
    position: 'absolute',
    bottom: 90, // Posisi dari bawah (menyesuaikan dengan perkiraan navbar)
    right: 30, // Posisi dari kanan
    backgroundColor: '#5c8d5c', // Warna tombol add
    width: 60,
    height: 60,
    borderRadius: 30, // Membuat lingkaran
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Shadow untuk Android
    shadowColor: '#000', // Shadow untuk iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});