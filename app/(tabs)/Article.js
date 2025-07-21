// File: src/app/ArticleScreen.js

import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    TextInput,
    FlatList,
    Animated,
    Keyboard,
    Alert
} from 'react-native';
import { useFonts } from 'expo-font';
import {
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_300Light,
    Nunito_500Medium
} from '@expo-google-fonts/nunito';
import { useJournalAndArticle } from '../../context/JournalAndArticleStore';
import { router } from 'expo-router'; // Import router from expo-router

// =============================================================================
// Start of Merged Components
// =============================================================================

// Helper function to truncate text for preview
const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Component from plantcard.js
const PlantCard = ({ item, selectionMode, selectedItems, toggleSelection, onCardPress, enterSelectionMode, isLiked, toggleLike }) => {
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
            toggleLike(item.id); // Use parent's toggleLike
        });
    };

    return (
        <TouchableOpacity
            style={styles.plantCardWrapper}
            onLongPress={() => enterSelectionMode(item.id)}
            onPress={() => selectionMode ? toggleSelection(item.id) : onCardPress(item)} // Call onCardPress
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
                                ? require('../../assets/images/checkbox_checked.png')
                                : require('../../assets/images/checkbox_unchecked.png')
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
                                        ? require('../../assets/images/like_active.png')
                                        : require('../../assets/images/like_inactive.png')
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
                    {/* Display truncated fullArticle for preview */}
                    <Text style={styles.plantCardDescription}>
                        {truncateText(item.fullArticle, 50)} {/* Display 250 characters from fullArticle */}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// Component from detail.js
export function DetailScreen({ plant, isLiked, toggleLike, onBack }) {
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
    });

    if (!fontsLoaded) {
        return null;
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
                    <Image source={require('../../assets/images/weui_back-outlined.png')} style={styles.detailHeaderIcon} />
                </TouchableOpacity>
                <Text style={styles.detailHeaderText}>Article</Text>
                <TouchableOpacity onPress={handleLikePress} style={styles.detailHeaderButton}>
                    <Animated.Image
                        source={
                            isLiked
                                ? require('../../assets/images/like_active.png')
                                : require('../../assets/images/like_inactive.png')
                        }
                        style={[styles.detailHeaderIcon, { transform: [{ scale: scaleAnim }] }]}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.detailScrollContent}>
                <View style={styles.detailTopImageSection}>
                    <Image source={plant.image} style={styles.detailMainPlantImage} />
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

                    <Text style={styles.detailFullArticleText}>
                        {plant.fullArticle}
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

// =============================================================================
// End of Merged Components
// =============================================================================

