import { useState, useRef, useEffect, useCallback, memo } from "react";
import dayjs from "dayjs";
import { deleteNote, updateNote } from "@features/notes/services/notesQuery";
import { TrashIcon, Pencil1Icon, PaperPlaneIcon, CheckIcon } from "@radix-ui/react-icons";
import { useIntl, FormattedMessage } from 'react-intl';
import Button from "@components/Button/Button";
import Loader from "@components/Loader/Loader";
import Modal from "@components/Modal/Modal";
import Row from "@components/Row/Row";
import { COLOR_OPTIONS, MAX_NOTE_LENGTH } from "@features/notes/utils/constants";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./NoteItem.module.scss";
import useNoteItem from "@features/notes/hooks/useNoteItem";

const NoteItem = ({ note, setIsAnyNoteInEditMode }) => {
    const intl = useIntl();
    const { noteItemLoading, noteItemError } = useNoteItem(note.id);
    const [isEditMode, setEditMode] = useState(note.edit);
    const [content, setContent] = useState(note.content ?? "");
    const [selectedColor, setSelectedColor] = useState(note.color || COLOR_OPTIONS[0].value);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const textAreaRef = useRef(null);
    const noteRef = useRef(null);
    const noteCreatedDate = dayjs(note.timestamp?.seconds ? note.timestamp.seconds * 1000 : undefined).format("MMM D, YYYY");

    const [prevNote, setPrevNote] = useState(note);

    if (prevNote !== note) {
        setPrevNote(note);
        setContent(note.content ?? "");
        setSelectedColor(note.color || COLOR_OPTIONS[0].value);
        setEditMode(note.edit);
    }

    const handleUpdate = useCallback(() => {
        setIsAnyNoteInEditMode(false);

        if (!content) {
            deleteNote(note.id);
            return;
        }

        setEditMode(false);

        if (content !== note.content || selectedColor !== note.color) {
            updateNote(note.id, { content, color: selectedColor, edit: false });
        }
    }, [content, selectedColor, note, setIsAnyNoteInEditMode]);

    useEffect(() => {
        const textArea = textAreaRef.current;
        if (textArea) {
            textArea.style.height = "auto";
            textArea.style.height = `${textArea.scrollHeight}px`;
        }
    }, [content]);

    useEffect(() => {
        if (!isEditMode) return;

        const handleClickOutside = (event) => {
            if (noteRef.current && !noteRef.current.contains(event.target)) {
                handleUpdate();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isEditMode, handleUpdate]);

    const handleChange = (e) => {
        if (e.target.value.length > MAX_NOTE_LENGTH) return;
        setContent(e.target.value);
    };

    const handleEdit = () => {
        setEditMode(true);
        setIsAnyNoteInEditMode(true);

        const textArea = textAreaRef.current;
        if (textArea) {
            textArea.focus();
            textArea.setSelectionRange(textArea.value.length, textArea.value.length);
        }
    };

    const handleDelete = () => {
        deleteNote(note.id);
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
            {noteItemError && <span className={styles.error}><FormattedMessage id="notes.loadError" /></span>}

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
                                        onChange={() => setSelectedColor(color.value)}
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
            />

            <footer className={styles.footer}>
                <span>{noteCreatedDate}</span>
                {isEditMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}>
                            <FormattedMessage id="notes.characterCount" values={{ current: content.length, max: MAX_NOTE_LENGTH }} />
                    </motion.div>
                )}
            </footer>

            <Modal heading={intl.formatMessage({ id: 'notes.deleteNote' })} isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen}>
                <p><FormattedMessage id="notes.deleteConfirm" /></p>
                <Row equal>
                    <Button variation="secondary" onClick={() => setIsDialogOpen(false)}>
                        <FormattedMessage id="common.cancel" />
                    </Button>
                    <Button onClick={handleDelete}>
                        <FormattedMessage id="common.delete" />
                    </Button>
                </Row>
            </Modal>
        </motion.li>
    );
};

export default memo(NoteItem);
