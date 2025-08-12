import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getImage } from '../getImage';
import { usePlant } from '../../../../context/PlantContext';

const screenWidth = Dimensions.get('window').width;

const PlantCard = ({
  plant,
  isSelected,
  isSelecting,
  setIsSelecting,
  selectedPlants,
  setSelectedPlants,
}) => {
  const router = useRouter();
  const { deletePlant } = usePlant();

  const imageSource =
    typeof plant.image === 'string'
      ? plant.image.startsWith('file')
        ? { uri: plant.image }
        : getImage(plant.image)
      : getImage('placeholder');

  const toggleSelect = (id) => {
    setSelectedPlants((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Plant',
      'Are you sure you want to delete this plant?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deletePlant(id) },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={{ flex: 1 }} // Tambahkan ini!
      onLongPress={() => {
        setIsSelecting(true);
        setSelectedPlants([plant.id]);
      }}
      onPress={() => {
        if (isSelecting) {
          toggleSelect(plant.id);
        } else {
          // Navigasi ke rute dinamis yang baru
          router.push(`/plant/${plant.id}`); 
        }
      }}
    >
      <View style={[styles.card, isSelected && styles.selectedCard]}>
        <Image
          source={imageSource}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.cardContent}>
          <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
            {plant.name || 'Unnamed'}
          </Text>
          <Text style={styles.detail}>
            {plant.age || '--'} days
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1, // Ini penting!
    width: '100%',
    backgroundColor: '#7BAB91',
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    borderWidth: 0,
  },

  selectedCard: {
    borderColor: '#42574E',
    borderWidth: 3,
  },

  cardImage: {
    width: '100%',
    height: screenWidth * 0.3,
    borderRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#ccc',
  },

  cardContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },

  name: {
    fontSize: 18,
    fontFamily: 'Nunito-Black',
    color: 'white',
    textAlign: 'center',
  },

  detail: {
    fontSize: 13,
    fontFamily: 'Nunito-Regular',
    color: 'white',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default PlantCard;