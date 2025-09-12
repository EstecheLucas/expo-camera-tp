import React from "react";
import { Text, StyleSheet } from "react-native";

type Props = {
  message: string | null;
};

export const ErrorMessage = ({ message }: Props) => {
  if (!message) return null; // si no hay mensaje, no renderiza nada

  return <Text style={styles.errorText}>{message}</Text>;
};

const styles = StyleSheet.create({
  errorText: {
    color: "#ff6b6b",
    marginBottom: 8,
    fontWeight: "600",
    textAlign: "center",
  },
});
