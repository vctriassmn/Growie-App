import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

const PlantCard = ({ plant }) => (
  <Link href={`MyGarden/plant/${plant.id}`} asChild>
    <TouchableOpacity style={styles.card}>
      <Text style={styles.name}>{plant.name}</Text>
      <Text>Age: {plant.age} days</Text>
      <Text>Condition: {plant.condition}</Text>
    </TouchableOpacity>
  </Link>
);

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
});

export default PlantCard;