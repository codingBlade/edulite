import { Text, View } from 'react-native';

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        width: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#acacac',
      }}
    >
      <Text>This is the home screen</Text>
    </View>
  );
}
