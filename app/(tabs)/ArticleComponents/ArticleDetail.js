// File: growiie kirim/app/(tabs)/ArticleComponents/ArticleDetail.js
// --- Salin semua kode di bawah ini ---

import React, { useRef } from 'react';
import {
    Animated,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { Ionicons } from '@expo/vector-icons';

// Hapus import cleanHtml karena kita akan buat fungsi baru
// import { cleanHtml } from './utils/articleUtils';

export function ArticleDetail({ plant, isLiked, toggleLike, onBack }) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handleLikePress = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.2,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start(() => {
            toggleLike(plant.id);
        });
    };

    let [fontsLoaded] = useFonts({
        Nunito_400Regular,
        Nunito_700Bold,
        'Nunito-ExtraBold': require('../../../assets/fonts/Nunito-ExtraBold.ttf'), // Pastikan font ini ada jika digunakan
    });

    // --- FUNGSI BARU UNTUK MERENDER KONTEN ---
    // Fungsi ini mengubah tag HTML menjadi teks dengan paragraf yang benar
    const renderArticleContent = (htmlContent) => {
        if (!htmlContent) {
            return '';
        }

        // 1. Ganti tag <br> dan penutup paragraf </p> dengan dua baris baru untuk membuat jarak
        const withLineBreaks = htmlContent
            .replace(/<br\s*\/?>/gi, '\n\n')
            .replace(/<\/p>/gi, '\n\n');

        // 2. Hapus SEMUA sisa tag HTML
        const plainText = withLineBreaks.replace(/<[^>]*>/g, '');

        // 3. Hapus spasi atau baris baru berlebih di awal/akhir
        return plainText.trim();
    };

    if (!fontsLoaded) {
        return null;
    }

    const isMainImageAColor = typeof plant.image === 'string' && plant.image.startsWith('#');

    return (
        <View style={styles.detailContainer}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#fff"
                translucent={false}
            />

            <View style={styles.detailHeader}>
                <TouchableOpacity onPress={onBack} style={styles.detailHeaderButton}>
                    <Ionicons name="chevron-back" size={24} color="#444" />
                </TouchableOpacity>
                <Text style={styles.detailHeaderText}>Article</Text>
                <TouchableOpacity onPress={handleLikePress} style={styles.detailHeaderButton}>
                    <Animated.Image
                        source={
                            isLiked
                                ? require('../../../assets/images/like_active.png')
                                : require('../../../assets/images/like_inactive.png')
                        }
                        style={[styles.detailHeaderIcon, { transform: [{ scale: scaleAnim }] }]}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.detailScrollContent}>
                <View style={styles.detailTopImageSection}>
                    {isMainImageAColor ? (
                        <View style={[styles.mainColorBackground, { backgroundColor: plant.image }]} />
                    ) : (
                        <Image source={plant.image} style={styles.detailMainPlantImage} />
                    )}
                    <View style={styles.detailOverlayInfo}>
                        <Image source={plant.avatar} style={styles.detailAvatar} />
                        <Text style={styles.detailUsername}>{plant.username}</Text>
                    </View>
                </View>

                <View style={styles.detailContentSection}>
                    <Text style={styles.detailPlantName}>{plant.name}</Text>
                    <Text style={styles.detailDateText}>Date: {plant.date}</Text>

                    <Text style={styles.detailSectionTitle}>📸 Photo of the Day</Text>
                    <Image source={plant.photoOfTheDayImage} style={styles.detailPhotoOfDayImage} />
                    <Text style={styles.detailQuoteText}>{plant.quote}</Text>

                    {/* Menggunakan fungsi baru untuk menampilkan konten */}
                    <Text style={styles.detailFullArticleText}>
                        {renderArticleContent(plant.fullArticle)}
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    detailContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    detailHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
        width: '100%',
        marginTop: 50,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
    },
    detailHeaderButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailHeaderIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    detailHeaderText: {
        flex: 1,
        fontSize: 20,
        fontFamily: 'Nunito-ExtraBold',
        color: '#448461',
        textAlign: 'center',
    },
    detailScrollContent: {
        paddingBottom: 20,
    },
    detailTopImageSection: {
        width: '100%',
        height: 250,
        position: 'relative',
    },
    detailMainPlantImage: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: '100%',
        fontFamily: 'Nunito_700Bold',
        height: '100%',
        resizeMode: 'cover',
    },
    mainColorBackground: {
        width: '100%',
        height: '100%',
        backgroundColor: '#448461',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    detailOverlayInfo: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(59, 59, 59, 0.4)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    detailAvatar: {
        width: 50,
        height: 50,
        borderRadius: 30,
        borderColor: '#fff',
        borderWidth: 1,
        marginRight: 10,
    },
    detailUsername: {
        fontSize: 16,
        fontFamily: 'Nunito_700Bold',
        color: '#fff',
    },
    detailContentSection: {
        padding: 20,
    },
    detailPlantName: {
        fontSize: 24,
        fontFamily: 'Nunito_700Bold',
        color: '#448461',
        marginBottom: 5,
    },
    detailDateText: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Nunito_400Regular',
        marginBottom: 20,
    },
    detailSectionTitle: {
        fontSize: 16,
        color: '#448461',
        marginTop: 10,
        fontFamily: 'Nunito_700Bold',
        marginBottom: 10,
    },
    detailPhotoOfDayImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 8,
        marginBottom: 10,
    },
    detailQuoteText: {
        fontSize: 15,
        fontStyle: 'italic',
        color: '#888',
        textAlign: 'center',
        marginVertical: 15,
        paddingHorizontal: 10,
        fontFamily: 'Nunito_400Regular'
    },
    // Style ini sudah benar, perataan justify akan bekerja pada tiap blok teks (paragraf)
    detailFullArticleText: {
        fontSize: 15,
        color: '#333',
        fontFamily: 'Nunito_400Regular',
        lineHeight: 22,
        marginTop: 10,
        marginBottom: 60,
        textAlign: 'justify',
    },
});

export default ArticleDetail;