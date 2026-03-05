import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GameProvider } from './context/GameContext';
import { AppProvider } from './context/AppContext';
import { TabNavigator } from './navigation/TabNavigator';
import { Colors } from './constants/colors';

export default function App() {
  return (
    <SafeAreaProvider>
      <GameProvider>
        <AppProvider>
          <NavigationContainer
            theme={{
              dark: false,
              colors: {
                primary: Colors.primary,
                background: Colors.background,
                card: Colors.surface,
                text: Colors.text,
                border: Colors.border,
                notification: Colors.primary,
              },
              fonts: {
                regular: { fontFamily: 'System', fontWeight: '400' },
                medium: { fontFamily: 'System', fontWeight: '500' },
                bold: { fontFamily: 'System', fontWeight: '700' },
                heavy: { fontFamily: 'System', fontWeight: '800' },
              },
            }}
          >
            <StatusBar style="dark" />
            <TabNavigator />
          </NavigationContainer>
        </AppProvider>
      </GameProvider>
    </SafeAreaProvider>
  );
}
