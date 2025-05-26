import { useEffect } from "react";
import { useStore } from "@store/store";
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where, orderBy } from "firebase/firestore";
import { db } from "@baseUrl/firebase";
import { NOTE_COLLECTION } from "@features/notes/utils/constants";

const useNotes = () => {
    const userId = useStore((state) => state.user.uid);
    const setAllNotes = useStore((state) => state.setAllNotes);

    const notesQuery = query(
        collection(db, NOTE_COLLECTION),
        where("userId", "==", userId),
        orderBy("timestamp", "desc")
    );
    
    const [notesSnapshot, loading, error] = useCollection(notesQuery);

    useEffect(() => {
        if (notesSnapshot) {
            const notes = notesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setAllNotes(notes);
        }
    }, [notesSnapshot]);

    return { loading, error };
}
 
export default useNotes;