// Initial static data for other categories (not 'publish')
const initialData = [
    {
        id: '1',
        name: 'How to Plant a New Houseplant',
        description: 'A beginner-friendly guide to planting any houseplant, from pot selection to first watering.',
        image: require('../../assets/images/caramenyiram.png'),
        avatar: require('../../assets/images/Logo.png'),
        username: 'Growie',
        category: 'growie',
        date: 'July 1, 2025',
        photoOfTheDayImage: require('../../assets/images/alatgardening.png'),
        quote: '"Every thriving plant begins with good planting habits."',
        fullArticle: `Planting a new houseplant is the first step toward a greener, fresher home. Whether you're working with a leafy tropical, a small succulent, or a flowering variety, the basic planting process is similar.

Start by choosing a pot with drainage holes to prevent root rot. Fill the bottom with a bit of potting mix, then gently place your plant into the pot. Add soil around the roots, pressing lightly to eliminate air pockets and support the plant.

Once planted, water the soil slowly until it’s evenly moist and a bit drains from the bottom. Avoid placing your plant in direct sunlight right away—give it time to adjust in a bright, indirect light area.

Over the next few days, monitor soil moisture and avoid overwatering.

Remember: every plant has different needs, so always check light and water preferences for your specific plant type.
With patience and care, you’ll set your new plant up for long-term health and vibrant growth.
`
    },
    {
        id: '2',
        name: 'Fiddle Leaf Fig',
        description: 'A popular indoor tree with large, violin-shaped leaves.',
        image: require('../../assets/images/plant.png'),
        avatar: require('../../assets/images/pp.jpg'),
        username: 'User123',
        category: 'latest',
        date: 'June 28, 2025',
        photoOfTheDayImage: require('../../assets/images/plant.png'),
        quote: '"Standing tall and bringing joy."',
        fullArticle: `My Fiddle Leaf Fig is finally thriving! After a bit of a struggle with leaf drop, I found the perfect spot for it with consistent bright, indirect light. It's been a journey, but seeing new leaves unfurl makes it all worth it.

I've learned that consistency is key with these beauties. They don't like sudden changes in temperature or light. Also, proper watering is crucial – I make sure the soil is mostly dry before giving it a good soak.

If you're thinking of getting a Fiddle Leaf Fig, be patient! They can be a bit dramatic, but with the right care, they truly become the centerpiece of any room.
`
    },
    {
        id: '3',
        name: 'Snake Plant',
        description: 'Extremely hardy and low-maintenance, perfect for beginners.',
        image: require('../../assets/images/plant.png'),
        avatar: require('../../assets/images/pp.jpg'),
        username: 'GreenThumb',
        category: 'trending',
        date: 'July 2, 2025',
        photoOfTheDayImage: require('../../assets/images/plant.png'),
        quote: '"Unbothered and thriving."',
        fullArticle: `The Snake Plant continues to be my most reliable houseplant. It literally thrives on neglect, making it perfect for busy individuals or those new to plant care. I water it maybe once a month, sometimes even less.

Its upright, sword-like leaves add a modern touch to any decor, and it's also excellent for air purification. I have one in my bedroom and one in the living room, and they always look great with minimal effort.

If you want a plant that won't give you any trouble, the Snake Plant is definitely the way to go. It's almost impossible to kill!
`
    },
    {
        id: '4',
        name: 'How to Water Your Plant',
        description: 'Learn when, how much, and how often to water your houseplants to keep them healthy and thriving.',
        image: require('../../assets/images/Watering.png'),
        avatar: require('../../assets/images/Logo.png'),
        username: 'Growie',
        category: 'growie',
        date: 'July 3, 2025',
        photoOfTheDayImage: require('../../assets/images/alatgardening.png'),
        quote: '"Water with care not too much, not too little."',
        fullArticle: `Watering seems simple, but it’s one of the most common reasons plants thrive—or die. The key is understanding your plant’s needs and checking the soil before every watering.

Start by feeling the top inch of soil. If it’s dry, it’s usually time to water. For most houseplants, watering once a week is enough, but factors like sunlight, humidity, and pot type can affect how often you need to water.

When watering, go slow and deep. Pour until water starts to drain from the bottom — this ensures the roots get enough. Avoid shallow watering, which only wets the surface and encourages weak root growth.

Always empty excess water from the tray or saucer to prevent root rot. Overwatering is more dangerous than underwatering for most plants.

Pay attention to signs: drooping, yellowing leaves, or soggy soil may indicate overwatering. Dry, crispy leaves can signal it’s too little. With practice, you’ll develop a rhythm your plants will love.`
    },
    {
        id: '5',
        name: 'ZZ Plant',
        description: 'Drought-tolerant, shiny leaves, thrives on neglect.',
        image: require('../../assets/images/plant.png'),
        avatar: require('../../assets/images/pp.jpg'),
        username: 'LazyGardener',
        category: 'latest',
        date: 'June 29, 2025',
        photoOfTheDayImage: require('../../assets/images/plant.png'),
        quote: '"Thriving on pure neglect."',
        fullArticle: `The ZZ Plant truly lives up to to its reputation as a "set it and forget it" plant. Its shiny, dark green leaves always look vibrant, even if I forget to water it for weeks. It's incredibly drought-tolerant thanks to its rhizomes that store water.

I have it in a corner of my office that doesn't get much light, and it's perfectly happy. If you travel a lot or simply want a plant that doesn't demand much attention, the ZZ Plant is your best friend.

Seriously, if you think you have a black thumb, try a ZZ plant. It's almost foolproof!
`
    },
    {
        id: '6',
        name: 'Peace Lily',
        description: 'Elegant plant with white spathes, purifies air.',
        image: require('../../assets/images/peacelily.png'),
        avatar: require('../../assets/images/pp.jpg'),
        username: 'BloomBuddy',
        category: 'trending',
        date: 'July 4, 2025',
        photoOfTheDayImage: require('../../assets/images/peacelily.png'),
        quote: '"Flowering peace in every corner."',
        fullArticle: `My Peace Lily just bloomed again, and its white spathes are so elegant! This plant is not only beautiful but also a fantastic air purifier. It's quite communicative too; its leaves droop dramatically when it needs water, making it easy to care for.

I keep it in a spot with medium, indirect light, and it seems to love the humidity from my bathroom. It's a classic houseplant for a reason—it's graceful, relatively easy, and benefits your indoor air quality.

Highly recommend a Peace Lily if you want a plant that adds beauty and purpose to your home.
`
    },
];

