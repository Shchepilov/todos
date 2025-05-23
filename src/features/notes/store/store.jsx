export const useNotesStore = (set) => ({
    allNotes: [],
    setAllNotes: (notes) => set({ allNotes: notes })
});
