import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({ children }: any) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('@theme').then(theme => {
      if (theme === 'light') setIsDarkMode(false);
    });
  }, []);

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem('@theme', newMode ? 'dark' : 'light');
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      background: isDarkMode ? '#060912' : '#f5f5f5',
      card: isDarkMode ? '#1a1f2b' : '#ffffff',
      text: isDarkMode ? '#ffffff' : '#000000',
      subText: isDarkMode ? '#aaaaaa' : '#666666',
      primary: '#ff3b30',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);