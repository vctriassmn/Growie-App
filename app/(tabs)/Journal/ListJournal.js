// File: app/(tabs)/Journal/ListJournal.js

import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { deleteJournalEntries, getJournalEntriesByTitle } from './journalData'; // <--- JALUR YANG SUDAH ANDA KONFIRMASI

// Impor gambar lokal untuk tombol tambah
const addButtonImage = require('../../../assets/images/add.png');

const SPACING = 20;

export default function ListJournalScreen() {
    const { folderTitle } = useLocalSearchParams();
    
    const [journalData, setJournalData] = useState([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState(new Set());
    
    useEffect(() => {
        const entries = getJournalEntriesByTitle(folderTitle);
        setJournalData(entries);
    }, [folderTitle]);

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
      setJournalData(newJournalData);
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
                  <Text style={styles.headerTitle}>{folderTitle}</Text>
                  <TouchableOpacity onPress={() => console.log('More options')}>
                    <Ionicons name="ellipsis-vertical" size={30} color="#694B40" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.subTitle}>made in July, 2024</Text>
                <FlatList
                    data={journalData}
                    renderItem={renderJournalEntry}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                />
            
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
                    onPress={() => {
                      // router.push('AddJournal');
                    }}
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
    subTitle: {
        fontSize: 14,
        color: '#888',
        marginBottom: 20,
        alignSelf: 'flex-start',
        fontStyle: 'italic',
    },
    listContainer: {
        paddingBottom: 100,
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
      marginRight: 10,
      width: 24,
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
});