function ArticleScreen({ navigation }) {
    // Memberikan nilai default [] untuk publishedArticles untuk menghindari error
    const { publishedArticles = [] } = useJournalAndArticle();
    const [activeTab, setActiveTab] = useState('all');
    const [plants, setPlants] = useState(initialData);
    const [searchQuery, setSearchQuery] = useState('');

    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [likedItems, setLikedItems] = useState(new Set()); // Global state for liked items

    // State to manage showing the detail screen
    const [showArticleDetail, setShowArticleDetail] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);

    // Menggabungkan publishedArticles ke dalam data `plants`
    useEffect(() => {
        // Buat salinan initialData
        const combinedData = [...initialData];
        // Tambahkan artikel dari publishedArticles jika belum ada
        publishedArticles.forEach(pubArticle => {
            if (!combinedData.some(item => item.id === pubArticle.id)) {
                combinedData.push(pubArticle);
            }
        });
        setPlants(combinedData);
    }, [publishedArticles]);

    const toggleLike = useCallback((itemId) => {
        setLikedItems(prevLikedItems => {
            const newLikedItems = new Set(prevLikedItems);
            if (newLikedItems.has(itemId)) {
                newLikedItems.delete(itemId);
            } else {
                newLikedItems.add(itemId);
            }
            return newLikedItems;
        });
    }, []);

    const tabs = [
        { key: 'all', label: 'All' },
        { key: 'publish', label: 'My Publish' },
        { key: 'growie', label: 'From growie' },
        { key: 'latest', label: 'Latest' },
        { key: 'trending', label: 'Trending' },
    ];

    const toggleSelection = (itemId) => {
        if (selectedItems.includes(itemId)) {
            setSelectedItems(selectedItems.filter((id) => id !== itemId));
        } else {
            setSelectedItems([...selectedItems, itemId]);
        }
    };

    const enterSelectionMode = (itemId) => {
        setSelectionMode(true);
        setSelectedItems([itemId]);
    };

    const exitSelectionMode = () => {
        setSelectionMode(false);
        setSelectedItems([]);
    };

    const handleDeleteSelected = () => {
        if (selectedItems.length === 0) {
            Alert.alert('No Items Selected', 'Please select at least one item to delete.');
            return;
        }

        const deletableItems = plants.filter(item => selectedItems.includes(item.id) && item.category === 'publish');
        const nonDeletableItems = selectedItems.filter(id => {
            const item = plants.find(plant => plant.id === id);
            return item && item.category !== 'publish';
        });

        if (nonDeletableItems.length > 0 && deletableItems.length === 0) {
            Alert.alert('Deletion Restricted', 'Only articles with the category "My Publish" can be deleted.');
            return;
        }

        if (nonDeletableItems.length > 0) {
            Alert.alert(
                'Partial Deletion',
                'Some selected items cannot be deleted because they are not from "My Publish" category. Do you want to delete the eligible items?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Delete Eligible',
                        onPress: () => {
                            setPlants(plants.filter(item => !(selectedItems.includes(item.id) && item.category === 'publish')));
                            exitSelectionMode();
                        },
                        style: 'destructive',
                    },
                ],
                { cancelable: true }
            );
        } else {
            Alert.alert(
                'Confirm Deletion',
                `Are you sure you want to delete ${selectedItems.length} selected item(s)?`,
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Delete',
                        onPress: () => {
                            setPlants(plants.filter((item) => !selectedItems.includes(item.id)));
                            exitSelectionMode();
                        },
                        style: 'destructive',
                    },
                ],
                { cancelable: true }
            );
        }
    };

    const filteredPlants = React.useMemo(() => {
        let currentPlants = []; // Initialize with an empty array

        if (activeTab === 'all') {
            // For 'All' tab, use combined initialData and publishedArticles
            currentPlants = plants;
        } else if (activeTab === 'publish') {
            // For 'My Publish' tab, only use publishedArticles
            currentPlants = publishedArticles;
        } else {
            // For other tabs, filter from all available data (initialData + publishedArticles)
            currentPlants = plants.filter(item => item.category === activeTab);
        }

        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            currentPlants = currentPlants.filter(item =>
                item.name.toLowerCase().includes(lowerCaseQuery) ||
                item.description.toLowerCase().includes(lowerCaseQuery) ||
                item.username.toLowerCase().includes(lowerCaseQuery) ||
                item.fullArticle.toLowerCase().includes(lowerCaseQuery) // Also search in fullArticle
            );
        }

        return currentPlants;
    }, [activeTab, plants, searchQuery, publishedArticles]); // Add publishedArticles as a dependency

    const handleCardPress = (plant) => {
        setSelectedArticle(plant);
        setShowArticleDetail(true);
};

    const handleBackFromDetail = () => {
        setShowArticleDetail(false);
        setSelectedArticle(null);
    };

    const renderItem = ({ item }) => (
        <PlantCard
            item={item}
            selectionMode={selectionMode}
            selectedItems={selectedItems}
            toggleSelection={toggleSelection}
            onCardPress={handleCardPress} // Pass the new handler
            enterSelectionMode={enterSelectionMode}
            isLiked={likedItems.has(item.id)} // Pass liked status
            toggleLike={toggleLike} // Pass toggle function
        />
    );
    let [fontsLoaded] = useFonts({
        Nunito_400Regular,
        Nunito_700Bold,
        Nunito_300Light,
        Nunito_500Medium,
    });

    if (!fontsLoaded) {
        return null;
    }

    const handleAdd = () => {
        Alert.alert('Add Button Pressed', 'You tapped the add button! Implement your add logic here.');
    };

    if (showArticleDetail && selectedArticle) {
        return (
            <DetailScreen
                plant={selectedArticle}
                isLiked={likedItems.has(selectedArticle.id)}
                toggleLike={toggleLike}
                onBack={handleBackFromDetail} // Pass the new back handler
            />
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light-content" />

            <View style={styles.header}>
                {selectionMode ? (
                    <TouchableOpacity onPress={exitSelectionMode} style={styles.headerButtonBatal}>
                        <Text style={styles.headerButtonTextContent}>Cancel</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.headerIcon}
                        onPress={() => navigation.goBack()} // Keep navigation for the main tab back button
                    >
                        <Image source={require('../../assets/images/weui_back-outlined.png')} />
                    </TouchableOpacity>
                )}

                <Text style={styles.headerText}>Article</Text>

                {selectionMode && (
                    <TouchableOpacity onPress={handleDeleteSelected} style={styles.headerButtonHapus}>
                        <Text style={styles.headerButtonTextContent}>Delete ({selectedItems.length})</Text>
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.search}>
                <TouchableOpacity>
                    <Image source={require('../../assets/images/search.png')} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
                <TextInput
                    placeholder="Search articles"
                    style={{ flex: 1, fontSize: 16, marginLeft: 10, fontFamily: 'Nunito_400Regular' }}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    returnKeyType="search"
                    onSubmitEditing={Keyboard.dismiss}
                    editable={!selectionMode}
                />
            </View>

            <View style={styles.filterContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContainergeser}>
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab.key}
                            style={[styles.tabButton, activeTab === tab.key && styles.activeTab]}
                            onPress={() => setActiveTab(tab.key)}
                            disabled={selectionMode}
                        >
                            <Text style={[styles.tabText, activeTab === tab.key && styles.activeText]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredPlants}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingVertical: 20, paddingBottom: 100 }}
                ListEmptyComponent={() => (
                    <View style={styles.emptyListContainer}>
                        <Text style={styles.emptyListText}>No articles matching your criteria.</Text>
                    </View>
                )}
            />

            <TouchableOpacity style={styles.fab} onPress={handleAdd}>
                <Image
                    source={require('../../assets/images/add.png')}
                    style={styles.fabIcon}
                />
            </TouchableOpacity>
        </View>
    );
}

