// Lokasi file: app/(tabs)/Home.js

import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, TouchableOpacity, PanResponder } from 'react-native';
import { useRouter } from 'expo-router';

// Data dummy
const latestArticlesData = [
  { id: '1', name: 'How to Plant a New Houseplant', description: 'A beginner-friendly guide...', image: require('../../assets/images/caramenyiram.png'), avatar: require('../../assets/images/Logo.png'), username: 'Growie', liked: false, },
  { id: '2', name: 'Fiddle Leaf Fig', description: 'A popular indoor tree...', image: require('../../assets/images/plant.png'), avatar: require('../../assets/images/pp.jpg'), username: 'User123', liked: true, },
  { id: '3', name: 'Snake Plant', description: 'Extremely hardy and low-maintenance...', image: require('../../assets/images/peacelily.png'), avatar: require('../../assets/images/pp.jpg'), username: 'GreenThumb', liked: false, },
];
const myGardenData = [
  { id: 'g1', name: 'Lily of the Valley', image: require('../../assets/images/lily-of-the-valley.png') },
  { id: 'g2', name: 'Snorlax Planter', image: require('../../assets/images/snorlax-planter.png') },
  { id: 'g3', name: 'Cactus', image: require('../../assets/images/cactus.png') },
  { id: 'g4', name: 'Three Musketeers', image: require('../../assets/images/three-musketeers.png') },
  { id: 'g5', name: 'Turtles', image: require('../../assets/images/turtles.png') },
];
const remindersData = [
  { id: 'r1', time: '07.30', task: 'Baby Spinach | Watering' },
  { id: 'r2', time: '10.30', task: 'Monstera | Watering' },
  { id: 'r3', time: '16.00', task: 'Water Lily | Pruning' },
];

// Impor Aset
import BellIcon from '../../assets/images/bell.svg'; 
import ProfileBorderSVG from '../../assets/icons/profile.svg'; // SVG untuk bingkai
const profilePic = require('../../assets/images/profile-image.png'); // Gambar profil PNG
const heartIconActive = require('../../assets/images/like_active.png');
const heartIconInactive = require('../../assets/images/like_inactive.png');


