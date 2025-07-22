import React from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';

import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { plants } from '../data';
import { getImage } from '../getImage';
import WaterStatus from '../components/WaterStatus';

import { Dimensions } from 'react-native';

import EditIcon from '../../../../assets/icons/edit.svg';
import BackIcon from '../../../../assets/icons/back.svg';

export const options = {
  tabBarStyle: { display: 'none' }, // untuk tab bawaan
  tabBarVisible: false,             // untuk beberapa custom layout (non-standard)
};

export default function PlantDetail() {
    const { id } = useLocalSearchParams();
    const plant = plants.find(p => p.id === parseInt(id));
    const imageSource = getImage(plant.image);
    const imageExists = !!imageSource; 
    const screenWidth = Dimensions.get('window').width;
    const router = useRouter();

    
    
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#694B40' }}>
            <StatusBar style="light" backgroundColor="#694B40" />
            <ScrollView style={styles.container}>
                {/* back button */}
                <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(tabs)/MyGarden/pages')}>
                    <BackIcon width={40} height={40} />
                </TouchableOpacity>

                {/* Image Container */}
                <View style={styles.imageContainer}>
                    {imageExists ? (
                        <Image
                            source={getImage(plant.image)}
                            style={{ width: screenWidth, height: screenWidth * 7 / 9 }}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.placeholder}>
                            <Text style={styles.placeholderText}>🪴 No image available</Text>
                        </View>
                    )}
                </View>

                <View style={styles.isi}>
                    {/* Header */}
                    <Text style={styles.name}>{plant.name}</Text>
                    <Text style={styles.notes}>{plant.notes}</Text>

                    {/* plant Info */}
                    <View style={styles.condition}>
                        {/* water level */}
                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <Text style={styles.title}>Water Level</Text>

                            <View style={[styles.box, {backgroundColor: '#D7F6F4'},]}>
                                <WaterStatus level={plant.waterLevel} frequency={plant.waterFrequency}/>
                            </View>
                        </View>
                        
                        {/* age */}
                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <Text style={styles.title}>Age</Text>

                            <View style={[styles.box, {backgroundColor: '#FBF2D6' }]}>
                                <Text style={[styles.main, { color: '#694B40'}]}>{plant.age}</Text>
                                <Text style={[styles.info, { color: '#694B40'}]}>days</Text>
                            </View>
                        </View>

                        {/* condition */}
                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <Text style={styles.title}>Condition</Text>

                            <View style={[styles.box, {backgroundColor: '#7BAB91'},]}>
                                {/* ini masih error dikit karena belom diadain gambar conditionnya yaa */}
                                <Image
                                    source={require('../../../../assets/images/mygarden/placeholder.jpg')}
                                    style={{width: 50, height: 50, borderRadius: 25, marginBottom: 4}}
                                    resizeMode="cover"
                                />
                                <Text style={[styles.info, { color: 'white'}]}>{plant.condition}</Text>
                            </View>
                        </View>
                    </View>

                </View>
            </ScrollView>

            {/* Edit Button */}
            <View style={[styles.container, {flex: 1}]}>
                <Link href={`/plant/${id}/edit`} asChild>
                    <TouchableOpacity style={styles.editButton}>
                        <EditIcon width={60} height={60} />
                    </TouchableOpacity>
                </Link>
            </View>


        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    // Main container
    container: {
        backgroundColor: '#FAFFFB',
    },
    // =======================================================================================
    
    // gambar taneman
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
    // =======================================================================================
    
    // keterangan / info taneman
    isi: {
        padding: 30,
        paddingTop: 20,
        backgroundColor: '#FAFFFB',
    },
    // --------------------------------------------------------
    
    // nama + notes
    name: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#448461',
        marginBottom: 8,
    },

    notes: {
        fontSize: 14,
        marginBottom: 4,
        color: '#448461',
        textAlign: 'justify',
        lineHeight: 22,

    },
    // --------------------------------------------------------
    
    // kondisi taneman
    condition: {
        marginTop: 30,
        width: '100%',
        // backgroundColor: '#F0F4F1',
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'stretch', // Make children take equal height
    },
    // --------------------------------------------------------

    // individunya
    box: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 100,
        minWidth: 102,
    },
    
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 4,
    },

    main: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#448461',
        marginBottom: 4,
    },

    info: {
        fontSize: 14,
        color: '#448461',
        marginBottom: 4,
    },
    // --------------------------------------------------------

    // button
    editButton: {
        position: 'absolute',
        bottom: 120,
        right: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },

    // back button
    backButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        zIndex: 999,
    },
    backText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }

});