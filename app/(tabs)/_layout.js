import { useFonts } from 'expo-font';
import { Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import BottomNavBar from '../../components/navbar';
import { UserProvider } from '../../context/UserContext';
import { JournalAndArticleProvider } from '../../context/JournalAndArticleStore';

// Mencegah splash screen hilang secara otomatis sebelum font selesai dimuat
SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  // --- MULAI LOGIKA PEMUATAN FONT ---
  // Muat semua variasi font yang Anda inginkan dari folder assets/fonts/
  const [fontsLoaded, fontError] = useFonts({
    'Nunito-Light': require('../../assets/fonts/Nunito-Light.ttf'),
    'Nunito-Regular': require('../../assets/fonts/Nunito-Regular.ttf'),
    'Nunito-Italic': require('../../assets/fonts/Nunito-Italic.ttf'),
    'Nunito-Medium': require('../../assets/fonts/Nunito-Medium.ttf'),
    'Nunito-SemiBold': require('../../assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Bold': require('../../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-ExtraBold': require('../../assets/fonts/Nunito-ExtraBold.ttf'),
    'Nunito-Black': require('../../assets/fonts/Nunito-Black.ttf'),
    'Nunito-BoldItalic': require('../../assets/fonts/Nunito-BoldItalic.ttf'),
  });

  useEffect(() => {
    // Sembunyikan splash screen setelah font dimuat (atau jika ada error)
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Jika font belum dimuat atau ada error, jangan render apapun untuk menghindari FOUC (Flash of Unstyled Content)
  if (!fontsLoaded && !fontError) {
    return null;
  }
  // --- AKHIR LOGIKA PEMUATAN FONT ---

  // Setelah font dimuat, render seluruh aplikasi Anda seperti biasa
  return (
    <UserProvider>
      <JournalAndArticleProvider>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: 'none' },
          }}
          tabBar={({ navigation, state, descriptors }) => {
            const currentRouteName = state.routes[state.index].name;

            // Jangan tampilkan navbar di halaman-halaman ini
            if (currentRouteName === 'Journal/ListJournal' || currentRouteName === 'Journal/IsiJournal') {
              return null;
            }

            return (
              <BottomNavBar
                navigation={navigation}
                currentRouteName={currentRouteName}
              />
            );
          }}
        >
          <Tabs.Screen
            name="Home"
            options={{
              title: 'Home',
            }}
          />
          <Tabs.Screen
            name="Article"
            options={{
              title: 'Article',
            }}
          />
          <Tabs.Screen
            name="Reminder"
            options={{
              title: 'Reminder',
            }}
          />
          <Tabs.Screen
            name="Journal"
            options={{
              title: 'Journal',
            }}
          />
          <Tabs.Screen
            name="MyGarden"
            options={{
              title: 'My garden',
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
            }}
          />
          {/* Tambahkan screen lain di bawah <Tabs> jika ada */}
        </Tabs>
      </JournalAndArticleProvider>
    </UserProvider>
  );
}