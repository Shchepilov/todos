import { useState, useRef, useId } from "react";
import { Dialog } from "radix-ui";
import dayjs from "dayjs";
import { useStore } from "@store/store";
import Checkbox from "@components/Checkbox/Checkbox";
import Button from "@components/Button/Button";
import { PRIORITY_OPTIONS } from "@features/todos/utils/constants";

const EditForm = ({ id, content, priority, date, dueDate, autoMove, handleUpdate }) => {
    const currentDay = useStore((state) => state.currentDay);
    const currentDate = dayjs(currentDay).format("YYYY-MM-DD");
    const [newDueDate, setNewDueDate] = useState(dueDate || currentDate);
    const [isDueDate, setIsDueDate] = useState(!!dueDate);
    const [newContent, setNewContent] = useState(content);
    const [newPriority, setNewPriority] = useState(priority);
    const [newDate, setNewDate] = useState(date);
    const [newAutoMove, setNewAutoMove] = useState(autoMove);
    const priorityId = useId();
    const dueDateId = useId();
    const dateId = useId();
    const closeDialogRef = useRef(null);

    const handleUpdateTodo = (e) => {
        e.preventDefault();

        if (!newContent) return;

        const updatedDueDate = isDueDate ? newDueDate : null;

        handleUpdate(id, newContent, newPriority, newDate, updatedDueDate, newAutoMove);

        closeDialogRef.current?.click();
    };

    return (
        <form className="form" onSubmit={(e) => e.preventDefault()}>
            <div className="row">
                <div className="field">
                    <input
                        type="text"
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        placeholder="Add a new todo"
                    />
                </div>
            </div>

            <div className="row">
                <div className="field">
                    <label htmlFor={priorityId} className="label">Priority</label>
                    <select value={newPriority} id={priorityId} onChange={(e) => setNewPriority(e.target.value)}>
                        {PRIORITY_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="row">
                <div className="field">
                    <label htmlFor={dateId} className="label">Date</label>
                    <input type="date" id={dateId} value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                </div>

                <div className="field">
                    <label htmlFor={dueDateId} className="label">Due Date</label>

                    <div className="field split-field">
                        <input type="date" id={dueDateId} disabled={!isDueDate} value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} />
                        <Checkbox type="checkbox" checked={isDueDate} onChange={(e) => setIsDueDate(e.target.checked)} />
                    </div>    
                </div>
            </div>

            <div className="row">
                <div className="field split-field">
                    <Checkbox type="checkbox" checked={newAutoMove} label="Auto move" onChange={(e) => setNewAutoMove(e.target.checked)} />
                </div>
            </div>

            <div className="button-group">
                <Button variation="secondary" onClick={() => closeDialogRef.current?.click()}>Cancel</Button>
                <Button onClick={handleUpdateTodo} disabled={!newContent}>Update</Button>
            </div>

            <Dialog.Close ref={closeDialogRef} hidden></Dialog.Close>
        </form>
    );
};

export default EditForm;
