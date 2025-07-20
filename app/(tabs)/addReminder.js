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

const ITEM_HEIGHT = 20; // Lebih kecil lagi sesuai prototype
const ITEM_GAP = 14; // Memperbesar gap vertikal antara item
const VISIBLE_ITEMS = 7; // Menampilkan 7 item sesuai prototype

const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export default function AddReminderScreen({ route }) {
  const navigation = useNavigation();
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState(50);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Watering");
  const [repeater, setRepeater] = useState("DAILY");
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

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
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
          onPress={() => navigation.navigate('Reminder')}
          style={styles.backButton}
        >
          <Text style={styles.backText}>←</Text>
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
          <Text style={styles.label}>REMINDER NAME</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Reminder name"
            placeholderTextColor="#7A8B7A"
          />

          <View style={styles.section}>
            <Text style={styles.label}>CATEGORY</Text>
            <View style={styles.row}>
              {["Watering", "Fertilizing", "Pruning"].map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.optionSmall,
                    category === c && styles.optionActive,
                  ]}
                  onPress={() => setCategory(c)}
                >
                  <Text style={styles.optionTextSmall}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>REPEATER</Text>
            <View style={styles.row}>
              {["DAILY", "WEEKLY", "MONTHLY"].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.optionSmall,
                    repeater === r && styles.optionActive,
                  ]}
                  onPress={() => setRepeater(r)}
                >
                  <Text style={styles.optionTextSmall}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {repeater === "DAILY" && (
              <View style={styles.row}>
                {days.map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[
                      styles.circleSmall,
                      selectedDays.includes(d) && styles.optionActive,
                    ]}
                    onPress={() => toggleDay(d)}
                  >
                    <Text style={styles.optionTextSmall}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {repeater === "WEEKLY" && (
              <View style={styles.row}>
                {[1, 2, 3, 4].map((w) => (
                  <TouchableOpacity
                    key={w}
                    style={[
                      styles.optionSmall,
                      selectedWeeks.includes(w) && styles.optionActive,
                    ]}
                    onPress={() => toggleWeek(w)}
                  >
                    <Text style={styles.optionTextSmall}>Week {w}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {repeater === "MONTHLY" && (
              <>
                <TouchableOpacity
                  style={styles.optionSmall}
                  onPress={() => setShowDateModal(true)}
                >
                  <Text style={styles.optionTextSmall}>Choose Date</Text>
                </TouchableOpacity>

                <View style={styles.row}>
                  {selectedDates.map((d) => (
                    <Text key={d} style={{ margin: 2, fontSize: 12 }}>
                      {d}
                    </Text>
                  ))}
                </View>
              </>
            )}
          </View>

          <Text style={styles.label}>NOTES</Text>
          <TextInput
            style={[styles.input, { height: 60, fontSize: 13 }]}
            value={notes}
            onChangeText={setNotes}
            multiline
            placeholder="Write a notes here..."
            placeholderTextColor="#7A8B7A"
          />
        </View>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>

      <RNModal isVisible={showDateModal}>
        <View style={styles.modal}>
          <Text style={styles.label}>Date per Month</Text>
          <View style={styles.datesGrid}>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <TouchableOpacity
                key={d}
                style={[
                  styles.circleSmall,
                  selectedDates.includes(d) && styles.optionActive,
                ]}
                onPress={() => toggleDate(d)}
              >
                <Text style={styles.optionTextSmall}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            onPress={() => setShowDateModal(false)}
            style={styles.saveButton}
          >
            <Text style={styles.saveButtonText}>Done</Text>
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
    backgroundColor: "#fff" 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 30,
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
  scrollerWrapper: {
    flexDirection: "row",
    position: "relative",
    justifyContent: "center",
    marginBottom: 16,
    marginTop: 8,
    overflow: "visible",
  },
  listWrapper: {
    width: 82,
    height: (ITEM_HEIGHT + ITEM_GAP) * VISIBLE_ITEMS,
    overflow: "hidden",
    marginHorizontal: 20,
    alignItems: "center",
    zIndex: 2,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B8CDB5",
    borderRadius: 15,
    width: 78,
    marginTop: ITEM_GAP/2,
    marginBottom: ITEM_GAP/2,
  },
  itemText: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: "#000000",
    lineHeight: 20,
    textAlign: 'center',
  },
  highlightOverlay: {
    position: "absolute",
    left: 12,
    right: 12,
    top: (ITEM_HEIGHT + ITEM_GAP) * Math.floor(VISIBLE_ITEMS / 2),
    height: ITEM_HEIGHT + 13,
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
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 7,
    marginBottom: 10,
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
  section: { marginVertical: 6 },
  row: { flexDirection: "row", flexWrap: "wrap", marginVertical: 2 },
  // Small option button
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
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    margin: 3,
  },
  saveButton: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: '#6A804F',
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems: "center",
    marginTop: 10,
    borderRadius: 16,
    alignSelf: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#6A804F',
    fontSize: 17,
    fontFamily: 'Nunito-Bold',
  },
  modal: {
    backgroundColor: "#DDEEDC",
    padding: 16,
    borderRadius: 16,
  },
  datesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
});
