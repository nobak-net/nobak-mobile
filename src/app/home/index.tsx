import { StyleSheet, Text, View } from "react-native";
import { Link } from 'expo-router';
import { AuthenticationProvider, AuthenticationContext } from '@/src/context/AuthContext';

export default function Root() {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Hello Bro</Text>
        <Text style={styles.subtitle}>This is the first page of your app.</Text>
        <Link href={{ pathname: 'onboard', params: { name: 'Bacon' } }}>Go to Onboard</Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
