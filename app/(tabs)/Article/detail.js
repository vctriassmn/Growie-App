// detail.js
import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar, // Ensure StatusBar is imported
  Animated
} from 'react-native';

export default function DetailScreen({ route, navigation }) {
  const { plant } = route.params;

  const [liked, setLiked] = useState(false);
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
    setLiked(!liked);
  };

  return (
    <View style={styles.container}>
      {/* Updated StatusBar component */}
      <StatusBar
        barStyle="dark-content" // Or 'light-content' based on your header background
        backgroundColor="#fff" // Your desired background color
        translucent={false} // Set to false to make background color fully opaque below status bar
                          // Set to true if you want content to appear behind status bar
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Image source={require('../../../assets/images/weui_back-outlined.png')} style={styles.headerIcon} />
        </TouchableOpacity>
        <Text style={styles.headertext}>Article</Text>
        <TouchableOpacity onPress={handleLike} style={styles.headerButton}>
          <Animated.Image
            source={
              liked
                ? require('../../../assets/images/like_active.png')
                : require('../../../assets/images/like_inactive.png')
            }
            style={[styles.headerIcon, { transform: [{ scale: scaleAnim }] }]}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topImageSection}>
          <Image source={plant.image} style={styles.mainPlantImage} />
          <View style={styles.overlayInfo}>
            <Image source={plant.avatar} style={styles.avatar} />
            <Text style={styles.username}>{plant.username}</Text>
          </View>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.plantName}>{plant.name}</Text>
          <Text style={styles.dateText}>Date: {plant.date}</Text>

          <Text style={styles.sectionTitle}>📸 Photo of the Day</Text>
          <Image source={plant.photoOfTheDayImage} style={styles.photoOfDayImage} />
          <Text style={styles.quoteText}>{plant.quote}</Text>

          <Text style={styles.fullArticleText}>
            {plant.fullArticle}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    width: '100%',
    marginTop: 50, // This pushes content down, status bar is usually above this
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  headerButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  headertext: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#448461',
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  topImageSection: {
    width: '100%',
    height: 250,
    
    position: 'relative',
  },
  mainPlantImage: {
    borderTopLeftRadius: 10,
    borderTopRightRadius:10,
    // backgroundColor:'red',
    width: '100%',
    fontFamily: 'Sora_700Bold',
    height: '100%',
    resizeMode: 'cover',
  },
  overlayInfo: {
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 30,
    borderColor: '#fff',
    borderWidth: 1,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontFamily: 'Sora_700Bold',
    // fontWeight: 'bold',
    color: '#fff',
  },
  contentSection: {
    padding: 20,
  },
  plantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#448461',
    marginBottom: 5,
    fontFamily: 'Sora_700Bold',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins_400Regular',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    // fontWeight: 'bold',
    color: '#448461',
    marginTop: 10,
    fontFamily: 'Sora_700Bold',
    marginBottom: 10,
  },
  photoOfDayImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 10,
  },
  quoteText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  fullArticleText: {
    fontSize: 15,
    color: '#333',
    fontFamily: 'Poppins_400Regular',
    lineHeight: 22,
    marginTop: 10,
    marginBottom:60
  },
});