import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLanguageStore } from '@/hooks/useLanguageStore';
const logo = require('../assets/images/logo-icon.png');

export default function Welcome() {
  const { selectedLanguage, setLanguage } = useLanguageStore();
  const [errorMessage, setErrorMessage] = useState<string>('');

  function handleNavigation(route: string) {
    if (!selectedLanguage && route !== '/language-select') {
      setErrorMessage('Please select a language before continuing.');
      return;
    }

    setErrorMessage('');
    router.push(route as any);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.appName}>EduLite</Text>
          <Text style={styles.subtitle}>Welcome to your learning journey</Text>
        </View>

        {/* Language Selection */}
        <View style={styles.languageSection}>
          {/* Language Selection Button */}
          <TouchableOpacity style={styles.languageSelectButton} onPress={() => router.push('/Lang/language-select')}>
            <View style={styles.languageButtonContent}>
              <Ionicons name="language-outline" size={24} color="#1976D2" />
              <Text style={styles.languageSelectButtonText}>
                {selectedLanguage
                  ? `Selected: ${selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}`
                  : 'Select Language'}
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#666" />
            </View>
          </TouchableOpacity>

          {/* Error Message */}
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationSection}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => handleNavigation('/login')}>
            <Text style={styles.primaryButtonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => handleNavigation('/register')}>
            <Text style={styles.secondaryButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.guestButton} onPress={() => router.push('/' as any)}>
            <Ionicons name="person-outline" size={16} color="#666" />
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>By continuing, you agree to our Terms of Service</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
    backgroundColor: 'white',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: '100%',
    maxWidth: 350,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: '#E8F0FE',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 28,
    color: '#1976D2',
    marginBottom: 8,
    fontFamily: 'Poppins',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Poppins_Regular',
  },
  languageSection: {
    width: '100%',
    maxWidth: 350,
    marginBottom: 25,
  },
  languageSelectButton: {
    backgroundColor: 'white',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1976D2',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  languageButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  languageSelectButtonText: {
    fontSize: 16,
    color: '#1976D2',
    fontFamily: 'Poppins',
    flex: 1,
    textAlign: 'center',
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Poppins',
  },
  navigationSection: {
    width: '100%',
    maxWidth: 350,
    gap: 15,
  },
  primaryButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#1976D2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderColor: '#1976D2',
    borderWidth: 2,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButtonText: {
    color: '#1976D2',
    fontSize: 16,
    fontFamily: 'Poppins',
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  guestButtonText: {
    color: '#666',
    fontSize: 16,
    fontFamily: 'Poppins',
  },
  footer: {
    marginTop: 15,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
    fontFamily: 'Poppins_Regular',
  },
});
