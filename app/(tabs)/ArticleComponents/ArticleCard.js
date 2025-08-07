// File: growiie kirim/app/(tabs)/ArticleComponents/ArticleCard.js

import React, { useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Animated,
} from 'react-native';
import { truncateText, cleanHtml } from './utils/articleUtils';

const ArticleCard = ({ item, selectionMode, selectedItems, toggleSelection, onCardPress, enterSelectionMode, isLiked, toggleLike }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handleLike = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.5,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start(() => {
            toggleLike(item.id);
        });
    };

    // ✅ Perbaikan: Logika untuk menentukan gambar atau warna latar
    const isImageAColor = typeof item.image === 'string' && item.image.startsWith('#');

    return (
        <TouchableOpacity
            style={styles.plantCardWrapper}
            onLongPress={() => enterSelectionMode(item.id)}
            onPress={() => selectionMode ? toggleSelection(item.id) : onCardPress(item)}
            activeOpacity={0.9}
        >
            {selectionMode && (
                <TouchableOpacity
                    style={styles.plantCardCheckboxContainer}
                    onPress={() => toggleSelection(item.id)}
                >
                    <Image
                        source={
                            selectedItems.includes(item.id)
                                ? require('../../../assets/images/checkbox_checked.png')
                                : require('../../../assets/images/checkbox_unchecked.png')
                        }
                        style={styles.plantCardCheckboxIcon}
                    />
                </TouchableOpacity>
            )}
            <View style={[styles.plantCard, selectionMode && styles.plantCardShrink]}>
                <View style={styles.plantCardTopSection}>
                    {isImageAColor ? (
                        <View style={[styles.colorBackground, { backgroundColor: item.image }]} />
                    ) : (
                        <Image source={item.image} style={styles.plantCardImage} />
                    )}
                    <View style={styles.plantCardRightInfo}>
                        <TouchableOpacity style={styles.articleLikeButton} onPress={handleLike} activeOpacity={0.8}>
                            <Animated.Image
                                source={
                                    isLiked
                                        ? require('../../../assets/images/like_active.png')
                                        : require('../../../assets/images/like_inactive.png')
                                }
                                style={[styles.articleLikeIcon, { transform: [{ scale: scaleAnim }] }]}
                            />
                        </TouchableOpacity>
                        <Image source={item.avatar} style={styles.plantCardAvatar} />
                        <Text style={styles.plantCardUsername}>{item.username}</Text>
                    </View>
                </View>
                <View style={styles.plantCardBottomSection}>
                    <Text style={styles.plantCardName}>{item.name}</Text>
                    <Text style={styles.plantCardDescription}>
                        {truncateText(cleanHtml(item.fullArticle), 50)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    plantCardWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        width: '90%',
        alignSelf: 'center',
        marginLeft: 4,
    },
    plantCardCheckboxContainer: {
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    plantCardCheckboxIcon: {
        width: 24,
        height: 24,
    },
    plantCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 4,
        flex: 1,
        width: 330,
    },
    plantCardShrink: {
        width: 400,
    },
    plantCardTopSection: { 
        flexDirection: 'row',
        height: 150, 
    },
    plantCardImage: {
        width: '75%',
        height: '100%',
        resizeMode: 'cover',
    },
    // ✅ Tambahkan style baru untuk latar belakang warna
    colorBackground: {
        width: '75%',
        height: '100%',
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
    },
    plantCardRightInfo: {
        backgroundColor: '#DCF0E4',
        width: '25%',
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    plantCardAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderColor: '#448461',
        borderWidth: 1,
        marginBottom: 5,
        marginTop: 20,
    },
    plantCardUsername: {
        fontSize: 14,
        color: '#448461',
        marginBottom: 10,
    },
    articleLikeButton: { 
        position: 'absolute', 
        top: 5, 
        right: 5, 
        padding: 5, 
    },
    articleLikeIcon: { 
        width: 24, 
        height: 24, 
    },
    plantCardBottomSection: {
        padding: 10,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    plantCardName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#448461',
        marginBottom: 4,
    },
    plantCardDescription: {
        fontSize: 13,
        color: '#666',
        numberOfLines: 6,
    },
});

export default ArticleCard;