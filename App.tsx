import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Src/screens/HomeScreen';
import HistoryScreen from './Src/screens/HistoryScreen';

import { TimerProvider } from './Src/context/TimerContext';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <TimerProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
  </TimerProvider>
  );
};

export default App;