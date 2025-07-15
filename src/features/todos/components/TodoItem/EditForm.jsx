import { useState, useRef } from "react";
import { Dialog } from "radix-ui";
import { useForm } from "react-hook-form"
import * as Form from '@radix-ui/react-form';
import dayjs from "dayjs";
import { useStore } from "@store/store";
import Checkbox from "@components/Checkbox/Checkbox";
import Input from "@components/Input/Input";
import Select from "@components/Select/Select";
import Field from "@components/Field/Field";
import Button from "@components/Button/Button";
import { PRIORITY_OPTIONS } from "@features/todos/utils/constants";

const EditForm = ({ id, content, priority, date, dueDate, autoMove, handleUpdate }) => {
    const { register, handleSubmit, formState: { errors }, } = useForm();

    const currentDay = useStore((state) => state.currentDay);
    const currentDate = dayjs(currentDay).format("YYYY-MM-DD");
    const [isDueDate, setIsDueDate] = useState(!!dueDate);
    const [newAutoMove, setNewAutoMove] = useState(autoMove);
    
    const closeDialogRef = useRef(null);

    const handleIsDueDate = (e) => setIsDueDate(e.target.checked);
    const handleChangeAutoMove = (e) => setNewAutoMove(e.target.checked);
    const handleCloseForm = () => closeDialogRef.current?.click()

    const handleUpdateTodo = (data) => {
        const { todoTitle, todoPriority, todoDueDate, todoDate } = data;
        const updatedDueDate = isDueDate ? todoDueDate : null;
        
        handleUpdate(id, todoTitle, todoPriority, todoDate, updatedDueDate, newAutoMove);
        handleCloseForm();
    };

    return (
        <Form.Root onSubmit={handleSubmit(handleUpdateTodo)} className="form">
            <Field name="todoTitle" label="Title" errors={errors}>
                <Input
                    register={register}
                    name="todoTitle"
                    label="Title"
                    placeholder="Title"
                    autoFocus
                    errors={errors}
                    required="Field is required"
                    defaultValue={content}
                    maxLength={{
                        value: 40,
                        message: "Title cannot exceed 40 characters"
                    }}
                />
            </Field>

            <Field name="todoPriority" label="Priority" errors={errors}>
                <Select
                    register={register}
                    name="todoPriority"
                    nameKey="label"
                    items={PRIORITY_OPTIONS}
                    defaultValue={priority}
                />
            </Field>

            <div className="row">
                <Field name="todoDate" label="Date" errors={errors}>
                    <Input
                        type="date"
                        register={register}
                        name="todoDate"
                        defaultValue={date}
                        errors={errors}/>
                </Field>

                <div className="field split-field">
                    <Field name="todoDueDate" label="Due Date" errors={errors}>
                        <Input
                            type="date"
                            register={register}
                            name="todoDueDate"
                            defaultValue={dueDate || currentDate}
                            errors={errors}
                            disabled={!isDueDate}
                        />
                    </Field>
                    
                    <Checkbox checked={isDueDate} onChange={handleIsDueDate}/>
                </div>
            </div>

            <div className="row">
                <div className="field split-field">
                    <Checkbox type="checkbox" checked={newAutoMove} label="Auto move" onChange={handleChangeAutoMove} />
                </div>
            </div>

            <div className="button-group">
                <Button variation="secondary" onClick={handleCloseForm}>Cancel</Button>
                <Button type="submit">Update</Button>
            </div>

            <Dialog.Close ref={closeDialogRef} hidden></Dialog.Close>
        </Form.Root>
    );
};

export default EditForm;
