// File: app/(tabs)/Journal/ListJournal.js

import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, LayoutAnimation, Platform, UIManager, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { deleteJournalEntries, getJournalEntriesByTitle, addJournalEntry, renameJournalFolder } from './journalData';

const addButtonImage = require('../../../assets/images/add.png');
const SPACING = 30;

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export default function ListJournalScreen() {
    const { folderTitle } = useLocalSearchParams();
    
    const [journalData, setJournalData] = useState([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState(new Set());

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [tempTitle, setTempTitle] = useState(folderTitle);
    
    const flatListRef = useRef(null);
    const isInitialMount = useRef(true);
    const titleInputRef = useRef(null);

    // FIX BUG 1: Perbarui tempTitle setiap kali folderTitle berubah
    useEffect(() => {
        setTempTitle(folderTitle);
    }, [folderTitle]);

    // Effect untuk mengambil data jurnal saat folderTitle berubah
    useEffect(() => {
        const entries = getJournalEntriesByTitle(folderTitle);
        setJournalData(entries);
    }, [folderTitle]);
    
    // Effect untuk memfokuskan TextInput saat mode edit aktif
    useEffect(() => {
        if (isEditingTitle && titleInputRef.current) {
            // FIX BUG 2: Gunakan setTimeout untuk memberi waktu pada UI
            setTimeout(() => {
                titleInputRef.current.focus();
            }, 100); 
        }
    }, [isEditingTitle]);

    // Effect untuk menggulir ke bawah saat ada entri baru
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        
        if (flatListRef.current) {
            setTimeout(() => {
                flatListRef.current.scrollToEnd({ animated: true });
            }, 50);
        }
    }, [journalData]);


    const handleSaveTitle = () => {
        if (tempTitle && tempTitle !== folderTitle) {
            renameJournalFolder(folderTitle, tempTitle);
            router.setParams({ folderTitle: tempTitle });
        }
        Keyboard.dismiss();
        setIsEditingTitle(false);
    };

    const handleAddJournal = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        
        const newEntry = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            day: 'New Entry',
            content: 'Write something here...'
        };
        
        addJournalEntry(folderTitle, newEntry);
        
        const updatedEntries = getJournalEntriesByTitle(folderTitle);
        setJournalData([...updatedEntries]);
    };

    const handleSelect = (itemId) => {
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        if (newSet.has(itemId)) {
          newSet.delete(itemId);
        } else {
          newSet.add(itemId);
        }
        return newSet;
      });
    };
    
    const handleDelete = () => {
      deleteJournalEntries(folderTitle, selectedItems);
      
      const newJournalData = getJournalEntriesByTitle(folderTitle);
      setJournalData([...newJournalData]);

      setIsSelectionMode(false);
      setSelectedItems(new Set());
    };

    const renderJournalEntry = ({ item }) => {
        const isSelected = selectedItems.has(item.id);
        const checkboxIcon = isSelected ? 'checkbox-outline' : 'square-outline';

        const handlePress = () => {
          if (isSelectionMode) {
            handleSelect(item.id);
          } else {
            router.push({
              pathname: 'Journal/IsiJournal',
              params: { entryId: item.id }
            });
          }
        };

        const handleLongPress = () => {
          setIsSelectionMode(true);
          handleSelect(item.id);
        };

        return (
            <TouchableOpacity
                onPress={handlePress}
                onLongPress={handleLongPress}
            >
                <View style={styles.entryRow}>
                    {isSelectionMode && (
                        <View style={styles.checkboxContainer}>
                            <Ionicons
                                name={checkboxIcon}
                                size={24}
                                color={isSelected ? '#448461' : '#A9A9A9'}
                            />
                        </View>
                    )}
                    <View style={[styles.entryCard, isSelected && styles.selectedEntryCard]}>
                        <View style={styles.textContainer}>
                            <Text style={styles.entryDay}>{item.day}</Text>
                            <Text style={styles.entryContent} numberOfLines={1}>{item.content}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const handleBackPress = () => {
      if (isSelectionMode) {
        setIsSelectionMode(false);
        setSelectedItems(new Set());
      } else {
        router.navigate('../Journal');
      }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                  <TouchableOpacity onPress={handleBackPress}>
                    <Ionicons name="chevron-back" size={30} color="#000000" />
                  </TouchableOpacity>
                  {isEditingTitle ? (
                      <TextInput
                          ref={titleInputRef}
                          style={styles.headerTitleInput}
                          value={tempTitle}
                          onChangeText={setTempTitle}
                          // onBlur akan memicu handleSaveTitle secara otomatis
                          onBlur={handleSaveTitle}
                          onSubmitEditing={handleSaveTitle}
                          returnKeyType="done"
                      />
                  ) : (
                      <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
                          <Text style={styles.headerTitle}>{folderTitle}</Text>
                      </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => console.log('More options')}>
                    <Ionicons name="ellipsis-vertical" size={30} color="#694B40" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.subTitle}>made in July, 2024</Text>
                
                <FlatList
                    ref={flatListRef}
                    data={journalData}
                    renderItem={renderJournalEntry}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                />
                
                {isEditingTitle && (
                    // Cukup panggil Keyboard.dismiss() untuk menutup keyboard.
                    // onBlur pada TextInput akan menangani proses penyimpanan.
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.overlay} />
                    </TouchableWithoutFeedback>
                )}
            
                {isSelectionMode && selectedItems.size > 0 && (
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDelete}
                    >
                        <Text style={styles.deleteButtonText}>Delete ({selectedItems.size})</Text>
                    </TouchableOpacity>
                )}
                
                {!isSelectionMode && (
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddJournal}
                  >
                    <Image source={addButtonImage} style={styles.addButtonImage} />
                  </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FAFFFB',
    },
    container: {
        flex: 1,
        backgroundColor: '#FAFFFB',
        paddingHorizontal: SPACING,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 40,
        marginTop: 10,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#6A804F',
    },
    headerTitleInput: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#6A804F',
        borderBottomWidth: 1,
        borderBottomColor: '#6A804F',
        paddingBottom: 5,
        flex: 1,
        marginHorizontal: 10,
    },
    subTitle: {
        fontSize: 14,
        color: '#888',
        marginBottom: 20,
        alignSelf: 'flex-start',
        fontStyle: 'italic',
    },
    listContainer: {
        paddingBottom: 200, 
    },
    entryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    entryCard: {
        flex: 1,
        backgroundColor: '#D9ECE1',
        borderRadius: 15,
        paddingRight: 25,
        paddingLeft: 25,
        paddingBottom: 15,
        paddingTop: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    selectedEntryCard: {
        borderColor: '#448461',
        borderWidth: 2,
    },
    checkboxContainer: {
        marginRight: 20,
        width: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
    },
    entryDay: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#448461',
    },
    entryContent: {
        fontSize: 12,
        color: '#448461',
        lineHeight: 20,
        marginTop: 10,
    },
    addButton: {
        position: 'absolute',
        bottom: 15,
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
    deleteButton: {
      position: 'absolute',
      bottom: 120,
      right: 30,
      backgroundColor: '#FF6347',
      paddingVertical: 15,
      paddingHorizontal: 25,
      borderRadius: 30,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
    },
    deleteButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject, 
        zIndex: 1, 
    },
});