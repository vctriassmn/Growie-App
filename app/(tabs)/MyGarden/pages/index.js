import React from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { getImage } from '../getImage';

const screenWidth = Dimensions.get('window').width;

export default function Home() {
  return (
    <ScrollView style={styles.container}>
      {/* Greeting */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello! akusaygkamu</Text>
        <Text style={styles.title}>🌿 Welcome to My Garden!</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {['Succulents', 'Flowers', 'Vegetables', 'Potted'].map(tab => (
          <TouchableOpacity key={tab} style={styles.tabButton}>
            <Text style={styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Plant Cards */}
      <View style={styles.cardContainer}>
        {[0, 1, 2, 3, 4].map(index => (
          <View key={index} style={styles.card}>
            <Image
              source={getImage('placeholder')}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <Text style={styles.cardText}>Plant Name – {index * 50 + 3} Days</Text>
          </View>
        ))}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.navbar}>
        {['Home', 'Article', 'Reminder', 'Journal', 'MyGarden'].map(item => (
          <TouchableOpacity key={item} style={styles.navIcon}>
            <Image
              source={getImage('placeholder')}
              style={styles.navImage}
              resizeMode="contain"
            />
            <Text style={styles.navLabel}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAFFFB',
    flex: 1,
    paddingTop: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 16,
    color: '#694B40',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#448461',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 12,
  },
  tabButton: {
    backgroundColor: '#D3E6DB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#284E43',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingBottom: 60,
  },
  card: {
    width: screenWidth * 0.42,
    backgroundColor: '#F0F4F1',
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    padding: 8,
  },
  cardImage: {
    width: '100%',
    height: screenWidth * 0.42,
    borderRadius: 8,
    backgroundColor: '#ccc',
  },
  cardText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    color: '#316569',
  },
  navbar: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#D7F6F4',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  navIcon: {
    alignItems: 'center',
  },
  navImage: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 10,
    color: '#316569',
  },
});









// import React from 'react';
// import { ScrollView, Text, View, StyleSheet } from 'react-native';
// import { plants } from '../data';
// import PlantCard from '../components/PlantCard';

// export default function Home() {
//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>🌿 Welcome to My Garden!</Text>
//       <View>
//         {plants.map(plant => (
//           <PlantCard key={plant.id} plant={plant} />
//         ))}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
// });