import { useState, useRef, useEffect, memo } from "react";
import { useStore } from "@store/store"
import { TrashIcon, Pencil1Icon, PaperPlaneIcon, MoveIcon, CheckIcon } from "@radix-ui/react-icons";
import Button from "@components/Button/Button";
import Loader from "@components/Loader/Loader";


import { motion } from "framer-motion";
import styles from "./NoteItem.module.scss";

const COLOR_OPTIONS = [
    { id: 'default', value: '#FEFEFE' },
    { id: 'yellow', value: '#FFDD1B' },
    { id: 'purple', value: '#B180FF' },
    { id: 'pink', value: '#FF89B7' },
    { id: 'green', value: '#48E16D' },
    { id: 'blue', value: '#62A6FF' },
    { id: 'orange', value: '#FF812D' },
];

const NoteItem = ({ note }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isEditMode, setEditMode] = useState(note.edit);
    const [content, setContent] = useState(note.content);
    const [selectedColor, setSelectedColor] = useState(note.color || COLOR_OPTIONS[0].value);
    const textAreaRef = useRef(null);
    const noteRef = useRef(null);

    const deleteNote = useStore((state) => state.deleteNote);
    const updateNote = useStore((state) => state.updateNote);    

    useEffect(() => {
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


    const update = async (id, data) => {
        //setIsLoading(true);
        try {
            await updateNote(id, data);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = () => {
        if (content !== note.content || selectedColor !== note.color) {
            update(note.id, { content, color: selectedColor, edit: false });
        }

        if (!content && note.edit) {
            deleteNote(note.id);
        }

        setEditMode(false);
    };

    const handleChange = (e) => {
        setContent(e.target.value);
    };

    const handleEdit = () => {
        setEditMode(true);
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
        update(note.id, { color: selectedColor });
        setSelectedColor(color);
    };

    return (
        <motion.li 
            layout
            exit={{ opacity: 0, x: 15 }}
            transition={{ duration: 0.2 }}
            className={styles.item}
            ref={noteRef}
            style={{'--note-color': selectedColor }}
        >
            {isLoading && <Loader className={styles.loader} />}

            <div className={styles.header}>
                {isEditMode ? (
                    <div className={styles.editActions}>
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

                        <Button size="small" className={styles.buttonIcon} onClick={handleUpdate}>
                            <PaperPlaneIcon />
                        </Button>
                    </div>
                ) : (
                    <div className={styles.actions}>
                        <span className={styles.dragContainer}><MoveIcon /></span>

                        <Button size="small" className={styles.buttonIcon} onClick={handleEdit}>
                            <Pencil1Icon />
                        </Button>

                        <Button size="small" className={styles.buttonIcon} onClick={handleDelete}>
                            <TrashIcon />
                        </Button>
                    </div>
                )}
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
        </motion.li>
    );
};

export default memo(NoteItem);
