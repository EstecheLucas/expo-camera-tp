import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [closeCamera, setCloseCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  useEffect(() => {
    if (isLoggedIn) {
      const timer1 = setTimeout(() => {
        setShowMessage(true);
      }, 2000);

      const timer2 = setTimeout(() => {
        setCloseCamera(true);
      }, 3000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setShowMessage(false);
      setCloseCamera(false);
    }
  }, [isLoggedIn]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginBottom: 10 }}>
          Necesitamos permiso para usar la cámara
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Dar permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoggedIn) {
    if (closeCamera) {
      return (
        <View style={styles.container}>
          <Text style={styles.overlayText}>Sesión iniciada correctamente</Text>
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing="front" />
        <View style={styles.overlay}>
          {showMessage ? (
            <Text style={styles.overlayText}>Sesión iniciada</Text>
          ) : (
            <Text style={styles.overlayText}>Escaneando rostro...</Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <TextInput placeholder="Usuario" style={styles.input} placeholderTextColor="#ddd" />
      <TextInput placeholder="Contraseña" secureTextEntry style={styles.input} placeholderTextColor="#ddd" />

      <TouchableOpacity style={styles.button} onPress={() => setIsLoggedIn(true)}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#525252ff",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#fff",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#b4b4b4ff",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#8b8b8bff",
    color: "#fff",
  },
  button: {
    backgroundColor: "#000000ff",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  overlay: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  overlayText: {
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "#fff",
    padding: 10,
    
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
