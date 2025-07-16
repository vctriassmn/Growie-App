import { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FolderCard from './Journal/FolderCard';

// Import gambar lokal
const coverImage = require('../../assets/images/coverFolder.png');
const addButtonImage = require('../../assets/images/add.png');

// Dummy data folder jurnal awal (ditambahkan 2 item)
const initialJournalFolders = [
  { id: '1', title: 'My Baby Spinach', image: coverImage },
  { id: '2', title: 'Nanem Jagung', image: coverImage },
  { id: '3', title: 'Daily Progress', image: coverImage },
  { id: '4', title: 'Beginner Guide', image: coverImage },
  { id: '5', title: 'Folder 5', image: coverImage },
  { id: '6', title: 'Folder 6', image: coverImage },
  { id: '7', title: 'Folder 7', image: coverImage },
  { id: '8', title: 'Folder 8', image: coverImage },
];

const HORIZONTAL_SPACING = 25;
const VERTICAL_SPACING = 50;

// Menggunakan Dimensions untuk menghitung lebar card
const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - (HORIZONTAL_SPACING * 2 + HORIZONTAL_SPACING)) / 2;

const USER_NAME = "Ann";

export default function ListJournalPage({ navigation }) {
  const [journalFolders, setJournalFolders] = useState(initialJournalFolders);

  useEffect(() => {
    if (navigation) {
      const unsubscribe = navigation.addListener('focus', () => {
        console.log('Layar Jurnal menjadi fokus');
      });
      return unsubscribe;
    }
  }, [navigation]);

  const renderJournalFolder = ({ item }) => (
    <TouchableOpacity
      style={styles.folderContainer}
      onPress={() => {
        console.log('Navigasi ke folder:', item.title);
      }}
    >
      <FolderCard title={item.title} image={item.image} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>This is {USER_NAME}'s</Text>
          <Text style={styles.headerTextBold}>Journal</Text>
        </View>
        <FlatList
          style={styles.flatList}
          data={journalFolders}
          renderItem={renderJournalFolder}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={true} 
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddFolder', {
            onAdd: (newFolderTitle) => {
              const newFolder = {
                id: Date.now().toString(),
                title: newFolderTitle,
                image: coverImage,
              };
              setJournalFolders(prevFolders => [...prevFolders, newFolder]);
            }
          })}
        >
          <Image source={addButtonImage} style={styles.addButtonImage} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e0f2e0',
  },
  container: {
    flex: 1,
    backgroundColor: '#e0f2e0',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  headerText: {
    fontSize: 26,
    color: '#5c8d5c',
  },
  headerTextBold: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5c8d5c',
  },
  flatList: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: HORIZONTAL_SPACING,
    paddingBottom: 200, // Nilai dinaikkan
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: VERTICAL_SPACING,
  },
  folderContainer: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButton: {
    position: 'absolute',
    bottom: 120,
    right: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  addButtonImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#5c8d5c',
  },
});