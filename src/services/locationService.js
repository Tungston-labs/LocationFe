import BackgroundGeolocation from "react-native-background-geolocation";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const initLocationTracking = async () => {

  const token = await AsyncStorage.getItem("token");
  console.log("🔹 TRACKING TOKEN:", token);

  BackgroundGeolocation.ready({

    // 🔥 Better accuracy
    desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,

    // ⭐ CHANGE THIS (50 is too large for office)
    distanceFilter: 10,

    // 🔥 Allow plugin to stop when user is still
    stopTimeout: 5, // stops GPS after 5 minutes of no movement

    // 🔥 Prevent Android killing the service
    stopOnTerminate: false,
    startOnBoot: true,
    foregroundService: true,
    enableHeadless: true,

    // ⭐⭐⭐ VERY IMPORTANT
     preventSuspend: true,
    // heartbeatInterval: 60,        // wakes app every 60 sec
    // disableStopDetection: true,   // don't sleep when user stops

    // Server
    url: "http://178.248.112.16:5005/api/location",

    headers: {
      Authorization: `Bearer ${token}`,
    },

    autoSync: true,
    batchSync: false,

    //debug: true,  👉 turn OFF in production
    debug: false,

    notification: {
      title: "Tracking Active",
      text: "Location tracking is running",
    },

  }).then((state) => {

    console.log("✅ BG Geo Ready:", state.enabled);

    // 🔥 Location listener
    BackgroundGeolocation.onLocation(location => {
      console.log("📍 LOCATION:", location);
    });

    // ⭐ VERY POWERFUL — ensures updates even if not moving
    // BackgroundGeolocation.onHeartbeat(() => {
    //   BackgroundGeolocation.getCurrentPosition({
    //     samples: 1,
    //     persist: true
    //   });
    // });

    // ⭐ Confirm server received location
    BackgroundGeolocation.onHttp(response => {
      console.log("📡 HTTP STATUS:", response.status);
    });

    // 🔥 MUST START (many developers forget this)
    if (!state.enabled) {
      BackgroundGeolocation.start();
    }
BackgroundGeolocation.getCurrentPosition({
      samples: 1,
      persist: true
    });

  });
};

export const startTracking = () => {
  BackgroundGeolocation.start();
};

export const stopTracking = () => {
  BackgroundGeolocation.stop();
};

export const destroyTracking = () => {
  BackgroundGeolocation.stop();
};
