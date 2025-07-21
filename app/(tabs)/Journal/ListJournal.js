// File: src/app/Journal/ListJournalScreen.js

import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, LayoutAnimation, Platform, UIManager, TextInput, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useJournalAndArticle } from '../../../context/JournalAndArticleStore'; 

const SPACING = 30;

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export default function ListJournalScreen() {
    const { folderTitle } = useLocalSearchParams();
    const navigation = useNavigation();
    
    // Pastikan fungsi publishJournalEntries diimpor dari store
    const { journals, addJournalEntry, deleteJournalEntries, publishJournalEntries } = useJournalAndArticle();

    const [selectionMode, setSelectionMode] = useState(null);
    const [selectedEntries, setSelectedEntries] = useState([]);
    
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [tempTitle, setTempTitle] = useState(folderTitle);
    
    const flatListRef = useRef(null);
    const isInitialMount = useRef(true);
    const titleInputRef = useRef(null);
    
    const journalData = journals[folderTitle] || [];

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    useEffect(() => {
        setTempTitle(folderTitle);
    }, [folderTitle]);

    useEffect(() => {
        if (isEditingTitle && titleInputRef.current) {
            setTimeout(() => {
                titleInputRef.current.focus();
            }, 100); 
        }
    }, [isEditingTitle]);

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
    };

    const toggleSelection = (entryId) => {
        const isSelected = selectedEntries.includes(entryId);
        if (isSelected) {
            setSelectedEntries(selectedEntries.filter(id => id !== entryId));
        } else {
            setSelectedEntries([...selectedEntries, entryId]);
        }
    };
    
    const handleMoreOptions = () => {
        Alert.alert(
            "Pilih Aksi",
            "Apa yang ingin Anda lakukan?",
            [
                {
                    text: "Batal",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Publish",
                    onPress: () => setSelectionMode('publish')
                },
                {
                    text: "Delete",
                    onPress: () => setSelectionMode('delete')
                }
            ]
        );
    };

    const handlePublish = () => {
        if (selectedEntries.length === 0) {
            Alert.alert("Peringatan", "Pilih setidaknya satu entri untuk dipublikasikan.");
            return;
        }
        const entriesToPublish = journalData.filter(entry => selectedEntries.includes(entry.id));
        
        // Panggil fungsi publishJournalEntries dari store
        publishJournalEntries(folderTitle, entriesToPublish);
        
        Alert.alert("Sukses", `${entriesToPublish.length} entri berhasil dipublikasikan!`);
        setSelectionMode(null);
        setSelectedEntries([]);
    };

    const handleDelete = () => {
        if (selectedEntries.length === 0) {
            Alert.alert("Peringatan", "Pilih setidaknya satu entri untuk dihapus.");
            return;
        }
        Alert.alert(
            "Konfirmasi Hapus",
            `Anda yakin ingin menghapus ${selectedEntries.length} entri?`,
            [
                { text: "Batal", style: "cancel" },
                {
                    text: "Hapus",
                    onPress: () => {
                        deleteJournalEntries(folderTitle, selectedEntries);
                        setSelectedEntries([]);
                        setSelectionMode(null);
                        Alert.alert("Sukses", `${selectedEntries.length} entri berhasil dihapus.`);
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const handleCancelSelection = () => {
        setSelectionMode(null);
        setSelectedEntries([]);
    };

    const renderJournalEntry = ({ item }) => {
        const handlePress = () => {
            if (selectionMode) {
                toggleSelection(item.id);
            } else {
                router.push({
                    pathname: 'Journal/IsiJournal',
                    params: { entryId: item.id }
                });
            }
        };

        return (
            <TouchableOpacity onPress={handlePress}>
                <View style={styles.entryRow}>
                    {selectionMode && (
                        <TouchableOpacity onPress={() => toggleSelection(item.id)} style={styles.checkboxContainer}>
                            <Image
                                source={selectedEntries.includes(item.id) 
                                    ? require('../../../assets/images/checkbox_checked.png')
                                    : require('../../../assets/images/checkbox_unchecked.png')}
                                style={styles.checkboxImage}
                            />
                        </TouchableOpacity>
                    )}
                    <View style={styles.entryCard}>
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
        router.navigate('../Journal');
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
                            onBlur={handleSaveTitle}
                            onSubmitEditing={handleSaveTitle}
                            returnKeyType="done"
                        />
                    ) : (
                        <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
                            <Text style={styles.headerTitle}>{folderTitle}</Text>
                        </TouchableOpacity>
                    )}
                    {selectionMode ? (
                        <TouchableOpacity onPress={handleCancelSelection}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={handleMoreOptions}>
                            <Ionicons name="ellipsis-vertical" size={30} color="#694B40" />
                        </TouchableOpacity>
                    )}
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
                
                {selectionMode === 'publish' ? (
                    <TouchableOpacity style={styles.fabTextButton} onPress={handlePublish}>
                        <Text style={styles.fabText}>Publish</Text>
                    </TouchableOpacity>
                ) : selectionMode === 'delete' ? (
                    <TouchableOpacity style={[styles.fabTextButton, styles.deleteButton]} onPress={handleDelete}>
                        <Text style={styles.fabText}>Delete</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.fabImageButton} onPress={handleAddJournal}>
                        <Image
                            source={require('../../../assets/images/add.png')}
                            style={styles.fabImage}
                        />
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
    cancelText: {
        fontSize: 18,
        color: '#888',
    },
    subTitle: {
        fontSize: 14,
        color: '#888',
        marginBottom: 20,
        alignSelf: 'flex-start',
        fontStyle: 'italic',
    },
    listContainer: {
        paddingBottom: 20,
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
    checkboxContainer: {
        paddingRight: 10,
    },
    checkboxImage: {
        width: 24,
        height: 24,
    },
    fabTextButton: {
        position: 'absolute',
        bottom: 120,
        right: SPACING,
        backgroundColor: '#448461',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    deleteButton: {
        backgroundColor: '#DC143C',
    },
    fabText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    fabImageButton: {
        position: 'absolute',
        bottom: 120,
        right: SPACING,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#5c8d5c',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    fabImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
        backgroundColor: 'transparent',
    },
});