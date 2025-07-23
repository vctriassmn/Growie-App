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

import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';


import { useRouter } from 'expo-router';
import { useUser } from '../../../../context/UserContext';


import { plants } from '../data';
import PlantCard from '../components/PlantCard';

import BellIcon from '../../../../assets/images/bell.svg'; 
import ProfileBorderSVG from '../../../../assets/icons/profile.svg';


const screenWidth = Dimensions.get('window').width;

export default function Home() {
  const { userName, profilePicture } = useUser(); 
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#694B40' }}>
    <StatusBar style="light"/>

      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20 }}>
          {/* Profile Section */}
          <TouchableOpacity 
            style={styles.header}
            onPress={() => router.push('/Profile')}
            activeOpacity={0.8}
          >
            <View style={styles.profileContainer}>
              <ProfileBorderSVG width="100%" height="100%" style={{ position: 'absolute' }} />
              <Image 
                source={typeof profilePicture === 'string' ? { uri: profilePicture } : profilePicture}
                style={styles.profileImage} 
              />
            </View>
            <Text style={styles.greetingText}>Hello! {userName}</Text>
          </TouchableOpacity>
          
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome to My Garden!</Text>
            <TouchableOpacity onPress={() => router.push('/Notification')}>
              <View style={styles.bellContainer}>
                <BellIcon width={24} height={24} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* search */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search your plant...</Text>
        </View>

        {/* filter blm bisa dipake tp ygy */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          <View style={styles.tabs}>
            {['Succulents', 'Flowers', 'Vegetables', 'Potted', 'Herbs', 'Climbers'].map(tab => (
              <TouchableOpacity key={tab} style={styles.tabButton}>
                <Text style={styles.tabText}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Plant Cards */}
        <View style={styles.cardContainer}>
          {[...Array(plants.length)].map((_, index) => {
            const plant = plants[index];
            return (
              <View key={plant.id} style={styles.cardWrapper}>
                <PlantCard plant={plant} />
              </View>
            );
          })}
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
  container: {
    backgroundColor: '#FAFFFB',
    flex: 1,
    paddingTop: 16,
    
  },

  // header ================================================
  header: {
    backgroundColor: '#FBF2D6',
    padding: 15,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    ...shadowStyle,
  },
  //profile ---------------------------
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

  // greeting --------------------------------
  welcomeSection: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },

  welcomeTitle: {
    fontSize: 22,
    color: '#333',
    fontFamily: 'Nunito-ExtraBold',
  },

  // notif --------------------------------
  bellContainer: {
    width: 35,
    height: 35,
    borderRadius: 22,
    backgroundColor: '#FBF2D6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    ...shadowStyle,
  },


  // search =================================================================
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 20,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: '#888',
  },

  // filter =================================================================
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
    marginHorizontal: 20,
    marginVertical: 20,
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

  // card ==================================================================
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingBottom: 120,
  },
  cardWrapper: {
    width: '48%', // dua kolom dengan margin
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