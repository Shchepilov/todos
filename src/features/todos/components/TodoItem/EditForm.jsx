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

    const handleChangeContent = (e) => setNewContent(e.target.value);
    const handleChangePriority = (e) => setNewPriority(e.target.value);
    const handleChangeDate = (e) => setNewDate(e.target.value);
    const handleChangeDueDate = (e) => setNewDueDate(e.target.value);
    const handleIsDueDate = (e) => setIsDueDate(e.target.checked);
    const handleChangeAutoMove = (e) => setNewAutoMove(e.target.checked);
    const handleCloseForm = () => closeDialogRef.current?.click()
    const handleSubmitForm = (e) => e.preventDefault();

    const handleUpdateTodo = (e) => {
        e.preventDefault();

        if (!newContent) return;

        const updatedDueDate = isDueDate ? newDueDate : null;

        handleUpdate(id, newContent, newPriority, newDate, updatedDueDate, newAutoMove);
        handleCloseForm();
    };

    return (
        <form className="form" onSubmit={handleSubmitForm}>
            <div className="row">
                <div className="field">
                    <input
                        type="text"
                        value={newContent}
                        onChange={handleChangeContent}
                        placeholder="Add a new todo"
                    />
                </div>
            </div>

            <div className="row">
                <div className="field">
                    <label htmlFor={priorityId} className="label">Priority</label>
                    <select value={newPriority} id={priorityId} onChange={handleChangePriority}>
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
                    <input type="date" id={dateId} value={newDate} onChange={handleChangeDate} />
                </div>

                <div className="field">
                    <label htmlFor={dueDateId} className="label">Due Date</label>

                    <div className="field split-field">
                        <input type="date" id={dueDateId} disabled={!isDueDate} value={newDueDate} onChange={handleChangeDueDate} />
                        <Checkbox type="checkbox" checked={isDueDate} onChange={handleIsDueDate} />
                    </div>    
                </div>
            </div>

            <div className="row">
                <div className="field split-field">
                    <Checkbox type="checkbox" checked={newAutoMove} label="Auto move" onChange={handleChangeAutoMove} />
                </div>
            </div>

            <div className="button-group">
                <Button variation="secondary" onClick={handleCloseForm}>Cancel</Button>
                <Button onClick={handleUpdateTodo} disabled={!newContent}>Update</Button>
            </div>

            <Dialog.Close ref={closeDialogRef} hidden></Dialog.Close>
        </form>
    );
};

export default EditForm;
