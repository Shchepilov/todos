import { useState, useRef, useId } from "react";
import { useStore } from "@store/store";
import * as Dialog from '@radix-ui/react-dialog';
import { PlusIcon } from "@radix-ui/react-icons";
import Checkbox from "@components/Checkbox/Checkbox";
import Button from "@components/Button/Button";
import { addTodo } from "@features/todos/services/todosQuery";
import { PRIORITY_OPTIONS } from "@features/todos/utils/constants";
import dayjs from "dayjs";

const TodoForm = () => {
    const userId = useStore((state) => state.user.uid);
    const currentDay = useStore((state) => state.currentDay);
    const currentDate = dayjs(currentDay).format("YYYY-MM-DD");
    const closeDialogRef = useRef(null);
    const priorityId = useId();
    const dueDateId = useId();
    const autoMoveId = useId();
    const [dueDate, setDueDate] = useState(currentDate);
    const [isDueDate, setIsDueDate] = useState(false);
    const [newAutoMove, setNewAutoMove] = useState(false);
    const [todoText, setTodoText] = useState("");
    const [priority, setPriority] = useState(PRIORITY_OPTIONS[0].value);

    const changeTodoText = (e) => setTodoText(e.target.value);
    const handleChangePriority = (e) => setPriority(e.target.value);
    const handleChangeDueDate = (e) => setDueDate(e.target.value);
    const handleToggleDueDate = (e) => setIsDueDate(e.target.checked);
    const handleNewAutoMove = (e) => setNewAutoMove(e.target.checked);
    const handleSubmitForm = (e) => e.preventDefault();
    const handleCloseForm = () => closeDialogRef.current?.click();

    const handleAddTodo = (e) => {
        e.preventDefault();

        const updatedDueDate = isDueDate ? dueDate : null;

        addTodo(userId, todoText, priority, updatedDueDate, newAutoMove, currentDate);
        setTodoText("");
        setDueDate(currentDate);
        setIsDueDate(false);
        handleCloseForm();
    };

    return (
        <form onSubmit={handleSubmitForm} className="form">
            <div className="field">
                <input type="text" value={todoText} onChange={changeTodoText} placeholder="Add a new task"/>
            </div>

            <div className="row">
                <div className="field">
                    <label htmlFor={priorityId} className="label">Priority</label>

                    <select id={priorityId} value={priority} onChange={handleChangePriority}>
                        {PRIORITY_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="field">
                    <label htmlFor={dueDateId} className="label">Due Date</label>
                    
                    <div className="field split-field">
                        <input type="date" id={dueDateId} disabled={!isDueDate} value={dueDate} onChange={handleChangeDueDate} />

                        <Checkbox checked={isDueDate} onChange={handleToggleDueDate} />
                    </div>
                </div>
            </div>

            <div className="field split-field">
                <Checkbox checked={newAutoMove} label="Auto move" id={autoMoveId} onChange={handleNewAutoMove} />
            </div>

            <div className="button-group">
                <Button variation="secondary" onClick={handleCloseForm}>Cancel</Button>
                <Button onClick={handleAddTodo} disabled={!todoText}><PlusIcon/>Add Todo</Button>
            </div>

            <Dialog.Close ref={closeDialogRef} hidden></Dialog.Close>
        </form>
    );
};

export default TodoForm;
