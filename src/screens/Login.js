import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const inputChangeHandler = (value, name) => {
    setUserData({ ...userData, [name]: value });   
  };

const loginHandler = () => {
  axios
    .post("http://20.20.22.203:1234/api/signIn", userData)
    .then(async (res) => {
  
      const token = res.data.token;

      //  Save token locally
      await AsyncStorage.setItem("token", token);

      navigation.replace("Dashboard"); 
    })
    .catch((error) => {
      console.log(error.response?.data || error.message);
      alert("Login Failed !");
       console.log("FULL ERROR:", error);
    console.log("RESPONSE:", error.response?.data);
    alert(JSON.stringify(error.response?.data));
    });
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ColdChain Login</Text>

      <View style={styles.card}>
        <View style={styles.inputContainer}>
          <Text>Email</Text>
          <TextInput
            style={styles.input}
            value={userData.email}
            onChangeText={(txt) =>
              inputChangeHandler(txt, "email")
            }
          />
        </View>

        <View style={styles.inputContainer}>
          <Text>Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={userData.password}
            onChangeText={(txt) =>
              inputChangeHandler(txt, "password")
            }
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={loginHandler}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    width: "80%",
    padding: 20,
    backgroundColor: "#e0f7fa",
    borderRadius: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginTop: 5,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    alignItems: "center",
    borderRadius: 6,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});