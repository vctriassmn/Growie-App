import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';

//expo
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

//navigation
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

// context
import { useUser } from '../../../../context/UserContext';
import { usePlant } from '../../../../context/PlantContext';

// icons
import AddIcon from '../../../../assets/images/add.png';
import SearchIcon from '../../../../assets/icons/search.svg';
import BellIcon from '../../../../assets/images/bell.svg';
import ProfileBorderSVG from '../../../../assets/icons/profile.svg';

//components
import PlaceholderImage from '../../../../assets/images/mygarden/placeholder.jpg';
import PlantCard from '../components/PlantCard';


const screenWidth = Dimensions.get('window').width;

export default function MyGarden() {
  // use"an
  const router = useRouter();
  const { userName, profilePicture } = useUser();
  const { plants, addPlant, deletePlant } = usePlant();
  
  // filter
  const [activeCategory, setActiveCategory] = useState('All');
  
  // search
  const [searchQuery, setSearchQuery] = useState('');

  // both
  const filteredPlants = plants
  .filter((plant) =>
    activeCategory === 'All' ? true : plant.cat === activeCategory
  )
  .filter((plant) =>
    plant.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // delete
  const [selectedPlants, setSelectedPlants] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      // Reset saat halaman aktif lagi
      setSelectedPlants([]);
      setIsSelecting(false);
    }, [])
  );

  // add plant
  const handleAddPlant = () => {
    router.push('/plant/add');
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F4F1' }}>
      <StatusBar style="dark" />

      {isSelecting ? (
      <>
        {/* Header: Selected + Cancel */}
        <View style={styles.selectHeader}>
          <Text style={styles.selectTitle}>Selected ({selectedPlants.length})</Text>
          <TouchableOpacity onPress={() => {
            setIsSelecting(false);
            setSelectedPlants([]);
          }}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Only Plant Cards */}
        <FlatList
          data={plants}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <PlantCard
                plant={item}
                isSelected={selectedPlants.includes(item.id)}
                isSelecting={isSelecting}
                setIsSelecting={setIsSelecting}
                selectedPlants={selectedPlants}
                setSelectedPlants={setSelectedPlants}
              />
            </View>
          )}
          columnWrapperStyle={styles.rowWrapper}
          contentContainerStyle={styles.cardContainer}
          showsVerticalScrollIndicator={false}
        />


        {/* Delete Button */}
        <View style={styles.deleteContainer}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              selectedPlants.forEach(id => deletePlant(id));
              setSelectedPlants([]);
              setIsSelecting(false);
            }}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </>
    ) : (
      <>
        <ScrollView style={styles.container}>
          {/* Header ================================================================= */}
          <View style={{ paddingHorizontal: 20 }}>
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

            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>Welcome to My Garden!</Text>
              <TouchableOpacity onPress={() => router.push('/Notification')}>
                <View style={styles.bellContainer}>
                  <BellIcon width={24} height={24} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search ================================================================= */}
          <View style={styles.searchContainer}>
            <View style={styles.searchIcon}>
              <SearchIcon width={24} height={24} />
            </View>
            <TextInput
              placeholder="Search plants..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
          </View>

          {/* Filter Tabs ================================================================= */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContainer}
          >
            <View style={styles.tabs}>
              {['All', 'Succulents', 'Flowers', 'Vegetables', 'Herbs', 'Climbers'].map(tab => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.tabButton,
                    activeCategory === tab && styles.activeTabButton
                  ]}
                  onPress={() => setActiveCategory(tab)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeCategory === tab && styles.activeTabText
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Plant Cards ================================================================= */}
          {filteredPlants.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {plants.length === 0
                  ? 'You have no plants yet.'
                  : 'No matching plants found.'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredPlants}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              renderItem={({ item }) => (
                <View style={styles.cardWrapper}>
                  <PlantCard
                    plant={item}
                    isSelected={selectedPlants.includes(item.id)}
                    isSelecting={isSelecting}
                    setIsSelecting={setIsSelecting}
                    selectedPlants={selectedPlants}
                    setSelectedPlants={setSelectedPlants}
                  />
                </View>
              )}
              columnWrapperStyle={styles.rowWrapper}
              contentContainerStyle={styles.cardContainer}
              showsVerticalScrollIndicator={false}
            />
          )}


          <View style={{ height: 20, width: screenWidth, backgroundColor: 'transparent' }} />
        </ScrollView>

        <View style={{ backgroundColor: '#FAFFFB' }}>
          <TouchableOpacity style={styles.add} onPress={handleAddPlant}>
            {/* <AddIcon width={60} height={60} /> */}
            <Image
              source={AddIcon}
              style={styles.addbutton}
            />
          </TouchableOpacity>
        </View>
      </>
      )}

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
    backgroundColor: '#D3E6DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 20,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    fontSize: 14,
    color: '#888',
    width: '100%',
    height: '100%',
    fontFamily: 'Nunito-SemiBold',
  },

  // filter =================================================================
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginHorizontal: 20,
    marginVertical: 20,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#D3E6DB',
  },

  tabText: {
    color: '#284E43',
    fontWeight: '600',
    fontFamily: 'Nunito-ExtraBold',
    fontSize: 14,
  },

  activeTabButton: {
    backgroundColor: '#284E43',
  },

  activeTabText: {
    color: '#FFFFFF',
  },

  // card ==================================================================
  cardContainer: {
    paddingHorizontal: 10,
    paddingBottom: 120,
    // alignItems: 'stretch',
  },
  
  rowWrapper: {
    justifyContent: 'space-between',
    // alignItems: 'stretch', // Ini bikin tinggi card seragam dalam satu baris
    // width: '48%', // dua kolom dengan margin
  },
  
  cardWrapper: {
    flex: 1,
    maxWidth: '50%', // dua kolom dengan margin
    backgroundColor: '#fff',
    // alignItems: 'stretch',
    borderRadius: 12,
    padding: 10,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 64,
  },

  emptyText: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 24,
  },

  // button ===============
  add: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 62,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  addbutton: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },

  // deleting ================================
  selectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#FAFFFB',
  },
  selectTitle: {
    fontSize: 16,
    color: '#42574E',
    fontFamily: 'Nunito-SemiBold',
    alignItems: 'flex-start',
  },
  cancelText: {
    fontSize: 16,
    color: '#42574E',
    fontFamily: 'Nunito-SemiBold',
  },
  deleteContainer: {
    padding: 20,
    backgroundColor: '#FAFFFB',
  },
  deleteButton: {
    position: 'absolute',
    bottom: 96,
    right: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#42574E',
    width: 150,
    height: 50,
    borderRadius: 30,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Nunito-ExtraBold',
  },
});