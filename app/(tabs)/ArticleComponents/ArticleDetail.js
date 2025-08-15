// File: growiie kirim/app/(tabs)/ArticleComponents/ArticleDetail.js

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
import CheckBox from '@react-native-community/checkbox';



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
        'Nunito-ExtraBold': require('../../../assets/fonts/Nunito-ExtraBold.ttf'),
    });

    // --- FUNGSI BARU UNTUK MERENDER KONTEN ---
    // Fungsi ini sekarang mengurai HTML dan mengembalikan array komponen React Native
    const renderArticleContent = (htmlContent) => {
        if (!htmlContent) {
            return null;
        }

        const components = [];
        // Regex untuk mencari semua tag <p>, <img>, <b>, <i>, dan <u>
        const regex = /<p>(.*?)<\/p>|<img[^>]*src="([^"]*)"[^>]*>|<b>(.*?)<\/b>|<i>(.*?)<\/i>|<u>(.*?)<\/u>/gs;
        let lastIndex = 0;
        let match;
        let counter = 0;

        while ((match = regex.exec(htmlContent)) !== null) {
            // Tangani teks di luar tag yang ditemukan
            const textBefore = htmlContent.substring(lastIndex, match.index).trim();
            if (textBefore) {
                components.push(
                    <Text key={`text-${counter++}`} style={styles.detailFullArticleText}>
                        {textBefore.replace(/<[^>]*>/g, '')}
                    </Text>
                );
            }

            // Memastikan penangkapan regex sesuai urutan
            const [fullMatch, pContent, imgUrl, bContent, iContent, uContent] = match;

            if (pContent) {
                // Merender konten di dalam tag <p>
                // Tangani tag <b>, <i>, dan <u> di dalam <p>
                const pComponents = [];
                const innerRegex = /<b>(.*?)<\/b>|<i>(.*?)<\/i>|<u>(.*?)<\/u>|([^<]+)/gs;
                let innerMatch;
                let innerCounter = 0;

                while ((innerMatch = innerRegex.exec(pContent)) !== null) {
                    const [innerFullMatch, bText, iText, uText, plainText] = innerMatch;
                    if (bText) {
                        pComponents.push(<Text key={`b-${innerCounter++}`} style={styles.boldText}>{bText}</Text>);
                    } else if (iText) {
                        pComponents.push(<Text key={`i-${innerCounter++}`} style={styles.italicText}>{iText}</Text>);
                    } else if (uText) {
                        pComponents.push(<Text key={`u-${innerCounter++}`} style={styles.underlineText}>{uText}</Text>);
                    } else if (plainText) {
                        pComponents.push(<Text key={`plain-${innerCounter++}`}>{plainText}</Text>);
                    }
                }

                components.push(
                    <Text key={`paragraph-${counter++}`} style={styles.detailFullArticleText}>
                        {pComponents}
                    </Text>
                );
            } else if (imgUrl) {
                // Merender tag <img> sebagai komponen Image
                components.push(
                    <Image key={`image-${counter++}`} source={{ uri: imgUrl }} style={styles.detailArticleImage} />
                );
            } else if (checkboxTag) {
            const isChecked = /checked/.test(checkboxTag);
            components.push(
                <View key={`checkbox-container-${counter}`} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                     <CheckBox
                        key={`checkbox-${counter++}`}s
                        value={isChecked}
                        onValueChange={() => {}}
                        style={{ marginVertical: 0 }}
                    />
                </View>
            );
            } else if (bContent) {
                components.push(
                    <Text key={`bold-${counter++}`} style={[styles.detailFullArticleText, styles.boldText]}>
                        {bContent}
                    </Text>
                );
            } else if (iContent) {
                // Merender tag <i> di luar <p>
                components.push(
                    <Text key={`italic-${counter++}`} style={[styles.detailFullArticleText, styles.italicText]}>
                        {iContent}
                    </Text>
                );
            } else if (uContent) {
                // Merender tag <u> di luar <p>
                components.push(
                    <Text key={`underline-${counter++}`} style={[styles.detailFullArticleText, styles.underlineText]}>
                        {uContent}
                    </Text>
                );
            }

            lastIndex = match.index + fullMatch.length;
        }

        // Tangani sisa teks setelah loop berakhir
        const textAfter = htmlContent.substring(lastIndex).trim();
        if (textAfter) {
            components.push(
                <Text key={`final-text-${counter++}`} style={styles.detailFullArticleText}>
                    {textAfter.replace(/<[^>]*>/g, '')}
                </Text>
            );
        }

        return components;
    };

    if (!fontsLoaded) {
        return null;
    }

    const isMainImageAColor = typeof plant.image === 'string' && plant.image.startsWith('#');

    // --- LOGIKA BARU UNTUK MENGAMBIL FOTO PERTAMA ---
    let photoOfTheDayImage = plant.photoOfTheDayImage; // Gunakan foto default jika tidak ada gambar di artikel
    let modifiedFullArticle = plant.fullArticle;

    const firstImageRegex = /<img[^>]*src="([^"]*)"[^>]*>/;
    const firstImageMatch = firstImageRegex.exec(plant.fullArticle);

    if (firstImageMatch && firstImageMatch[1]) {
        photoOfTheDayImage = { uri: firstImageMatch[1] }; // Ambil URL gambar pertama
        modifiedFullArticle = plant.fullArticle.replace(firstImageMatch[0], ''); // Hapus tag gambar dari artikel
    }

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

                    {/* FOTO PERTAMA DITAMPILKAN DI SINI */}
                    {photoOfTheDayImage && (
                        <>
                            <Text style={styles.detailSectionTitle}>📸 Photo of the Day</Text>
                            <Image source={photoOfTheDayImage} style={styles.detailPhotoOfDayImage} />
                            {/* Kutipan juga mungkin perlu dipindahkan, tapi saya biarkan di sini sesuai kode awal */}
                            <Text style={styles.detailQuoteText}>{plant.quote}</Text>
                        </>
                    )}

                    {/* Sisa konten artikel (tanpa foto pertama) ditampilkan di sini */}
                    {renderArticleContent(modifiedFullArticle)}
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
    detailFullArticleText: {
        fontSize: 15,
        color: '#333',
        fontFamily: 'Nunito_400Regular',
        lineHeight: 22,
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'justify',
    },
    detailArticleImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 15,
        marginVertical: 10,
    },
    // Menambahkan style baru untuk format teks
    boldText: {
        fontFamily: 'Nunito_700Bold',
    },
    italicText: {
        fontStyle: 'italic',
    },
    underlineText: {
        textDecorationLine:'underline',
    }
});

export default ArticleDetail;
