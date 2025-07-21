import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
} from "react-native";
import RNModal from "react-native-modal";
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
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

export default function AddReminderScreen({ route }) {
  const navigation = useNavigation();
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState(50);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [repeater, setRepeater] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedWeeks, setSelectedWeeks] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [notes, setNotes] = useState("");
  const [showDateModal, setShowDateModal] = useState(false);

  const [fontsLoaded] = useFonts({
    'Nunito-Bold': require('../../assets/fonts/Nunito-Bold.ttf'),
  });

  const reminderTitle = route?.params?.title || "Untitled";

  if (!fontsLoaded) {
    return null;
  }

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const onScrollEnd = (e, type) => {
    const index = Math.round(e.nativeEvent.contentOffset.y / (ITEM_HEIGHT + ITEM_GAP));
    if (type === "hour") {
      setHour(hours[index]);
    } else {
      setMinute(minutes[index]);
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
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Reminder')}>
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
            data={hours}
            keyExtractor={(item) => `hour-${item}`}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT + ITEM_GAP}
            decelerationRate="fast"
            style={{ flexGrow: 0, zIndex: 2 }}
            initialScrollIndex={8}
            contentContainerStyle={{
              paddingTop: (ITEM_HEIGHT + ITEM_GAP) * Math.floor(VISIBLE_ITEMS / 2),
              paddingBottom: (ITEM_HEIGHT + ITEM_GAP) * Math.floor(VISIBLE_ITEMS / 2),
            }}
            onMomentumScrollEnd={(e) => onScrollEnd(e, "hour")}
            renderItem={({ item }) => renderItem(item)}
            getItemLayout={(_, index) => ({ length: ITEM_HEIGHT + ITEM_GAP, offset: (ITEM_HEIGHT + ITEM_GAP) * index, index })}
          />
        </View>
        <View style={styles.listWrapper}>
          <FlatList
            data={minutes}
            keyExtractor={(item) => `minute-${item}`}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT + ITEM_GAP}
            decelerationRate="fast"
            style={{ flexGrow: 0, zIndex: 2 }}
            initialScrollIndex={50}
            contentContainerStyle={{
              paddingTop: (ITEM_HEIGHT + ITEM_GAP) * Math.floor(VISIBLE_ITEMS / 2),
              paddingBottom: (ITEM_HEIGHT + ITEM_GAP) * Math.floor(VISIBLE_ITEMS / 2),
            }}
            onMomentumScrollEnd={(e) => onScrollEnd(e, "minute")}
            renderItem={({ item }) => renderItem(item)}
            getItemLayout={(_, index) => ({ length: ITEM_HEIGHT + ITEM_GAP, offset: (ITEM_HEIGHT + ITEM_GAP) * index, index })}
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
              <View style={[styles.row, { justifyContent: 'flex-start', marginTop: 10, paddingLeft: 15 }]}>
                <TouchableOpacity
                  style={styles.chooseDateButton}
                  onPress={() => setShowDateModal(true)}
                >
                  <Text style={styles.chooseDateText}>Choose Date</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.divider} />
          
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>NOTES</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              multiline
              placeholder="Write a notes here..."
              placeholderTextColor="#7A8B7A"
            />
          </View>
        </View>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={() => navigation.navigate('Reminder')}
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
                  // Only render dates 1-31
                  if (dateNum > 31) {
                    // Return empty placeholder to maintain grid structure
                    return <View key={`empty-${dayIndex}`} style={{ width: 40, height: 40, margin: 2, marginHorizontal: 4 }} />;
                  }
                  
                  return (
                    <TouchableOpacity
                      key={dateNum}
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
                })}
              </View>
            ))}
          </View>
          <TouchableOpacity
            onPress={() => setShowDateModal(false)}
            style={styles.doneButton}
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
  selectedDateChip: {
    backgroundColor: "rgba(127, 153, 94, 0.2)",
    paddingVertical: 3,
    paddingHorizontal: 8,
    margin: 3,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDateText: {
    fontSize: 11,
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
