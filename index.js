import 'react-native-gesture-handler';

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import BackgroundFetch from "react-native-background-fetch";
import { sendImmediateLocation } from "./src/services/locationService"; 
// adjust path if needed

// ⭐⭐⭐⭐⭐ VERY IMPORTANT
const HeadlessTask = async (event) => {

  console.log("🔥 Headless fetch running:", event.taskId);

  try {
    await sendImmediateLocation();
  } catch (e) {
    console.log("Headless ERROR:", e);
  }

  BackgroundFetch.finish(event.taskId);
};

BackgroundFetch.registerHeadlessTask(HeadlessTask);


AppRegistry.registerComponent(appName, () => App);
