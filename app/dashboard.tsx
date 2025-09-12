import React from "react";
import { View, Text } from "react-native";
import { globalStyles } from "../styles/globalStyles";

export default function Dashboard() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Bienvenido al Dashboard</Text>
    </View>
  );
}
