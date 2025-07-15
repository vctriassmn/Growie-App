import { Tabs } from 'expo-router';
import BottomNavBar from '../../components/navbar'; // Pastikan path ini benar

export default function TabLayout() {
  return (
    <Tabs
      // Penting: Pastikan tidak ada prop 'style' di sini jika Anda melihat warning 'Invalid prop `style` supplied to `React.Fragment`'
      // Tabs component itu sendiri tidak menerima prop style untuk children-nya.
      // Jika ada style yang diterapkan ke <Tabs>, itu akan menjadi style container navigator.
      tabBar={({ navigation, state, descriptors }) => (
        <BottomNavBar
          navigation={navigation}
          // currentRouteName harus cocok dengan 'name' di Tabs.Screen
          currentRouteName={state.routes[state.index].name}
        />
      )}
      screenOptions={{
        headerShown: false, // Sembunyikan header default
        tabBarStyle: { display: 'none' }, // Sembunyikan tab bar default Expo Router
      }}
    >
      {/* Definisi setiap tab - NAMA HARUS SESUAI NAMA FILE (tanpa .js) */}
      <Tabs.Screen
        name="Home" // Akan merender app/(tabs)/Home.js
        options={{
          title: 'Home', // Teks yang bisa digunakan oleh navbar kustom
        }}
      />
      <Tabs.Screen
        name="Article" // Akan merender app/(tabs)/Article.js
        options={{
          title: 'Article',
        }}
      />
      <Tabs.Screen
        name="Reminder" // Akan merender app/(tabs)/Reminder.js
        options={{
          title: 'Reminder',
        }}
      />
      <Tabs.Screen
        name="Journal" // Akan merender app/(tabs)/Journal.js (sebelumnya ListFolderJournal/ListJournalPage)
        options={{
          title: 'Journal',
        }}
      />
      <Tabs.Screen
        name="MyGarden" // Akan merender app/(tabs)/MyGarden.js
        options={{
          title: 'My garden', // Teks tampilan di UI bisa pakai spasi
        }}
      />
    </Tabs>
  );
}
