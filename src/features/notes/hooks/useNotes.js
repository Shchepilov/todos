import { useEffect } from "react";
import { useStore } from "@store/store";
import { useCollection } from 'react-firebase-hooks/firestore';
import { notesQuery } from "@features/notes/services/notesQuery";

const useNotes = () => {
    const userId = useStore((state) => state.user.uid);
    const setAllNotes = useStore((state) => state.setAllNotes);
    const allNotesQuery = notesQuery(userId);
    
    const [notesSnapshot, loading, error] = useCollection(allNotesQuery);

    useEffect(() => {
        if (notesSnapshot) {
            const notes = notesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setAllNotes(notes);
        }
    }, [notesSnapshot]);

    return { loading, error };
}
 
export default useNotes;
