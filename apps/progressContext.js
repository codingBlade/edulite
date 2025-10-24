import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';

export const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(0);
  const [badges, setBadges] = useState([]);

  // Load saved progress from AsyncStorage when app starts
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const savedProgress = await AsyncStorage.getItem('userProgress');
        const savedBadges = await AsyncStorage.getItem('userBadges');

        if (savedProgress !== null) setProgress(JSON.parse(savedProgress));
        if (savedBadges !== null) setBadges(JSON.parse(savedBadges));
      } catch (e) {
        console.log('Error loading progress:', e);
      }
    };

    loadProgress();
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    AsyncStorage.setItem('userProgress', JSON.stringify(progress));
    AsyncStorage.setItem('userBadges', JSON.stringify(badges));
  }, [progress, badges]);

  // Example logic to award badges
  const addProgress = () => {
    const newProgress = progress + 1;
    setProgress(newProgress);

    if (newProgress === 1 && !badges.includes('First Step')) {
      setBadges([...badges, 'First Step']);
    } else if (newProgress === 5 && !badges.includes('Halfway There')) {
      setBadges([...badges, 'Halfway There']);
    }
  };

  return <ProgressContext.Provider value={{ progress, badges, addProgress }}>{children}</ProgressContext.Provider>;
};
