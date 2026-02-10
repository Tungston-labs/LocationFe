import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveToken = async (token) => {
  await AsyncStorage.setItem("token", token);
};

export const getToken = () => {
  return AsyncStorage.getItem("token");
};

export const removeToken = () => {
  return AsyncStorage.removeItem("token");
};

