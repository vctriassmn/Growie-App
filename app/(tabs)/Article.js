// article 
// File: growiie kirim/app/(tabs)/Article.js
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    TextInput,
    FlatList,
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
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import ArticleCard from './ArticleComponents/ArticleCard';

export const initialData = [
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
        image: require('../../assets/images/peacelily.png'),
        avatar: require('../../assets/images/pp.jpg'),
        username: 'GreenThumb',
        category: 'trending',
        date: 'July 2, 2025',
        photoOfTheDayImage: require('../../assets/images/plant.png'),
        quote: '"Unbothered and thriving."',
        fullArticle: `The Snake Plant continues to be my most reliable houseplant. It literally thrives on neglect, making it perfect for busy individuals or those new to plant care. I water it maybe once a month, sometimes even less.

Its upright, sword-like leaves add a modern touch to any decor, and it's also excellent for air purification. I have one in my bedroom and one in the living room, and they always look great with minimal effort.

If you want a plant that won't give you any trouble, the Snake Plant is definitely the way to go. It's almost foolproof!
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
    {
  id: '7',
  name: 'Tips Merawat Pohon Berry',
  description: 'Panduan lengkap merawat pohon berry agar tumbuh subur dan berbuah lebat.',
  image: require('../../assets/images/peacelily.png'), // ganti dengan path gambar pohon berry
  avatar: require('../../assets/images/pp.jpg'),
  username: 'BerryGardener',
  category: 'trending',
  date: '7 Juli 2025',
  photoOfTheDayImage: require('../../assets/images/peacelily.png'), 
  quote: '"Rawat dengan cinta, panen berry yang manis akan datang."',
  fullArticle: `Merawat pohon berry memang membutuhkan perhatian khusus agar tanaman dapat tumbuh sehat dan menghasilkan buah yang maksimal. Berikut ini beberapa tips penting yang dapat membantu kamu dalam merawat pohon berry:

1. Pemilihan Lokasi Tanam 
Pilih tempat yang mendapatkan sinar matahari penuh minimal 6-8 jam sehari. Pohon berry menyukai cahaya matahari yang cukup untuk fotosintesis optimal.

2. Media Tanam yang Subur dan Drainase Baik 
Gunakan tanah yang kaya bahan organik dan memiliki sistem drainase yang baik agar akar tidak tergenang air, yang bisa menyebabkan akar membusuk.

3. Penyiraman yang Tepat 
Pohon berry membutuhkan kelembapan tanah yang konsisten, terutama saat musim kemarau atau saat tanaman mulai berbuah. Siram secara rutin tapi hindari overwatering.

4. Pemupukan Rutin
Berikan pupuk kompos atau pupuk organik setiap 2-3 minggu sekali untuk mendukung pertumbuhan dan pembentukan buah. Pupuk dengan kandungan nitrogen, fosfor, dan kalium seimbang sangat dianjurkan.

5. Pemangkasan 
Lakukan pemangkasan ranting yang kering atau terlalu rimbun agar sirkulasi udara baik dan cahaya bisa merata ke seluruh tanaman. Ini juga membantu mencegah penyakit.

6. Pengendalian Hama dan Penyakit  
Periksa tanaman secara berkala dari serangan hama seperti kutu daun, ulat, atau jamur. Gunakan insektisida organik atau pestisida ramah lingkungan jika diperlukan.

7. Perhatikan Waktu Panen
Panen buah berry saat sudah matang sempurna agar mendapatkan rasa manis dan nutrisi maksimal. Biasanya buah akan berubah warna dan mudah dipetik.

Dengan perawatan yang telaten dan konsisten, pohon berry kamu akan tumbuh subur dan memberikan hasil panen yang melimpah setiap musimnya. Selamat mencoba dan nikmati manisnya buah berry hasil kerja kerasmu!`
  ,
  isLiked: false
},

];

function ArticleScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { publishedArticles, deletePublishedArticles, likedArticles = new Set(), toggleLike } = useJournalAndArticle();
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    useFocusEffect(
        useCallback(() => {
            if (params.article) {
                router.setParams({ article: undefined });
            }
            setSelectionMode(false);
            setSelectedItems([]);
        }, [params.article])
    );
    
    // Perbaikan: Menggunakan useMemo untuk menghindari loop tak terbatas.
    const allArticles = useMemo(() => {
        const combinedData = [...initialData];
        publishedArticles.forEach(pubArticle => {
            if (!combinedData.some(item => item.id === pubArticle.id)) {
                combinedData.push(pubArticle);
            }
        });
        return combinedData;
    }, [publishedArticles]);

    const filteredPlants = useMemo(() => {
        let currentPlants = [];

        if (activeTab === 'all') {
            currentPlants = allArticles;
        } else if (activeTab === 'publish') {
            currentPlants = publishedArticles;
        } else {
            currentPlants = allArticles.filter(item => item.category === activeTab);
        }

        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            currentPlants = currentPlants.filter(item =>
                item.name.toLowerCase().includes(lowerCaseQuery) ||
                item.description.toLowerCase().includes(lowerCaseQuery) ||
                item.username.toLowerCase().includes(lowerCaseQuery) ||
                item.fullArticle.toLowerCase().includes(lowerCaseQuery)
            );
        }

        return currentPlants;
    }, [activeTab, searchQuery, allArticles, publishedArticles]);

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

        const deletableItems = allArticles.filter(item => selectedItems.includes(item.id) && item.category === 'publish');
        const nonDeletableItems = selectedItems.filter(id => {
            const item = allArticles.find(plant => plant.id === id);
            return item && item.category !== 'publish';
        });

        if (nonDeletableItems.length > 0 && deletableItems.length === 0) {
            Alert.alert(
                'Deletion Restricted',
                'Only articles with the category "My Publish" can be deleted.'
            );
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
                            // Panggil fungsi baru untuk menghapus artikel yang dipublikasikan
                            deletePublishedArticles(deletableItems.map(item => item.id));
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
                            // Panggil fungsi baru untuk menghapus artikel yang dipublikasikan
                            deletePublishedArticles(selectedItems);
                            exitSelectionMode();
                        },
                        style: 'destructive',
                    },
                ],
                { cancelable: true }
            );
        }
    };

    const handleCardPress = (article) => {
        router.push({
            pathname: `/(tabs)/ArticleComponents/${article.id}`,
        });
    };

    const renderItem = ({ item }) => (
        <ArticleCard
            item={item}
            selectionMode={selectionMode}
            selectedItems={selectedItems}
            toggleSelection={toggleSelection}
            onCardPress={handleCardPress}
            enterSelectionMode={enterSelectionMode}
            isLiked={likedArticles.has(item.id)}
            toggleLike={toggleLike}
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
        router.push('/(tabs)/Journal');
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light-content" />

            <View style={styles.header}>
                {selectionMode && (
                    <TouchableOpacity onPress={exitSelectionMode} style={styles.headerButtonBatal}>
                        <Text style={styles.headerButtonTextContent}>Cancel</Text>
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

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', width: '100%' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        fontFamily: 'Nunito_400Regular',
        height: 60,
        width: '100%',
        marginTop: 50,
        paddingHorizontal: 20,
        position: 'relative',
        justifyContent: 'center',
    },
    headerText: {
        fontFamily: 'Nunito-ExtraBold',
        fontSize: 20,
        color: '#448461',
        position: 'relative',
        textAlign: 'center',
        zIndex: 0,
    },
    headerButtonHapus: {
        fontFamily: 'Nunito_700Bold',
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
        left: 20,
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
        width: '92%',
        height: 40,
        backgroundColor: '#FBF2D6',
        alignItems: 'center',
        alignSelf: 'center',
        margin: 5,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    filterContainer: { flexDirection: 'row', marginTop: 5, marginLeft: 15, marginRight: 15 },
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
});

export default ArticleScreen;