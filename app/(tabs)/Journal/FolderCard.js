import { ImageBackground, StyleSheet, Text, View } from 'react-native';

export default function FolderCard({ title, image }) {
  return (
    <View style={styles.container}>
      <ImageBackground source={image} style={styles.image} imageStyle={styles.imageStyle}>
        <View style={styles.overlay} />
        {/* Teks judul folder */}
        <Text style={styles.title}>{title}</Text>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    borderRadius: 15,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
  },
  title: {
    fontSize: 18,
    color: '#448461', 
    textAlign: 'center',
    paddingHorizontal: 5,
    fontFamily: 'Nunito-ExtraBold', // Gunakan font yang sesuai
  },
});