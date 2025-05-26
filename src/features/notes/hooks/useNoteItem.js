import { useEffect } from "react";
import { useStore } from "@store/store";
import { useDocument } from 'react-firebase-hooks/firestore';
import { doc } from "firebase/firestore";
import { db } from "@baseUrl/firebase";
import { NOTE_COLLECTION } from "@features/notes/utils/constants";

const useNoteItem = (id) => {
    const [noteItemSnapshot, noteItemLoading, noteItemError] = useDocument(doc(db, NOTE_COLLECTION, id));
    const updateNote = useStore((state) => state.updateNote);

    useEffect(() => {
        if (noteItemSnapshot && noteItemSnapshot.exists()) {
            const noteItem = { id: noteItemSnapshot.id, ...noteItemSnapshot.data() };
            updateNote(noteItem);
        }
    }, [noteItemSnapshot, updateNote]);

    return {  noteItemLoading, noteItemError };
}
 
export default useNoteItem;
