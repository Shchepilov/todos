import { useState } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import { AnimatePresence } from "framer-motion";
import { useStore } from "@store/store";
import Loader from "@components/Loader/Loader";
import Button from "@components/Button/Button";
import { addNote } from "@features/notes/services/notesQuery";
import useNotes from "@features/notes/hooks/useNotes";
import NoteItem from "@features/notes/components/NoteItem/NoteItem";
import styles from "./NoteList.module.scss";

const NoteList = () => {
    const userId = useStore((state) => state.user.uid);
    const notes = useStore((state) => state.allNotes);
    const [isAnyNoteInEditMode, setIsAnyNoteInEditMode] = useState(false);

    const { loading: isLoading, error } = useNotes();

    const handleAddNote = () => {
        const content = { edit: true };
        setIsAnyNoteInEditMode(true);

        addNote(userId, content);
    };

    if (error) {
        return <div>Error loading notes</div>;
    }

    return (
        <div className={styles.container}>
            {notes.length === 0 && (
                <div className={styles.noNotes}>
                    <Button variation="icon" size="large" className={styles.addButton} onClick={handleAddNote}>
                        <PlusIcon />
                    </Button>
                    <p>Create note</p>
                </div>
            )}

            {notes.length > 0 && (
                <div className={styles.listContainer}>
                    <Button variation="icon" size="medium" className={styles.addButton} onClick={handleAddNote} disabled={isAnyNoteInEditMode}>
                        <PlusIcon />
                        {isLoading && <Loader className={styles.loader} />}
                    </Button>
                    <ul className={styles.list}>
                        <AnimatePresence>
                            {notes.map((note) => (
                                <NoteItem key={note.id} note={note} setIsAnyNoteInEditMode={setIsAnyNoteInEditMode} />
                            ))}
                        </AnimatePresence>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NoteList;
