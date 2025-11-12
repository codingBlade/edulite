import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { badge_Tier } from '../Badges/badge_Tier';

// Key constants for storage
const STORAGE_KEYS = {
  PROGRESS: 'user_progress',
  BADGE_INDEX: 'user_badge_index',
  CURRENT_LEVEL: 'user_current_level',
};

export default function ProgressScreen() {
  const [progress, setProgress] = useState(0);
  const [badgeIndex, setBadgeIndex] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [expToNextLevel, setExpToNextLevel] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const currentBadge = badge_Tier[badgeIndex];
  const badgeColor = currentBadge.color ?? '#FFD700';
  const badgeIcon = currentBadge.icon ?? currentBadge.icon ?? '🏅';

  // Calculate required EXP based on tier (gets harder each tier)
  const getRequiredExp = (tier: number) => {
    const baseExp = 150;
    //this multiplier makes it so that its 50% harder to tier up each time
    const tierMultiplier = 1 + tier * 0.5;
    return Math.floor(baseExp * tierMultiplier);
  };

  // Generate random EXP between 5-27, but less at higher tiers
  const getRandomExp = () => {
    const baseMin = 5;
    const baseMax = 27;
    const tierPenalty = badgeIndex * 2; // Higher tiers give less xp on average

    const minExp = Math.max(1, baseMin - tierPenalty);
    const maxExp = Math.max(minExp + 5, baseMax - tierPenalty);

    return Math.floor(Math.random() * (maxExp - minExp + 1)) + minExp;
  };

  // Load saved progress on app start
  useEffect(() => {
    loadProgress();
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveProgress();
    }
  }, [progress, badgeIndex, currentLevel]);

  // Initialize exp requirement when badgeIndex changes
  useEffect(() => {
    setExpToNextLevel(getRequiredExp(badgeIndex));
  }, [badgeIndex]);

  // Animate progress bar when progress changes
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (progress / expToNextLevel) * 100,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress, expToNextLevel]);

  // Load progress from AsyncStorage
  const loadProgress = async () => {
    try {
      const [savedProgress, savedBadgeIndex, savedCurrentLevel] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.PROGRESS),
        AsyncStorage.getItem(STORAGE_KEYS.BADGE_INDEX),
        AsyncStorage.getItem(STORAGE_KEYS.CURRENT_LEVEL),
      ]);

      if (savedProgress !== null) {
        setProgress(Number(savedProgress));
      }
      if (savedBadgeIndex !== null) {
        setBadgeIndex(Number(savedBadgeIndex));
      }
      if (savedCurrentLevel !== null) {
        setCurrentLevel(Number(savedCurrentLevel));
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      // Shows an error to the user if the data fails to load
      Alert.alert('Error', 'Failed to load your progress');
    } finally {
      setIsLoading(false);
    }
  };

  // Save progress to AsyncStorage
  const saveProgress = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.PROGRESS, progress.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.BADGE_INDEX, badgeIndex.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.CURRENT_LEVEL, currentLevel.toString()),
      ]);
    } catch (error) {
      console.error('Error saving progress:', error);
      // Shows an error to the user if the data fails to load
      Alert.alert('Error', 'Failed to save your progress');
    }
  };

  // Reset all progress (optional - for testing)
  const resetProgress = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.PROGRESS),
        AsyncStorage.removeItem(STORAGE_KEYS.BADGE_INDEX),
        AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_LEVEL),
      ]);
      setProgress(0);
      setBadgeIndex(0);
      setCurrentLevel(1);
      Alert.alert('Progress Reset', 'All progress has been reset');
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  };

  const handleIncrease = () => {
    const expGained = getRandomExp();

    setProgress((prev) => {
      const newProgress = prev + expGained;

      // If at max badge level stops xp gain
      if (badgeIndex >= badge_Tier.length - 1 && newProgress >= expToNextLevel) {
        Alert.alert('🏆 Max Level Reached', "You've earned the highest badge: 🎓!");
        return expToNextLevel;
      }

      // Check for level up
      if (newProgress >= expToNextLevel) {
        const nextBadgeIndex = badgeIndex + 1;
        const nextbadge = badge_Tier[nextBadgeIndex];

        // Update badge index and reset progress
        setBadgeIndex(nextBadgeIndex);
        setCurrentLevel((prev) => prev + 1);
        setProgress(0);

        // Show level up alert
        setTimeout(() => {
          Alert.alert(
            '🎉 Badge Tier Up!',
            `Congratulations! You've earned the ${nextbadge.name} Badge! ${nextbadge.icon ?? nextbadge.icon}`,
          );
        }, 100);

        return 0;
      }

      return newProgress;
    });
  };

  // Get all earned badges (all badges up to current badgeIndex)
  const earnedBadges = badge_Tier.slice(0, badgeIndex + 1);

  // Progress bar that shows the required xp and needed xp to next level
  const ProgressWithSteps = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
              backgroundColor: badgeColor,
            },
          ]}
        />
        <View style={styles.expTextContainer}>
          <Text style={styles.expText}>
            {progress} / {expToNextLevel} EXP
          </Text>
        </View>
      </View>
    </View>
  );

  // Check if the user has reached max level
  const isMaxLevel = badgeIndex >= badge_Tier.length - 1;

  // if the data is still loading, show a loading indicator
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading your progress...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <Text style={styles.title}>Your Progress</Text>

        {/* Progress Bar with Centered EXP Text */}
        <ProgressWithSteps />

        {/* Current Badge Display */}
        <View style={[styles.badgeContainer, { borderColor: badgeColor }]}>
          <Text style={[styles.badgeEmoji, { color: badgeColor }]}>{badgeIcon}</Text>
          <Text style={styles.badgeText}>{currentBadge.name} Badge</Text>
          <Text style={styles.tierInfo}>Tier {badgeIndex + 1}</Text>
        </View>

        {/* Next Badge Preview - Only show if NOT at max level */}
        {!isMaxLevel && (
          <View style={styles.badgePreview}>
            <Text style={styles.previewTitle}>Next Badge:</Text>
            <View style={styles.nextBadge}>
              <Text style={styles.nextBadgeEmoji}>
                {badge_Tier[badgeIndex + 1].icon ?? badge_Tier[badgeIndex + 1].icon ?? '🏅'}
              </Text>
              <Text style={styles.nextBadgeText}>{badge_Tier[badgeIndex + 1].name}</Text>
            </View>
          </View>
        )}

        {/* Max Level Message - Only show if at max level */}
        {isMaxLevel && (
          <View style={styles.maxLevelContainer}>
            <Text style={styles.maxLevelEmoji}>🧠</Text>
            <Text style={styles.maxLevelText}>Max Level Achieved!</Text>
            <Text style={styles.maxLevelSubtext}>You've unlocked all badges!</Text>
          </View>
        )}

        {/* Buttons */}
        <TouchableOpacity style={styles.button} onPress={handleIncrease}>
          <Text style={styles.buttonText}>Gain Random EXP</Text>
        </TouchableOpacity>

        {/* Reset Button - Optional, for testing */}
        <TouchableOpacity style={styles.resetButton} onPress={resetProgress}>
          <Text style={styles.resetButtonText}>Reset Progress</Text>
        </TouchableOpacity>
      </View>

      {/* Earned Badges Display at Bottom */}
      <View style={styles.earnedBadgesContainer}>
        <Text style={styles.earnedBadgesTitle}>
          Earned Badges ({earnedBadges.length}/{badge_Tier.length})
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesScrollView}>
          {earnedBadges.map((badge, index) => (
            <View key={index} style={styles.earnedBadgeItem}>
              <Text style={[styles.earnedBadgeIcon, { color: badge.color ?? '#00ff6aff' }]}>
                {badge.icon ?? badge.icon ?? '🏅'}
              </Text>
              <Text style={styles.earnedBadgeName}>{badge.name}</Text>
              <Text style={styles.earnedBadgeTier}>Tier {index + 1}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
// Styles for the progress screen and its components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2695efff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 30,
  },
  progressContainer: {
    width: '90%',
    marginBottom: 30,
  },
  progressBar: {
    width: '100%',
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  expTextContainer: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '700',
    textShadowColor: '#ffffff98',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  badgeContainer: {
    marginVertical: 20,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderWidth: 3,
    borderRadius: 25,
    alignItems: 'center',
    backgroundColor: '#00000033',
  },
  badgeEmoji: {
    fontSize: 45,
  },
  badgeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  tierInfo: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 5,
    opacity: 0.8,
  },
  badgePreview: {
    marginVertical: 15,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#46141433',
    borderRadius: 15,
    width: '80%',
  },
  previewTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  nextBadge: {
    alignItems: 'center',
  },
  nextBadgeEmoji: {
    fontSize: 30,
    marginBottom: 5,
  },
  nextBadgeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  maxLevelContainer: {
    marginVertical: 15,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0e111da3',
    borderRadius: 15,
    width: '80%',
    borderWidth: 2,
    borderColor: '#e4fa3eff',
  },
  maxLevelEmoji: {
    fontSize: 35,
    marginBottom: 10,
  },
  maxLevelText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  maxLevelSubtext: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.8,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#323033fc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#555455ff',
  },
  resetButtonText: {
    color: '#fe0b0bff',
    fontSize: 12,
    fontWeight: '500',
  },
  // Earned Badges Styles
  earnedBadgesContainer: {
    height: 140,
    backgroundColor: '#070505ff',
    borderTopWidth: 4,
    borderTopColor: '#595959ff',
    padding: 15,
  },
  earnedBadgesTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  badgesScrollView: {
    paddingHorizontal: 10,
  },
  earnedBadgeItem: {
    alignItems: 'center',
    marginHorizontal: 12,
    padding: 10,
    backgroundColor: '#1c1a1aff',
    borderRadius: 12,
    minWidth: 80,
  },
  earnedBadgeIcon: {
    fontSize: 30,
    marginBottom: 2,
  },
  earnedBadgeName: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  earnedBadgeTier: {
    color: '#c5c2c2ff',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 1,
  },
});
