import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "@photo_notes";

export interface PhotoNote {
  id: string;
  title: string;
  description: string;
  imageUri: string;
  updatedAt: string;
}

type CreatePayload = Pick<PhotoNote, "title" | "description" | "imageUri">;
type UpdatePayload = Partial<CreatePayload>;

interface NotesContextValue {
  notes: PhotoNote[];
  loading: boolean;
  addNote: (payload: CreatePayload) => Promise<PhotoNote>;
  updateNote: (id: string, payload: UpdatePayload) => Promise<PhotoNote | undefined>;
  deleteNote: (id: string) => Promise<void>;
  getNoteById: (id: string) => PhotoNote | undefined;
  refreshNotes: () => Promise<void>;
}

const NotesContext = createContext<NotesContextValue | undefined>(undefined);

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<PhotoNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setNotes(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Error loading notes from storage", error);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, []);

  const persistNotes = useCallback((producer: (prev: PhotoNote[]) => PhotoNote[]) => {
    setNotes((prev) => {
      const next = producer(prev);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch((error) => {
        console.error("Error persisting notes", error);
      });
      return next;
    });
  }, []);

  const addNote = useCallback(
    async (payload: CreatePayload) => {
      const newNote: PhotoNote = {
        id: `${Date.now()}`,
        title: payload.title,
        description: payload.description,
        imageUri: payload.imageUri,
        updatedAt: new Date().toISOString(),
      };
      persistNotes((prev) => [...prev, newNote]);
      return newNote;
    },
    [persistNotes]
  );

  const updateNote = useCallback(
    async (id: string, payload: UpdatePayload) => {
      let updated: PhotoNote | undefined;
      persistNotes((prev) =>
        prev.map((note) => {
          if (note.id !== id) {
            return note;
          }
          updated = {
            ...note,
            ...payload,
            updatedAt: new Date().toISOString(),
          };
          return updated;
        })
      );
      return updated;
    },
    [persistNotes]
  );

  const deleteNote = useCallback(
    async (id: string) => {
      persistNotes((prev) => prev.filter((note) => note.id !== id));
    },
    [persistNotes]
  );

  const getNoteById = useCallback(
    (id: string) => notes.find((note) => note.id === id),
    [notes]
  );

  const refreshNotes = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setNotes(JSON.parse(stored));
        return;
      }
      setNotes([]);
    } catch (error) {
      console.error("Error refreshing notes", error);
    }
  }, []);

  return (
    <NotesContext.Provider
      value={{ notes, loading, addNote, updateNote, deleteNote, getNoteById, refreshNotes }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};
