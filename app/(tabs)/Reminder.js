import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, Image, Switch, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as Font from 'expo-font';
import { useIsFocused } from '@react-navigation/native';

export default function Reminder() {
  const navigation = useNavigation();
  const currentDate = new Date();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  
  // Define all useState hooks at the component's top level
  const [reminders, setReminders] = useState([
    { 
      id: '1', 
      time: '07:30', 
      title: 'Baby Spinach', 
      category: 'Watering',
      active: true, 
      days: {M: true, T: true, W: true, Th: true, F: true, S: false, Su: false} 
    },
    { 
      id: '2', 
      time: '08:00', 
      title: 'Peace Lily', 
      category: 'Watering',
      active: false, 
      days: {M: true, T: true, W: true, Th: true, F: true, S: false, Su: false} 
    },
    { 
      id: '3', 
      time: '09:15', 
      title: 'Snake Plant', 
      category: 'Fertilizing',
      active: true, 
      days: {M: false, T: false, W: false, Th: false, F: true, S: true, Su: true} 
    },
    { 
      id: '4', 
      time: '12:45', 
      title: 'Monstera', 
      category: 'Pruning',
      active: false, 
      days: {M: true, T: false, W: true, Th: false, F: true, S: false, Su: false} 
    },
    { 
      id: '5', 
      time: '14:30', 
      title: 'Fiddle Leaf Fig', 
      category: 'Watering',
      active: true, 
      days: {M: true, T: false, W: true, Th: false, F: true, S: false, Su: false} 
    },
    { 
      id: '6', 
      time: '15:45', 
      title: 'Pothos', 
      category: 'Fertilizing',
      active: false, 
      days: {M: false, T: true, W: false, Th: true, F: false, S: true, Su: false} 
    },
    { 
      id: '7', 
      time: '17:00', 
      title: 'Orchid', 
      category: 'Watering',
      active: true, 
      days: {M: true, T: true, W: true, Th: true, F: true, S: true, Su: true} 
    },
    { 
      id: '8', 
      time: '19:15', 
      title: 'Rubber Plant', 
      category: 'Pruning',
      active: false, 
      days: {M: false, T: false, W: false, Th: false, F: false, S: true, Su: true} 
    }
  ]);

  // Load fonts using useFonts hook
  const [fontsLoaded] = useFonts({
    'Nunito-Bold': require('../../assets/fonts/Nunito-Bold.ttf'),
  });

  useEffect(() => {
    // Simulate data loading (in a real app, this would fetch from API or storage)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [isFocused]);

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
    // Update the reminders state to toggle the active property of the reminder with the given id
    setReminders(prevReminders => 
      prevReminders.map(reminder => 
        reminder.id === id 
          ? { ...reminder, active: !reminder.active } 
          : reminder
      )
    );
    console.log(`Toggled reminder ${id}`);
  };

  const handleDayPress = (day) => {
    // Navigate to addReminder with the selected day
    navigation.navigate('addReminder', { title: `Add Reminder for ${day.day}, ${day.month} ${day.date}` });
  };

  const handleEditReminder = (reminder) => {
    // Navigate to addReminder with the reminder data for editing
    navigation.navigate('addReminder', { 
      title: 'Edit Reminder',
      reminderData: reminder 
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerContainer}>
          {/* PLANT REMINDER Header */}
          <Text style={styles.headerTitle}>PLANT REMINDER</Text>
          <View style={styles.divider} />
        </View>

        {/* Upcoming Days */}
        <View style={styles.upcomingContainer}>
          <View style={styles.daysRow}>
            {upcomingDays.map((day) => (
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
                        {item.time}
                      </Text>
                      <Text style={[
                        styles.reminderTitle,
                        item.active ? styles.activeText : styles.inactiveText
                      ]}>
                        {item.title}
                      </Text>
                    </View>
                    
                    <View style={styles.daysSwitchContainer}>
                      {/* Weekday indicators */}
                      <View style={styles.daysContainer}>
                        {Object.entries(item.days).map(([day, isActive], index) => (
                          <Text 
                            key={index} 
                            style={[
                              styles.dayIndicator,
                              isActive && styles.activeDayIndicator,
                              !item.active && isActive && styles.inactiveDayIndicator
                            ]}
                          >
                            {day}
                          </Text>
                        ))}
                      </View>
                      
                      {/* Toggle switch */}
                      <Switch
                        trackColor={{ false: '#D9ECE1', true: '#7BAB91' }}
                        thumbColor={'#fff'}
                        ios_backgroundColor="#D9ECE1"
                        onValueChange={() => handleToggleReminder(item.id)}
                        value={item.active}
                        style={styles.reminderSwitch}
                      />
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
        onPress={() => navigation.navigate('addReminder', { title: 'Add Reminder' })}
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
    paddingHorizontal: 16,
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
    fontSize: 28,
    fontFamily: 'Nunito',
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  divider: {
    height: 2,
    backgroundColor: '#448461',
    marginBottom: 20,
    width: '70%', // Approximately 4/6 of the screen width
  },
  upcomingContainer: {
    marginBottom: 25,
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
    width: '23%', // Adjusted to fit 4 cards with small spacing
    justifyContent: 'flex-start',
    position: 'relative',
  },
  dayName: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: '#000',
    textAlign: 'left',
    marginBottom: 8,
  },
  dateContainer: {
    marginTop: 6,
  },
  yearText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 10,
    color: '#000',
    opacity: 0.7,
  },
  dateText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 10,
    color: '#000',
  },
  seeMoreText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 10,
    color: '#7BAB91',
    opacity: 0.8,
    position: 'absolute',
    bottom: 8,
    right: 8,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: '#000',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginVertical: 15,
    justifyContent: 'space-between',
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#448461',
    backgroundColor: 'transparent',
    minWidth: 100,
    alignItems: 'center',
  },
  categoryButtonSelected: {
    backgroundColor: '#448461',
  },
  categoryText: {
    fontFamily: 'Nunito-Bold',
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
    height: 80,
    position: 'relative',
  },
  reminderCardBackground: {
    position: 'absolute',
    top: 0,
    left: 5,
    right: 0,
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
    left: 0,
    right: 8,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reminderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
  reminderTime: {
    fontFamily: 'Nunito-Bold',
    fontSize: 22,
    marginBottom: 4,
  },
  reminderTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
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
  },
  daysContainer: {
    flexDirection: 'row',
    marginRight: 12,
  },
  dayIndicator: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    marginRight: 2,
    color: '#CCCCCC',
  },
  activeDayIndicator: {
    color: '#448461',
  },
  inactiveDayIndicator: {
    color: '#AAC8B8',
  },
  reminderSwitch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
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
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: '#999',
  }
});
