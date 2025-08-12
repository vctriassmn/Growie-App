// File: app/(tabs)/Journal/IsiJournal.js
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import AutoHeightWebView from '../../../components/AutoHeightWebView';
import { 
    Image, 
    SafeAreaView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View, 
    Alert, 
    TextInput, 
    ActivityIndicator,
    Keyboard,
    Platform
} from 'react-native';
import { RichEditor, actions } from 'react-native-pell-rich-editor';
import * as ImagePicker from 'expo-image-picker';
import { useJournalAndArticle } from '../../../context/JournalAndArticleStore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
    
    const journalEntry = getJournalEntryById(folderTitle, entryId);
    const richText = useRef(null); 
    const scrollRef = useRef(null);

    const [isEditing, setIsEditing] = useState(false);
    const [showFontTools, setShowFontTools] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    useEffect(() => {
  const showSub = Keyboard.addListener(
    Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
    (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    }
  );
  const hideSub = Keyboard.addListener(
    Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
    () => {
      setKeyboardHeight(0);
    }
  );

  return () => {
    showSub.remove();
    hideSub.remove();
  };
}, []);

    useEffect(() => {
        if (journalEntry) {
            setEditedTitle(journalEntry.title);
            setEditedContent(journalEntry.content);
        }
    }, [journalEntry]);

    // Listener Keyboard untuk toolbar
    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
            setKeyboardHeight(e.endCoordinates.height);
        });
        const hideSub = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0);
        });

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    

    const handleGoBackToList = () => {
        router.push({ pathname: './ListJournal', params: { folderTitle } });
    };

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

    const toggleEditMode = () => {
        if (!isEditing) {
    setEditedTitle(journalEntry.title);
    setEditedContent(journalEntry.content);
    richText.current?.setContentHTML(journalEntry.content);
}

        setIsEditing(!isEditing);
        setShowFontTools(false);
    };

    // ----- new: wrap selection in DOM with given tag and get updated HTML back via postMessage
const handleRichMessage = (event) => {
  // event comes from RichEditor WebView => event.nativeEvent.data
  try {
    const raw = event?.nativeEvent?.data ?? event?.data ?? '';
    const parsed = JSON.parse(raw);
    if (parsed?.type === 'CONTENT_UPDATED') {
      setEditedContent(parsed.html ?? '');
    } else if (parsed?.type === 'FORMAT_ERROR') {
      console.warn('Editor format error:', parsed.message);
    }
  } catch (e) {
    // non-json messages can be ignored
    // console.log('editor message:', raw);
  }
};

const applyFormatTag = (tag) => {
  if (!richText.current) return;
  richText.current.focusContentEditor?.();

  const js = `(function(){
    try {
      var sel = window.getSelection();
      if (!sel || !sel.rangeCount) { return; }
      var range = sel.getRangeAt(0);
      var frag = range.cloneContents();
      var wrapper = document.createElement('${tag}');
      wrapper.appendChild(frag);
      range.deleteContents();
      range.insertNode(wrapper);
      document.body.normalize();
      var html = document.body.innerHTML;
      window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'CONTENT_UPDATED', html: html }));
    } catch(err) {
      window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'FORMAT_ERROR', message: err.message }));
    }
  })(); true;`;

  if (typeof richText.current.commandDOM === 'function') {
    richText.current.commandDOM(js);
  }

  // ✅ Sinkronkan ke state
  richText.current?.getContentHtml().then(html => {
    setEditedContent(html || '');
  });
};



    const handleInsertCheckbox = () => {
        richText.current?.insertHTML(`<div><br/></div>`);
        richText.current?.insertHTML(`<div style="display: block;"><input type="checkbox" />&nbsp;</div>`);
    };
    const [isLoadingContent, setIsLoadingContent] = useState(true);

useEffect(() => {
    if (journalEntry) {
        setEditedTitle(journalEntry.title);
        setEditedContent(journalEntry.content);
        setIsLoadingContent(false); // loading selesai saat data siap
    }
}, [journalEntry]);

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
            base64: true,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const base64 = result.assets[0].base64;
            const mime = result.assets[0].mimeType || 'image/jpeg';
            const imageHtml = `
    <div style="margin-top: 12px;">
        <img src="data:${mime};base64,${base64}" 
             style="width: 100%; border-radius: 15px; display: block; margin: auto;" />
    </div>
`;

richText.current?.insertHTML(imageHtml);

setTimeout(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
}, 200);

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
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={isEditing ? handleSaveChanges : handleGoBackToList}>
                        <Ionicons name={isEditing ? "checkmark-sharp" : "chevron-back"} size={30} color="#000000" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleEditMode}>
                        <Ionicons name={isEditing ? "close" : "ellipsis-vertical"} size={30} color="#694B40" />
                    </TouchableOpacity>
                </View>

                {isEditing ? (
                    <TextInput
                        style={styles.titleInput}
                        value={editedTitle}
                        onChangeText={setEditedTitle}
                        placeholder="Tulis Judul di Sini"
                        placeholderTextColor="#999"
                        onFocus={() => setTimeout(() => scrollRef.current?.scrollToPosition(0, 0, true), 200)}
                    />
                ) : (
                    <Text style={styles.titleText}>{journalEntry.title}</Text>
                )}

                <KeyboardAwareScrollView
    ref={scrollRef}
    enableOnAndroid={true}
    keyboardOpeningTime={0}
    extraScrollHeight={keyboardHeight + 20}
    contentContainerStyle={styles.scrollContainer}
    showsVerticalScrollIndicator={false}
