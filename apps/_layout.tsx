import { Stack } from 'expo-router';
import { LanguageProvider } from './LanguageContext';

// Root layout wrapping the app with LanguageProvider
export default function RootLayout() {
  return (
    <LanguageProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="Home" options={{ headerShown: true }} />
        <Stack.Screen name="language-select" options={{ headerShown: true }} />
        <Stack.Screen name="progress" options={{ headerShown: true }} />
      </Stack>
    </LanguageProvider>
  );
}
