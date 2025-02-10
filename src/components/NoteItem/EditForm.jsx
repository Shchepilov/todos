import { useState, useRef } from "react";
import { Dialog } from "radix-ui";
import { Cross2Icon } from "@radix-ui/react-icons";
import styles from "../NoteItem/NoteItem.module.scss";
import dialog from "../../styles/Dialog.module.scss";

const EditForm = ({ id, content, handleUpdate, isDialogOpen, setIsDialogOpen }) => {
    const [newContent, setNewContent] = useState(content);
    const closeDialogRef = useRef(null);

    const handleUpdateNote = () => {
        if (!newContent) return;

        handleUpdate(id, newContent);

        closeDialogRef.current?.click();
    };

    return (
        <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className={dialog.backdrop} />
                <Dialog.Content className={dialog.modal} aria-describedby={undefined}>
                    <Dialog.Title className="DialogTitle">Edit Note</Dialog.Title>
                    <Dialog.Close asChild>
                        <button className={dialog.close} aria-label="Close">
                            <Cross2Icon />
                        </button>
                    </Dialog.Close>
                    
                    <form className={styles.editForm} onSubmit={(e) => e.preventDefault()}>
                        <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} />
                        <div className={styles.actions}>
                            <button type="submit" onClick={handleUpdateNote}>Update</button>

                            <Dialog.Close ref={closeDialogRef} asChild>
                                <button>Cancel</button>
                            </Dialog.Close>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default EditForm;
