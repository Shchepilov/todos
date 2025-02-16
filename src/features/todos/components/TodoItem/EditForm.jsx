import { useState, useRef } from "react";
import { Dialog } from "radix-ui";
import { Cross2Icon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import { useStore } from "../../../../store/store";
import styles from "./EditForm.module.scss";
import dialog from "../../../../components/Dialog/Dialog.module.scss";
import forms from "../../../../Forms.module.scss";

const EditForm = ({ id, content, priority, date, dueDate, autoMove, handleUpdate, isDialogOpen, setIsDialogOpen }) => {
    const currentDay = useStore((state) => state.currentDay);
    const currentDate = dayjs(currentDay).format("YYYY-MM-DD");
    const [newDueDate, setNewDueDate] = useState(dueDate || currentDate);
    const [isDueDate, setIsDueDate] = useState(!!dueDate);
    const [newContent, setNewContent] = useState(content);
    const [newPriority, setNewPriority] = useState(priority);
    const [newDate, setNewDate] = useState(date);
    const [newAutoMove, setNewAutoMove] = useState(autoMove);
    const closeDialogRef = useRef(null);

    const handleUpdateTodo = (e) => {
        e.preventDefault();

        if (!newContent) return;

        const updatedDueDate = isDueDate ? newDueDate : null;

        handleUpdate(id, newContent, newPriority, newDate, updatedDueDate, newAutoMove);

        closeDialogRef.current?.click();
    };

    return (
        <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className={dialog.backdrop} />
                <Dialog.Content className={dialog.modal} aria-describedby={undefined}>
                    <Dialog.Title className="DialogTitle">Edit Todo</Dialog.Title>
                    <Dialog.Close asChild>
                        <button className={dialog.close} aria-label="Close">
                            <Cross2Icon />
                        </button>
                    </Dialog.Close>
                    
                    <form className={forms.form} onSubmit={(e) => e.preventDefault()}>
                        <div className={forms.formLabel}>
                            <label>Title</label>
                        </div>

                        <div className={forms.formField}>
                            <input
                                type="text"
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                placeholder="Add a new todo"
                            />
                        </div>

                        <div className={forms.formLabel}>
                            <label>Priority</label>
                        </div>

                        <div className={forms.formField}>
                            <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
                                <option value="1">Low</option>
                                <option value="2">Medium</option>
                                <option value="3">High</option>
                            </select>
                        </div>

                        <div className={forms.formLabel}>
                            <label>Date</label>
                        </div>

                        <div className={forms.formField}>
                            <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                        </div>

                        <div className={forms.formLabel}>
                            <label>Due date</label>
                        </div>
                        
                        <div className={forms.formField}>
                            <input type="date" disabled={!isDueDate} value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} />
                            <input type="checkbox" checked={isDueDate} onChange={(e) => setIsDueDate(e.target.checked)} />
                        </div>

                        <div className={forms.formLabel}>
                            <label>Auto move</label>
                        </div>

                        <div className={forms.formField}>
                            <input type="checkbox" checked={newAutoMove} onChange={(e) => setNewAutoMove(e.target.checked)} />
                        </div>

                        <div className={styles.actions}>
                            <button onClick={handleUpdateTodo}>Update</button>
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
