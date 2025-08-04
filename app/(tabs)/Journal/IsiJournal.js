
// File: app/(tabs)/Journal/IsiJournal.js
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform, Alert, TextInput, ActivityIndicator } from 'react-native';
import { RichEditor, actions } from 'react-native-pell-rich-editor';
import * as ImagePicker from 'expo-image-picker';
import { useJournalAndArticle } from '../../../context/JournalAndArticleStore';

const iconFont = require('../../../assets/icons/tool-font.png');
const iconCheckbox = require('../../../assets/icons/tool-checkbox.png');
const iconImage = require('../../../assets/icons/tool-images.png');
const iconBold = require('../../../assets/icons/tool-bold.png');
const iconItalic = require('../../../assets/icons/tool-italic.png');
const iconUnderline = require('../../../assets/icons/tool-underline.png');

export default function IsiJournalScreen() {
    const { folderTitle, entryId } = useLocalSearchParams();
    const { getJournalEntryById, updateJournalEntry } = useJournalAndArticle(); 
    
    // Data asli dari context, ini adalah "source of truth"
    const journalEntry = getJournalEntryById(folderTitle, entryId);
    
    const richText = useRef(null); 
    const [isEditing, setIsEditing] = useState(false);
    const [showFontTools, setShowFontTools] = useState(false);
    
    // --- PERBAIKAN KUNCI 1: State terpisah untuk mode edit ---
    // Ini mencegah state saling menimpa.
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');

    useEffect(() => {
        // Setiap kali data dari context berubah (misalnya setelah menyimpan),
        // perbarui state untuk edit agar selalu sinkron.
        if (journalEntry) {
            setEditedTitle(journalEntry.title);
            setEditedContent(journalEntry.content);
        }
    }, [journalEntry]); // Hanya berjalan saat `journalEntry` berubah

    const handleGoBackToList = () => {
        router.push({ pathname: './ListJournal', params: { folderTitle } });
    };

    // --- PERBAIKAN KUNCI 2: Fungsi simpan mengambil dari state edit ---
    const handleSaveChanges = () => {
        if (journalEntry) {
            updateJournalEntry(folderTitle, entryId, { 
                title: editedTitle, 
                content: editedContent 
            });
        }
        setIsEditing(false);
        setShowFontTools(false);
        Alert.alert("Tersimpan!", "Perubahan jurnal Anda telah disimpan.");
    };
    
    // --- PERBAIKAN KUNCI 3: Fungsi untuk mengaktifkan/menonaktifkan mode edit ---
    const toggleEditMode = () => {
        if (isEditing) {
            // Jika sedang mengedit (aksi "Cancel"), reset perubahan ke data asli
            setEditedTitle(journalEntry.title);
            setEditedContent(journalEntry.content);
        }
        // Toggle status edit dan sembunyikan toolbar font
        setIsEditing(!isEditing);
        setShowFontTools(false);
    };

    const handleFormatAction = (action) => richText.current?.sendAction(action);
    const handleInsertCheckbox = () => richText.current?.insertHTML(`<div style="margin-top: 5px; margin-bottom: 5px;"><input type="checkbox" /> </div>`);

    const handleInsertImage = async () => {
        richText.current?.focusContentEditor();
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Izin Ditolak', 'Kami memerlukan izin akses galeri!');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            richText.current?.insertImage(uri, 'width: 100%; border-radius: 15px; margin-top: 10px; margin-bottom: 10px;');
        }
    };
    
    if (!journalEntry) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <ActivityIndicator size="large" color="#448461" style={{ marginTop: 50 }}/>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={isEditing ? handleSaveChanges : handleGoBackToList}>
                            <Ionicons name={isEditing ? "checkmark-sharp" : "chevron-back"} size={30} color="#000000" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleEditMode}>
                            <Ionicons name={isEditing ? "close" : "ellipsis-vertical"} size={30} color="#694B40" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView 
                        contentContainerStyle={styles.scrollContainer} 
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {isEditing ? (
                            <TextInput
                                style={styles.titleInput}
                                // --- PERBAIKAN KUNCI 4: Gunakan state `editedTitle` ---
                                value={editedTitle}
                                onChangeText={setEditedTitle}
                                placeholder="Tulis Judul di Sini"
                                placeholderTextColor="#999"
                            />
                        ) : (
                            // Tampilkan judul dari data asli jika tidak sedang mengedit
                            <Text style={styles.titleText}>{journalEntry.title}</Text>
                        )}

                        <RichEditor
                            ref={richText}
                            disabled={!isEditing}
                            initialContentHTML={isEditing ? editedContent : journalEntry.content}
                            onChange={setEditedContent} 
                            placeholder="Tulis ceritamu di sini..."
                            style={styles.richEditor}
                            editorStyle={styles.editorContentStyle}
                            useContainer={false}
                        />
                    </ScrollView>

                    {isEditing && (
                        <View style={styles.editToolbarWrapper}>
                            {showFontTools && (
                                <View style={styles.fontToolsFlyout}>
                                    <TouchableOpacity onPress={() => handleFormatAction(actions.setBold)}>
                                        <Image source={iconBold} style={styles.flyoutIcon} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleFormatAction(actions.setItalic)}>
                                        <Image source={iconItalic} style={styles.flyoutIcon} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleFormatAction(actions.setUnderline)}>
                                        <Image source={iconUnderline} style={styles.flyoutIcon} />
                                    </TouchableOpacity>
                                </View>
                            )}
                            <View style={styles.editToolbar}>
                                <TouchableOpacity onPress={() => setShowFontTools(!showFontTools)}>
                                    <Image source={iconFont} style={styles.toolbarIcon} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleInsertCheckbox}>
                                    <Image source={iconCheckbox} style={styles.toolbarIcon} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleInsertImage}>
                                    <Image source={iconImage} style={styles.toolbarIcon} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// Stylesheet Anda tetap sama, hanya menambahkan rata kanan-kiri
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FAFFFB' },
    container: { flex: 1, backgroundColor: '#FAFFFB', paddingHorizontal: 20 },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingVertical: 10, 
        marginTop: 30 
    },
    titleText: {
        fontSize: 28,
        fontFamily: 'Nunito-ExtraBold',
        color: '#448461',
        marginVertical: 20,
        lineHeight: 36,
    },
    titleInput: {
        fontSize: 28,
        fontFamily: 'Nunito-ExtraBold',
        color: '#448461',
        marginVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 8,
    },
    errorText: { fontSize: 18, color: 'red', textAlign: 'center', marginTop: 50, fontFamily: 'Nunito-Regular' },
    backLink: { fontSize: 16, color: '#448461', textAlign: 'center', marginTop: 20, fontFamily: 'Nunito-Bold', textDecorationLine: 'underline' },
    scrollContainer: { paddingBottom: 150 },
    richEditor: {
        minHeight: 1000,
        flex: 1,
    },
    editorContentStyle: {
        backgroundColor: 'transparent',
        color: '#448461',
        fontFamily: 'Nunito-Regular',
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'justify', 
    },
    editToolbarWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    editToolbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '90%',
        height: 70,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginBottom: 20,
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    toolbarIcon: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    fontToolsFlyout: {
        position: 'absolute',
        bottom: 100,
        left: '10%',
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    flyoutIcon: {
        width: 30,
        height: 30,
        marginHorizontal: 8,
    },
});