import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Image style={styles.tinyLogo} source={require("./assets/Icon-192.png")} />
      <Text style={styles.textPadded}>Welcome to FitFlow!</Text>
      <Text style={styles.textPadded}>Click the buttons below to customize your workout.</Text>
      <Text style={styles.textPadded}>If you're already at the gym, click "Start Workout"</Text>
      <Exercise name="Bench Press" number="1"/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  tinyLogo: {
    width: 50,
    height: 50,
    paddingBottom: 30,
  },
  textPadded: {
    paddingTop: 25,
  },
});

const Exercise = props => {
  return (
    <View style={styles.textPadded}>
      <Text>Exercise #{props.number}: {props.name}</Text>
    </View>
  );
};