export default ArticleScreen;

const styles = StyleSheet.create({
    // Styles from original article.js
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        fontFamily: 'Nunito_400Regular',
        height: 60,
        width: '100%',
        marginTop: 50,
        paddingHorizontal: 20,
        position: 'relative',
    },
    headerIcon: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 20,
        zIndex: 1,
    },
    headerText: {
        fontFamily: 'Nunito_700Bold',
        fontSize: 20,
        color: '#448461',
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        zIndex: 0,
    },
    headerButtonHapus: {
        fontFamily: 'Nunito_400Regular',
        position: 'absolute',
        right: 20,
        backgroundColor: '#448461',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    headerButtonBatal: {
        position: 'absolute',
        marginLeft: 20,
        backgroundColor: '#A9A8A8',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    headerButtonTextContent: {
        fontSize: 14,
        color: 'white',
        fontFamily: 'Nunito_700Bold',
    },
    search: {
        flexDirection: 'row',
        width: 360,
        height: 40,
        backgroundColor: '#FBF2D6',
        alignItems: 'center',
        alignSelf: 'center',
        margin: 5,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    filterContainer: { flexDirection: 'row', marginTop: 5, marginLeft: 30 },
    filterContainergeser: { paddingVertical: 5, paddingRight: 20 },
    tabButton: { borderWidth: 1, borderColor: '#448461', borderRadius: 15, paddingVertical: 8, paddingHorizontal: 16, marginHorizontal: 5 },
    activeTab: { backgroundColor: '#448461' },
    tabText: { color: '#448461', fontSize: 14, fontFamily: 'Nunito_400Regular' },
    activeText: { color: 'white', fontWeight: 'bold' },
    emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 50,
    },
    emptyListText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        fontFamily: 'Nunito_400Regular'
    },
    fab: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 110,
        borderRadius: 30,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    fabIcon: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
    },

    // Styles from plantcard.js (prefixed with 'plantCard')
    plantCardWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        width: 330,
        alignSelf: 'center',
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
    plantCardImage: { width: 230, height: 150, resizeMode: 'cover' },
    plantCardRightInfo: { backgroundColor: '#DCF0E4', width: 100, paddingVertical: 10 },
    plantCardAvatar: { width: 50, height: 50, borderRadius: 30, borderColor: '#448461', borderWidth: 1, marginBottom: 5, marginTop: 20, alignSelf: 'center', justifyContent: 'center' },
    plantCardUsername: { fontSize: 14, color: '#448461', marginBottom: 10, justifyContent: 'center', alignSelf: 'center' },
    plantCardHeartButton: { width: 24, height: 24, alignSelf: 'flex-end', marginRight: 10 },
    plantCardBottomSection: { padding: 10, paddingHorizontal: 20, paddingBottom: 20 },
    plantCardName: { fontSize: 16, fontWeight: 'bold', color: '#448461', marginBottom: 4 },
    plantCardDescription: {
        fontSize: 13,
        color: '#666',
        numberOfLines: 4, // Limit to 4 lines for preview
    },

    // Styles from detail.js (prefixed with 'detail')
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
        fontFamily: 'Nunito_700Bold',
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
        marginBottom: 60
    },
});
