import { useEffect, useState } from "react";
import { useStore } from "@store/store";
import Loader from "@components/Loader/Loader";
import Button from "@components/Button/Button";
import NoteItem from "../NoteItem/NoteItem";
import { AnimatePresence } from "framer-motion";
import { PlusIcon } from "@radix-ui/react-icons";
import styles from "./NoteList.module.scss";

const NoteList = () => {
    const notes = useStore((state) => state.allNotes);
    const addNote = useStore((state) => state.addNote);
    const fetchNotes = useStore((state) => state.fetchNotes);
    const [isLoading, setIsLoading] = useState(false);
    const [isAnyNoteInEditMode, setIsAnyNoteInEditMode] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            setIsLoading(true);

            try {
                await fetchNotes();
            } finally {
                setIsLoading(false);
            }
        };
        fetch();
    }, []);

    const handleAddNote = () => {
        const content = { edit: true };
        setIsAnyNoteInEditMode(true);

        addNote(content);
    };

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
