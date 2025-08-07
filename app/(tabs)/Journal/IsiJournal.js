// File: app/(tabs)/Journal/IsiJournal.js
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { 
    Image, 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View, 
    KeyboardAvoidingView, 
    Platform, 
    Alert, 
    TextInput, 
    ActivityIndicator 
} from 'react-native';
import { RichEditor, actions } from 'react-native-pell-rich-editor';
import { WebView } from 'react-native-webview';
import * as ImagePicker from 'expo-image-picker';
import { useJournalAndArticle } from '../../../context/JournalAndArticleStore';

// Aset gambar
const iconFont = require('../../../assets/icons/tool-font.png');
const iconCheckbox = require('../../../assets/icons/tool-checkbox.png');
const iconImage = require('../../../assets/icons/tool-images.png');
const iconBold = require('../../../assets/icons/tool-bold.png');
const iconItalic = require('../../../assets/icons/tool-italic.png');
const iconUnderline = require('../../../assets/icons/tool-underline.png');

export default function IsiJournalScreen() {
    const { folderTitle, entryId } = useLocalSearchParams();
    const { getJournalEntryById, updateJournalEntry } = useJournalAndArticle(); 
    
    // Data jurnal asli dari context
    const journalEntry = getJournalEntryById(folderTitle, entryId);
    
    // useRef untuk mengakses metode RichEditor
    const richText = useRef(null); 
    
    // State untuk mengontrol mode edit dan toolbar
    const [isEditing, setIsEditing] = useState(false);
    const [showFontTools, setShowFontTools] = useState(false);
    
    // State terpisah untuk menyimpan perubahan selama mode edit
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');

    useEffect(() => {
        if (journalEntry) {
            // Sinkronkan state lokal dengan data dari context
            setEditedTitle(journalEntry.title);
            setEditedContent(journalEntry.content);
        }
    }, [journalEntry]); 

    // Fungsi untuk kembali ke daftar jurnal
    const handleGoBackToList = () => {
        router.push({ pathname: './ListJournal', params: { folderTitle } });
    };

    // Fungsi untuk menyimpan perubahan
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
    
    // Fungsi untuk mengaktifkan/menonaktifkan mode edit
    const toggleEditMode = () => {
        // Jika sedang mengedit (aksi "Batal"), kembalikan ke data asli
        if (isEditing) {
            setEditedTitle(journalEntry.title);
            setEditedContent(journalEntry.content);
            // Kunci perbaikan: Reset konten RichEditor ke data asli
            richText.current?.setContentHTML(journalEntry.content);
        }
        // Ubah status mode edit
        setIsEditing(!isEditing);
        setShowFontTools(false);
    };

    // Fungsi untuk aksi RichEditor
    const handleFormatAction = (action) => richText.current?.sendAction(action);
    const handleInsertCheckbox = () => richText.current?.insertHTML(`<div style="margin-top: 5px; margin-bottom: 5px;"><input type="checkbox" />&nbsp;</div>`);
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
    
    // Tampilkan loading jika data belum tersedia
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
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={isEditing ? handleSaveChanges : handleGoBackToList}>
                            <Ionicons name={isEditing ? "checkmark-sharp" : "chevron-back"} size={30} color="#000000" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleEditMode}>
                            <Ionicons name={isEditing ? "close" : "ellipsis-vertical"} size={30} color="#694B40" />
                        </TouchableOpacity>
                    </View>

                    {/* Judul (Sticky, di tengah, dan di luar ScrollView) */}
                    {isEditing ? (
                        <TextInput
                            style={styles.titleInput}
                            value={editedTitle}
                            onChangeText={setEditedTitle}
                            placeholder="Tulis Judul di Sini"
                            placeholderTextColor="#999"
                        />
                    ) : (
                        <Text style={styles.titleText}>{journalEntry.title}</Text>
                    )}

                    {/* Konten yang bisa digulir */}
                    <ScrollView 
                        contentContainerStyle={styles.scrollContainer} 
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Konten (berubah menjadi RichEditor saat mode edit) */}
                        {isEditing ? (
                            <RichEditor
                                ref={richText}
                                initialContentHTML={editedContent}
                                onChange={setEditedContent} 
                                placeholder="Tulis ceritamu di sini..."
                                style={styles.richEditor}
                                editorStyle={styles.editorContentStyle}
                                useContainer={false}
                                // MODIFIKASI: Menambahkan CSS untuk memastikan teks selalu justify
                                initialCSSText={`
                                    body {
                                        font-family: 'Nunito-Regular';
                                        color: #448461;
                                        font-size: 16px;
                                        line-height: 24px;
                                        text-align: justify;
                                    }
                                `}
                            />
                        ) : (
                            // Tampilkan WebView untuk konten yang tidak bisa diedit
                            <WebView
                                originWhitelist={['*']}
                                source={{ html: `
                                    <html>
                                        <head>
                                            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                                            <style>
                                                @font-face {
                                                    font-family: 'Nunito-Regular';
                                                    src: url('path/to/Nunito-Regular.ttf'); // Catatan: font lokal tidak didukung langsung di WebView, ini hanya contoh
                                                }
                                                body {
                                                    font-family: 'Nunito-Regular', sans-serif;
                                                    color: #448461;
                                                    font-size: 16px;
                                                    line-height: 24px;
                                                    text-align: justify;
                                                    margin: 0;
                                                    padding: 0;
                                                }
                                                img {
                                                    max-width: 100%;
                                                    height: auto;
                                                    border-radius: 15px;
                                                }
                                                b, strong {
                                                    font-family: 'Nunito-Bold', sans-serif;
                                                }
                                                i, em {
                                                    font-style: italic;
                                                }
                                                u {
                                                    text-decoration: underline;
                                                }
                                                /* Style untuk checkbox */
                                                input[type="checkbox"] {
                                                    -webkit-appearance: none;
                                                    -moz-appearance: none;
                                                    appearance: none;
                                                    width: 18px;
                                                    height: 18px;
                                                    border: 2px solid #694B40;
                                                    border-radius: 4px;
                                                    vertical-align: middle;
                                                    margin-right: 8px;
                                                    position: relative;
                                                    top: -1px;
                                                }
                                                input[type="checkbox"]:checked {
                                                    background-color: #694B40;
                                                    border-color: #694B40;
                                                }
                                                input[type="checkbox"]:checked::after {
                                                    content: '✓';
                                                    font-size: 14px;
                                                    color: white;
                                                    position: absolute;
                                                    top: 0px;
                                                    left: 2px;
                                                }
                                            </style>
                                        </head>
                                        <body>
                                            ${journalEntry.content}
                                        </body>
                                    </html>
                                `}}
                                style={styles.readOnlyWebView}
                                scrollEnabled={false}
                            />
                        )}
                    </ScrollView>

                    {/* Toolbar edit (hanya muncul saat mode edit aktif) */}
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

// Stylesheet
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
        lineHeight: 36,
        textAlign: 'center',
        paddingBottom: 20,
    },
    titleInput: {
        fontSize: 28,
        fontFamily: 'Nunito-ExtraBold',
        color: '#448461',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 8,
        textAlign: 'center',
        marginBottom: 20,
    },
    errorText: { fontSize: 18, color: 'red', textAlign: 'center', marginTop: 50, fontFamily: 'Nunito-Regular' },
    backLink: { fontSize: 16, color: '#448461', textAlign: 'center', marginTop: 20, fontFamily: 'Nunito-Bold', textDecorationLine: 'underline' },
    scrollContainer: { paddingBottom: 150 },
    richEditor: {
        minHeight: 1000,
        flex: 1,
    },
    readOnlyWebView: {
        height: 1000,
        flex: 1,
        backgroundColor: 'transparent'
    },
    editorContentStyle: {
        backgroundColor: 'transparent',
        color: '#448461',
        fontFamily: 'Nunito-Regular',
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'justify', // Ini tetap dipertahankan untuk styling container
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