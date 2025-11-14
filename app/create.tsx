import { CameraView, useCameraPermissions } from "expo-camera";
import {
  launchImageLibraryAsync,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CustomButton } from "../components/CustomButton";
import { useNotes } from "../components/NotesContext";

export default function CreateNoteScreen() {
  const router = useRouter();
  const { addNote } = useNotes();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const openCamera = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert("Permisos necesarios", "Necesitamos acceso a tu cámara para capturar la nota.");
        return;
      }
    }
    setCameraVisible(true);
  };

  const capturePhoto = async () => {
    try {
      const photo = await cameraRef.current?.takePictureAsync();
      if (!photo) return;
      setImageUri(photo.uri);
      setCameraVisible(false);
    } catch {
      Alert.alert("Error", "No pudimos capturar la foto. Intenta nuevamente.");
    }
  };

  const openGallery = async () => {
    try {
      const { granted } = await requestMediaLibraryPermissionsAsync();
      if (!granted) {
        Alert.alert("Permiso requerido", "Autoriza el acceso a tu galería para seleccionar imágenes.");
        return;
      }
      const result = await launchImageLibraryAsync({
        mediaTypes: "images",
        allowsMultipleSelection: false,
        quality: 1,
      });
      if (!result.canceled && result.assets?.length) {
        setImageUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert("Error", "No pudimos abrir tu galería.");
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !description.trim() || !imageUri) {
      Alert.alert("Campos incompletos", "Completa el formulario y toma una foto.");
      return;
    }
    try {
      setSaving(true);
      await addNote({
        title: title.trim(),
        description: description.trim(),
        imageUri,
      });
      router.replace("/");
    } catch {
      Alert.alert("Error", "No se pudo guardar la nota.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva Nota</Text>

      <TouchableOpacity style={styles.photoContainer} onPress={openCamera}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.preview} />
        ) : (
          <Text style={styles.photoPlaceholder}>Toca para tomar una foto</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Título"
        placeholderTextColor="#d4d4d8"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descripción"
        placeholderTextColor="#d4d4d8"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <CustomButton label="Elegir desde la galería" type="ghost" onPress={openGallery} />

      {saving ? (
        <ActivityIndicator color="#fff" size="large" />
      ) : (
        <CustomButton label="Guardar nota" onPress={handleSave} />
      )}

      <CustomButton label="Cancelar" type="ghost" onPress={() => router.back()} />

      <Modal animationType="slide" visible={cameraVisible}>
        <CameraView ref={cameraRef} style={styles.camera} facing="back">
          <View style={styles.cameraActions}>
            <TouchableOpacity style={styles.cameraButton} onPress={capturePhoto}>
              <Text style={styles.cameraButtonText}>Capturar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cameraButton, styles.cameraButtonAlt]}
              onPress={() => setCameraVisible(false)}
            >
              <Text style={styles.cameraButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#525252ff",
    paddingTop: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  photoContainer: {
    borderWidth: 2,
    borderColor: "#d4d4d4",
    borderStyle: "dashed",
    borderRadius: 14,
    padding: 10,
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#8b8b8bff",
  },
  photoPlaceholder: {
    color: "#f5f5f5",
    fontSize: 16,
  },
  preview: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  input: {
    width: "100%",
    backgroundColor: "#8b8b8bff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#fff",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#b4b4b4ff",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  camera: {
    flex: 1,
  },
  cameraActions: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  cameraButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  cameraButtonAlt: {
    backgroundColor: "rgba(47,47,47,0.8)",
  },
  cameraButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
