import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { plants } from '../data';
import PlantCard from '../components/PlantCard';

export default function Home() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🌿 Welcome to My Garden!</Text>
      <View>
        {plants.map(plant => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});