import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { ThemeProvider } from '../context/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack 
        screenOptions={{ 
          headerShown: false, 
          animation: Platform.OS === 'web' ? 'none' : 'fade' 
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="search" />
        <Stack.Screen name="saved" />
        <Stack.Screen name="history" /> 
        <Stack.Screen name="downloads" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="edit-profile" />
        <Stack.Screen name="category" />
        <Stack.Screen name="movie/[id]" />
        <Stack.Screen name="movie/player" />
        <Stack.Screen name="movie/full-player" />
        <Stack.Screen name="person/[id]" />
      </Stack>
    </ThemeProvider>
  );
}