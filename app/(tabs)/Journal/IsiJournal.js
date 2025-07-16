// File: app/(tabs)/Journal/IsiJournal.js

import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Dummy data untuk semua entri, termasuk konten dan gambar penuh
const allJournalEntries = {
    '1a': {
        day: 'Day - 1',
        title: 'My Baby Spinach',
        image: require('../../../assets/images/babyspinach.png'), // Ganti dengan path gambar yang sesuai
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    '2a': {
        day: 'Day - 2',
        title: 'My Baby Spinach',
        image: require('../../../assets/images/babyspinach.png'),
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    '3a': {
        day: 'Day - 3',
        title: 'My Baby Spinach',
        image: require('../../../assets/images/babyspinach.png'),
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    '4a': {
        day: 'Day - 4',
        title: 'My Baby Spinach',
        image: require('../../../assets/images/babyspinach.png'),
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    '5a': {
        day: 'Day - 5',
        title: 'My Baby Spinach',
        image: require('../../../assets/images/babyspinach.png'),
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    '1b': {
        day: 'Hari Ke-1',
        title: 'Nanem Jagung',
        image: require('../../../assets/images/babyspinach.png'),
        content: 'Mulai menanam jagung, semoga tumbuh subur. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Mulai menanam jagung, semoga tumbuh subur. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    '2b': {
        day: 'Hari Ke-2',
        title: 'Nanem Jagung',
        image: require('../../../assets/images/babyspinach.png'),
        content: 'Penyiraman pertama, tanah masih lembab. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    // Tambahkan data dummy lainnya untuk folder 'Daily Progress' dan 'Beginner Guide'
    // ...
};

export default function IsiJournalScreen() {
    const { entryId } = useLocalSearchParams();
    const journalEntry = allJournalEntries[entryId];

    if (!journalEntry) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <Text style={styles.errorText}>Journal entry not found!</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header (Back, Title, More) */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={30} color="#000000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{journalEntry.title}</Text>
                    <TouchableOpacity onPress={() => console.log('More options')}>
                        <Ionicons name="ellipsis-vertical" size={30} color="#694B40" />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    <Text style={styles.entryDay}>{journalEntry.day}</Text>
                    <Image source={journalEntry.image} style={styles.mainImage} />
                    <Text style={styles.entryContent}>{journalEntry.content}</Text>

                    {/* Tiga tombol di bagian bawah */}
                    <View style={styles.bottomButtonsContainer}>
                        <TouchableOpacity style={styles.bottomButton} onPress={() => console.log('Button 1 pressed')} />
                        <TouchableOpacity style={styles.bottomButton} onPress={() => console.log('Button 2 pressed')} />
                        <TouchableOpacity style={styles.bottomButton} onPress={() => console.log('Button 3 pressed')} />
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FAFFFB',
    },
    container: {
        flex: 1,
        backgroundColor: '#FAFFFB',
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 40,
        marginTop: 10,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#6A804F',
    },
    scrollContainer: {
        paddingBottom: 50,
    },
    entryDay: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#448461',
        marginBottom: 30,
    },
    mainImage: {
        width: '100%',
        height: 250,
        borderRadius: 25,
        marginBottom: 30,
    },
    entryContent: {
        fontSize: 14,
        color: '#448461',
        lineHeight: 22,
        marginBottom: 30,
        textAlign: 'justify', // Menjadikan tulisan rata kanan kiri
        paddingRight:10,
        paddingLeft: 10,
    },
    bottomButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 15,
    },
    bottomButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#D9ECE1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 50,
    },
});