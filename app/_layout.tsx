import { Stack } from "expo-router";
import { NotesProvider } from "../components/NotesContext";

export default function RootLayout() {
  return (
    <NotesProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </NotesProvider>
  );
}
