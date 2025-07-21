import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Alert,
    Image
} from 'react-native';

// Import context yang sudah kita buat
import { useJournalAndArticle } from '../../context/JournalAndArticleStore';

// Data contoh untuk jurnal. Dalam aplikasi nyata, ini bisa dari state atau database.
const initialJournalEntries = [
    {
        id: 'journal-1',
        name: 'My First Journal Entry',
        description: 'Today I planted a beautiful new sunflower in my garden.',
        image: require('../../assets/images/peacelily.png'),
        avatar: require('../../assets/images/pp.jpg'),
        username: 'JournalUser',
        date: 'July 20, 2025',
        photoOfTheDayImage: require('../../assets/images/plant.png'),
        quote: '"Sunflowers always make me happy."',
        fullArticle: 'My first entry about planting a sunflower. It was a great day. I hope it grows tall and strong!',
    },
    {
        id: 'journal-2',
        name: 'Caring for a new cactus',
        description: 'A little guide on how to not overwater your cactus.',
        image: require('../../assets/images/plant.png'),
        avatar: require('../../assets/images/pp.jpg'),
        username: 'CactusLover',
        date: 'July 19, 2025',
        photoOfTheDayImage: require('../../assets/images/alatgardening.png'),
        quote: '"Less water, more sun!"',
        fullArticle: 'I recently got a new cactus and learned that they need very little water. Just a little every few weeks is enough to keep it healthy and happy.',
    },
    // Tambahkan entri jurnal lainnya di sini
];

const JournalScreen = () => {
    // Mengambil fungsi dari context
    const { publishedArticles, addPublishedArticle } = useJournalAndArticle();

    // State lokal untuk entri jurnal
    const [journalEntries, setJournalEntries] = useState(initialJournalEntries);
    
    // Fungsi untuk menandai sebuah jurnal sebagai "published"
    const isPublished = (journalId) => {
        return publishedArticles.some(article => article.id === journalId);
    };

    const handlePublish = (journalEntry) => {
        // Panggil fungsi dari context untuk menambahkan artikel
        addPublishedArticle(journalEntry);
        Alert.alert('Published!', `${journalEntry.name} has been published to your articles.`);
    };

    const renderItem = ({ item }) => (
        <View style={styles.journalCard}>
            <Image source={item.image} style={styles.journalImage} />
            <View style={styles.journalContent}>
                <Text style={styles.journalTitle}>{item.name}</Text>
                <Text style={styles.journalDescription}>{item.description}</Text>
            </View>
            <View style={styles.buttonContainer}>
                {isPublished(item.id) ? (
                    <Text style={styles.publishedText}>Published</Text>
                ) : (
                    <TouchableOpacity
                        style={styles.publishButton}
                        onPress={() => handlePublish(item)}
                    >
                        <Text style={styles.buttonText}>Publish</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>My Journal</Text>
            </View>
            <FlatList
                data={journalEntries}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: 100,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#448461',
        paddingBottom: 15,
    },
    headerText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
    listContent: {
        paddingVertical: 20,
    },
    journalCard: {
        flexDirection: 'row',
        backgroundColor: '#FBF2D6',
        borderRadius: 10,
        marginHorizontal: 20,
        marginBottom: 15,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    journalImage: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
    },
    journalContent: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
    },
    journalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    journalDescription: {
        fontSize: 12,
        color: '#666',
    },
    buttonContainer: {
        justifyContent: 'center',
        paddingRight: 10,
    },
    publishButton: {
        backgroundColor: '#448461',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    publishedText: {
        color: 'green',
        fontWeight: 'bold',
        paddingHorizontal: 15,
    }
});

export default JournalScreen;