// Komponen ArticleCard
const ArticleCard = ({ item, onCardPress, onLikeToggle }) => {
  return (
    <TouchableOpacity 
      style={styles.articleCardWrapper} 
      onPress={() => onCardPress(item)}
      activeOpacity={0.9}
    >
      <View style={styles.articleCard}>
        <View style={styles.articleTopSection}>
          <Image source={item.image} style={styles.articleImage} />
          <View style={styles.articleRightInfo}>
            <TouchableOpacity style={styles.articleLikeButton} onPress={onLikeToggle}>
              <Image 
                source={item.liked ? heartIconActive : heartIconInactive} 
                style={styles.articleLikeIcon}
              />
            </TouchableOpacity>
            <Image source={item.avatar} style={styles.articleAvatar} />
            <Text style={styles.articleUsername}>{item.username}</Text>
          </View>
        </View>
        <View style={styles.articleBottomSection}>
          <Text style={styles.articleName}>{item.name}</Text>
          <Text style={styles.articleDescription} numberOfLines={2}>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};


// Komponen Utama HomePage
export default function HomePage() {
  const router = useRouter(); 
  const [articles, setArticles] = useState(latestArticlesData);

  const handleLikeToggle = (articleId) => {
    const updatedArticles = articles.map(article => 
      article.id === articleId ? { ...article, liked: !article.liked } : article
    );
    setArticles(updatedArticles);
  };

  // Logika PanResponder & Scroll
  const scrollViewRef = useRef(null);
  const articleSectionY = useRef(0);
  const [isPanelUp, setIsPanelUp] = useState(false);
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => !isPanelUp && Math.abs(gestureState.dy) > 5,
      onPanResponderRelease: (e, gesture) => {
        if (gesture.vy < -0.5 || gesture.dy < -100) scrollToArticle();
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
      
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        scrollEnabled={!isPanelUp}
        showsVerticalScrollIndicator={!isPanelUp}
      >
        <View style={styles.paddedContent}>
            {/* Header dengan Profil SVG */}
            <View style={styles.header}>
              <View style={styles.profileContainer}>
                {/* Layer Bawah: Bingkai SVG */}
                <ProfileBorderSVG width="100%" height="100%" style={{ position: 'absolute' }} />
                {/* Layer Atas: Gambar Profil PNG */}
                <Image source={profilePic} style={styles.profileImage} />
              </View>
              <Text style={styles.greetingText}>Hello! akusaygkamu</Text>
            </View>
            
            {/* Sisa konten atas */}
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>Welcome to Homepage!</Text>
              <TouchableOpacity onPress={() => router.push('/Notification')}>
                <View style={styles.bellContainer}>
                  <BellIcon width={24} height={24} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>My garden</Text>
                <TouchableOpacity onPress={() => router.push('/MyGarden')}>
                  <Text style={styles.seeMore}>See more</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 5, paddingVertical: 10 }}>
                {myGardenData.map((plant) => (
                  <View key={plant.id} style={styles.gardenCard}>
                    <Image source={plant.image} style={styles.gardenImage} />
                    <Text style={styles.gardenLabel}>{plant.name}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Reminders</Text>
                <TouchableOpacity onPress={() => router.push('/Reminder')}>
                  <Text style={styles.seeMore}>See more</Text>
                </TouchableOpacity>
              </View>
              <View>
                {remindersData.map((reminder) => (
                  <View key={reminder.id} style={styles.reminderItem}>
                    <Text style={styles.reminderTime}>{reminder.time}</Text>
                    <Text style={styles.reminderText}>{reminder.task}</Text>
                  </View>
                ))}
              </View>
            </View>
        </View>

        {/* Bagian Artikel yang bisa digeser */}
        <View 
          style={styles.articlesSection}
          onLayout={(event) => { articleSectionY.current = event.nativeEvent.layout.y; }}
        >
          <ScrollView 
            scrollEnabled={isPanelUp} 
            showsVerticalScrollIndicator={isPanelUp}
            contentContainerStyle={{ paddingBottom: 50 }} 
          >
            <View style={styles.articleHeader} {...panResponder.panHandlers}>
                <Text style={styles.sectionTitle}>Articles</Text>
                <TouchableOpacity onPress={() => router.push('/Article')}>
                  <Text style={styles.seeMore}>See more</Text>
                </TouchableOpacity>
            </View>
            
            {articles.map(article => (
              <ArticleCard 
                key={article.id} 
                item={article}
                onCardPress={() => router.push('/Article')}
                onLikeToggle={() => handleLikeToggle(article.id)}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


// Objek Shadow
const shadowStyle = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 5,
};

// Stylesheet Lengkap
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0FBF0' },
  topBar: { height: 30, backgroundColor: '#5D4037' },
  scrollContainer: { paddingBottom: 30, },
  paddedContent: { paddingHorizontal: 20, },
  header: { backgroundColor: '#FBF2D6', padding: 15, borderRadius: 20, flexDirection: 'row', alignItems: 'center', marginTop: 10, ...shadowStyle, },
  
  // Style untuk Profil dengan SVG
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
  
  greetingText: { fontSize: 20, fontWeight: 'normal', color: '#333' },
  welcomeSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20, },
  welcomeTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  bellContainer: { width: 35, height: 35, borderRadius: 22, backgroundColor: '#FBF2D6', justifyContent: 'center', alignItems: 'center', marginRight: 5, ...shadowStyle, },
  section: { backgroundColor: '#D9ECE1', borderRadius: 20, paddingTop: 15, paddingBottom: 15, paddingHorizontal: 15, marginBottom: 35, ...shadowStyle, },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  seeMore: { fontSize: 14, color: '#555' },
  gardenCard: { backgroundColor: '#FAFFFB', borderRadius: 15, width: 150, height: 180, marginHorizontal: 5, ...shadowStyle, },
  gardenImage: { width: '100%', height: 150, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
  gardenLabel: { marginTop: 5, fontSize: 13, fontWeight: 'bold', color: '#7BAB91', textAlign: 'center'},
  reminderItem: { backgroundColor: '#7BAB91', borderRadius: 15, paddingVertical: 15, paddingHorizontal: 20, marginBottom: 10, borderLeftWidth: 5, borderLeftColor: '#284E43', ...shadowStyle, },
  reminderTime: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  reminderText: { fontSize: 14, color: '#fff' },
  articlesSection: { backgroundColor: '#fff', borderTopLeftRadius: 45, borderTopRightRadius: 45, marginTop: 5, flex: 1, shadowColor: "#000", shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 20, },
  articleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20, marginBottom: 5, marginTop: 15},
  articleCardWrapper: { marginBottom: 20, paddingHorizontal: 20, },
  articleCard: { backgroundColor: '#fff', borderRadius: 12, ...shadowStyle, overflow: 'hidden', },
  articleTopSection: { flexDirection: 'row' },
  articleImage: { width: '65%', height: 150, resizeMode: 'cover' },
  articleRightInfo: { backgroundColor: '#DCF0E4', width: '35%', alignItems: 'center', justifyContent: 'center', padding: 10, position: 'relative', },
  articleAvatar: { width: 50, height: 50, borderRadius: 25, borderColor: '#448461', borderWidth: 1, marginBottom: 8, },
  articleUsername: { fontSize: 14, color: '#448461', fontWeight: '600', },
  articleBottomSection: { paddingVertical: 15, paddingHorizontal: 20, },
  articleName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4, },
  articleDescription: { fontSize: 13, color: '#666', fontFamily: 'Nunito_400Regular' },
  articleLikeButton: { position: 'absolute', top: 10, right: 10, padding: 5, },
  articleLikeIcon: { width: 24, height: 24, },
});