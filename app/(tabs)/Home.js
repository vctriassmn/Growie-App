import { StyleSheet, Text, View, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomePage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ini adalah Halaman Home</Text>
      <Button title="Go to Profile" onPress={() => router.push('/Profile')} />
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
    marginBottom: 20,
  },
});
