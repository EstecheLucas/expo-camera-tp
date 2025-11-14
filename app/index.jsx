import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CustomButton } from "../components/CustomButton";
import { useNotes } from "../components/NotesContext";

const formatDate = (value) => {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
};

export default function NotesListScreen() {
  const router = useRouter();
  const { notes, loading, refreshNotes } = useNotes();
  const [refreshing, setRefreshing] = useState(false);

  const sortedNotes = useMemo(
    () =>
      [...notes].sort(
        (a, b) => new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf()
      ),
    [notes]
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshNotes();
    setRefreshing(false);
  }, [refreshNotes]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notas Fotográficas</Text>
      {loading && (
        <ActivityIndicator color="#fff" size="large" style={styles.loading} />
      )}
      <FlatList
        data={sortedNotes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          sortedNotes.length === 0 ? styles.emptyStateContainer : undefined
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#fff"
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.noteItem}
            onPress={() => router.push(`/note/${item.id}`)}
          >
            <Image
              source={{ uri: item.imageUri }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <View style={styles.noteInfo}>
              <Text style={styles.noteTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.noteDate}>{formatDate(item.updatedAt)}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !loading && (
            <Text style={styles.emptyText}>
              No tienes notas aún. Crea tu primera nota fotográfica.
            </Text>
          )
        }
      />

      <CustomButton label="Crear nueva nota" onPress={() => router.push("/create")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#525252ff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },
  loading: {
    marginBottom: 10,
  },
  noteItem: {
    flexDirection: "row",
    backgroundColor: "#8b8b8bff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#bcbcbc",
  },
  noteInfo: {
    flex: 1,
  },
  noteTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  noteDate: {
    color: "#e5e5e5",
    fontSize: 14,
  },
  emptyText: {
    color: "#f3f4f6",
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
  },
  emptyStateContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
});