>
    {isLoadingContent ? (
        <ActivityIndicator size="large" color="#448461" style={{ marginTop: 50 }} />
    ) : (
        isEditing ? (
            <RichEditor
                key={entryId}  // Supaya rerender bersih saat buka jurnal baru
                ref={richText}
                initialContentHTML={editedContent}
                onChange={(html) => setEditedContent(html || '')}
                onMessage={handleRichMessage}
                placeholder="Tulis ceritamu di sini..."
                style={styles.richEditor}
                editorStyle={{
                    backgroundColor: 'transparent',
                    color: '#448461',
                    fontFamily: 'Nunito-Regular',
                    fontSize: 16,
                    lineHeight: 24,
                    textAlign: 'justify',
                    cssText: `* { text-align: justify !important; } p { text-align: justify !important; }`, 
                }}
                useContainer={false}
                initialCSSText={`body, p, div { font-family: 'Nunito-Regular'; color: #448461; font-size: 16px; line-height: 24px; text-align: justify !important; }`}
            />
        ) : (
            <AutoHeightWebView
                key={entryId}
                content={`
                    <html>
                        <head>
                            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                            <style>
                                body {
                                    font-family: 'Nunito-Regular';
                                    color: #448461;
                                    font-size: 16px;
                                    line-height: 24px;
                                    text-align: justify;
                                    margin: 0;
                                    padding: 0;
                                }
                                img { max-width: 100%; height: auto; border-radius: 15px; }
                                b, strong { font-family: 'Nunito-ExtraBold'; }
                                i, em { font-style: italic; }
                                u { text-decoration: underline; }
                                input[type="checkbox"] {
                                    appearance: none;
                                    width: 18px; height: 18px; border: 2px solid #694B40; border-radius: 4px;
                                    vertical-align: middle; margin-right: 8px; position: relative;
                                }
                                input[type="checkbox"]:checked {
                                    background-color: #694B40; border-color: #694B40;
                                }
                                input[type="checkbox"]:checked::after {
                                    content: '✓'; font-size: 14px; color: white; position: absolute; top: -4px; left: 1px;
                                }
                            </style>
                        </head>
                        <body>${journalEntry.content}</body>
                    </html>
                `}
            />
        )
    )}
</KeyboardAwareScrollView>

                {isEditing && (
                    <View style={[styles.editToolbarWrapper, { bottom: keyboardHeight > 0 ? keyboardHeight + 20 : 30 }]} pointerEvents="box-none">
                        {showFontTools && (
                            <View style={styles.fontToolsFlyout}>
                                <TouchableOpacity
  onPressIn={() => richText.current?.focusContentEditor?.()}
  onPress={() => applyFormatTag('b')}
>
  <Image source={iconBold} style={styles.flyoutIcon} />
</TouchableOpacity>

<TouchableOpacity
  onPressIn={() => richText.current?.focusContentEditor?.()}
  onPress={() => applyFormatTag('i')}
>
  <Image source={iconItalic} style={styles.flyoutIcon} />
</TouchableOpacity>

<TouchableOpacity
  onPressIn={() => richText.current?.focusContentEditor?.()}
  onPress={() => applyFormatTag('u')}
>
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FAFFFB' },
    container: { flex: 1, backgroundColor: '#FAFFFB', paddingHorizontal: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, marginTop: 30 },
    titleText: { fontSize: 28, fontFamily: 'Nunito-ExtraBold', color: '#448461', lineHeight: 36, textAlign: 'center', paddingBottom: 10 },
    titleInput: { fontSize: 28, fontFamily: 'Nunito-ExtraBold', color: '#448461', borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 8, textAlign: 'center' },
    scrollContainer: { 
        flexGrow: 1,
        paddingTop: 5, 
        paddingBottom: 150 
    },
    richEditor: {
        flex: 1,
        minHeight: 300
    },
    editToolbarWrapper: { position: 'absolute', left: 0, right: 0, alignItems: 'center', marginVertical: 20 },
    editToolbar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '90%', height: 70, backgroundColor: '#FFFFFF', borderRadius: 20, marginBottom: 20, paddingHorizontal: 20, shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
    toolbarIcon: { width: 40, height: 40, resizeMode: 'contain' },
    fontToolsFlyout: { position: 'absolute', bottom: 100, left: '10%', flexDirection: 'row', backgroundColor: 'white', borderRadius: 15, padding: 10, shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
    flyoutIcon: { width: 30, height: 30, marginHorizontal: 8 },
});
