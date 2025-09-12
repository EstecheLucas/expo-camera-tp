import React, { useEffect, useRef, useState } from "react";
import { View, Text, ActivityIndicator, Platform, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import { CustomButton } from "../components/CustomButton";
import { ErrorMessage } from "../components/ErrorMessage";
import { globalStyles } from "../styles/globalStyles";


const API_BASE = "https://ixk9cqrvwl5t.share.zrok.io";
const defaultHeaders = { skip_zrok_interstitial: "true" };

async function uploadImage({ uri, endpoint, fields = {} }: { uri: string; endpoint: string; fields?: Record<string, any> }) {
  const form = new FormData();
  Object.entries(fields).forEach(([k, v]) => form.append(k, String(v)));

  form.append("image", {
    uri,
    name: "face.jpg",
    type: Platform.select({ ios: "image/jpeg", android: "image/jpeg", default: "image/jpeg" }),
  } as any);

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: defaultHeaders as any,
    body: form,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = { ok: res.ok };
  }

  if (!res.ok) {
    const msg = data?.message || data?.error || `Error ${res.status}`;
    const err: any = new Error(msg);
    err.status = res.status;
    throw err;
  }

  return data;
}

export default function FaceLoginScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

 
  const [recognized, setRecognized] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [closeCamera, setCloseCamera] = useState(false);

  
  useEffect(() => {
    if (!recognized) return;

    const t1 = setTimeout(() => setShowMessage(true), 2000);
    const t2 = setTimeout(() => setCloseCamera(true), 3000);

    const t3 = setTimeout(() => {
      router.replace("/dashboard");
    }, 3100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [recognized]);

  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) requestPermission();
  }, [permission]);

  const takeAndRecognize = async () => {
    try {
      setError(null);
      setLoading(true);

      const photo = await cameraRef.current?.takePictureAsync({ quality: 0.6, skipProcessing: true });
      if (!photo?.uri) throw new Error("No se pudo capturar la foto");

      await uploadImage({ uri: photo.uri, endpoint: "/recognize" });
      
      setRecognized(true);
    } catch (e: any) {
      console.error(e);
      const msg = e?.status === 401 || e?.status === 404 ? "Rostro no reconocido" : (e?.message || "Error de red");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  
  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={globalStyles.container}>
        <Text style={{ textAlign: "center", marginBottom: 10, color: "#fff" }}>
          Necesitamos permiso para usar la cámara
        </Text>
        <CustomButton label="Dar permiso" onPress={() => requestPermission()} />
      </View>
    );
  }

 
  if (recognized && closeCamera) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Sesión iniciada correctamente</Text>
      </View>
    );
  }


  return (
    <View style={{ flex: 1 }}>
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing="front" />

      <View style={styles.overlay}>
        <Text style={styles.overlayHeading}>Ingreso por rostro</Text>

        <ErrorMessage message={error} />

        <View style={{ width: "100%" }}>
          <CustomButton label={loading ? "Cargando..." : "Capturar e ingresar"} onPress={takeAndRecognize} />
        </View>

        <View style={{ width: "100%", marginTop: 10 }}>
          <CustomButton label="Cancelar" onPress={() => router.back()} type="alt" />
        </View>

        <View style={{ marginTop: 12 }}>
          <Text style={styles.smallText}>
            {recognized ? (showMessage ? "Sesión iniciada" : "Escaneando rostro...") : "Alineá tu rostro y presiona capturar"}
          </Text>
          {loading ? <ActivityIndicator style={{ marginTop: 8 }} /> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    bottom: 40,
    left: 16,
    right: 16,
    alignItems: "center",
  },
  overlayHeading: {
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "#fff",
    padding: 10,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  smallText: {
    color: "#fff",
    textAlign: "center",
  },
});
