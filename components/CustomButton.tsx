import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
  label: string;
  onPress: () => void;
  type?: "default" | "alt" | "ghost";
};

export const CustomButton = ({ label, onPress, type = "default" }: Props) => {
  const styleMap = {
    default: styles.button,
    alt: styles.buttonAlt,
    ghost: styles.buttonGhost,
  };

  const textMap = {
    default: styles.buttonText,
    alt: styles.buttonAltText,
    ghost: styles.buttonGhostText,
  };

  return (
    <TouchableOpacity style={styleMap[type]} onPress={onPress}>
      <Text style={textMap[type]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#000",
    padding: 15,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonAlt: {
    backgroundColor: "#1e1e1e",
    padding: 14,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonAltText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonGhost: {
    borderWidth: 1,
    borderColor: "#b4b4b4ff",
    padding: 14,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#8b8b8bff",
    marginBottom: 10,
  },
  buttonGhostText: {
    color: "#fff",
    fontWeight: "600",
  },
});
