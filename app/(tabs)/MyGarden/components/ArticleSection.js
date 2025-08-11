import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';

import ArticleCard from '../../ArticleComponents/ArticleCard';

const screenHeight = Dimensions.get('window').height;
const drawerHeight = screenHeight * 0.9;

export default function ArticleSection({ articles }) {
  const router = useRouter();
  const drawerY = useRef(new Animated.Value(screenHeight * 0.78)).current;
  const [localArticles, setLocalArticles] = useState(articles);

  const toggleLike = (id) => {
    const updated = localArticles.map(article =>
      article.id === id ? { ...article, liked: !article.liked } : article
    );
    setLocalArticles(updated);
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
          toValue: gestureState.dy < -50 ? screenHeight * 0.15 : screenHeight * 0.78,
          useNativeDriver: true,
        }).start();
      },
        onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 10,
        onPanResponderMove: (_, gestureState) => {
            const newY = drawerY._value + gestureState.dy;
            const clampedY = Math.min(drawerHeight, Math.max(screenHeight * 0.15, newY));
            drawerY.setValue(clampedY);
        },
        // ✅ Perbaikan: Menggunakan gestureState di sini
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
                // >>>>>> PERUBAHAN: Panggil fungsi baru dengan data artikel
                onCardPress={() => handleArticleCardPress(article)}
                onLikeToggle={() => handleLikeToggle(article.id)}
            />
        ))}
      </ScrollView>
    </Animated.View>
  );
}

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
});