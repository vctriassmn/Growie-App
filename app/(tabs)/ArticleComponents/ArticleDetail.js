// Lokasi File: ArticleComponents/ArticleDetail.js

import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { Ionicons } from '@expo/vector-icons';


// Fungsi htmlToText tidak berubah, sudah benar.
const htmlToText = (html) => {
    if (!html || typeof html !== 'string') return '';
    let text = html;
    text = text.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/<\/p>/gi, '\n\n');
    text = text.replace(/<[^>]+>/g, '');
    text = text.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"');
    const cleanedText = text.split('\n').map(line => line.trim()).join('\n').replace(/\n{3,}/g, '\n\n');  
    return cleanedText.trim();
};


function ArticleDetail({ plant, isLiked, toggleLike, onBack }) {
    let [fontsLoaded] = useFonts({
        Nunito_400Regular,
        Nunito_700Bold,
    });

    if (!fontsLoaded || !plant) {
        return null;
    }
    
    const getImageSource = (source) => {
        return typeof source === 'string' ? { uri: source } : source;
    };

    const photoOfTheDaySource = plant.category === 'publish'
        ? plant.image
        : plant.photoOfTheDayImage;

    return (
        <View style={styles.detailContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />
            <View style={styles.detailHeader}>
                <TouchableOpacity onPress={onBack} style={styles.detailHeaderButton}>
                    <Ionicons name="chevron-back" size={24} color="#444" />
                </TouchableOpacity>
                <Text style={styles.detailHeaderText}>Article</Text>
                <TouchableOpacity onPress={() => toggleLike(plant.id)} style={styles.detailHeaderButton}>
                    <Image
                        source={ isLiked ? require('../../../assets/images/like_active.png') : require('../../../assets/images/like_inactive.png') }
                        style={styles.detailHeaderIcon}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.detailScrollContent}>
                <View style={styles.detailTopImageSection}>
                    {plant.image ? (
                        <Image source={getImageSource(plant.image)} style={styles.detailMainPlantImage} />
                    ) : (
                        <View style={styles.detailImagePlaceholder}>
                            <Ionicons name="image-outline" size={60} color="#ced4da" />
                        </View>
                    )}
                    <View style={styles.detailOverlayInfo}>
                         <Image source={getImageSource(plant.avatar)} style={styles.detailAvatar} />
                         <Text style={styles.detailUsername}>{plant.username}</Text>
                    </View>
                </View>

                <View style={styles.detailContentSection}>
                    <Text style={styles.detailPlantName}>{plant.name}</Text>
                    <Text style={styles.detailDateText}>Date: {plant.date}</Text>

                    {photoOfTheDaySource && (
                        <>
                            <Text style={styles.detailSectionTitle}>📸 Photo of the Day</Text>
                            <Image source={getImageSource(photoOfTheDaySource)} style={styles.detailPhotoOfDayImage} />
                        </>
                    )}
                    
                    <Text style={styles.detailQuoteText}>"{plant.quote}"</Text>
                    
                    <Text style={styles.detailFullArticleText}>
                        {htmlToText(plant.fullArticle)}
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    // --- PERUBAHAN SATU-SATUNYA ADA DI SINI ---
    detailScrollContent: { 
        paddingBottom: 120 // Nilai diperbesar agar konten tidak tertutup navbar bawah
    },
    // --- SISA KODE STYLE TIDAK BERUBAH ---
    detailContainer: { flex: 1, backgroundColor: '#fff' },
    detailHeader: { flexDirection: 'row', alignItems: 'center', height: 60, width: '100%', marginTop: 50, paddingHorizontal: 20, justifyContent: 'space-between', backgroundColor: '#fff' },
    detailHeaderButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    detailHeaderIcon: { width: 24, height: 24, resizeMode: 'contain' },
    detailHeaderText: { flex: 1, fontSize: 20, fontFamily: 'Nunito_700Bold', color: '#448461', textAlign: 'center' },
    detailTopImageSection: { width: '100%', height: 250, position: 'relative', backgroundColor: '#e9ecef' },
    detailMainPlantImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    detailImagePlaceholder: { width: '100%', height: '100%', backgroundColor: '#e9ecef', justifyContent: 'center', alignItems: 'center' },
    detailOverlayInfo: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 20 },
    detailAvatar: { width: 50, height: 50, borderRadius: 25, borderColor: '#fff', borderWidth: 1, marginRight: 10 },
    detailUsername: { fontSize: 16, fontFamily: 'Nunito_700Bold', color: '#fff' },
    detailContentSection: { paddingHorizontal: 20, paddingVertical: 20 },
    detailPlantName: { fontSize: 24, fontFamily: 'Nunito_700Bold', color: '#448461', marginBottom: 5 },
    detailDateText: { fontSize: 14, color: '#666', fontFamily: 'Nunito_400Regular', marginBottom: 20 },
    detailSectionTitle: { fontSize: 16, color: '#448461', fontFamily: 'Nunito_700Bold', marginBottom: 10 },
    detailPhotoOfDayImage: { width: '100%', height: 200, resizeMode: 'cover', borderRadius: 8, marginBottom: 10 },
    detailQuoteText: { fontSize: 15, fontStyle: 'italic', color: '#6c757d', textAlign: 'center', marginVertical: 20, paddingHorizontal: 10, fontFamily: 'Nunito_400Regular' },
    detailFullArticleText: { fontSize: 15, color: '#343a40', fontFamily: 'Nunito_400Regular', lineHeight: 24, marginTop: 10, textAlign: 'justify', },
});

export default ArticleDetail;