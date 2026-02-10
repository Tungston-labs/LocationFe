import React, { useEffect, useState } from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import {
  initLocationTracking,
  startTracking,
  stopTracking,
  destroyTracking
} from "../services/locationService";
import { removeToken } from "../auth/authStorage";

export default function HomeScreen({ navigation }) {

  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    initLocationTracking();
  }, []);

  const toggleTracking = () => {

    if (tracking) {
      stopTracking();
    } else {
      startTracking();
    }

    setTracking(!tracking);
  };

  const logout = async () => {

    destroyTracking(); // avoid privacy disaster
    await removeToken();

    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Location Tracking</Text>

      <View style={styles.buttonContainer}>
        <Button
          title={tracking ? "STOP TRACKING" : "START TRACKING"}
          onPress={toggleTracking}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Logout" onPress={logout} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    marginBottom: 30,
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 16,
  },
});
