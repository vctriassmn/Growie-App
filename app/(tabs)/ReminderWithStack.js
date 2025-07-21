import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Reminder from './Reminder';
import AddReminder from './addReminder';

const Stack = createStackNavigator();

export default function ReminderWithStack() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Reminder" component={ReminderScreen} />
        <Stack.Screen name="AddReminder" component={AddReminderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}