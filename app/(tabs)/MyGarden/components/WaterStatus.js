import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WaterStatus = ({ level, frequency }) => (
  <View style={{ alignItems: 'center', justifyContent: 'space-between' }}>  
    <Text style={styles.main}>{level}%</Text>
    <Text style={styles.info}>Every {frequency} Days</Text>
  </View>
);

const styles = StyleSheet.create({
  
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
});

export default WaterStatus;