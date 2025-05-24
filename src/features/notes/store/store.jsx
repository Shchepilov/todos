

export const useNotesStore = (set) => ({
    allNotes: [],
    setAllNotes: (notes) => set({ allNotes: notes }),
    notesLastUpdated: null,
    setNotesLastUpdated: (timestamp) => set({notesLastUpdated: timestamp})
});
