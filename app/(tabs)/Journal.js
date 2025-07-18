import { useState, useRef, useEffect } from 'react';
import { Dimensions, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, LayoutAnimation, Platform, UIManager } from 'react-native';
import { router } from 'expo-router';
import { getJournalFolders } from './Journal/journalData';
import FolderCard from './Journal/FolderCard';

const coverImage = require('../../assets/images/coverFolder.png');
const addButtonImage = require('../../assets/images/add.png');

const initialJournalFolders = getJournalFolders();

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
  const [journalFolders, setJournalFolders] = useState(initialJournalFolders);
  const flatListRef = useRef(null);
  const isInitialMount = useRef(true);

  // Gunakan useEffect untuk menggulir hanya setelah folder baru ditambahkan
  useEffect(() => {
    // Lewati eksekusi pada render pertama kali
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Gulir ke bawah hanya jika ada folder dan bukan render pertama
    if (journalFolders.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [journalFolders]);

  const handleAddFolder = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const newId = Date.now().toString();
    const newFolder = {
      id: newId,
      title: 'Untitled'
    };
    
    setJournalFolders(prevFolders => [...prevFolders, newFolder]);
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
          // Prop onContentSizeChange dihapus untuk mencegah scroll awal
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
    paddingBottom: 100, // Padding Bottom 100 sudah benar
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