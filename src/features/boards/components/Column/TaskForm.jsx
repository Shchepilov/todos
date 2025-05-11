import { useRef, useState } from "react";
import { useStore } from "@store/store";
import * as Dialog from '@radix-ui/react-dialog';
import { PlusIcon } from "@radix-ui/react-icons";
import Button from "@components/Button/Button";

const TaskForm = ({ columnId, boardId }) => {
    const addTask = useStore((state) => state.addTask);
    const closeDialogRef = useRef(null);
    const [taskName, setTaskName] = useState("");

    const setTaskNameValue = (e) => {
        setTaskName(e.target.value);
    }

    const closeDialog = () => closeDialogRef.current?.click();

    const handleAddTask = (e) => {
        e.preventDefault();

        if (!taskName) return;

        addTask(boardId, columnId, { title: taskName });
        setTaskName("");
        closeDialogRef.current?.click();
    }

    return (
        <form onSubmit={handleAddTask} className="form">
            <input type="text" autoFocus onChange={setTaskNameValue} placeholder="Task title"/>

            <div className="button-group">
                <Button type="button" variation="secondary" onClick={closeDialog}>Cancel</Button>
                <Button type="submit" disabled={!taskName}><PlusIcon/>Add Task</Button>
            </div>

            <Dialog.Close ref={closeDialogRef} hidden></Dialog.Close>
        </form>
    );
};

export default TaskForm;
