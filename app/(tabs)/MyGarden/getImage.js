const images = {
    snorlax: require('../../../assets/images/mygarden/snorlax.jpg'),
    kraken: require('../../../assets/images/mygarden/kraken.jpg'),
    turtles: require('../../../assets/images/mygarden/turtles.jpg'),
    three: require('../../../assets/images/mygarden/three.jpg'),
    lily: require('../../../assets/images/mygarden/lily.jpg'),
    placeholder: require('../../../assets/images/mygarden/placeholder.jpg'),
};

export function getImage(name) {
  console.log('getImage called with:', name);
  return images[name] || images['placeholder'];
}