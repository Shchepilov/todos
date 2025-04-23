import { useState, useRef, useId } from "react";
import { useStore } from "@store/store";
import * as Dialog from '@radix-ui/react-dialog';
import { PlusIcon } from "@radix-ui/react-icons";
import Checkbox from "@components/Checkbox/Checkbox";
import Button from "@components/Button/Button";
import dayjs from "dayjs";

const TodoForm = () => {
    const currentDay = useStore((state) => state.currentDay);
    const addTodo = useStore((state) => state.addTodo);
    const currentDate = dayjs(currentDay).format("YYYY-MM-DD");
    const priorityRef = useRef();
    const dueDateRef = useRef();
    const closeDialogRef = useRef(null);
    const priorityId = useId();
    const dueDateId = useId();
    const autoMoveId = useId();
    const [dueDate, setDueDate] = useState(currentDate);
    const [isDueDate, setIsDueDate] = useState(false);
    const [newAutoMove, setNewAutoMove] = useState(false);
    const [todoText, setTodoText] = useState("");

    const changeTodoText = (e) => {
        setTodoText(e.target.value);
    };
    
    const handleAddTodo = (e) => {
        e.preventDefault();
        
        const priority = priorityRef.current.value;
        const dueDate = dueDateRef.current.value;
        const updatedDueDate = isDueDate ? dueDate : null;

        addTodo(todoText, priority, updatedDueDate, newAutoMove);
        setTodoText("");
        setDueDate(currentDate);
        setIsDueDate(false);
        closeDialogRef.current?.click();
    };

    return (
        <form onSubmit={(e) => e.preventDefault()} className="form">
            <div className="field">
                <input type="text" value={todoText} onChange={changeTodoText} placeholder="Add a new task"/>
            </div>

            <div className="row">
                <div className="field">
                    <label htmlFor={priorityId} className="label">Priority</label>

                    <select ref={priorityRef} id={priorityId}>
                        <option value="" disabled>Select priority</option>
                        <option value="1">Low</option>
                        <option value="2">Medium</option>
                        <option value="3">High</option>
                    </select>
                </div>

                <div className="field">
                    <label htmlFor={dueDateId} className="label">Due Date</label>
                    
                    <div className="field split-field">
                        <input type="date" id={dueDateId} disabled={!isDueDate} ref={dueDateRef} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

                        <Checkbox checked={isDueDate} onChange={(e) => setIsDueDate(e.target.checked)} />
                    </div>
                </div>
            </div>

            <div className="field split-field">
                <Checkbox checked={newAutoMove} label="Auto move" id={autoMoveId} onChange={(e) => setNewAutoMove(e.target.checked)} />
            </div>

            <div className="button-group">
                <Button variation="secondary" onClick={() => closeDialogRef.current?.click()}>Cancel</Button>
                <Button onClick={handleAddTodo} disabled={!todoText}><PlusIcon/>Add Todo</Button>
            </div>

            <Dialog.Close ref={closeDialogRef} hidden></Dialog.Close>
        </form>
    );
};

export default TodoForm;
