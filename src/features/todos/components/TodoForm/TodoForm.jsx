import { useState, useRef } from "react";
import { useStore } from "@store/store";
import * as Dialog from '@radix-ui/react-dialog';
import styles from "./TodoForm.module.scss";
import dayjs from "dayjs";

const TodoForm = () => {
    const currentDay = useStore((state) => state.currentDay);
    const currentDate = dayjs(currentDay).format("YYYY-MM-DD");
    const addTodo = useStore((state) => state.addTodo);
    const contentRef = useRef();
    const priorityRef = useRef();
    const dueDateRef = useRef();
    const autoMoveRef = useRef();
    const closeDialogRef = useRef(null);
    const [dueDate, setDueDate] = useState(currentDate);
    const [isDueDate, setIsDueDate] = useState(false);
    const [newAutoMove, setNewAutoMove] = useState(false);

    const handleAddTodo = (e) => {
        e.preventDefault();

        const content = contentRef.current.value;
        const priority = priorityRef.current.value;
        const dueDate = dueDateRef.current.value;

        if (!content) return;
        
        const updatedDueDate = isDueDate ? dueDate : null;

        addTodo(content, priority, updatedDueDate, newAutoMove);
        contentRef.current.value = "";
        setDueDate(currentDate);
        setIsDueDate(false);
        closeDialogRef.current?.click();
    };

    return (
        <form onSubmit={(e) => e.preventDefault()} className={"form " + styles.form}>
            <div className="formLabel">
                <label>Title</label>
            </div>

            <div className="formField">
                <input type="text" ref={contentRef} placeholder="Add a new todo"/>
            </div>

            <div className="formLabel">
                <label>Priority</label>
            </div>

            <div className="formField">
                <select ref={priorityRef}>
                    <option value="" disabled>Select priority</option>
                    <option value="1">Low</option>
                    <option value="2">Medium</option>
                    <option value="3">High</option>
                </select>
            </div>

            <div className="formLabel">
                <label>Due date</label>
            </div>
            
            <div className="formField">
                <input type="date" disabled={!isDueDate} ref={dueDateRef} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                <input type="checkbox" checked={isDueDate} onChange={(e) => setIsDueDate(e.target.checked)} />
            </div>

            <div className="formLabel">
                <label>Auto move</label>
            </div>

            <div className="formField">
                <input type="checkbox" checked={newAutoMove} onChange={(e) => setNewAutoMove(e.target.checked)} />
            </div>

            <div className="emptyLabel">
                <button className="button" onClick={handleAddTodo}>Add</button>
            </div>

            <Dialog.Close ref={closeDialogRef} hidden></Dialog.Close>
        </form>
    );
};

export default TodoForm;
