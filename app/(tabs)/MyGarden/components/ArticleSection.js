import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ArticleSection = ({ notes }) => (
  <View style={styles.container}>
    <Text style={styles.title}>📝 Journal / Article</Text>
    <Text>{notes}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
});

export default ArticleSection;