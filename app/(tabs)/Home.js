// Lokasi file: app/(tabs)/Home.js

import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, TouchableOpacity, PanResponder } from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';
import { useReminders } from '../../context/ReminderContext';
import { usePlant } from '../../context/PlantContext'; 
import { getImage } from './MyGarden/getImage';
import { Animated } from 'react-native';


// Data dummy
const latestArticlesData = [
  { id: '1', name: 'How to Plant a New Houseplant', description: 'A beginner-friendly guide to planting any houseplant, from pot selection to first watering.', image: require('../../assets/images/caramenyiram.png'), avatar: require('../../assets/images/Logo.png'), username: 'Growie', liked: false, },
  { id: '2', name: 'Fiddle Leaf Fig', description: 'A popular indoor tree with large, violin-shaped leaves.', image: require('../../assets/images/plant.png'), avatar: require('../../assets/images/pp.jpg'), username: 'User123', liked: true, },
  { id: '3', name: 'Snake Plant', description: 'Extremely hardy and low-maintenance, perfect for beginners.', image: require('../../assets/images/peacelily.png'), avatar: require('../../assets/images/pp.jpg'), username: 'GreenThumb', liked: false, },
];

// Impor Aset
import BellIcon from '../../assets/images/bell.svg';
import ProfileBorderSVG from '../../assets/icons/profile.svg';
const heartIconActive = require('../../assets/images/like_active.png');
const heartIconInactive = require('../../assets/images/like_inactive.png');

// Komponen ArticleCard
const ArticleCard = ({ item, onCardPress, onLikeToggle }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleLikePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.2,
        useNativeDriver: true,
        duration: 5, 
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        duration: 5,
      }),
    ]).start();

    onLikeToggle();
  };

  return (
    <TouchableOpacity style={styles.articleCardWrapper} onPress={() => onCardPress(item)} activeOpacity={0.9}>
      <View style={styles.articleCard}>
        <View style={styles.articleTopSection}>
          <Image source={item.image} style={styles.articleImage} />
          <View style={styles.articleRightInfo}>
            
            {/* Animated Like Button */}
            <TouchableOpacity style={styles.articleLikeButton} onPress={handleLikePress}>
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Image 
                  source={item.liked ? heartIconActive : heartIconInactive} 
                  style={styles.articleLikeIcon} 
                />
              </Animated.View>
            </TouchableOpacity>

            <Image source={item.avatar} style={styles.articleAvatar} />
            <Text style={styles.articleUsername}>{item.username}</Text>
          </View>
        </View>
        <View style={styles.articleBottomSection}>
          <Text style={styles.articleName}>{item.name}</Text>
          <Text 
  style={styles.articleDescription}
  numberOfLines={1}
  ellipsizeMode="tail"
>
  {item.description}
</Text>

        </View>
      </View>
    </TouchableOpacity>
  );
};


