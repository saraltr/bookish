import { auth } from "@/utils/firebaseConfig";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet, Text, TextInput,
  TouchableOpacity
} from "react-native";

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      router.replace("/profile")
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >

      <Text style={styles.title}>Login</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput 
      placeholder="Email" 
      placeholderTextColor="#aaa"
      value={email} 
      onChangeText={setEmail} 
      style={styles.input} />


      <TextInput 
      placeholder="Password" 
      placeholderTextColor="#aaa"
      value={password} 
      secureTextEntry 
      onChangeText={setPassword} 
      style={styles.input} 
      />

      <TouchableOpacity
      style={styles.button}
      onPress={handleLogin}>
        <Text style={styles.buttonText}>
          Login
        </Text>
      </TouchableOpacity>


      <TouchableOpacity
      onPress={() => router.push("/register")}>
        <Text style={styles.link}>No account yet? Register</Text>
      </TouchableOpacity>


    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2B0607",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#f0f4ff",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#543a3bcf",
    color: "#f0f4ff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#85B79D",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: "center", 
  },
  buttonText: {
    color: "#2B0607",
    fontWeight: "bold",
    fontSize: 16
  },
  error: {
    color: "#ff6b6b",
    marginBottom: 12,
    textAlign: "center",
  },
  link: {
    color: "#85B79D",
    marginTop: 20,
    textAlign: "center",
    fontSize: 14,
  },
});

export default LoginScreen;