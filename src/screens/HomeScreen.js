import React, { useEffect, useState } from "react";
import { View, Button, Text, StyleSheet, PermissionsAndroid, Platform } from "react-native";

import { initLocationTracking, startTracking, stopTracking, destroyTracking, sendImmediateLocation } from "../services/locationService";

import { removeToken } from "../auth/authStorage";

export default function HomeScreen({ navigation }) {

  const [tracking, setTracking] = useState(false);



  const requestLocationPermission = async () => {

    if (Platform.OS === "android") {

      try {

        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        ]);

        if (
          granted["android.permission.ACCESS_FINE_LOCATION"] === "granted"
        ) {

          console.log("✅ Location permission granted");

          // ⭐ START BACKGROUND TRACKING
          initLocationTracking();
          sendImmediateLocation();

        } else {

          console.log("❌ Location permission denied");
        }

      } catch (err) {
        console.warn(err);
      }

    }
  };



  useEffect(() => {

    requestLocationPermission();

  }, []);



  const toggleTracking = async () => {

    if (tracking) {

      await stopTracking();
      console.log("🛑 Tracking stopped");

    } else {

      await startTracking();
      console.log("🚀 Tracking started");

    }

    setTracking(!tracking);
  };


  const logout = async () => {

    await destroyTracking(); // VERY IMPORTANT
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
