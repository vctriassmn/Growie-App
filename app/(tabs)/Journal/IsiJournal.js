// File: app/(tabs)/Journal/IsiJournal.js (Kode Final yang Bersih)

import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useJournalAndArticle } from '../../../context/JournalAndArticleStore';

export default function IsiJournalScreen() {
    // 1. Ambil ID yang dibutuhkan dari parameter rute
    const { folderTitle, entryId } = useLocalSearchParams();
    
    // 2. Ambil fungsi yang kita butuhkan dari context
    const { getJournalEntryById } = useJournalAndArticle();

    // 3. Ambil data HANYA dari context sebagai sumber kebenaran tunggal
    const journalEntry = getJournalEntryById(folderTitle, entryId);
    
    // HAPUS: const allJournalEntries = {...}
    // HAPUS: const [fontsLoaded] = useFonts({...})

    // Tampilan jika data tidak ditemukan
    if (!journalEntry) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <Text style={styles.errorText}>Entri Jurnal tidak ditemukan!</Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.backLink}>Kembali ke Daftar</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={30} color="#000000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{folderTitle}</Text>
                    <TouchableOpacity onPress={() => console.log('More options')}>
                        <Ionicons name="ellipsis-vertical" size={30} color="#694B40" />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    <Text style={styles.entryDay}>{journalEntry.day}</Text>
                    
                    <Image 
                        source={journalEntry.image} // Tambahkan gambar placeholder
                        style={styles.mainImage} 
                    />
                    
                    <Text style={styles.entryContent}>{journalEntry.content}</Text>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

// Stylesheet yang sudah diperbarui dengan font global
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FAFFFB',
    },
    container: {
        flex: 1,
        backgroundColor: '#FAFFFB',
        paddingHorizontal: 20,
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
        color: '#6A804F',
        fontFamily: 'Nunito-Bold', // Gunakan font global
    },
    scrollContainer: {
        paddingBottom: 50,
    },
    entryDay: {
        fontSize: 20,
        color: '#448461',
        marginBottom: 30,
        fontFamily: 'Nunito-Bold', // Gunakan font global
    },
    mainImage: {
        width: '100%',
        height: 250,
        borderRadius: 25,
        marginBottom: 30,
        backgroundColor: '#e0e0e0' // Warna latar jika gambar gagal dimuat
    },
    entryContent: {
        fontSize: 14,
        color: '#448461',
        lineHeight: 22,
        marginBottom: 30,
        textAlign: 'justify',
        paddingHorizontal: 10,
        fontFamily: 'Nunito-Regular', // Gunakan font global
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 50,
        fontFamily: 'Nunito-Regular',
    },
    backLink: {
        fontSize: 16,
        color: '#448461',
        textAlign: 'center',
        marginTop: 20,
        fontFamily: 'Nunito-Bold',
        textDecorationLine: 'underline',
    }
});