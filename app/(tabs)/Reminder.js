import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, Image, Animated, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as Font from 'expo-font';
import { useIsFocused } from '@react-navigation/native';
import { useReminders } from '../../context/ReminderContext';

export default function Reminder() {
  const navigation = useNavigation();
  const route = useRoute();
  const currentDate = new Date();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  
  // Use reminders from context instead of local state
  const { 
    reminders, 
    setReminders, 
    updateReminder, 
    addReminder, 
    toggleReminderActive 
  } = useReminders();

  // Load fonts using useFonts hook
  const [fontsLoaded] = useFonts({
    'Nunito-Bold': require('../../assets/fonts/Nunito-Bold.ttf'),
  });

  useEffect(() => {
    // Check if we have a returned reminder from the addReminder screen
    if (isFocused && navigation.isFocused()) {
      console.log("Route params in Reminder.js:", route?.params);
      const updatedReminder = route?.params?.updatedReminder;
      const isNewReminder = route?.params?.isNewReminder;
      
      console.log("Updated Reminder:", updatedReminder);
      console.log("Is New Reminder:", isNewReminder);

      if (updatedReminder) {
        // Cek apakah reminder ini sudah ada dalam array
        const reminderExists = reminders.some(r => r.id === updatedReminder.id);
        console.log("Reminder exists:", reminderExists);
        
        if (isNewReminder && !reminderExists) {
          // Add the new reminder to the list
          console.log("Adding new reminder");
          addReminder(updatedReminder);
        } else if (reminderExists) {
          // Update the existing reminder
          console.log("Updating existing reminder");
          updateReminder(updatedReminder);
        }
        
        // Clear the params after using them
        navigation.setParams({ updatedReminder: null, isNewReminder: null });
      }

      // Simulate data loading (in a real app, this would fetch from API or storage)
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isFocused, navigation, reminders, addReminder, updateReminder]);

  if (!fontsLoaded || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#448461" />
      </View>
    );
  }

  // Helper function to get next 4 days
  const getNextFourDays = () => {
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < 4; i++) {
      const date = new Date();
      date.setDate(currentDate.getDate() + i);
      const dayOfWeek = dayNames[date.getDay()];
      const day = date.getDate();
      const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
      days.push({
        id: i.toString(),
        day: dayOfWeek,
        date: day,
        month: month,
        year: date.getFullYear()
      });
    }
    return days;
  };

  // Dummy data for upcoming days
  const upcomingDays = getNextFourDays();

  // Filter reminders based on selected category
  const filteredReminders = selectedCategory 
    ? reminders.filter(item => item.category === selectedCategory) 
    : reminders;

  const handleCategoryPress = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null); // Deselect if already selected
    } else {
      setSelectedCategory(category); // Select the category
    }
  };

  const handleToggleReminder = (id) => {
    // Use context function to toggle reminder active state
    toggleReminderActive(id);
    console.log(`Toggled reminder ${id}`);
  };

  const handleDayPress = (day) => {
    // Ambil reminder berdasarkan index hari (0-3) untuk id 1-4
    const reminderIndex = parseInt(day.id); // day.id adalah '0', '1', '2', '3'
    const targetReminderId = (reminderIndex + 1).toString(); // Konversi ke '1', '2', '3', '4'
    
    // Cari reminder dengan id yang sesuai
    const selectedReminder = reminders.find(reminder => reminder.id === targetReminderId);
    
    if (selectedReminder) {
      console.log("Opening EditReminder for day:", day);
      console.log("Selected reminder:", selectedReminder);
      
      // Buat salinan reminder untuk mencegah referensi objek yang sama
      const reminderToEdit = {...selectedReminder};
      
      // Navigate to EditReminder with the reminder data for editing
      const params = { 
        title: `Edit Reminder - ${day.day}, ${day.month} ${day.date}`,
        reminderData: reminderToEdit 
      };
      
      console.log("Navigation params:", params);
      // Gunakan timeout kecil untuk memastikan navigasi bekerja dengan benar
      setTimeout(() => {
        navigation.navigate('EditReminder', params);
      }, 50);
    } else {
      // Fallback jika reminder tidak ditemukan, arahkan ke AddReminder
      console.log("No reminder found for id:", targetReminderId);
      navigation.navigate('addReminder', { title: `Add Reminder for ${day.day}, ${day.month} ${day.date}` });
    }
  };

  const handleEditReminder = (reminder) => {
    console.log("Editing reminder:", reminder);
    console.log("Reminder ID:", reminder.id);
    console.log("Reminder Title:", reminder.title);
    
    // Buat salinan reminder untuk mencegah referensi objek yang sama
    const reminderToEdit = {...reminder};
    
    // Navigate to EditReminder with the reminder data for editing
    const params = { 
      title: 'Edit Reminder',
      reminderData: reminderToEdit 
    };
    
    console.log("Navigation params:", params);
    // Gunakan timeout kecil untuk memastikan navigasi bekerja dengan benar
    setTimeout(() => {
      navigation.navigate('EditReminder', params);
    }, 50);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          {/* PLANT REMINDER Header */}
          <Text style={styles.headerTitle}>PLANT REMINDER</Text>
          <View style={styles.divider} />
        </View>

        {/* Upcoming Days */}
        <View style={styles.upcomingContainer}>
          <View style={styles.daysRow}>
            {upcomingDays.map((day, index) => (
              <TouchableOpacity 
                key={day.id} 
                style={styles.dayCard}
                onPress={() => handleDayPress(day)}
              >
                <Text style={styles.dayName}>{day.day}</Text>
                <View style={styles.dateContainer}>
                  <Text style={styles.yearText}>{day.year},</Text>
                  <Text style={styles.dateText}>{day.date} {day.month}</Text>
                </View>
                <Text style={styles.seeMoreText}>see more</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* MY REMINDERS Section */}
        <Text style={styles.sectionTitle}>MY REMINDERS</Text>
        <View style={styles.divider} />

        {/* Category Filter */}
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === 'Watering' && styles.categoryButtonSelected
            ]}
            onPress={() => handleCategoryPress('Watering')}
          >
            <Text 
              style={[
                styles.categoryText,
                selectedCategory === 'Watering' && styles.categoryTextSelected
              ]}
            >
              Watering
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === 'Fertilizing' && styles.categoryButtonSelected
            ]}
            onPress={() => handleCategoryPress('Fertilizing')}
          >
            <Text 
              style={[
                styles.categoryText,
                selectedCategory === 'Fertilizing' && styles.categoryTextSelected
              ]}
            >
              Fertilizing
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === 'Pruning' && styles.categoryButtonSelected
            ]}
            onPress={() => handleCategoryPress('Pruning')}
          >
            <Text 
              style={[
                styles.categoryText,
                selectedCategory === 'Pruning' && styles.categoryTextSelected
              ]}
            >
              Pruning
            </Text>
          </TouchableOpacity>
        </View>

        {/* Reminders List */}
        {filteredReminders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No reminders found</Text>
          </View>
        ) : (
          <View style={styles.remindersListContainer}>
            {filteredReminders.map(item => (
              <View key={item.id} style={styles.reminderContainer}>
                {/* Background card - changes color based on active state */}
                <View style={[
                  styles.reminderCardBackground,
                  item.active ? styles.activeCardBackground : styles.inactiveCardBackground
                ]} />
                
                {/* Foreground card - always white */}
                <TouchableOpacity 
                  style={styles.reminderCard}
                  onPress={() => handleEditReminder(item)}
                >
                  <View style={styles.reminderContent}>
                    <View>
                      <Text style={[
                        styles.reminderTime,
                        item.active ? styles.activeText : styles.inactiveText
                      ]}>
                        {item.hour}.{item.minute}
                      </Text>
                      <Text style={[
                        styles.reminderTitle,
                        item.active ? styles.activeText : styles.inactiveText
                      ]}>
                        {item.title}
                      </Text>
                    </View>
                    
                    <View style={styles.daysSwitchContainer}>
                      {/* Display options based on frequency */}
                      <View style={styles.daysContainer}>
                        {item.frequency === 'weekly' ? (
                          // For WEEKLY frequency, show Week numbers 1-4
                          <Text style={[styles.frequencyIndicator, item.active ? styles.activeText : styles.inactiveText]}>
                            Week: {[1, 2, 3, 4].map((week, index) => {
                              // Check if this week is active
                              const isActive = item.selectedWeeks?.includes(week) || false;
                              
                              return (
                                <Text 
                                  key={index} 
                                  style={[
                                    styles.weekIndicator,
                                    isActive && styles.activeDayIndicator,
                                    !item.active && isActive && styles.inactiveDayIndicator
                                  ]}
                                >
                                  {week}{index < 3 ? ' ' : ''}
                                </Text>
                              );
                            })}
                          </Text>
                        ) : item.frequency === 'monthly' ? (
                          // For MONTHLY frequency, show "Repeats monthly on the X(st/nd/rd/th)"
                          <Text style={[styles.frequencyIndicator, item.active ? styles.activeText : styles.inactiveText]}>
                            {(() => {
                              const date = item.selectedDate || 1; // Default to 1st if not set
                              const day = parseInt(date, 10);
                              
                              // Calculate the ordinal suffix
                              let suffix = 'th';
                              if (day % 10 === 1 && day !== 11) suffix = 'st';
                              else if (day % 10 === 2 && day !== 12) suffix = 'nd';
                              else if (day % 10 === 3 && day !== 13) suffix = 'rd';
                              
                              return `${day}${suffix} every month`;
                            })()}
                          </Text>
                        ) : (
                          // For DAILY frequency, show weekday indicators as before
                          [
                            {key: 'Mo', display: 'M'}, // Monday
                            {key: 'Tu', display: 'T'}, // Tuesday
                            {key: 'W', display: 'W'}, // Wednesday
                            {key: 'Th', display: 'T'}, // Thursday
                            {key: 'F', display: 'F'}, // Friday
                            {key: 'Sa', display: 'S'}, // Saturday
                            {key: 'Su', display: 'S'}  // Sunday
                          ].map((dayObj, index) => {
                            // Untuk hari Kamis (Thursday) dan Minggu (Sunday) yang memiliki key duplikat
                            // Kita akan menggunakan pendekatan berbasis index untuk mengambil nilai yang tepat
                            let isActive;
                            
                            // Definisikan array untuk menentukan urutan properti dalam object item.days
                            const dayKeys = ['Mo', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'];
                            // Gunakan index untuk mengakses nilai yang tepat
                            isActive = item.days[dayKeys[index]];
                            
                            return (
                              <Text 
                                key={index} 
                                style={[
                                  styles.dayIndicator,
                                  isActive && styles.activeDayIndicator,
                                  !item.active && isActive && styles.inactiveDayIndicator
                                ]}
                              >
                                {dayObj.display}
                              </Text>
                            );
                          })
                        )}
                      </View>
                      
                      {/* Custom Toggle Switch */}
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleToggleReminder(item.id)}
                        style={styles.switchContainer}
                      >
                        <View 
                          style={[
                            styles.customSwitch,
                            item.active ? styles.customSwitchActive : styles.customSwitchInactive
                          ]}
                        />
                        <Animated.View 
                          style={[
                            styles.customSwitchThumb,
                            item.active ? { left: 30 } : { left: 4 }
                          ]}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddReminder', { title: 'Add Reminder' })}
      >
        <Image
          source={require('../../assets/images/add.png')}
          style={styles.fabIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingHorizontal: 22,
    paddingTop: 60,
    paddingBottom: 100, // Space for bottom navigation
  },
  headerContainer: {
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Nunito-ExtraBold',
    color: '#000',
    marginBottom: 8,
  },
  divider: {
    height: 2,
    backgroundColor: '#448461',
    marginBottom: 25,
    width: '70%', 
  },
  upcomingContainer: {
    marginBottom: 45,
    maxHeight: 120,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  dayCard: {
    backgroundColor: '#FBF2D6',
    padding: 10,
    height: 115,
    borderRadius: 10,
    width: '23%', 
    justifyContent: 'flex-start',
    position: 'relative',
  },
  dayName: {
    fontFamily: 'Nunito-ExtraBold',
    fontSize: 24,
    color: '#000',
    textAlign: 'left',
  },
  dateContainer: {
    marginStart: 3,
  },
  yearText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 10,
    color: '#000',
    opacity: 0.7,
  },
  dateText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 10,
    color: '#000',
  },
  seeMoreText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 10,
    color: '#7BAB91',
    opacity: 0.8,
    position: 'absolute',
    bottom: 8,
    right: 8,
    fontStyle: 'italic',
  },
  reminderPreview: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    alignItems: 'flex-end',
  },
  reminderPreviewTime: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 9,
    color: '#448461',
  },
  reminderPreviewTitle: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 8,
    color: '#7BAB91',
    maxWidth: 60,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Nunito-ExtraBold',
    color: '#000',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
    width: '60%'
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#448461',
    backgroundColor: 'transparent',
    minWidth: 70,
    alignItems: 'center',
    marginEnd: 15,
  },
  categoryButtonSelected: {
    backgroundColor: '#448461',
  },
  categoryText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: '#448461',
  },
  categoryTextSelected: {
    color: '#FFFFFF',
  },
  remindersListContainer: {
    paddingBottom: 20,
  },
  reminderContainer: {
    marginBottom: 16,
    height: 110,
    position: 'relative',
  },
  reminderCardBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 8,
    bottom: 0,
    borderRadius: 15,
  },
  activeCardBackground: {
    backgroundColor: '#7BAB91',
  },
  inactiveCardBackground: {
    backgroundColor: '#D9ECE1',
  },
  reminderCard: {
    position: 'absolute',
    top: 0,
    left: 12, 
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  reminderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '100%',
  },
  reminderTime: {
    fontFamily: 'Nunito-ExtraBold',
    fontSize: 30,
    marginStart: 10,
    marginBottom: 11,
    marginTop: 4,
  },
  reminderTitle: {
    fontFamily: 'Nunito-SemiBold',
    marginStart: 12,
    fontSize: 16,
  },
  activeText: {
    color: '#448461',
  },
  inactiveText: {
    color: 'rgba(0, 0, 0, 0.5)',
  },
  daysSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 12,
    right: 12,
  },
  daysContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap', 
    maxWidth: 180, 
  },
  dayIndicator: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 15,
    marginRight: 4,
    color: '#CCCCCC',
  },
  weekIndicator: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 15,
    color: '#CCCCCC',
  },
  frequencyIndicator: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    marginRight: 4,
    maxWidth: 130, // Prevent text from wrapping too much
  },
  activeDayIndicator: {
    color: '#448461',
  },
  inactiveDayIndicator: {
    color: '#AAC8B8',
  },
  reminderSwitch: {
    marginLeft: 6,
  },
  customSwitch: {
    width: 60,
    height: 32,
    borderRadius: 16,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  customSwitchActive: {
    backgroundColor: '#7BAB91',
  },
  customSwitchInactive: {
    backgroundColor: '#D9ECE1',
  },
  customSwitchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    position: 'absolute',
    top: 3,
  },
  switchContainer: {
    width: 52,
    height: 32,
    position: 'relative',
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 110,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  fabIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: '#999',
  }
});
