import BackgroundFetch from "react-native-background-fetch";
import Geolocation from "react-native-geolocation-service";
import ReactNativeForegroundService from "@supersami/rn-foreground-service";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://178.248.112.16:5005/api/location";

// FOREGROUND SERVICE (only when fetching)


const startForegroundService = async () => {
  await ReactNativeForegroundService.start({
    id: 1001,
    title: "Location Tracking",
    message: "Fetching your location...",

    icon: "ic_launcher",
    ServiceType: "location",
  });
};

const stopForegroundService = async () => {
  await ReactNativeForegroundService.stop();
};


// GET GPS LOCATION


const getLocation = () => {
  return new Promise((resolve, reject) => {

    Geolocation.getCurrentPosition(
      position => resolve(position),
      error => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        forceRequestLocation: true,
      }
    );

  });
};


// SEND TO SERVER


const sendLocationToServer = async (coords) => {

  const token = await AsyncStorage.getItem("token");

  try {

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        latitude: coords.latitude,
        longitude: coords.longitude,
      }),
    });

    console.log("✅ Location sent to server");

  } catch (err) {
    console.log("❌ Failed to send location:", err);
  }
};


// BACKGROUND FETCH (THE BRAIN)


export const initLocationTracking = async () => {

  BackgroundFetch.configure(
    {
      minimumFetchInterval: 15, // 🔥 every ~15-25 minutes
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
      forceAlarmManager: true,
      requiresBatteryNotLow: false,
      requiresCharging: false,
      requiresDeviceIdle: false,
    },

    async (taskId) => {

      console.log("🔥 Background fetch triggered");

      try {

        await startForegroundService();

        const position = await getLocation();

        await sendLocationToServer(position.coords);

      } catch (err) {

        console.log("LOCATION ERROR:", err);

      }

      await stopForegroundService();

      BackgroundFetch.finish(taskId);
    },

    (error) => {
      console.log("BackgroundFetch failed:", error);
    }
  );

  BackgroundFetch.start();

  console.log("✅ Background tracking initialized");
};


// OPTIONAL MANUAL START / STOP


export const startTracking = async () => {

  await ReactNativeForegroundService.start({
    id: 1001,
    title: "Location Tracking",
    message: "Tracking your location...",
    icon: "ic_launcher",
    ServiceType: "location",
  });

  await BackgroundFetch.start();
};

export const stopTracking = async () => {

  await BackgroundFetch.stop();
  await ReactNativeForegroundService.stop();
};

export const destroyTracking = async () => {
  await BackgroundFetch.stop();
};

export const sendImmediateLocation = async () => {

  try {

    const position = await getLocation();

    await sendLocationToServer(position.coords);

    console.log("✅ Immediate location sent");

  } catch (err) {

    console.log("❌ Immediate location error:", err);
  }
};
