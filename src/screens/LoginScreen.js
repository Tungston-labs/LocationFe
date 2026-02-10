import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import api from "../services/api";
import { saveToken } from "../auth/authStorage";

export default function LoginScreen({ navigation }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      await saveToken(res.data.token);

      navigation.replace("Home");

    } catch {
      alert("Login failed");
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

      <Button title="Login" onPress={login} />

      <View style={styles.buttonSpacer} />

      <Button
        title="Signup"
        onPress={() => navigation.navigate("Signup")}
      />

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
  buttonSpacer: {
    marginTop: 12,
  },
});
