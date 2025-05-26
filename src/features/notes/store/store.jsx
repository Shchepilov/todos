

export const useNotesStore = (set) => ({
    allNotes: [],
    setAllNotes: (notes) => set({ allNotes: notes }),
    updateNote: (updatedNote) => set((state) => ({
        allNotes: state.allNotes.map(note => 
            note.id === updatedNote.id ? updatedNote : note
        )
    }))
});
