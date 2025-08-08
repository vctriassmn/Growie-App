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
    fontFamily: 'Nunito-SemiBold',
    color: '#316569',
    marginBottom: 4,
  },

  info: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#316569',
    marginBottom: 4,
  },
});

export default WaterStatus;