import { CameraView, useCameraPermissions } from "expo-camera";
import {
  launchImageLibraryAsync,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
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
import { CustomButton } from "../../components/CustomButton";
import { useNotes } from "../../components/NotesContext";

export default function EditNoteScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getNoteById, updateNote } = useNotes();
  const note = id ? getNoteById(id) : undefined;

  const [title, setTitle] = useState(note?.title ?? "");
  const [description, setDescription] = useState(note?.description ?? "");
  const [imageUri, setImageUri] = useState<string | null>(note?.imageUri ?? null);
  const [saving, setSaving] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!note) return;
    setTitle(note.title);
    setDescription(note.description);
    setImageUri(note.imageUri);
  }, [note]);

  const openCamera = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert("Permiso requerido", "Autoriza el uso de la cámara para tomar una nueva foto.");
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
        Alert.alert("Permiso requerido", "Debes permitir el acceso a la galería.");
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
      Alert.alert("Error", "No pudimos abrir la galería.");
    }
  };

  const handleSave = async () => {
    if (!note) {
      router.replace("/");
      return;
    }
    if (!title.trim() || !description.trim() || !imageUri) {
      Alert.alert("Campos incompletos", "Asegúrate de completar la información y tomar una foto.");
      return;
    }

    try {
      setSaving(true);
      await updateNote(note.id, {
        title: title.trim(),
        description: description.trim(),
        imageUri,
      });
      router.replace(`/note/${note.id}`);
    } catch {
      Alert.alert("Error", "No se pudo actualizar la nota.");
    } finally {
      setSaving(false);
    }
  };

  if (!note) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Nota no encontrada</Text>
        <CustomButton label="Volver" onPress={() => router.replace("/")} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Nota</Text>

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
        <CustomButton label="Guardar cambios" onPress={handleSave} />
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
              <Text style={styles.cameraButtonText}>Cerrar</Text>
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
