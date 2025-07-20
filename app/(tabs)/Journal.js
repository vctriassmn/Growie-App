// File: app/(tabs)/Journal.js

import { useState, useRef, useEffect, useCallback } from 'react';
import { Dimensions, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, LayoutAnimation, Platform, UIManager } from 'react-native';
import { router, useFocusEffect } from 'expo-router'; 
import { getJournalFolders, addJournalFolder } from './Journal/journalData'; 
import FolderCard from './Journal/FolderCard';

const coverImage = require('../../assets/images/coverFolder.png');
const addButtonImage = require('../../assets/images/add.png');

const HORIZONTAL_SPACING = 25;
const VERTICAL_SPACING = 35;

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - (HORIZONTAL_SPACING * 2 + HORIZONTAL_SPACING)) / 2;

const USER_NAME = "Ann";

// Aktifkan LayoutAnimation di Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function JournalPage() {
  const [journalFolders, setJournalFolders] = useState([]);
  const flatListRef = useRef(null);
  const untitledCounter = useRef(0); // Tambahkan counter untuk judul

  // Gunakan useFocusEffect untuk memuat data setiap kali layar aktif/difokuskan
  useFocusEffect(
    useCallback(() => {
      const folders = getJournalFolders();
      setJournalFolders(folders);
    }, [])
  );
  
  const handleAddFolder = () => {
    // Terapkan animasi layout
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    // Dapatkan hitungan folder untitled yang ada
    const existingUntitledCount = journalFolders.filter(f => f.title.includes('Untitled')).length;
    untitledCounter.current = existingUntitledCount + 1;

    // Buat judul baru yang unik
    const newTitle = `Untitled ${untitledCounter.current}`;
    const newId = newTitle; // Menggunakan judul unik sebagai id
    
    const newFolder = {
      id: newId,
      title: newTitle
    };
    
    // Tambahkan folder ke data persisten terlebih dahulu
    addJournalFolder(newFolder);

    // Muat ulang data dari sumber persisten untuk memastikan UI sinkron
    const updatedFolders = getJournalFolders();
    setJournalFolders(updatedFolders);
    
    // Pindahkan logika scroll ke sini
    if (flatListRef.current) {
        setTimeout(() => {
            flatListRef.current.scrollToEnd({ animated: true });
        }, 50);
    }
  };

  const renderJournalFolder = ({ item }) => (
    <TouchableOpacity
      style={styles.folderContainer}
      onPress={() => {
        router.push({
          pathname: 'Journal/ListJournal',
          params: { folderTitle: item.title }
        });
      }}
    >
      <FolderCard title={item.title} image={coverImage} />
    </TouchableOpacity>
  );

  const renderFooter = () => (
    <View style={{ height: 100 }} />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>This is {USER_NAME}'s</Text>
          <Text style={styles.headerTextBold}>Journal</Text>
        </View>
        <FlatList
          ref={flatListRef}
          style={styles.flatList}
          data={journalFolders}
          renderItem={renderJournalFolder}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={true}
          ListFooterComponent={renderFooter}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddFolder}
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
    backgroundColor: '#FAFFFB',
    fontFamily: 'Nunito_400Regular',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAFFFB',
    fontFamily: 'Nunito_400Regular',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 70,
    fontFamily: 'Nunito_400Regular',
  },
  headerText: {
    fontSize: 26,
    color: '#448461',
  },
  headerTextBold: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#448461',
  },
  flatList: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: HORIZONTAL_SPACING,
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
    elevation: 10,
    marginTop: 10,
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