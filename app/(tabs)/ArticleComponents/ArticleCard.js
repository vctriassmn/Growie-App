// Lokasi File: ArticleComponents/ArticleCard.js

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const extractFirstImageUri = (htmlContent) => {
    if (!htmlContent) return null;
    const match = htmlContent.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : null;
};

const ArticleCard = ({ item, selectionMode, selectedItems, toggleSelection, onCardPress, enterSelectionMode, isLiked, toggleLike }) => {
    
    // --- INTI PERUBAHAN: Logika Thumbnail yang Lebih Cerdas ---
    // 1. Coba ekstrak gambar dari konten HTML.
    // 2. Jika tidak ada, gunakan properti 'image' dari item itu sendiri.
    const thumbnailSource = extractFirstImageUri(item.fullArticle) || item.image;

    const descriptionText = item.description || 'No description available.';
    const getImageSource = (source) => (typeof source === 'string' ? { uri: source } : source);
    
    return (
        <TouchableOpacity
            style={styles.cardWrapper}
            onLongPress={() => enterSelectionMode(item.id)}
            onPress={() => (selectionMode ? toggleSelection(item.id) : onCardPress(item))}
            activeOpacity={0.9}
        >
            {selectionMode && (
                <TouchableOpacity style={styles.checkboxContainer} onPress={() => toggleSelection(item.id)}>
                    <Image source={ selectedItems.includes(item.id) ? require('../../../assets/images/checkbox_checked.png') : require('../../../assets/images/checkbox_unchecked.png') } style={styles.checkboxIcon}/>
                </TouchableOpacity>
            )}
            <View style={styles.card}>
                <View style={styles.topSection}>
                    <View style={styles.imageContainer}>
                        {/* Sekarang menggunakan `thumbnailSource` yang bisa berasal dari dua tempat */}
                        {thumbnailSource ? (
                            <Image source={getImageSource(thumbnailSource)} style={styles.mainImage} />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Ionicons name="image-outline" size={40} color="#ced4da" />
                            </View>
                        )}
                    </View>
                    <View style={styles.rightInfo}>
                         <TouchableOpacity onPress={() => toggleLike(item.id)} style={styles.likeButton}>
                             <Image source={ isLiked ? require('../../../assets/images/like_active.png') : require('../../../assets/images/like_inactive.png') } style={styles.heartIcon} />
                        </TouchableOpacity>
                        <Image source={getImageSource(item.avatar)} style={styles.avatar} />
                        <Text style={styles.username} numberOfLines={1}>{item.username}</Text>
                    </View>
                </View>
                <View style={styles.bottomSection}>
                    <Text style={styles.articleName} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.articleDescription} numberOfLines={3}>
                        {descriptionText}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// Stylesheet tidak perlu diubah.
const styles = StyleSheet.create({
    cardWrapper: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, paddingHorizontal: 15, },
    checkboxContainer: { paddingRight: 10, },
    checkboxIcon: { width: 24, height: 24, },
    card: { flex: 1, backgroundColor: '#fff', borderRadius: 15, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 5, },
    topSection: { flexDirection: 'row', height: 140 },
    imageContainer: { width: '75%', height: '100%', },
    mainImage: { width: '100%', height: '100%', resizeMode: 'cover', },
    imagePlaceholder: { width: '100%', height: '100%', backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#e9ecef', },
    rightInfo: { backgroundColor: '#DCF0E4', width: '25%', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
    likeButton: { alignSelf: 'flex-end', padding: 5, },
    heartIcon: { width: 22, height: 22, },
    avatar: { width: 55, height: 55, borderRadius: 27.5, borderColor: '#448461', borderWidth: 1.5, backgroundColor: '#f8f9fa' },
    username: { fontSize: 13, color: '#448461', fontFamily: 'Nunito_700Bold', paddingHorizontal: 2, },
    bottomSection: { paddingVertical: 15, paddingHorizontal: 20 },
    articleName: { fontSize: 16, fontFamily: 'Nunito_700Bold', color: '#448461', marginBottom: 6 },
    articleDescription: { fontSize: 13, fontFamily: 'Nunito_400Regular', color: '#666', lineHeight: 18, },
});

export default ArticleCard;