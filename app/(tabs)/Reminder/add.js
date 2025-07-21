import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import RNModal from "react-native-modal";
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import WheelPicker from 'react-native-wheel-picker-android';

const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

function AddReminderScreen({ route }) {
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

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Nunito-Bold': require('../../assets/fonts/Nunito-Bold.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.log('Error loading fonts:', error);
        setFontsLoaded(true); // Continue even if font fails to load
      }
    }
    loadFonts();
  }, []);

  const reminderTitle = route?.params?.title || "Untitled";

  const onHourSelected = (index) => {
    setHour(hours[index]);
  };

  const onMinuteSelected = (index) => {
    setMinute(minutes[index]);
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

      {/* TIME PICKER */}
      <View style={styles.timePickerWrapper}>
        <View style={styles.wheelWrapper}>
          <WheelPicker
            style={styles.wheelPicker}
            data={hours}
            onItemSelected={onHourSelected}
            selectedItem={parseInt(hour)}
            selectedItemTextColor="#000000"
            itemTextColor="#666666"
            selectedItemTextSize={16}
            itemTextSize={16}
            initPosition={8}
            visibleItemCount={7}
          />
        </View>
        <View style={styles.wheelWrapper}>
          <WheelPicker
            style={styles.wheelPicker}
            data={minutes}
            onItemSelected={onMinuteSelected}
            selectedItem={parseInt(minute)}
            selectedItemTextColor="#000000"
            itemTextColor="#666666"
            selectedItemTextSize={16}
            itemTextSize={16}
            initPosition={50}
            visibleItemCount={7}
          />
        </View>
      </View>

      {/* REMINDER DETAILS */}
      <ScrollView style={styles.formContainer}>
        <View style={styles.card}>
        <Text style={styles.label}>REMINDER NAME</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <View style={styles.section}>
          <Text style={styles.label}>CATEGORY</Text>
          <View style={styles.row}>
            {["Watering", "Fertilizing", "Pruning"].map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.option,
                  category === c && styles.optionActive,
                ]}
                onPress={() => setCategory(c)}
              >
                <Text>{c}</Text>
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
                  styles.option,
                  repeater === r && styles.optionActive,
                ]}
                onPress={() => setRepeater(r)}
              >
                <Text>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {repeater === "DAILY" && (
            <View style={styles.row}>
              {days.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.circle,
                    selectedDays.includes(d) && styles.optionActive,
                  ]}
                  onPress={() => toggleDay(d)}
                >
                  <Text>{d}</Text>
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
                    styles.option,
                    selectedWeeks.includes(w) && styles.optionActive,
                  ]}
                  onPress={() => toggleWeek(w)}
                >
                  <Text>Week {w}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {repeater === "MONTHLY" && (
            <>
              <TouchableOpacity
                style={styles.option}
                onPress={() => setShowDateModal(true)}
              >
                <Text>Choose Date</Text>
              </TouchableOpacity>

              <View style={styles.row}>
                {selectedDates.map((d) => (
                  <Text key={d} style={{ margin: 2 }}>
                    {d}
                  </Text>
                ))}
              </View>
            </>
          )}
        </View>

        <Text style={styles.label}>NOTES</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </View>

      <TouchableOpacity style={styles.saveButton}>
        <Text>Save Changes</Text>
      </TouchableOpacity>
      </ScrollView>

      <RNModal isVisible={showDateModal}>
        <View style={styles.modal}>
          <Text style={styles.label}>Date per Month</Text>
          <View style={styles.datesGrid}>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <TouchableOpacity
                key={d}
                style={[
                  styles.circle,
                  selectedDates.includes(d) && styles.optionActive,
                ]}
                onPress={() => toggleDate(d)}
              >
                <Text>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            onPress={() => setShowDateModal(false)}
            style={styles.saveButton}
          >
            <Text>Done</Text>
          </TouchableOpacity>
        </View>
      </RNModal>
    </View>
  );
}

export default AddReminderScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: "#fff" 
  },
  formContainer: {
    flex: 1,
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
  timePickerWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    padding: 16,
  },
  wheelWrapper: {
    marginHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 8,
  },
  wheelPicker: {
    width: 70,
    height: 200,
  },
  card: { backgroundColor: "#DDEEDC", borderRadius: 16, padding: 16 },
  label: {
    backgroundColor: "#A5C5A0",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    borderRadius: 8,
    marginVertical: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  section: { marginVertical: 8 },
  row: { flexDirection: "row", flexWrap: "wrap", marginVertical: 4 },
  option: {
    backgroundColor: "#eee",
    padding: 8,
    margin: 4,
    borderRadius: 8,
  },
  optionActive: { backgroundColor: "#A5C5A0" },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
  },
  saveButton: {
    backgroundColor: "#DDEEDC",
    padding: 12,
    alignItems: "center",
    marginTop: 16,
    borderRadius: 16,
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
