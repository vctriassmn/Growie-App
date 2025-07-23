// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
// import { Link } from 'expo-router';
// import { Dimensions } from 'react-native';


// // import { plants } from '../data';
// import { getImage } from '../getImage';
// const screenWidth = Dimensions.get('window').width;

// // const imageSource = getImage(plant.image);

// const PlantCard = ({ plant }) => (
//   <Link href={`/plant/${plant.id}`} asChild>
//     <TouchableOpacity style={styles.card}>
//       <Image
//         source={getImage(plant.image)}
//         resizeMode="cover"
//       />
//       <Text style={styles.name}>{plant.name}</Text>
//       <Text>Age: {plant.age} days</Text>
//       <Text>Condition: {plant.condition}</Text>
//     </TouchableOpacity>
//   </Link>
// );

// const styles = StyleSheet.create({
//   card: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 12,
//     marginBottom: 12,
//     borderRadius: 8,
//   },
//   name: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     marginBottom: 4,
//   },
// });

// export default PlantCard;



import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { getImage } from '../getImage';

const screenWidth = Dimensions.get('window').width;

const PlantCard = ({ plant }) => (
  <Link href={`/plant/${plant.id}`} asChild>
    <TouchableOpacity style={styles.card}>
      {/* Image placeholder */}
      <Image
        source={getImage(plant.image || 'placeholder')}
        style={styles.cardImage}
        resizeMode="cover"
      />

      {/* Plant info */}
      <Text style={styles.name}>{plant.name || 'Unnamed'}</Text>
      <Text style={styles.detail}>{plant.age || '--'} days</Text>
      {/* <Text style={styles.detail}>Condition: {plant.condition || 'Unknown'}</Text> */}
    </TouchableOpacity>
  </Link>
);

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#7BAB91',
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: screenWidth * 0.3,
    borderRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#ccc',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
    textAlign: 'center',
  },
  detail: {
    fontSize: 13,
    color: 'white',
    marginTop: 2,
    textAlign: 'center',
    marginBottom: 8,
  },
});

export default PlantCard;