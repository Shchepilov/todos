import { useRef, useState } from "react";
import { useStore } from "@store/store";
import * as Dialog from '@radix-ui/react-dialog';
import { PlusIcon } from "@radix-ui/react-icons";
import Button from "@components/Button/Button";

const TaskForm = ({ columnId, boardId }) => {
    const columns = useStore((state) => state.columns);
    const addTask = useStore((state) => state.addTask);
    const closeDialogRef = useRef(null);
    const [taskName, setTaskName] = useState("");
    const [priorityValue, setPriorityValue] = useState(2);
    const [columnIdValue, setColumnIdValue] = useState(columnId);

    const setTaskNameValue = (e) => {
        setTaskName(e.target.value);
    }

    const handleChangePriority = (e) => {
        setPriorityValue(e.target.value);
    }

    const handleChangeColumn = (e) => {
        setColumnIdValue(e.target.value);
    }

    const closeDialog = () => closeDialogRef.current?.click();

    const handleAddTask = (e) => {
        e.preventDefault();

        if (!taskName) return;

        addTask(boardId, columnIdValue, { title: taskName, priority: priorityValue, columnId: columnIdValue });
        setTaskName("");
        closeDialogRef.current?.click();
    }

    return (
        <form onSubmit={handleAddTask} className="form">
            <input type="text" autoFocus onChange={setTaskNameValue} placeholder="Task title"/>

            <div className="row">
                <div className="field">
                    <label className="label">Priority</label>
                    <select value={priorityValue} onChange={handleChangePriority}>
                        <option disabled>Select priority</option>
                        <option value="1">Backlog</option>
                        <option value="2">Trivial</option>
                        <option value="3">Minor</option>
                        <option value="4">Major</option>
                        <option value="5">Critical</option>
                        <option value="6">Blocker</option>
                    </select>    
                </div>
            </div>

            <div className="row">
                <div className="field">
                    <label className="label">Column</label>
                    <select value={columnIdValue} onChange={handleChangeColumn}>
                        {columns.map(column => (
                            <option key={column.id} value={column.id}>{column.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="button-group">
                <Button type="button" variation="secondary" onClick={closeDialog}>Cancel</Button>
                <Button type="submit" disabled={!taskName}><PlusIcon/>Add Task</Button>
            </div>

            <Dialog.Close ref={closeDialogRef} hidden></Dialog.Close>
        </form>
    );
};

export default TaskForm;
