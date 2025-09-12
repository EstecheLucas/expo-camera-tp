import { BarcodeScanningResult, CameraView } from "expo-camera";
import { router } from "expo-router/build/imperative-api";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Product {
  code: string;
  name: string;
}

interface ProductManagerProps {
  onBack: () => void;
}

export default function ProductManager({ onBack }: ProductManagerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [scanning, setScanning] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [editName, setEditName] = useState<string>("");

  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    setScanning(false);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (!data) {
        Alert.alert("Error", "No se pudo leer el código.");
        return;
      }

      const exists = products.find((p) => p.code === data);
      if (exists) {
        Alert.alert("Atención", "El producto ya está registrado.");
      } else {
        const newProduct: Product = {
          code: data,
          name: `Producto ${products.length + 1}`,
        };
        setProducts([...products, newProduct]);
        Alert.alert("Éxito", "Producto agregado correctamente.");
      }
    }, 1200);
  };

  const updateProduct = () => {
    if (!editName.trim()) {
      Alert.alert("Error", "El nombre no puede estar vacío.");
      return;
    }
    if (!selected) return;

    setProducts((prev) =>
      prev.map((p) => (p.code === selected.code ? { ...p, name: editName } : p))
    );
    Alert.alert("Éxito", "Producto modificado.");
    setSelected(null);
  };

  const deleteProduct = () => {
    if (!selected) return;
    setProducts((prev) => prev.filter((p) => p.code !== selected.code));
    Alert.alert("Éxito", "Producto eliminado.");
    setSelected(null);
  };

  return (
    <View style={styles.container}>
      {scanning ? (
        <CameraView
          style={{ flex: 1 }}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "ean13", "ean8", "code128"],
          }}
        />
      ) : (
        <>
          <Text style={styles.title}>Gestión de Productos</Text>

          {loading && <ActivityIndicator size="large" color="#fff" />}

          <FlatList
            data={products}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  setSelected(item);
                  setEditName(item.name);
                }}
              >
                <Text style={styles.itemText}>
                  {item.name} ({item.code})
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.empty}>No hay productos aún.</Text>
            }
          />

          <TouchableOpacity style={styles.button} onPress={() => setScanning(true)}>
            <Text style={styles.buttonText}>➕ Escanear nuevo producto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonGhost} onPress={() => router.push("/register")}>
            <Text style={styles.buttonGhostText}>⬅ Volver al panel</Text>
          </TouchableOpacity>
        </>
      )}
app/ProductManager.tsx
      <Modal visible={!!selected} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar producto</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Nombre del producto"
              placeholderTextColor="#ddd"
            />
            <TouchableOpacity style={styles.button} onPress={updateProduct}>
              <Text style={styles.buttonText}>  Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#dc2626" }]}
              onPress={deleteProduct}
            >
              <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonGhost} onPress={() => setSelected(null)}>
              <Text style={styles.buttonGhostText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#525252ff",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    textAlign: "center",
  },
  item: {
    padding: 15,
    backgroundColor: "#8b8b8bff",
    borderRadius: 10,
    marginVertical: 6,
  },
  itemText: { fontSize: 16, color: "#fff" },
  empty: {
    textAlign: "center",
    color: "#ddd",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#000000ff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonGhost: {
    padding: 15,
    marginTop: 10,
    alignItems: "center",
  },
  buttonGhostText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#8b8b8bff",
    padding: 20,
    borderRadius: 15,
    width: "85%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#b4b4b4ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#525252ff",
    color: "#fff",
  },
});
