import { useState, useRef, useEffect, useCallback } from 'react';
import { Dimensions, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, LayoutAnimation, Platform, UIManager } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useJournalAndArticle } from '../../context/JournalAndArticleStore';
import FolderCard from './Journal/FolderCard'; // Ingat, file ini juga perlu diubah
import { useUser } from '../../context/UserContext';

const coverImage = require('../../assets/images/coverFolder.png');
const addButtonImage = require('../../assets/images/add.png');

const HORIZONTAL_SPACING = 25;
const VERTICAL_SPACING = 35;

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - (HORIZONTAL_SPACING * 2 + HORIZONTAL_SPACING)) / 2;

// Aktifkan LayoutAnimation di Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function JournalPage() {
  const { userName } = useUser();
  const { getJournalFolders, addJournalFolder, deleteJournalFolders } = useJournalAndArticle();

  const [journalFolders, setJournalFolders] = useState([]);
  const [selectedMode, setSelectedMode] = useState(false);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const flatListRef = useRef(null);
  const untitledCounter = useRef(0);

  useFocusEffect(
    useCallback(() => {
      const folders = getJournalFolders();
      setJournalFolders(folders);
      setSelectedMode(false);
      setSelectedFolders([]);
    }, [getJournalFolders])
  );

  const handleAddFolder = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const existingUntitledCount = journalFolders.filter(f => f.title.includes('Untitled')).length;
    untitledCounter.current = existingUntitledCount + 1;
    const newTitle = `Untitled ${untitledCounter.current}`;
    const newFolder = { id: newTitle, title: newTitle };

    addJournalFolder(newFolder);
    const updatedFolders = getJournalFolders();
    setJournalFolders(updatedFolders);

    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 50);
    }
  };

  const toggleFolderSelection = (folderId) => {
    if (selectedFolders.includes(folderId)) {
      setSelectedFolders(selectedFolders.filter((id) => id !== folderId));
    } else {
      setSelectedFolders([...selectedFolders, folderId]);
    }
  };

  const handleDeleteFolders = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    deleteJournalFolders(selectedFolders);
    const updatedFolders = getJournalFolders();
    setJournalFolders(updatedFolders);
    setSelectedMode(false);
    setSelectedFolders([]);
  };

  const handleCancelSelection = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedMode(false);
    setSelectedFolders([]);
  };

  const renderJournalFolder = ({ item }) => {
    const isSelected = selectedFolders.includes(item.id);
  
    return (
      <TouchableOpacity
        style={styles.folderContainer}
        onPress={() => {
          if (selectedMode) {
            toggleFolderSelection(item.id);
          } else {
            router.push({
              pathname: 'Journal/ListJournal',
              params: { folderTitle: item.title }
            });
          }
        }}
        onLongPress={() => {
          if (!selectedMode) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setSelectedMode(true);
            toggleFolderSelection(item.id);
          }
        }}
      >
        <FolderCard title={item.title} image={coverImage} />
        {isSelected && (
          <View style={styles.selectedOverlay} />
        )}
      </TouchableOpacity>
    );
  };

  const renderFooter = () => (
    <View style={{ height: 100 }} />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          {selectedMode ? (
            <>
              <TouchableOpacity onPress={handleCancelSelection} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.headerTextBold}>Selected ({selectedFolders.length})</Text>
            </>
          ) : (
            <>
              <Text style={styles.headerText}>This is {userName}'s</Text>
              <Text style={styles.headerTextBold}>Journal</Text>
            </>
          )}
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
        {selectedMode ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDeleteFolders}
            disabled={selectedFolders.length === 0}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.actionButton, styles.addButton]} onPress={handleAddFolder}>
            <Image source={addButtonImage} style={styles.actionButtonImage} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

// --- BAGIAN STYLESHEET YANG DIPERBARUI ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFFFB',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAFFFB',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 70,
  },
  headerText: {
    fontSize: 26,
    color: '#448461',
    fontFamily: 'Nunito-Regular',
  },
  headerTextBold: {
    fontSize: 32,
    color: '#448461',
    fontFamily: 'Nunito-ExtraBold', 
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
    position: 'relative',
  },
  actionButton: {
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
  addButton: {
    backgroundColor: '#5c8d5c',
    borderRadius: 30,
  },
  deleteButton: {
    backgroundColor: 'red',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
  },
  actionButtonImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  cancelButton: {
    position: 'absolute',
    left: 20,
    top: -30,
  },
  cancelText: {
    fontSize: 18,
    color: '#448461',
    fontFamily: 'Nunito-SemiBold',
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(68, 132, 97, 0.4)',
    borderRadius: 15,
  },
});