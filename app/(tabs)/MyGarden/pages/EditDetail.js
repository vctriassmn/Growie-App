import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { plants } from '../data'; // sesuaikan path
import { SafeAreaView } from 'react-native-safe-area-context';

import { getImage } from '../getImage';


import BackIcon from '../../../../assets/icons/back.svg';
import Edit1Icon from '../../../../assets/icons/editdetail.svg';

export default function EditPlant() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const plant = plants.find(p => p.id === parseInt(id));

    const imageSource = getImage(plant.image);
    const imageExists = !!imageSource; 


    const [name, setName] = useState(plant.name);
    const [age, setAge] = useState(String(plant.age));
    const [notes, setNotes] = useState(plant.notes);

    const handleSave = () => {
        // Simulasi update (nanti kamu ganti logic-nya dengan store/database update)
        console.log('Updated plant:', { name, age, notes });
        router.replace(`/plant/${plant.id}`);
    };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#694B40' }}>
        <StatusBar style="light" backgroundColor="#694B40" />
        <ScrollView style={styles.container}>
            {/* back button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push(`/MyGarden/plant/${id}`)}
            >
                <BackIcon width={40} height={40} />
            </TouchableOpacity>


            {/* Image Container */}
                <View style={styles.imageContainer}>
                    {imageExists ? (
                        <View style={styles.imageWrapper}>
                            <Image
                            source={getImage(plant.image)}
                            style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').width * 7 / 9 }}
                            resizeMode="cover"
                            />
                            <View style={styles.overlay}></View>
                        </View>
                    ) : (
                        <View style={styles.placeholder}>
                            <Text style={styles.placeholderText}>🪴 No image available</Text>
                        </View>
                    )}
                <View style={{backgroundColor: 'black', opacity: 0.4}}></View>
            </View>

            <Text style={styles.label}>Edit Plant Details</Text>
            <TextInput
                style={styles.input}
                placeholder="Plant Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Age (days)"
                value={age}
                keyboardType="numeric"
                onChangeText={setAge}
            />
            <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="Notes"
                value={notes}
                multiline
                onChangeText={setNotes}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>
        </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#FAFFFB',
    },
    container: {
        backgroundColor: '#FAFFFB',
    },
    backButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        zIndex: 999,
    },

    imageWrapper: {
        flex: 1,
        position: 'relative',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width * 7 / 9,
        backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: 2,
    },

    imageContainer: {
        width: '100%',
        marginBottom: 16,
        backgroundColor: '#D3E6DB',
        alignSelf: 'stretch',
        alignItems: 'center',
    },

    image: {
        width: '100%',
        aspectRatio: 0.75, // atau 1.33 untuk landscape, 1 untuk square
        borderRadius: 12,
        backgroundColor: '#D3E6DB',
    },
    
    placeholder: {
        width: '100%',
        aspectRatio: 0.75,
        borderRadius: 12,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },

    placeholderText: {
        fontSize: 16,
        color: '#666',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        backgroundColor: '#F0F0F0',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 12,
    },
    saveText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});