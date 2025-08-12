import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Reminder from './Reminder';
import AddReminder from './AddReminder';
import EditReminder from './EditReminder';

const Stack = createStackNavigator();

export default function ReminderWithStack() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator 
        initialRouteName="Reminder"
        screenOptions={{ 
          headerShown: false,
          detachInactiveScreens: false 
        }}
      >
        <Stack.Screen 
          name="Reminder" 
          component={Reminder} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="AddReminder" 
          component={AddReminder} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="EditReminder" 
          component={EditReminder}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}