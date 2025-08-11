// Lokasi file: app/_layout.js

import { Stack } from 'expo-router';
// 1. Impor UserProvider dari folder context
import { UserProvider } from '../context/UserContext';
import { ReminderProvider } from '../context/ReminderContext';
import { PlantProvider } from '../context/PlantContext';

export default function RootLayout() {
  return (
    <PlantProvider>
    <UserProvider>
      <ReminderProvider>
        <Stack initialRouteName="Starter" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Starter" />
          <Stack.Screen name="(tabs)" />

        </Stack>
      </ReminderProvider>
    </UserProvider>
    </PlantProvider>
  );
}