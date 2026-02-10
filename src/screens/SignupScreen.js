import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import api from "../services/api";

export default function SignupScreen({ navigation }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
     console.log("BASE URL ->", api.defaults.baseURL); 
    try {
      await api.post("/auth/signup", {
        email,
        password,
      });

      alert("User created!");
      navigation.goBack();

    } catch (err) {
      console.error(err);
      if (err.response) {
        // Server responded with a status code other than 2xx
        alert(`Signup failed: ${err.response.data.error || err.response.data.message || "Server Error"}`);
      } else if (err.request) {
        // Request was made but no response received
        alert("Signup failed: No response from server. Check your network connection.");
      } else {
        // Something happened in setting up the request
        alert(`Signup failed: ${err.message}`);
      }
    }
  };

  return (
    <View style={styles.container}>

      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
      />

      <Button title="Signup" onPress={signup} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
});