// Komponen Utama HomePage
export default function HomePage() {
  const router = useRouter(); 
  const navigation = useNavigation();
  const { getHomeReminders } = useReminders();
  const { userName, profilePicture } = useUser();
  const { plants } = usePlant();
  const [articles, setArticles] = useState(latestArticlesData);
  
  const myGardenPreview = plants.slice(0, 5);
  const homeReminders = getHomeReminders();

  const handleGardenCardPress = (plantId) => {
    // Navigasi ke rute dinamis yang baru
    router.push(`/plant/${plantId}`); 
  };

  const handleLikeToggle = (articleId) => {
    const updatedArticles = articles.map(article =>
      article.id === articleId ? { ...article, liked: !article.liked } : article
    );
    setArticles(updatedArticles);
  };

  const handleReminderPress = (reminder) => {
    const reminderToEdit = {...reminder};
    const params = { title: 'Edit Reminder', reminderData: reminderToEdit };
    setTimeout(() => { navigation.navigate('EditReminder', params); }, 50);
  };

  const scrollViewRef = useRef(null);
  const articleSectionY = useRef(0);
  const [isPanelUp, setIsPanelUp] = useState(false);
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => !isPanelUp && Math.abs(gestureState.dy) > 5,
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.vy < -0.5 || gestureState.dy < -100) scrollToArticle();
        else scrollToTop();
      },
    })
  ).current;

  const scrollToArticle = () => {
    if (scrollViewRef.current && articleSectionY.current > 0) {
      setIsPanelUp(true);
      scrollViewRef.current.scrollTo({ y: articleSectionY.current, animated: true });
    }
  };
  const scrollToTop = () => {
    if (scrollViewRef.current) {
      setIsPanelUp(false);
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar} />

      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContainer} scrollEnabled={!isPanelUp} showsVerticalScrollIndicator={!isPanelUp}>
        <View style={styles.paddedContent}>
            <TouchableOpacity style={styles.header} onPress={() => router.push('/Profile')} activeOpacity={0.8}>
              <View style={styles.profileContainer}>
                <ProfileBorderSVG width="100%" height="100%" style={{ position: 'absolute' }} />
                <Image source={typeof profilePicture === 'string' ? { uri: profilePicture } : profilePicture} style={styles.profileImage} />
              </View>
              <Text style={styles.greetingText}>Hello! {userName}</Text>
            </TouchableOpacity>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>Welcome to Homepage!</Text>
              <TouchableOpacity onPress={() => router.push('/Notification')}>
                <View style={styles.bellContainer}><BellIcon width={24} height={24} /></View>
              </TouchableOpacity>
            </View>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>My garden</Text>
                <TouchableOpacity onPress={() => router.push('/MyGarden')}><Text style={styles.seeMore}>See more</Text></TouchableOpacity>
              </View>
              {myGardenPreview.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 5, paddingVertical: 10 }}>
                  {myGardenPreview.map((plant) => {
                    const imageSource = getImage(plant.image);
                    return(
                      <TouchableOpacity key={plant.id} activeOpacity={0.8} onPress={() => handleGardenCardPress(plant.id)}>
                        <View style={styles.gardenCard}> 
                          <Image source={imageSource} style={styles.gardenImage} />
                          <View style={styles.gardenLabelContainer}>
                            <Text 
                              style={styles.gardenLabel}
                              numberOfLines={2} // Batasi teks menjadi maksimal 2 baris
                              ellipsizeMode="tail" // Tambahkan "..." di akhir jika terpotong
                            >
                              {plant.name}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              ) : (
                <View style={styles.emptyGardenContainer}><Text style={styles.emptyGardenText}>Your garden is empty. Add a plant in "My Garden" tab!</Text></View>
              )}
            </View>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Reminders</Text>
                <TouchableOpacity onPress={() => router.push('/Reminder')}><Text style={styles.seeMore}>See more</Text></TouchableOpacity>
              </View>
              <View>
                {homeReminders.map((reminder) => (
                  <TouchableOpacity key={reminder.id} style={styles.reminderItem} onPress={() => handleReminderPress(reminder)} activeOpacity={0.8}>
                    <Text style={styles.reminderTime}>{reminder.hour}.{reminder.minute}</Text>
                    <Text style={styles.reminderText}>{reminder.title} | {reminder.category}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
        </View>
        <View style={styles.articlesSection} onLayout={(event) => { articleSectionY.current = event.nativeEvent.layout.y; }}>
          <ScrollView scrollEnabled={isPanelUp} showsVerticalScrollIndicator={isPanelUp} contentContainerStyle={{ paddingBottom: 50 }}>
            <View style={styles.articleHeader} {...panResponder.panHandlers}>
                <Text style={styles.sectionTitle}>Articles</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/Article')}><Text style={styles.seeMore}>See more</Text></TouchableOpacity>
            </View>
            {articles.map(article => (
              <ArticleCard key={article.id} item={article} onCardPress={() => router.push({pathname: `/(tabs)/ArticleComponents/${article.id}`})} onLikeToggle={() => handleLikeToggle(article.id)} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const shadowStyle = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 5,
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0FBF0', },
  topBar: {
    height: 45,
  },
  scrollContainer: { paddingBottom: 30, },
  paddedContent: { paddingHorizontal: 20, },

header: {
    backgroundColor: '#FBF2D6',
    padding: 15,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    ...shadowStyle,
  },
  profileContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  greetingText: { fontSize: 20, color: '#333', fontFamily: 'Nunito-SemiBold' },
  welcomeSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20, },
  welcomeTitle: { fontSize: 22, color: '#333', fontFamily: 'Nunito-ExtraBold', marginLeft: 10, },
  bellContainer: { width: 35, height: 35, borderRadius: 22, backgroundColor: '#FBF2D6', justifyContent: 'center', alignItems: 'center', marginRight: 15, ...shadowStyle, },
  section: { backgroundColor: '#D9ECE1', borderRadius: 20, paddingTop: 15, paddingBottom: 15, paddingHorizontal: 15, marginBottom: 35, ...shadowStyle, },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, },
  sectionTitle: { fontSize: 18, color: '#333', fontFamily: 'Nunito-ExtraBold' },
  seeMore: { fontSize: 14, color: '#555', fontFamily: 'Nunito-Regular' },
  
  // --- PERBAIKAN STYLE KARTU TAMAN DI SINI ---
  gardenCard: { 
    backgroundColor: '#FAFFFB', 
    borderRadius: 15, 
    width: 150, 
    height: 180, 
    marginHorizontal: 5, 
    ...shadowStyle, 
  },
  gardenImage: { 
    width: '100%', 
    height: 130, // Sedikit dikurangi untuk memberi lebih banyak ruang untuk teks
    borderTopLeftRadius: 15, 
    borderTopRightRadius: 15 
  },
  // Style baru untuk container teks
  gardenLabelContainer: {
    flex: 1, // Penting: Ambil semua sisa ruang vertikal
    justifyContent: 'center', // Pusatkan teks secara vertikal
    alignItems: 'center', // Pusatkan teks secara horizontal
    paddingHorizontal: 8, // Beri jarak dari tepi kiri-kanan
  },
  gardenLabel: { 
    fontSize: 13, 
    fontWeight: 'bold', 
    color: '#7BAB91', 
    textAlign: 'center', // Penting untuk teks multi-baris
    fontFamily: 'Nunito-SemiBold'
  },
  // ----------------------------------------
  
  emptyGardenContainer: { height: 180, justifyContent: 'center', alignItems: 'center', padding: 10, },
  emptyGardenText: { fontSize: 14, color: '#777', textAlign: 'center', },
  reminderItem: { backgroundColor: '#7BAB91', borderRadius: 15, paddingVertical: 15, paddingHorizontal: 20, marginBottom: 10, borderLeftWidth: 5, borderLeftColor: '#284E43', ...shadowStyle, },
  reminderTime: { fontSize: 18, color: '#fff', fontFamily: 'Nunito-SemiBold' },
  reminderText: { fontSize: 14, color: '#fff', fontFamily: 'Nunito-Regular' },
  articlesSection: { backgroundColor: '#fff', borderTopLeftRadius: 45, borderTopRightRadius: 45, marginTop: 5, flex: 1, shadowColor: "#000", shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 20, },
  articleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20, marginBottom: 5, marginTop: 15},
  articleCardWrapper: { marginBottom: 20, paddingHorizontal: 20, },
  articleCard: { backgroundColor: '#fff', borderRadius: 12, ...shadowStyle, overflow: 'hidden', },
  articleTopSection: { flexDirection: 'row' },
  articleImage: { width: '65%', height: 150, resizeMode: 'cover' },
  articleRightInfo: { backgroundColor: '#DCF0E4', width: '35%', alignItems: 'center', justifyContent: 'center', padding: 10, position: 'relative', },
  articleAvatar: { width: 50, height: 50, borderRadius: 25, borderColor: '#448461', borderWidth: 1, marginBottom: 8, },
  articleUsername: { fontSize: 14, color: '#448461', fontFamily: 'Nunito-SemiBold' },
  articleBottomSection: { paddingVertical: 15, paddingHorizontal: 20, },
  articleName: { 
        fontSize: 16,
        fontFamily: 'Nunito-ExtraBold',
        color: '#448461',
        marginBottom: 4,
   },
  articleDescription: { 
        fontSize: 13,
        color: '#666',
        numberOfLines: 6,
        fontFamily: 'Nunito-Regular',},
  articleLikeButton: { position: 'absolute', top: 10, right: 10, padding: 5, },
  articleLikeIcon: { width: 24, height: 24, },
});