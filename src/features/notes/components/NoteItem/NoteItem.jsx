import { useState, useRef, useEffect, memo } from "react";
import { deleteNote, updateNote } from "@features/notes/services/notesQuery";
import { TrashIcon, Pencil1Icon, PaperPlaneIcon, CheckIcon } from "@radix-ui/react-icons";
import Button from "@components/Button/Button";
import Loader from "@components/Loader/Loader";
import Modal from "@components/Modal/Modal";
import { COLOR_OPTIONS, MAX_NOTE_LENGTH } from "@features/notes/utils/constants";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./NoteItem.module.scss";
import useNoteItem from "@features/notes/hooks/useNoteItem";

const NoteItem = ({ note, setIsAnyNoteInEditMode }) => {
    const {noteItemLoading, noteItemError} = useNoteItem(note.id);
    const [isEditMode, setEditMode] = useState(note.edit);
    const [content, setContent] = useState(note.content);
    const [selectedColor, setSelectedColor] = useState(note.color || COLOR_OPTIONS[0].value);
    const [symbols, setSymbols] = useState(note.content ? note.content.length : 0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const textAreaRef = useRef(null);
    const noteRef = useRef(null);

    useEffect(() => {
        setContent(note.content);
        setSelectedColor(selectedColor);
        setSymbols(note.content ? note.content.length : 0);
        setEditMode(note.edit);
    }, [note]);

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }

        if (!isEditMode) return;

        function handleClickOutside(event) {
            if (noteRef.current && !noteRef.current.contains(event.target)) {
                handleUpdate();
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isEditMode, content, selectedColor]);

    const handleUpdate = () => {
        setIsAnyNoteInEditMode(false);

        if (!content) {
            deleteNote(note.id);
            return;
        }

        setEditMode(false);

        if (content !== note.content || selectedColor !== note.color) {
            updateNote(note.id, { content, color: selectedColor, edit: false });
        }
    };

    const handleChange = (e) => {
        if (e.target.value.length > MAX_NOTE_LENGTH) return;
        setSymbols(e.target.value.length);
        setContent(e.target.value);
    };

    const handleEdit = () => {
        setEditMode(true);
        setIsAnyNoteInEditMode(true);
        textAreaRef.current.focus();

        if (textAreaRef.current) {
            const length = textAreaRef.current.value.length;
            textAreaRef.current.setSelectionRange(length, length);
        }
    };

    const handleDelete = () => {
        deleteNote(note.id);
    };

    const handleColorChange = (color) => {
        setSelectedColor(color);
    };

    return (
        <motion.li
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: 15 }}
            transition={{ duration: 0.2 }}
            className={styles.item}
            ref={noteRef}
            style={{'--note-color': selectedColor }}
        >
            {noteItemLoading && <Loader className={styles.loader} />}

            <div className={styles.header}>
                <AnimatePresence mode="wait">
                {isEditMode ? (
                    <motion.div
                        key="edit-mode"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className={styles.editActions}>

                        <ul className={styles.colors}>
                            {COLOR_OPTIONS.map((color) => (
                                <li key={color.id} className={styles.colorsItem}>
                                    <input
                                        type="radio"
                                        name="color"
                                        value={color.value}
                                        id={`color-${color.id}`}
                                        className={styles.colorInput}
                                        checked={selectedColor === color.value}
                                        onChange={() => handleColorChange(color.value)}
                                    />
                                    <label 
                                        htmlFor={`color-${color.id}`}
                                        className={styles.colorLabel}
                                        style={{ backgroundColor: color.value }}
                                    >
                                        {selectedColor === color.value && <CheckIcon />}
                                    </label>
                                </li>
                            ))}
                        </ul>

                        <Button size="small" variation="icon" className={styles.buttonIcon} onClick={handleUpdate} disabled={!content}>
                            <PaperPlaneIcon />
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="view-mode"
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className={styles.actions}>

                        <Button size="small" variation="icon" className={styles.buttonIcon} onClick={handleEdit}>
                            <Pencil1Icon />
                        </Button>

                        <Button size="small" variation="icon" className={styles.buttonIcon} onClick={() => setIsDialogOpen(true)}>
                            <TrashIcon />
                        </Button>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>

            <textarea
                className={styles.textarea}
                ref={textAreaRef}
                value={content}
                onChange={handleChange}
                readOnly={!isEditMode}
                autoFocus={isEditMode}
                onFocus={(e) => e.preventDefault()}
            />

            <div className={styles.footer}>
                {isEditMode && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}>
                            {symbols} / 400
                    </motion.div>
                )}
            </div>

            <Modal heading='Delete Note' isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen}>
                <p>Do you really want to see this note?</p>
                <div className="button-group">
                    <Button variation="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDelete}>Delete</Button>
                </div>
            </Modal>
        </motion.li>
    );
};

export default memo(NoteItem);
