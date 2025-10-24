import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={localStyles.container}>
      <Text style={localStyles.title}>Welcome to Edulite</Text>

      <View style={localStyles.buttonContainer}>
        <TouchableOpacity style={localStyles.button} onPress={() => router.push('/language-select')}>
          <Text style={localStyles.buttonText}>Language</Text>
        </TouchableOpacity>

        <TouchableOpacity style={localStyles.button} onPress={() => router.push('/progress')}>
          <Text style={localStyles.buttonText}>Badge</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2695efff',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  buttonContainer: {
    alignItems: 'center',
    gap: 15, // Adds space between buttons
  },
  button: {
    backgroundColor: '#000000ff',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
