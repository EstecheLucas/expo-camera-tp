import React, { useState } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { CustomInput } from "../components/CustomInput";
import { CustomButton } from "../components/CustomButton";
import { ErrorMessage } from "../components/ErrorMessage";
import { globalStyles } from "../styles/globalStyles";

export default function RegisterScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleRegister = () => {
    if (!email || !password || !confirm) {
      setError("Todos los campos son obligatorios");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setError(null);
 
    router.replace("/dashboard");
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Registro</Text>

      <CustomInput placeholder="Correo electrónico" value={email} onChangeText={setEmail} />
      <CustomInput placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
      <CustomInput placeholder="Repite la contraseña" value={confirm} onChangeText={setConfirm} secureTextEntry />

      <ErrorMessage message={error} />

      <CustomButton label="Crear cuenta" onPress={handleRegister} />
      <CustomButton label="Volver" onPress={() => router.back()} type="ghost" />
    </View>
  );
}
