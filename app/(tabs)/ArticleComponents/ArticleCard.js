import React, { useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Animated,
} from 'react-native';
import { truncateText } from './utils/articleUtils';

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
                    <Image source={item.image} style={styles.plantCardImage} />
                    <View style={styles.plantCardRightInfo}>
                        <TouchableOpacity onPress={handleLike} activeOpacity={0.8}>
                            <Animated.Image
                                source={
                                    isLiked
                                        ? require('../../../assets/images/like_active.png')
                                        : require('../../../assets/images/like_inactive.png')
                                }
                                style={[styles.plantCardHeartButton, { transform: [{ scale: scaleAnim }] }]}
                            />
                        </TouchableOpacity>
                        <Image source={item.avatar} style={styles.plantCardAvatar} />
                        <Text style={styles.plantCardUsername}>{item.username}</Text>
                    </View>
                </View>
                <View style={styles.plantCardBottomSection}>
                    <Text style={styles.plantCardName}>{item.name}</Text>
                    <Text style={styles.plantCardDescription}>
                        {truncateText(item.fullArticle, 50)}
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
    plantCardTopSection: { flexDirection: 'row' },
    plantCardImage: { width: '75%', height: '100%', resizeMode: 'cover' },
    plantCardRightInfo: { backgroundColor: '#DCF0E4', width: '25%', paddingVertical: 10 },
    plantCardAvatar: { width: 60, height: 60, borderRadius: 30, borderColor: '#448461', borderWidth: 1, marginBottom: 5, marginTop: 20, alignSelf: 'center', justifyContent: 'center' },
    plantCardUsername: { fontSize: 14, color: '#448461', marginBottom: 10, justifyContent: 'center', alignSelf: 'center' },
    plantCardHeartButton: { width: 24, height: 24, alignSelf: 'flex-end', marginRight: 10 },
    plantCardBottomSection: { padding: 10, paddingHorizontal: 20, paddingBottom: 20 },
    plantCardName: { fontSize: 16, fontWeight: 'bold', color: '#448461', marginBottom: 4 },
    plantCardDescription: {
        fontSize: 13,
        color: '#666',
        numberOfLines: 6,
    },
});

export default ArticleCard;