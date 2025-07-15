import { create } from 'zustand';

type Note = {
    id: string;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
};

interface NoteState {
    notes: Note[];
    loading: boolean;
    error: string | null;
    fetchNotes: () => Promise<void>;
    addNoteOptimistic: (newNote: Note) => void; // Contoh untuk optimistik UI
}

// Definisikan fungsi fetch dari API Notes eksternal
const fetchNotesFromApi = async (): Promise<Note[]> => {
    const response = await fetch('https://service.pace11.my.id/api/notes', {
        cache: 'no-store', // Selalu fetch data terbaru
    });
    if (!response.ok) {
        throw new Error('Failed to fetch notes from API');
    }
    const data = await response.json();
    if (data && Array.isArray(data.data)) {
        return data.data;
    }
    return [];
};


export const useNoteStore = create<NoteState>((set) => ({
    notes: [],
    loading: false,
    error: null,
    fetchNotes: async () => {
        set({ loading: true, error: null });
        try {
            const fetchedNotes = await fetchNotesFromApi();
            set({ notes: fetchedNotes, loading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch notes', loading: false });
        }
    },
    // Contoh fungsi untuk update state secara optimistik di klien
    addNoteOptimistic: (newNote) => {
        set((state) => ({
            notes: [...state.notes, newNote],
        }));
    },
}));