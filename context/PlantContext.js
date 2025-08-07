import React, { createContext, useState, useContext } from 'react';

// Data awal tanaman
export const initialPlants = [
  {
    id: 1,
    name: "Snorlax",
    age: 643,
    waterLevel: 67,
    waterFrequency: 3,
    condition: "Healthy",
    notes: "Snorlax lives in a ceramic Snorlax pot. It’s chill and calming. This plant thrives in indirect sunlight and prefers a consistent watering schedule. Occasionally, its leaves need to be wiped to remove dust and keep them healthy. Snorlax is quite resilient and rarely shows signs of stress. It brings a peaceful atmosphere to any room and is a favorite among visitors.",
    image: "snorlax",
    cat: "Succulents",
  },
  {
    id: 2,
    name: "Kraken",
    age: 73,
    waterLevel: 50,
    waterFrequency: 4,
    condition: "Sick",
    notes: "Kraken is wild and needs attention. Its leaves have started to droop, indicating it may need more humidity or a change in watering routine. Regular misting helps, but it also benefits from occasional fertilizer. Kraken is sensitive to temperature changes, so keeping it away from drafts is important. With proper care, it can recover and become a striking centerpiece.",
    image: "kraken",
    cat: "Vegetables",
  },
  {
    id: 3,
    name: "Three Musketeers Lorem Ipsum Dolor Sit Amet",
    age: 120,
    waterLevel: 80,
    waterFrequency: 2,
    condition: "Healthy",
    notes: "Three Musketeers love sunlight and grow fast. They require frequent watering, especially during the growing season. Their vibrant leaves add a splash of color to the garden. Pruning helps maintain their shape and encourages new growth. These plants are easy to propagate, making them a great choice for expanding your collection.",
    image: "three",
    cat: "Succulents",
  },
  {
    id: 4,
    name: "Lily of the Valley",
    age: 300,
    waterLevel: 30,
    waterFrequency: 7,
    condition: "Dying",
    notes: "Lily of the Valley rarely needs water. Very resilient, it can withstand periods of neglect without showing much stress. Its delicate flowers bloom in the spring and fill the air with a sweet fragrance. The plant prefers cool, shaded areas and well-draining soil. Regularly checking for pests ensures it remains healthy year-round.",
    image: "lily",
    cat: "Flowers",
  },
  {
    id: 5,
    name: "Turtles",
    age: 45,
    waterLevel: 60,
    waterFrequency: 3,
    condition: "Healthy",
    notes: "Turtles enjoy misting and shade. They thrive in environments with high humidity and indirect light. Overwatering can be an issue, so it’s important to let the soil dry out between waterings. Their unique leaf patterns make them a conversation starter. With gentle care, Turtles can live for many years and continue to flourish.",
    image: "turtles",
    cat: "Climbers",
  },
  {
    id: 6,
    name: "Turtles",
    age: 45,
    waterLevel: 60,
    waterFrequency: 3,
    condition: "Sick",
    notes: "Turtles enjoy misting and shade. They thrive in environments with high humidity and indirect light. Overwatering can be an issue, so it’s important to let the soil dry out between waterings. Their unique leaf patterns make them a conversation starter. With gentle care, Turtles can live for many years and continue to flourish.",
    image: "turtles",
    cat: "Herbs",
  },
];  

// Context & Provider
const PlantContext = createContext();

export const PlantProvider = ({ children }) => {
  const [plants, setPlants] = useState(initialPlants);

  const addPlant = (newPlant) => {
    setPlants((prev) => [...prev, newPlant]);
  };

  const editPlant = (updatedPlant) => {
    setPlants((prev) =>
      prev.map((p) => (p.id === updatedPlant.id ? updatedPlant : p))
    );
  };

  const deletePlant = (id) => {
    setPlants((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <PlantContext.Provider value={{ plants, addPlant, editPlant, deletePlant }}>
      {children}
    </PlantContext.Provider>
  );
};

// Custom hook
export const usePlant = () => useContext(PlantContext);