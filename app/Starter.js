import StarterPage from '../components/StarterPage';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useCallback } from 'react';
import { useFonts } from 'expo-font';

SplashScreen.preventAutoHideAsync(); // Supaya manual

export default function Starter() {
  const [fontsLoaded] = useFonts({
    'Nunito-Regular': require('../assets/fonts/Nunito-Regular.ttf'),
    'Nunito-Bold': require('../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-SemiBold': require('../assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Italic': require('../assets/fonts/Nunito-Italic.ttf'),
    'Nunito-Black': require('../assets/fonts/Nunito-Black.ttf'),
    'Nunito-Light': require('../assets/fonts/Nunito-Light.ttf'),
    'Nunito-Medium': require('../assets/fonts/Nunito-Medium.ttf'),
    'Nunito-BoldItalic': require('../assets/fonts/Nunito-BoldItalic.ttf'),
    'Nunito-ExtraBold': require('../assets/fonts/Nunito-ExtraBold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync(); // ✅ Baru sembunyikan splash screen
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null; // ⏳ Tunggu font selesai

  return <StarterPage />;
}
