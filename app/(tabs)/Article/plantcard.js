// PlantCard.js
import { useRef, useState } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const PlantCard = ({ item, selectionMode, selectedItems, toggleSelection, navigation, enterSelectionMode }) => {
  // State 'liked' ini sekarang bersifat lokal untuk setiap PlantCard
  const [isLiked, setIsLiked] = useState(false);
  // Animated.Value ini juga lokal untuk setiap PlantCard
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
    setIsLiked(!isLiked); // Mengubah state liked HANYA untuk kartu ini
  };

  return (
    <TouchableOpacity
      style={styles.cardWrapper}
      onLongPress={() => enterSelectionMode(item.id)} // Aktifkan mode pemilihan dari sini
      onPress={() => selectionMode ? toggleSelection(item.id) : navigation.navigate('Detail', { plant: item })}
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
                ? require('../../../assets/images/checkbox_checked.png')
                : require('../../../assets/images/checkbox_unchecked.png')
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
                  isLiked // Menggunakan state isLiked lokal
                    ? require('../../../assets/images/like_active.png')
                    : require('../../../assets/images/like_inactive.png')
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

const styles = StyleSheet.create({
  cardWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: 330,
    alignSelf: 'center',
    // backgroundColor: 'red'
  },
  checkboxContainer: {
    width: 30,
    // backgroundColor: 'blue',
    // height: '100%',
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
    width: 330,
  },
  cardShrink: {
    width: 400, // Card menyusut saat checkbox muncul
    // backgroundColor: 'red'
  },
  topSection: { flexDirection: 'row' },
  plantImage: { width: 230, height: 150, resizeMode: 'cover' },
  rightInfo: { backgroundColor: '#DCF0E4', width: 100, paddingVertical: 10 },
  avatar: { width: 50, height: 50, borderRadius: 30, borderColor: '#448461', borderWidth: 1, marginBottom: 5, marginTop: 20, alignSelf: 'center', justifyContent: 'center' },
  username: { fontSize: 14, color: '#448461', marginBottom: 10, justifyContent: 'center', alignSelf: 'center' },
  heartButton: { width: 24, height: 24, alignSelf:'flex-end', marginRight: 10 },
  bottomSection: { padding: 10, paddingHorizontal: 20, paddingBottom: 20 },
  plantName: { fontSize: 16, fontWeight: 'bold', color: '#448461', marginBottom: 4 },
  description: { fontSize: 13, color: '#666' },
});

export default PlantCard;