import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';

// import ArticleCard from '../../ArticleComponents/ArticleCard';
import { useJournalAndArticle } from '../../../../context/JournalAndArticleStore';

const latestArticlesData = [
    { id: '1', name: 'How to Plant a New Houseplant', description: 'A beginner-friendly guide...', image: require('../../../../assets/images/caramenyiram.png'), avatar: require('../../../../assets/images/Logo.png'), username: 'Growie', liked: false, },
    { id: '2', name: 'Fiddle Leaf Fig', description: 'A popular indoor tree...', image: require('../../../../assets/images/plant.png'), avatar: require('../../../../assets/images/pp.jpg'), username: 'User123', liked: true, },
    { id: '3', name: 'Snake Plant', description: 'Extremely hardy and low-maintenance...', image: require('../../../../assets/images/peacelily.png'), avatar: require('../../../../assets/images/pp.jpg'), username: 'GreenThumb', liked: false, },
];

const screenHeight = Dimensions.get('window').height;
const drawerHeight = screenHeight * 0.9;


const heartIconActive = require('../../../../assets/images/like_active.png');
const heartIconInactive = require('../../../../assets/images/like_inactive.png');


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


export default function ArticleSection() {
  const router = useRouter();
  const drawerY = useRef(new Animated.Value(screenHeight * 0.80)).current;
  const [articles, setArticles] = useState(latestArticlesData);
  
  

  const handleLikeToggle = (articleId) => {
    const updatedArticles = articles.map(article =>
      article.id === articleId ? { ...article, liked: !article.liked } : article
    );
    setArticles(updatedArticles);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 10,
      onPanResponderMove: (_, gestureState) => {
        const newY = drawerY._value + gestureState.dy;
        const clampedY = Math.min(drawerHeight, Math.max(screenHeight * 0.15, newY));
        drawerY.setValue(clampedY);
      },
      onPanResponderRelease: (_, gestureState) => {
        Animated.spring(drawerY, {
          toValue: gestureState.dy < -50 ? screenHeight * 0.15 : screenHeight * 0.80,
          useNativeDriver: true,
        }).start();
      },
        
    })
  ).current;

  // >>>>>> PERUBAHAN: Fungsi baru untuk navigasi ke detail artikel
  const handleArticleCardPress = (article) => {
    router.push({
        pathname: `/(tabs)/ArticleComponents/${article.id}`,
    });
  };

  return (
    <Animated.View style={[styles.drawer, { transform: [{ translateY: drawerY }] }]}>
      <View style={styles.handleBar} {...panResponder.panHandlers} />
      <View style={styles.header} {...panResponder.panHandlers}>
        <Text style={styles.sectionTitle}>Articles</Text>
      </View>

      <ScrollView
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 180, paddingTop: 15 }}
      >
        {articles.map((article) => (
            <ArticleCard
                key={article.id}
                item={article}
                onCardPress={() => router.push({pathname: `/(tabs)/ArticleComponents/${article.id}`,})}
                onLikeToggle={() => handleLikeToggle(article.id)}
              />
        ))}
      </ScrollView>
    </Animated.View>
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
  drawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: drawerHeight,
    backgroundColor: '#FAFFFB',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    elevation: 10,
    zIndex: 99,
    overflow: 'visible',
  },
  handleBar: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CCC',
    alignSelf: 'center',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 25,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#448461',
  },

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
  articleName: { fontSize: 16, color: '#333', marginBottom: 4, fontFamily: 'Nunito-SemiBold' },
  articleDescription: { fontSize: 13, color: '#666', fontFamily: 'Nunito-Regular' },
  articleLikeButton: { position: 'absolute', top: 10, right: 10, padding: 5, },
  articleLikeIcon: { width: 24, height: 24, },
});