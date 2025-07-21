import { Tabs } from 'expo-router';
import BottomNavBar from '../../components/navbar';
import { UserProvider } from '../../context/UserContext';
import { JournalAndArticleProvider } from '../../context/JournalAndArticleStore';

export default function TabLayout() {
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
        </Tabs>
      </JournalAndArticleProvider>
    </UserProvider>
  );
}