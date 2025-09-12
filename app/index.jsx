import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { CustomButton } from "../components/CustomButton";
import { CustomInput } from "../components/CustomInput";
import { globalStyles } from "../styles/globalStyles";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Iniciar Sesión</Text>

      <CustomInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
      />
      <CustomInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <CustomButton
        label="Entrar"
        onPress={() => router.push("/dashboard")}
      />
      <CustomButton
        label="Registrarse"
        onPress={() => router.push("/register")}
        type="alt"
      />
      <CustomButton
        label="Entrar con rostro"
        onPress={() => router.push("/faceLogin")}
        type="ghost"
      />
      
    </View>
  );
}
