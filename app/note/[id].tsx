import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CustomButton } from "../../components/CustomButton";
import { useNotes } from "../../components/NotesContext";

const formatDate = (value: string) => {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
};

export default function NoteDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getNoteById, deleteNote } = useNotes();

  const note = useMemo(() => (id ? getNoteById(id) : undefined), [getNoteById, id]);

  const handleDelete = () => {
    if (!note) return;
    Alert.alert("Eliminar nota", "¿Deseas eliminar esta nota?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await deleteNote(note.id);
          router.replace("/");
        },
      },
    ]);
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: note.imageUri }} style={styles.image} resizeMode="cover" />
          <LinearGradient colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"]} style={styles.overlay} />
          <Text style={styles.overlayTitle} numberOfLines={2}>
            {note.title}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Última edición</Text>
          <Text style={styles.metaValue}>{formatDate(note.updatedAt)}</Text>
        </View>

        <View style={styles.descriptionBox}>
          <Text style={styles.sectionLabel}>Descripción</Text>
          <Text style={styles.description}>{note.description}</Text>
        </View>

        <View style={styles.actions}>
          <CustomButton label="Editar" onPress={() => router.push(`/edit/${note.id}`)} />
          <CustomButton label="Eliminar" type="ghost" onPress={handleDelete} />
          <CustomButton label="Volver a la lista" type="ghost" onPress={() => router.replace("/")} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#3c3c3cff",
  },
  card: {
    borderRadius: 20,
    backgroundColor: "#525252ff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  imageWrapper: {
    position: "relative",
    height: 280,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
  },
  overlayTitle: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  metaRow: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  metaLabel: {
    color: "#d4d4d8",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  metaValue: {
    color: "#fff",
    fontSize: 16,
    marginTop: 4,
  },
  descriptionBox: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  sectionLabel: {
    color: "#d4d4d8",
    fontSize: 14,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  description: {
    color: "#f5f5f5",
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    padding: 20,
    gap: 10,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
});
