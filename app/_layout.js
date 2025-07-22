// Lokasi file: app/_layout.js

import { Stack } from 'expo-router';
// 1. Impor UserProvider dari folder context
import { UserProvider } from '../context/UserContext';

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack initialRouteName="Starter" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Starter" />
        <Stack.Screen name="(tabs)" />

      </Stack>
    </UserProvider>
  );
}