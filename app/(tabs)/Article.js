import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef } from 'react';
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
  Nunito_700Bold,
  Nunito_400Regular,
  Nunito_300Light,
  Nunito_600SemiBold,
  Nunito_500Medium
} from '@expo-google-fonts/nunito';
import { useNavigation } from '@react-navigation/native';

// PlantCard Component (Moved from (tabs)/Articledetail/plantcard.js)
const PlantCard = ({ item, selectionMode, selectedItems, toggleSelection, enterSelectionMode, onCardPress, onToggleLike }) => {
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
    ]).start();
    onToggleLike(item.id); // Call the parent's toggle like function
  };

  return (
    <TouchableOpacity
      style={styles.cardWrapper}
      onLongPress={() => enterSelectionMode(item.id)}
      onPress={() => selectionMode ? toggleSelection(item.id) : onCardPress(item)}
      activeOpacity={0.9}
    >
      {selectionMode && (
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => toggleSelection(item.id)}
        >
          <Image
            source={
              selectedItems.includes(item.id)
                ? require('../../assets/images/checkbox_checked.png')
                : require('../../assets/images/checkbox_unchecked.png')
            }
            style={styles.checkboxIcon}
          />
        </TouchableOpacity>
      )}
      <View style={[styles.card, selectionMode && styles.cardShrink]}>
        <View style={styles.topSection}>
          <Image source={item.image} style={styles.plantImage} />
          <View style={styles.rightInfo}>
            <TouchableOpacity onPress={handleLike} activeOpacity={0.8}>
              <Animated.Image
                source={
                  item.liked // Use item.liked directly
                    ? require('../../assets/images/like_active.png')
                    : require('../../assets/images/like_inactive.png')
                }
                style={[styles.heartButton, { transform: [{ scale: scaleAnim }] }]}
              />
            </TouchableOpacity>
            <Image source={item.avatar} style={styles.avatar} />
            <Text style={styles.username}>{item.username}</Text>
          </View>
        </View>
        <View style={styles.bottomSection}>
          <Text style={styles.plantName}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// DetailScreen Component (Moved from (tabs)/Articledetail/detail.js)
const DetailScreen = ({ plant, onBack, onToggleLike }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleLike = () => {
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
    ]).start();
    onToggleLike(plant.id); // Call the parent's toggle like function
  };

  return (
    <View style={styles.detailScreenContainer}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
        translucent={false}
      />

      <View style={styles.detailScreenHeader}>
        <TouchableOpacity onPress={onBack} style={styles.detailScreenHeaderButton}>
          <Image source={require('../../assets/images/weui_back-outlined.png')} style={styles.detailScreenHeaderIcon} />
        </TouchableOpacity>
        <Text style={styles.detailScreenHeadertext}>Article</Text>
        <TouchableOpacity onPress={handleLike} style={styles.detailScreenHeaderButton}>
          <Animated.Image
            source={
              plant.liked // Use plant.liked directly
                ? require('../../assets/images/like_active.png')
                : require('../../assets/images/like_inactive.png')
            }
            style={[styles.detailScreenHeaderIcon, { transform: [{ scale: scaleAnim }] }]}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.detailScreenScrollContent}>
        <View style={styles.detailScreenTopImageSection}>
          <Image source={plant.image} style={styles.detailScreenMainPlantImage} />
          <View style={styles.detailScreenOverlayInfo}>
            <Image source={plant.avatar} style={styles.detailScreenAvatar} />
            <Text style={styles.detailScreenUsername}>{plant.username}</Text>
          </View>
        </View>

        <View style={styles.detailScreenContentSection}>
          <Text style={styles.detailScreenPlantName}>{plant.name}</Text>
          <Text style={styles.detailScreenDateText}>Date: {plant.date}</Text>

          <Text style={styles.detailScreenSectionTitle}>📸 Photo of the Day</Text>
          <Image source={plant.photoOfTheDayImage} style={styles.detailScreenPhotoOfDayImage} />
          <Text style={styles.detailScreenQuoteText}>{plant.quote}</Text>

          <Text style={styles.detailScreenFullArticleText}>
            {plant.fullArticle}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};


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
`,
    liked: false // Added liked property
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
`,
    liked: false // Added liked property
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
`,
    liked: false // Added liked property
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

  Pay attention to signs: drooping, yellowing leaves, or soggy soil may indicate overwatering. Dry, crispy leaves can signal it’s too little. With practice, you’ll develop a rhythm your plants will love.`,
    liked: false // Added liked property
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
`,
    liked: false // Added liked property
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
`,
    liked: false // Added liked property
  },
  {
    id: '7',
    name: 'My Custom Plant',
    description: 'A plant I have grown myself!',
    image: require('../../assets/images/customplant.png'),
    avatar: require('../../assets/images/pp.jpg'),
    username: 'MySelf',
    category: 'publish',
    date: 'July 7, 2025',
    photoOfTheDayImage: require('../../assets/images/plant.png'),
    quote: '"My green creation, growing strong!"',
    fullArticle: `Today marks a milestone for my custom plant project! I've been cultivating this unique specimen from a tiny seedling, and it's finally showing its true colors. The leaves are developing a fascinating pattern that I haven't seen before.

It's been a rewarding challenge, experimenting with different soil mixes and light conditions to find what works best. This plant is a true testament to the joy of growing something entirely your own.

I'll keep sharing updates as it matures. Stay tuned for more on this exciting journey!
`,
    liked: false // Added liked property
  },
];

function ArticleScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('all');
  const [plants, setPlants] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const [showArticleDetail, setShowArticleDetail] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

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
      const item = plants.find(p => p.id === id);
      return item && item.category !== 'publish';
    });

    if (nonDeletableItems.length > 0 && deletableItems.length === 0) {
      Alert.alert(
        'Deletion Restricted',
        'You can only delete articles with the "My Publish" category.'
      );
      return;
    }

    if (nonDeletableItems.length > 0 && deletableItems.length > 0) {
      Alert.alert(
        'Mixed Selection',
        `Some selected items are not in the "My Publish" category and cannot be deleted. Are you sure you want to delete the ${deletableItems.length} deletable item(s)?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: () => {
              setPlants(plants.filter((item) => !(selectedItems.includes(item.id) && item.category === 'publish')));
              exitSelectionMode();
            },
            style: 'destructive',
          },
        ],
        { cancelable: true }
      );
      return;
    }

    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete ${deletableItems.length} selected item(s)?`,
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
  };

  // Function to toggle the liked status of a plant
  const handleToggleLike = (id) => {
    setPlants(prevPlants =>
      prevPlants.map(plant =>
        plant.id === id ? { ...plant, liked: !plant.liked } : plant
      )
    );
    // If the article is currently in detail view, update its liked status as well
    if (selectedArticle && selectedArticle.id === id) {
      setSelectedArticle(prevArticle => ({ ...prevArticle, liked: !prevArticle.liked }));
    }
  };

  const filteredPlants = React.useMemo(() => {
    let currentPlants = plants;

    if (activeTab !== 'all') {
      currentPlants = currentPlants.filter(item => item.category === activeTab);
    }

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currentPlants = currentPlants.filter(item =>
        item.name.toLowerCase().includes(lowerCaseQuery) ||
        item.description.toLowerCase().includes(lowerCaseQuery) ||
        item.username.toLowerCase().includes(lowerCaseQuery)
      );
    }

    return currentPlants;
  }, [activeTab, plants, searchQuery]);

  const handleCardPress = (item) => {
    setSelectedArticle(item);
    setShowArticleDetail(true);
  };

  const handleDetailBack = () => {
    setShowArticleDetail(false);
    setSelectedArticle(null);
  };

  const renderItem = ({ item }) => (
    <PlantCard
      item={item}
      selectionMode={selectionMode}
      selectedItems={selectedItems}
      toggleSelection={toggleSelection}
      enterSelectionMode={enterSelectionMode}
      onCardPress={handleCardPress}
      onToggleLike={handleToggleLike} // Pass the new toggle like function
    />
  );

  let [fontsLoaded] = useFonts({
    Nunito_700Bold,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_500Medium,
    Nunito_300Light
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleAdd = () => {
    Alert.alert('Add Button Pressed', 'You tapped the add button! Implement your add logic here.');
  };

  if (showArticleDetail && selectedArticle) {
    return <DetailScreen plant={selectedArticle} onBack={handleDetailBack} onToggleLike={handleToggleLike} />; // Pass the new toggle like function
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
            onPress={() => navigation.goBack()}
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
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
  activeText: { color: 'white', fontWeight: 'bold', fontFamily: 'Nunito_700Bold' },

  cardWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: 330,
    alignSelf: 'center',
  },
  checkboxContainer: {
    width: 30,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxIcon: {
    width: 24,
    height: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    flex: 1,
  },
  cardShrink: {
    width: 400,
  },
  topSection: { flexDirection: 'row' },
  plantImage: { width: 230, height: 150, resizeMode: 'cover' },
  rightInfo: { backgroundColor: '#DCF0E4', width: 100, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, position: 'relative' },
  avatar: { width: 50, height: 50, borderRadius: 30, borderColor: '#448461', borderWidth: 1, marginBottom: 5, marginTop: 20 },
  username: { fontSize: 14, color: '#448461', marginBottom: 10, fontFamily: 'Nunito_600SemiBold' },
  heartButton: { width: 24, height: 24, top: 5, left:20, alignSelf:'flex-end' },
  bottomSection: { padding: 10, paddingHorizontal: 20, paddingBottom: 20 },
  plantName: { fontSize: 16, fontWeight: 'bold', color: '#448461', marginBottom: 4, fontFamily: 'Nunito_700Bold' },
  description: { fontSize: 13, color: '#666', fontFamily: 'Nunito_400Regular' },
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
    fontFamily: 'Nunito_400Regular',
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

  // DetailScreen specific styles (prefixed)
  detailScreenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  detailScreenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    width: '100%',
    marginTop: 50,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  detailScreenHeaderButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailScreenHeaderIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  detailScreenHeadertext: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#448461',
    textAlign: 'center',
    fontFamily: 'Nunito_700Bold',
  },
  detailScreenScrollContent: {
    paddingBottom: 20,
  },
  detailScreenTopImageSection: {
    width: '100%',
    height: 250,
    position: 'relative',
  },
  detailScreenMainPlantImage: {
    borderTopLeftRadius: 10,
    borderTopRightRadius:10,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailScreenOverlayInfo: {
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
  detailScreenAvatar: {
    width: 50,
    height: 50,
    borderRadius: 30,
    borderColor: '#fff',
    borderWidth: 1,
    marginRight: 10,
  },
  detailScreenUsername: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Nunito_700Bold', // Changed to Nunito
  },
  detailScreenContentSection: {
    padding: 20,
  },
  detailScreenPlantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#448461',
    marginBottom: 5,
    fontFamily: 'Nunito_700Bold', // Changed to Nunito
  },
  detailScreenDateText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Nunito_400Regular', // Changed to Nunito
    marginBottom: 20,
  },
  detailScreenSectionTitle: {
    fontSize: 16,
    color: '#448461',
    marginTop: 10,
    fontFamily: 'Nunito_700Bold', // Changed to Nunito
    marginBottom: 10,
  },
  detailScreenPhotoOfDayImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 10,
  },
  detailScreenQuoteText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginVertical: 15,
    paddingHorizontal: 10,
    fontFamily: 'Nunito_400Regular', // Changed to Nunito
  },
  detailScreenFullArticleText: {
    fontSize: 15,
    color: '#333',
    fontFamily: 'Nunito_400Regular', // Changed to Nunito
    lineHeight: 22,
    marginTop: 10,
    marginBottom:60
  },
});
