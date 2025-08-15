import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, LayoutAnimation, Platform, UIManager, TextInput, TouchableWithoutFeedback, Keyboard, Alert, Dimensions } from 'react-native';
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
    
    const { journals, addJournalEntry, deleteJournalEntries, publishJournalEntries, renameJournalFolder } = useJournalAndArticle();

    const [selectionMode, setSelectionMode] = useState(null);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [selectedEntries, setSelectedEntries] = useState([]);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [tempTitle, setTempTitle] = useState(folderTitle);
    
    const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
    const optionsIconRef = useRef(null);
    
    const flatListRef = useRef(null);
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

    const handleSaveTitle = () => {
        if (tempTitle && tempTitle !== folderTitle) {
            renameJournalFolder(folderTitle, tempTitle);
            router.replace({
                pathname: '/Journal/ListJournal', 
                params: { folderTitle: tempTitle }
            });
        }
        Keyboard.dismiss();
        setIsEditingTitle(false);
    };

    // --- PERUBAHAN 1: Buat entri baru dengan format { title, content } ---
    const handleAddJournal = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const newEntry = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            title: 'New Entry', 
            content: 'Write your journal here...', 
        };
        addJournalEntry(folderTitle, newEntry);
        
        setTimeout(() => {
            if (flatListRef.current) {
                flatListRef.current.scrollToEnd({ animated: true });
            }
        }, 100); 
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
        optionsIconRef.current.measure((x, y, width, height, pageX, pageY) => {
            setMenuPosition({
                top: pageY + height,
                right: Dimensions.get('window').width - pageX - width,
            });
            setIsMenuVisible(true);
        });
    };
    
    const handleSelectAction = (action) => {
        setSelectionMode(action);
        setIsMenuVisible(false);
    };

    const handlePublish = () => {
        if (selectedEntries.length === 0) {
            Alert.alert("Peringatan", "Pilih setidaknya satu entri untuk dipublikasikan.");
            return;
        }
        const entriesToPublish = journalData.filter(entry => selectedEntries.includes(entry.id));
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
                    params: { 
                        entryId: item.id,
                        folderTitle: folderTitle 
                    }
                });
            }
        };

        // Fungsi untuk membersihkan HTML dari string untuk pratinjau
        const cleanContentPreview = (htmlContent) => {
            if (!htmlContent) return '';
            return htmlContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
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
                            {/* Menampilkan item.title sebagai judul */}
                            <Text style={styles.entryDay} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.entryContent} numberOfLines={2}>
                                {cleanContentPreview(item.content)}
                            </Text>
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

                    <View>
                        {selectionMode ? (
                            <TouchableOpacity onPress={handleCancelSelection}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity ref={optionsIconRef} onPress={handleMoreOptions}>
                                <Ionicons name="ellipsis-vertical" size={30} color="#694B40" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {isMenuVisible && (
                    <>
                        <TouchableWithoutFeedback onPress={() => setIsMenuVisible(false)}>
                            <View style={styles.overlay} />
                        </TouchableWithoutFeedback>
                        <View style={[styles.flyoutMenu, { top: menuPosition.top, right: menuPosition.right }]}>
                            <TouchableOpacity style={styles.menuItem} onPress={() => handleSelectAction('publish')}>
                                <Text style={styles.menuItemText}>Publish</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItem} onPress={() => handleSelectAction('delete')}>
                                <Text style={[styles.menuItemText, { color: '#DC143C' }]}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

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

// Stylesheet tetap sama, tidak perlu diubah.
// Nama style 'entryDay' tetap digunakan untuk konsistensi, meskipun sekarang menampilkan judul.
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
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 26,
        color: '#6A804F',
        fontFamily: 'Nunito-ExtraBold',
    },
    headerTitleInput: {
        fontSize: 26,
        color: '#6A804F',
        borderBottomWidth: 1,
        borderBottomColor: '#6A804F',
        paddingBottom: 5,
        flex: 1,
        marginHorizontal: 10,
        fontFamily: 'Nunito-Bold',
    },
    cancelText: {
        fontSize: 18,
        color: '#888',
        fontFamily: 'Nunito-SemiBold',
    },
    subTitle: {
        fontSize: 14,
        color: '#888',
        marginBottom: 20,
        alignSelf: 'flex-start',
        fontFamily: 'Nunito-Italic',
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
        paddingRight: 15,
        paddingLeft: 15,
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
    entryDay: { // Nama style ini tetap, tapi sekarang menampilkan judul
        fontSize: 18,
        color: '#448461',
        fontFamily: 'Nunito-ExtraBold',
    },
    entryContent: {
        fontSize: 14,
        color: '#448461',
        lineHeight: 20,
        marginTop: 10,
        fontFamily: 'Nunito-Regular',
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
        fontSize: 16,
        fontFamily: 'Nunito-Bold',
    },
    fabImageButton: {
        position: 'absolute',
        bottom: 110,
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
        backgroundColor: 'rgba(0,0,0,0.1)',
        zIndex: 20,
    },
    flyoutMenu: {
        position: 'absolute',
        backgroundColor: '#FBF2D6',
        borderRadius: 8,
        paddingVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 30,
        width: 200,
    },
    menuItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    menuItemText: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'Nunito-SemiBold',
    },
});