import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* PENTING: StarterPage harus menjadi Stack.Screen PERTAMA */}
      <Stack.Screen name="StarterPage" options={{ headerShown: false }} />

      {/* Ini adalah navigator tab Anda. Ketika onboarding selesai, kita akan navigasi ke sini. */}
      {/* Nama "(tabs)" harus cocok dengan nama folder Anda: app/(tabs) */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Anda bisa menambahkan rute lain di sini jika ada */}
    </Stack>
  );
}