import { useState, memo } from "react";
import { useStore } from "../../store/store"
import { TrashIcon, DotsVerticalIcon, Pencil1Icon } from "@radix-ui/react-icons";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Loader from "../Loader/Loader";
import EditNote from "./EditForm";
import styles from "./NoteItem.module.scss";
import todoItemStyles from "../TodoItem/TodoItem.module.scss";
import dropdown from '../../styles/Dropdown.module.scss';
import { motion } from "framer-motion";
import dayjs from "dayjs";

const NoteItem = ({ note }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const deleteNote = useStore((state) => state.deleteNote);
    const updateNote = useStore((state) => state.updateNote);

    const update = async (id, data) => {
        setIsLoading(true);
        await updateNote(id, data);
        setIsLoading(false);
    };
    
    const handleUpdate = (id, content) => {
        update(id, { content });
    };

    const timestampFormatted = dayjs(new Date(note.timestamp.seconds * 1000)).format("MMM D, YYYY");

    return (
        <motion.li 
            layout
            exit={{ opacity: 0, x: 15 }}
            transition={{ duration: 0.2 }}
            className={styles.item + " " + todoItemStyles.TodoItem}>
            {isLoading && <Loader className={styles.loader} />}

            <p>{note.content}</p>

            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button className={todoItemStyles.dropdownButton}>
                        <DotsVerticalIcon />
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content className={dropdown.content} align="end">
                        <DropdownMenu.Item className={dropdown.item} disabled>
                            Created at: {timestampFormatted}
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator className={dropdown.separator} />

                        <DropdownMenu.Item className={dropdown.item} onSelect={() => setIsDialogOpen(true)}>
                            <Pencil1Icon /> Edit
                        </DropdownMenu.Item>

                        <DropdownMenu.Item className={dropdown.item + " " + dropdown.itemDanger} onSelect={() => deleteNote(note.id)}>
                            <TrashIcon /> Delete
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <EditNote 
                content={note.content} 
                id={note.id} 
                handleUpdate={handleUpdate}
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen} />
        </motion.li>
    );
};

export default memo(NoteItem);
