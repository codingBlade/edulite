import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type LanguageContextType = {
  language: string;
  changeLanguage: (lang: string) => void;
  translations: { [key: string]: string };
};

const LanguageContext = React.createContext<LanguageContextType>({
  language: 'eng',
  changeLanguage: () => {},
  translations: { selectLanguage: 'Select language', welcome: 'Welcome' },
});

type LanguageSelectProps = {
  onComplete?: () => void;
};

export default function LanguageSelectScreen({ onComplete }: LanguageSelectProps) {
  const { language, changeLanguage, translations } = useContext(LanguageContext);

  // Available languages for selection
  const languages = [
    { code: 'eng', name: 'English' },
    { code: 'sep', name: 'Sepedi' },
    { code: 'tso', name: 'Xitsonga' },
    { code: 'ven', name: 'Tshivenda' },
  ];

  // Handle language selection and proceed to app
  const handleLanguageSelect = (langCode: string) => {
    changeLanguage(langCode);
    if (onComplete) {
      setTimeout(() => onComplete(), 300);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{translations.selectLanguage}</Text>
      <Text style={styles.welcome}>{translations.welcome}</Text>

      {/* Language selection buttons */}
      <View style={styles.languagesContainer}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[styles.languageButton, language === lang.code && styles.selectedLanguageButton]}
            onPress={() => handleLanguageSelect(lang.code)}
          >
            <Text style={[styles.languageName, language === lang.code && styles.selectedLanguageText]}>
              {lang.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Current language display */}
      <View style={styles.currentLanguageContainer}>
        <Text style={styles.currentLanguage}>
          Current language: <Text style={styles.languageCode}>{language}</Text>
        </Text>
      </View>
    </View>
  );
}

// styles for the Language Select Screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2695EF',
  },
  title: {
    fontSize: 32,
    marginBottom: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  welcome: {
    fontSize: 18,
    color: '#E6F3FF',
    marginBottom: 40,
    textAlign: 'center',
    fontWeight: '500',
  },
  languagesContainer: {
    width: '100%',
    maxWidth: 300,
  },
  languageButton: {
    backgroundColor: '#1A7BC8',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#4FAEFA',
    alignItems: 'center',
  },
  selectedLanguageButton: {
    backgroundColor: '#1A7BC8',
    borderColor: '#FFD700',
  },
  languageName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  selectedLanguageText: {
    color: '#FFD700',
  },
  currentLanguageContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#1A7BC8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4FAEFA',
  },
  currentLanguage: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  languageCode: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  Button: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 30,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
