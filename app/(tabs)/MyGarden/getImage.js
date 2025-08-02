const images = {
  snorlax: require('../../../assets/images/mygarden/snorlax.jpg'),
  kraken: require('../../../assets/images/mygarden/kraken.jpg'),
  turtles: require('../../../assets/images/mygarden/turtles.jpg'),
  three: require('../../../assets/images/mygarden/three.jpg'),
  lily: require('../../../assets/images/mygarden/lily.jpg'),
  placeholder: require('../../../assets/images/mygarden/placeholder.jpg'),
};

export function getImage(source) {
  console.log('getImage called with:', source);

  if (typeof source === 'string') {
    if (source.startsWith('file://')) {
      return { uri: source }; // ✅ URI dari ImagePicker
    }
    return images[source] || images['placeholder']; // ✅ Nama preset
  }

  return images['placeholder']; // fallback
}