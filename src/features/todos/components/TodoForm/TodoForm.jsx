import { useState, useRef } from "react";
import { useStore } from "@store/store";
import { useForm } from "react-hook-form"
import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import { PlusIcon } from "@radix-ui/react-icons";
import Checkbox from "@components/Checkbox/Checkbox";
import Input from "@components/Input/Input";
import Select from "@components/Select/Select";
import Field from "@components/Field/Field";
import Button from "@components/Button/Button";
import { addTodo } from "@features/todos/services/todosQuery";
import { PRIORITY_OPTIONS } from "@features/todos/utils/constants";
import dayjs from "dayjs";

const TodoForm = () => {
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const userId = useStore((state) => state.user.uid);
    const currentDay = useStore((state) => state.currentDay);
    const currentDate = dayjs(currentDay).format("YYYY-MM-DD");
    const closeDialogRef = useRef(null);
    const [isDueDate, setIsDueDate] = useState(false);
    const [newAutoMove, setNewAutoMove] = useState(false);

    const handleNewAutoMove = (e) => setNewAutoMove(e.target.checked);
    const handleCloseForm = () => closeDialogRef.current?.click();
    const handleToggleDueDate = (e) => setIsDueDate(e.target.checked);

    const handleAddTodo = (data) => {
        const { todoTitle, todoPriority, todoDueDate } = data;

        const updatedDueDate = isDueDate ? todoDueDate : null;

        addTodo(userId, todoTitle, todoPriority, updatedDueDate, newAutoMove, currentDate);
        
        handleCloseForm();
    };

    return (
        <Form.Root onSubmit={handleSubmit(handleAddTodo)} className="form">
            <Field name="todoTitle" label="Title" required errors={errors}>
                <Input
                    register={register}
                    name="todoTitle"
                    label="Title"
                    placeholder="Title"
                    autoFocus
                    errors={errors}
                    required="Field is required"
                    maxLength={{
                        value: 40,
                        message: "Title cannot exceed 40 characters"
                    }}
                />
            </Field>

            <div className="row">
                <Field name="todoPriority" label="Priority" errors={errors}>
                    <Select
                        register={register}
                        name="todoPriority"
                        nameKey="label"
                        items={PRIORITY_OPTIONS}
                        defaultValue={PRIORITY_OPTIONS[0].value}
                    />
                </Field>

                <div className="field split-field">
                    <Field name="todoDueDate" label="Due Date" errors={errors}>
                        <Input
                            type="date"
                            register={register}
                            name="todoDueDate"
                            defaultValue={currentDate}
                            errors={errors}
                            disabled={!isDueDate}
                        />
                    </Field>
                    
                    <Checkbox checked={isDueDate} onChange={handleToggleDueDate}
                    />
                </div>
            </div>

            <Checkbox checked={newAutoMove} 
                      label="Auto move"
                      onChange={handleNewAutoMove} />

            <div className="button-group">
                <Button variation="secondary" onClick={handleCloseForm}>Cancel</Button>
                <Button type="submit"><PlusIcon/>Add Todo</Button>
            </div>

            <Dialog.Close ref={closeDialogRef} hidden></Dialog.Close>
        </Form.Root>
    );
};

export default TodoForm;
