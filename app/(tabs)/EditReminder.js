import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import RNModal from "react-native-modal";
import { useFonts } from 'expo-font';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ITEM_HEIGHT = 18; // Lebih kecil lagi sesuai kebutuhan
const ITEM_GAP = 8; // Mengurangi gap vertikal
const VISIBLE_ITEMS = 7; // Tetap menampilkan 7 item

const days = [
  {id: 'mon', label: 'M'}, // Monday
  {id: 'tue', label: 'T'}, // Tuesday
  {id: 'wed', label: 'W'}, // Wednesday
  {id: 'thu', label: 'T'}, // Thursday
  {id: 'fri', label: 'F'}, // Friday
  {id: 'sat', label: 'S'}, // Saturday
  {id: 'sun', label: 'S'}, // Sunday
];

export default function EditReminderScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [initialHour, setInitialHour] = useState(8);
  const [initialMinute, setInitialMinute] = useState(50);
  const [initialName, setInitialName] = useState("");
  const [initialCategory, setInitialCategory] = useState("WATERING");
  const [initialRepeater, setInitialRepeater] = useState("DAILY");
  const [initialSelectedDays, setInitialSelectedDays] = useState(['mon']);
  const [initialNotes, setInitialNotes] = useState("");
  
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState(50);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("WATERING"); // Default to watering
  const [repeater, setRepeater] = useState("DAILY"); // Default to daily
  const [selectedDays, setSelectedDays] = useState(['mon']); // Default to Monday
  const [selectedWeeks, setSelectedWeeks] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [notes, setNotes] = useState("");
  const [showDateModal, setShowDateModal] = useState(false);
  const [reminderId, setReminderId] = useState(null);

  const [fontsLoaded] = useFonts({
    'Nunito-Bold': require('../../assets/fonts/Nunito-Bold.ttf'),
  });

  // Handle route params and direct props
  const params = route.params || {};
  console.log("Route params in EditReminder:", params);
  
  // Check if reminderData exists in route params
  const reminderData = params.reminderData || null;
  console.log("Reminder Data detail in EditReminder:", reminderData);
  
  // Title for the screen
  const reminderTitle = reminderData 
    ? `${reminderData.title}`
    : "Edit Reminder";

  // Determine if there are unsaved changes by comparing current values to initial values
  const hasUnsavedChanges = () => {
    return hour !== initialHour || 
           minute !== initialMinute || 
           name !== initialName || 
           category !== initialCategory || 
           repeater !== initialRepeater ||
           JSON.stringify(selectedDays) !== JSON.stringify(initialSelectedDays) ||
           notes !== initialNotes;
  };

  // Populate form with existing reminder data if in edit mode
  useEffect(() => {
    // Tambahkan timeout kecil untuk memastikan parameter telah tersedia
    const timer = setTimeout(() => {
      // Akses ulang parameter route untuk memastikan data terbaru
      const currentParams = route.params || {};
      const currentReminderData = currentParams.reminderData || null;
      
      console.log("UseEffect timeout called with reminderData in EditReminder:", currentReminderData);
      
      if (currentReminderData) {
        console.log("Setting data from reminderData in EditReminder");
        setReminderId(currentReminderData.id);
        
        // Set plant name
        setName(currentReminderData.title || "");
        setInitialName(currentReminderData.title || "");
        
        // Set category
        if (currentReminderData.category) {
          const categoryUpper = currentReminderData.category.toUpperCase();
          console.log("Setting category:", categoryUpper);
          setCategory(categoryUpper);
          setInitialCategory(categoryUpper);
        } else {
          console.log("No category found, defaulting to WATERING");
          setCategory("WATERING"); // Default category
          setInitialCategory("WATERING");
        }
      
        // Set time (hour & minute) langsung dari properti hour dan minute
        if (currentReminderData.hour && currentReminderData.minute) {
          const hourInt = parseInt(currentReminderData.hour, 10);
          const minuteInt = parseInt(currentReminderData.minute, 10);
          setHour(hourInt);
          setMinute(minuteInt);
          setInitialHour(hourInt);
          setInitialMinute(minuteInt);
        } else if (currentReminderData.time) {
          // Fallback untuk format lama dengan properti time
          const [hourStr, minuteStr] = currentReminderData.time.split('.');
          const hourInt = parseInt(hourStr, 10);
          const minuteInt = parseInt(minuteStr, 10);
          setHour(hourInt);
          setMinute(minuteInt);
          setInitialHour(hourInt);
          setInitialMinute(minuteInt);
        }
        
        // Set repeater sesuai dengan frequency dari currentReminderData
        if (currentReminderData.frequency) {
          const repeaterUpper = currentReminderData.frequency.toUpperCase();
          setRepeater(repeaterUpper);
          setInitialRepeater(repeaterUpper);
        } else {
          setRepeater("DAILY"); // Default ke DAILY jika tidak ada
          setInitialRepeater("DAILY");
        }
        
        if (currentReminderData.days) {
          // Urutan hari yang benar dalam days array
          const dayIds = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
          const dayLetters = ['Mo', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'];
          
          const selectedDayIds = [];
          
          // Periksa setiap hari dalam urutan yang benar
          dayLetters.forEach((letter, index) => {
            if (currentReminderData.days[letter]) {
              selectedDayIds.push(dayIds[index]);
            }
          });
          
          console.log("Selected day IDs in EditReminder:", selectedDayIds);
          
          // If no days were selected, default to Monday
          if (selectedDayIds.length === 0) {
            selectedDayIds.push('mon');
          }
          
          setSelectedDays(selectedDayIds);
          setInitialSelectedDays([...selectedDayIds]); // Save a copy for comparison
        } else {
          // Default to Monday if no days data
          setSelectedDays(['mon']);
          setInitialSelectedDays(['mon']);
        }
        
        // Set notes if available
        if (currentReminderData.note) {
          setNotes(currentReminderData.note);
          setInitialNotes(currentReminderData.note);
        } else if (currentReminderData.notes) {
          setNotes(currentReminderData.notes);
          setInitialNotes(currentReminderData.notes);
        } else {
          setNotes("");
          setInitialNotes("");
        }
      }
    }, 100); // timeout 100ms untuk memastikan rute params sudah diproses
    
    // Cleanup timer ketika komponen unmount
    return () => clearTimeout(timer);
  }, [route.params]); // Membuat useEffect bergantung pada route.params

  if (!fontsLoaded) {
    return null;
  }

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  // Refs for FlatList to allow scrolling programmatically
  const hourListRef = useRef(null);
  const minuteListRef = useRef(null);

  // Scroll to the correct time values when the component mounts
  useEffect(() => {
    if (hourListRef.current && minuteListRef.current) {
      setTimeout(() => {
        // Scroll to the hour
        hourListRef.current.scrollToIndex({
          index: hour,
          animated: true,
        });
        
        // Scroll to the minute
        minuteListRef.current.scrollToIndex({
          index: minute,
          animated: true,
        });
      }, 300); // Small timeout to ensure rendering is complete
    }
  }, [hour, minute]);

  const onScrollEnd = (e, type) => {
    const index = Math.round(e.nativeEvent.contentOffset.y / (ITEM_HEIGHT + ITEM_GAP));
    if (type === "hour") {
      setHour(parseInt(hours[index], 10));
    } else {
      setMinute(parseInt(minutes[index], 10));
    }
  };

  const toggleDay = (dayId) => {
    setSelectedDays((prev) =>
      prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId]
    );
  };

  const toggleWeek = (week) => {
    setSelectedWeeks((prev) =>
      prev.includes(week) ? prev.filter((w) => w !== week) : [...prev, week]
    );
  };

  const toggleDate = (d) => {
    setSelectedDates((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  const renderItem = (item) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>
        {item}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            // Konfirmasi jika sudah mengubah data
            if (hasUnsavedChanges()) {
              Alert.alert(
                'Konfirmasi',
                'Perubahan belum disimpan. Yakin ingin kembali?',
                [
                  {
                    text: 'Batal',
                    style: 'cancel'
                  },
                  {
                    text: 'Ya, Kembali',
                    onPress: () => navigation.navigate('Reminder')
                  }
                ]
              );
            } else {
              navigation.navigate('Reminder');
            }
          }}
        >
          <Ionicons name="chevron-back" size={24} color="#444" />
        </TouchableOpacity>
        <Text style={styles.title}>{reminderTitle}</Text>
      </View>

      {/* TIME SCROLLER */}
      <View style={styles.scrollerWrapper}>
        {/* HIGHLIGHT di bawah angka, absolute di parent */}
        <View
          style={styles.highlightOverlay}
          pointerEvents="none"
        >
          <Text
            style={{
              fontSize: 16,
              color: "green",
              position: "absolute",
              right: 10,
            }}
          >
            ✓
          </Text>
        </View>
        <View style={styles.listWrapper}>
          <FlatList
            ref={hourListRef}
            data={hours}
            keyExtractor={(item) => `hour-${item}`}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT + ITEM_GAP}
            decelerationRate="fast"
            style={{ flexGrow: 0, zIndex: 2 }}
            initialScrollIndex={hour}
            contentContainerStyle={{
              paddingTop: (ITEM_HEIGHT + ITEM_GAP) * Math.floor(VISIBLE_ITEMS / 2),
              paddingBottom: (ITEM_HEIGHT + ITEM_GAP) * Math.floor(VISIBLE_ITEMS / 2),
            }}
            onMomentumScrollEnd={(e) => onScrollEnd(e, "hour")}
            renderItem={({ item }) => renderItem(item)}
            getItemLayout={(_, index) => ({ length: ITEM_HEIGHT + ITEM_GAP, offset: (ITEM_HEIGHT + ITEM_GAP) * index, index })}
            onScrollToIndexFailed={(info) => {
              console.log('Scroll to index failed for hour:', info);
            }}
          />
        </View>
        <View style={styles.listWrapper}>
          <FlatList
            ref={minuteListRef}
            data={minutes}
            keyExtractor={(item) => `minute-${item}`}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT + ITEM_GAP}
            decelerationRate="fast"
            style={{ flexGrow: 0, zIndex: 2 }}
            initialScrollIndex={minute}
            contentContainerStyle={{
              paddingTop: (ITEM_HEIGHT + ITEM_GAP) * Math.floor(VISIBLE_ITEMS / 2),
              paddingBottom: (ITEM_HEIGHT + ITEM_GAP) * Math.floor(VISIBLE_ITEMS / 2),
            }}
            onMomentumScrollEnd={(e) => onScrollEnd(e, "minute")}
            renderItem={({ item }) => renderItem(item)}
            getItemLayout={(_, index) => ({ length: ITEM_HEIGHT + ITEM_GAP, offset: (ITEM_HEIGHT + ITEM_GAP) * index, index })}
            onScrollToIndexFailed={(info) => {
              console.log('Scroll to index failed for minute:', info);
            }}
          />
        </View>
      </View>

      {/* NON-SCROLLABLE CARD SECTION */}
      <View style={styles.fixedCardWrapper}>
        <View style={styles.fixedCard}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputTransparent}
              value={name}
              onChangeText={setName}
              placeholderTextColor="#7A8B7A"
              placeholder="Enter reminder name"
            />
            <Text style={styles.labelInside}>REMINDER NAME</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.categoryRow}>
              {["WATERING", "FERTILIZING", "PRUNING"].map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.categoryOption,
                    category === c && styles.categoryOptionActive,
                  ]}
                  onPress={() => setCategory(c)}
                >
                  <Text style={[
                    styles.categoryOptionText,
                    category === c && styles.categoryOptionTextActive
                  ]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.divider} />
          </View>

          <View style={styles.section}>
            <View style={styles.repeaterContainer}>
              <Text style={styles.repeaterLabel}>REPEATER</Text>
              <View style={styles.repeaterOptionsRow}>
                {["DAILY", "WEEKLY", "MONTHLY"].map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[
                      styles.repeaterOption,
                      repeater === r && styles.repeaterOptionActive,
                    ]}
                    onPress={() => setRepeater(r)}
                  >
                    <Text style={[
                      styles.repeaterOptionText,
                      repeater === r && styles.repeaterOptionTextActive
                    ]}>{r}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {repeater === "DAILY" && (
              <View style={[styles.row, { justifyContent: 'center', marginTop: 10 }]}>
                {days.map((day) => (
                  <TouchableOpacity
                    key={day.id}
                    style={[
                      styles.circleSmall,
                      selectedDays.includes(day.id) && styles.circleActive,
                    ]}
                    onPress={() => toggleDay(day.id)}
                  >
                    <Text style={styles.circleText}>{day.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {repeater === "WEEKLY" && (
              <View style={[styles.row, { justifyContent: 'center', marginTop: 10 }]}>
                {[1, 2, 3, 4].map((w) => (
                  <TouchableOpacity
                    key={w}
                    style={[
                      styles.weekOption,
                      selectedWeeks.includes(w) && styles.weekOptionActive,
                    ]}
                    onPress={() => toggleWeek(w)}
                  >
                    <Text style={[
                      styles.weekOptionText,
                      selectedWeeks.includes(w) && styles.weekOptionTextActive
                    ]}>Week {w}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {repeater === "MONTHLY" && (
              <View style={{ marginTop: 10 }}>
                <TouchableOpacity
                  style={styles.chooseDateButton}
                  onPress={() => setShowDateModal(true)}
                >
                  <Text style={styles.chooseDateText}>Choose Date</Text>
                </TouchableOpacity>
                {selectedDates.length > 0 && (
                  <View style={styles.selectedDatesContainer}>
                    <Text style={styles.selectedDatesLabel}>Selected Dates:</Text>
                    <View style={styles.selectedDatesWrapper}>
                      {selectedDates.map((d) => (
                        <Text key={d} style={styles.selectedDateItem}>{d}</Text>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>

          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>NOTES</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any notes here..."
              placeholderTextColor="#99918e"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* SAVE BUTTON */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            // Validate form
            if (!name.trim()) {
              alert('Please enter a plant name');
              return;
            }
            
            if (!category) {
              alert('Please select a category');
              return;
            }
            
            // Prepare the updated reminder data
            console.log("Preparing updated reminder");
            
            const updatedReminder = {
              id: reminderId || new Date().getTime().toString(), // Use existing ID or create new one
              hour: hour.toString().padStart(2, '0'),
              minute: minute.toString().padStart(2, '0'),
              title: name,
              category: category ? category.charAt(0) + category.slice(1).toLowerCase() : "Watering", // Capitalize properly
              active: reminderData ? reminderData.active : true, // Preserve active state
              days: {}, // We'll populate this below
              frequency: repeater.toLowerCase(), // Simpan frequency
              note: notes // Simpan notes
            };

            // Array indeks yang benar untuk memastikan penempatan huruf yang tepat
            // Urutan ini harus sama dengan urutan di Reminder.js
            const dayIndices = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
            const dayLetters = ['Mo', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'];
            
            // Initialize all days to false
            dayLetters.forEach(day => {
              updatedReminder.days[day] = false;
            });
            
            // Set selected days to true
            selectedDays.forEach(selectedDayId => {
              // Cari indeks hari yang sesuai
              const index = dayIndices.indexOf(selectedDayId);
              if (index !== -1 && index < dayLetters.length) {
                updatedReminder.days[dayLetters[index]] = true;
              }
            });
            
            // Pass the updated reminder back to the Reminder screen
            console.log("Sending updated reminder to Reminder screen:", updatedReminder);
            
            navigation.navigate('Reminder', { 
              updatedReminder: updatedReminder,
              isNewReminder: false // this is an edit, not a new reminder
            });
          }}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>

      <RNModal isVisible={showDateModal}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>Date per Month</Text>
          </View>
          <View style={styles.datesGrid}>
            {/* Render dates in rows of 7 to mimic a calendar */}
            {[...Array(5)].map((_, weekIndex) => (
              <View key={`week-${weekIndex}`} style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 2 }}>
                {[...Array(7)].map((_, dayIndex) => {
                  const dateNum = weekIndex * 7 + dayIndex + 1;
                  if (dateNum <= 31) {
                    return (
                      <TouchableOpacity
                        key={`date-${dateNum}`}
                        style={[
                          styles.dateCircle,
                          selectedDates.includes(dateNum) && styles.dateCircleSelected,
                        ]}
                        onPress={() => toggleDate(dateNum)}
                      >
                        <Text style={[
                          styles.dateText,
                          selectedDates.includes(dateNum) && styles.dateTextSelected
                        ]}>{dateNum}</Text>
                      </TouchableOpacity>
                    );
                  }
                  return <View key={`empty-${weekIndex}-${dayIndex}`} style={{ width: 40, height: 40, margin: 2 }} />;
                })}
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => setShowDateModal(false)}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </RNModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16,
    paddingBottom: 20, // Extra bottom padding to avoid navbar overlap 
    backgroundColor: "#fff" 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backText: {
    fontSize: 24,
    color: '#6A804F',
  },
  title: { 
    fontSize: 24, 
    fontFamily: 'Nunito-Bold',
    color: '#6A804F',
    flex: 1,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 6,
  },
  labelInside: {
    position: 'absolute',
    left: 10,
    top: 8,
    backgroundColor: "#448461",
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
    fontSize: 13,
    color: '#FFFFFF',
    fontFamily: 'Nunito-Bold',
    zIndex: 1,
    alignSelf: 'center',
    
  },
  inputTransparent: {
    borderWidth: 1.5,
    borderColor: "#7F995E",
    borderRadius: 30,
    paddingVertical: 10,
    paddingLeft: 140, // Space for the label
    paddingRight: 20,
    backgroundColor: 'transparent',
    fontSize: 14,
    height: 40,
  },
  scrollerWrapper: {
    flexDirection: "row",
    position: "relative",
    justifyContent: "center",
    marginBottom: 10,
    marginTop: 5,
    overflow: "visible",
  },
  listWrapper: {
    width: 70,
    height: (ITEM_HEIGHT + ITEM_GAP) * VISIBLE_ITEMS,
    overflow: "hidden",
    marginHorizontal: 15,
    alignItems: "center",
    zIndex: 2,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B8CDB5",
    borderRadius: 12,
    width: 65,
    marginTop: ITEM_GAP/2,
    marginBottom: ITEM_GAP/2,
  },
  itemText: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    color: "#000000",
    lineHeight: 18,
    textAlign: 'center',
  },
  highlightOverlay: {
    position: "absolute",
    left: 10,
    right: 10,
    top: (ITEM_HEIGHT + ITEM_GAP) * Math.floor(VISIBLE_ITEMS / 2),
    height: ITEM_HEIGHT + 8,
    backgroundColor: "#FFF5DD",
    borderRadius: 5,
    marginHorizontal: 2,
    zIndex: 0,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  // NEW: fixed card wrapper and card with shadow
  fixedCardWrapper: {
    marginTop: 8,
    alignItems: 'center',
    width: '100%',
  },
  fixedCard: {
    backgroundColor: '#D9ECE1',
    borderRadius: 18,
    padding: 14,
    paddingBottom: 20, // Slightly reduced padding at the bottom
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 7,
    marginBottom: 10,
    minHeight: 430, // Reduced minimum height to prevent navbar overlap
  },
  label: {
    backgroundColor: "#A5C5A0",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    borderRadius: 8,
    marginVertical: 4,
    fontSize: 13,
    color: '#2C3A2C',
    fontFamily: 'Nunito-Bold',
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 7,
    marginBottom: 8,
    backgroundColor: "#fff",
    fontSize: 13,
  },
  notesContainer: {
    position: 'relative',
    marginBottom: 8,
    marginTop: 29, // Increased top margin to create more space for label
  },
  notesLabel: {
    position: 'absolute',
    top: -16, // Moved the label higher up
    backgroundColor: "#448461",
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
    fontSize: 13,
    color: '#FFFFFF',
    fontFamily: 'Nunito-Bold',
    zIndex: 1,
    elevation: 3, // Added elevation for better shadow on Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  notesInput: {
    borderWidth: 1.5,
    borderColor: "#7F995E",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'transparent',
    fontSize: 13,
    height: 100, // Reduced height to fit the card better
    textAlignVertical: 'top',
    marginTop: 16, // Increased top margin to create more space below the label
  },
  section: { 
    marginVertical: 6 
  },
  row: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    marginVertical: 2
  },
  // Small option button
  categoryRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  categoryOption: {
    backgroundColor: "transparent",
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginHorizontal: 6,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#7F995E",
  },
  categoryOptionActive: {
    backgroundColor: "#FBF2D6",
    borderColor: "#7F995E",
  },
  categoryOptionText: {
    fontSize: 11,
    fontFamily: 'Nunito-Bold',
    color: '#7F995E',
  },
  categoryOptionTextActive: {
    color: '#7F995E',
  },
  divider: {
    height: 1,
    backgroundColor: '#A5C5A0',
    marginVertical: 10,
    width: '100%',
  },
  repeaterContainer: {
    borderWidth: 1.5,
    borderColor: "#7F995E",
    borderRadius: 30,
    padding: 10,
    position: 'relative',
    paddingLeft: 101, // Space for the label
    paddingRight: 10,
    // marginBottom: 5,
    backgroundColor: 'transparent',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  repeaterLabel: {
    position: 'absolute',
    left: 10,
    top: 7,
    backgroundColor: "#448461",
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
    fontSize: 13,
    color: '#FFFFFF',
    fontFamily: 'Nunito-Bold',
    zIndex: 1,
  },
  repeaterOptionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  repeaterOption: {
    backgroundColor: "#ABC29F",
    paddingVertical: 5,
    paddingHorizontal: 2,
    marginHorizontal: 4,
    borderRadius: 18,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    minWidth: 70,
  },
  repeaterOptionActive: {
    backgroundColor: "#FBF2D6",
  },
  repeaterOptionText: {
    fontSize: 11,
    fontFamily: 'Nunito-Bold',
    color: '#FAFFFB',
  },
  repeaterOptionTextActive: {
    color: '#7F995E',
  },
  weekOption: {
    backgroundColor: "#ABC29F",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 6,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  weekOptionActive: {
    backgroundColor: "#FBF2D6",
  },
  weekOptionText: {
    fontSize: 11,
    fontFamily: 'Nunito-Bold',
    color: '#FAFFFB',
  },
  weekOptionTextActive: {
    color: '#7F995E',
  },
  chooseDateButton: {
    backgroundColor: "#FBF2D6",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  chooseDateText: {
    fontSize: 13,
    fontFamily: 'Nunito-Bold',
    color: '#7F995E',
  },
  selectedDatesContainer: {
    marginTop: 5,
  },
  selectedDatesLabel: {
    fontSize: 13,
    fontFamily: 'Nunito-Bold',
    color: '#7F995E',
    marginBottom: 5,
  },
  selectedDatesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedDateItem: {
    backgroundColor: "rgba(127, 153, 94, 0.2)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    margin: 3,
    borderRadius: 12,
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
    color: '#7F995E',
  },
  optionSmall: {
    backgroundColor: "#eee",
    paddingVertical: 4,
    paddingHorizontal: 10,
    margin: 3,
    borderRadius: 8,
    minWidth: 0,
    minHeight: 0,
  },
  optionTextSmall: {
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
    color: '#2C3A2C',
  },
  optionActive: { backgroundColor: "#A5C5A0" },
  // Small circle for days/dates
  circleSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(127, 153, 94, 0.3)", // #7F995E with 30% opacity
    justifyContent: "center",
    alignItems: "center",
    margin: 6,
  },
  circleActive: {
    backgroundColor: "#7BAB91", // Solid color when selected
  },
  circleText: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    color: '#D9ECE1', // Text color
  },
  saveButton: {
    backgroundColor: "#fff",
    borderWidth: 2, // Increased border width for more emphasis
    borderColor: '#694B40', // Changed border color to #694B40
    paddingVertical: 10,
    paddingHorizontal: 36, // Increased horizontal padding for better proportions
    alignItems: "center",
    marginTop: 8,
    borderRadius: 22, // Increased border radius to make it more rounded
    alignSelf: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, // Increased shadow opacity
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#7F995E', // Changed text color to #7F995E
    fontSize: 17.5,
    fontFamily: 'Nunito-Bold',
    fontWeight: '900', // Adding extra font weight to make it bolder
    letterSpacing: 0.3, // Adding slight letter spacing for better readability
  },
  modal: {
    backgroundColor: "#DDEEDC",
    padding: 16,
    borderRadius: 16,
  },
  modalHeader: {
    backgroundColor: "#448461",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    alignSelf: "center",
    width: "60%",
  },
  modalHeaderText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
  },
  datesGrid: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center", // Center the entire grid horizontally
    paddingHorizontal: 0,
    marginTop: 5,
  },
  dateCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(127, 153, 94, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
    // Guaranteeing 7 columns per row with fixed width
    marginHorizontal: 4,
  },
  dateCircleSelected: {
    backgroundColor: "#FBF2D6",
  },
  dateText: {
    color: "#FFFFFF",
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
  },
  dateTextSelected: {
    color: "#7F995E",
  },
  doneButton: {
    backgroundColor: "#448461",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 16,
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
  },
});
