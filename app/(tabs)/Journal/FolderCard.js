import { ImageBackground, StyleSheet, Text, View } from 'react-native';

export default function FolderCard({ title, image }) {
  return (
    <View style={styles.container}>
      <ImageBackground source={image} style={styles.image} imageStyle={styles.imageStyle}>
        <View style={styles.overlay} />
        <Text style={styles.title}>{title}</Text>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Mengisi ruang yang tersedia di folderContainer
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
    backgroundColor: 'rgba(0,0,0,0.1)', // Mengurangi opasitas agar gambar lebih terlihat
    borderRadius: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: 5,
  },
});