import React, { useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';

const screenHeight = Dimensions.get('window').height;
const drawerHeight = screenHeight * 0.9; // atau bahkan screenHeight

const heartIconActive = require('../../../../assets/images/like_active.png');
const heartIconInactive = require('../../../../assets/images/like_inactive.png');

const handleLikeToggle = (articleId) => {
    const updatedArticles = articles.map(article => 
        article.id === articleId ? { ...article, liked: !article.liked } : article
    );
    setArticles(updatedArticles);
};

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

export default function ArticleSection({ articles }) {
  const router = useRouter();
  const drawerY = useRef(new Animated.Value(screenHeight * 0.82)).current;
  const panResponder = useRef(
    PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 10,
        onPanResponderMove: (_, gestureState) => {
            const newY = drawerY._value + gestureState.dy;
            const clampedY = Math.min(drawerHeight, Math.max(screenHeight * 0.15, newY));
            drawerY.setValue(clampedY);
        },
        onPanResponderRelease: (_, gestureState) => {
            if (gestureState.dy < -50) {
                Animated.spring(drawerY, {
                toValue: screenHeight * 0.15, // naik ke atas
                useNativeDriver: true,
                }).start();
            } else {
                Animated.spring(drawerY, {
                toValue: screenHeight * 0.82, // turun ke bawah
                useNativeDriver: true,
                }).start();
            }
        }
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.drawer,
        {
          transform: [{ translateY: drawerY }],
        },
      ]}
    >
      <View style={styles.handleBar} {...panResponder.panHandlers} />
      <View style={styles.header}  {...panResponder.panHandlers} >
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
                onCardPress={() => router.push('/Article')}
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
    width: 'full',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#448461',
  },
  seeMore: {
    fontSize: 14,
    color: '#448461',
    textDecorationLine: 'underline',
  },


  // article card

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