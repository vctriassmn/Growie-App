import { StyleSheet, Text, View } from 'react-native';

export default function HomePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ini adalah Halaman My Garden</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8f0',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5c8d5c',
  },
});
