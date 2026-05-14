import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

const Register = ({ navigation }) => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    company: "",
  });

  const inputChangeHandler = (value, name) => {
    setUserData({ ...userData, [name]: value });
  };

  const registerHandler = () => {
    axios
      .post("http://20.20.22.203:1234/api/signUp", userData)
      .then(() => {
        alert("Account Created ");
        navigation.navigate("Login");
      })
      .catch(() => {
        alert("Register Failed !!!  ");
      });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Name</Text>
      <TextInput onChangeText={(t) => inputChangeHandler(t, "name")} />

      <Text>Email</Text>
      <TextInput onChangeText={(t) => inputChangeHandler(t, "email")} />

      <Text>Password</Text>
      <TextInput secureTextEntry onChangeText={(t) => inputChangeHandler(t, "password")} />

      <Text>Confirm Password</Text>
      <TextInput secureTextEntry onChangeText={(t) => inputChangeHandler(t, "confirm_password")} />

      <Text>Company ID</Text>
      <TextInput onChangeText={(t) => inputChangeHandler(t, "company")} />

      <TouchableOpacity onPress={registerHandler}>
        <Text>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;