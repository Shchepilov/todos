import { useState, useRef } from "react";
import { useStore } from "@store/store";
import { useForm } from "react-hook-form"
import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import { PlusIcon } from "@radix-ui/react-icons";
import { useIntl, FormattedMessage } from 'react-intl';
import Checkbox from "@components/Checkbox/Checkbox";
import Input from "@components/Input/Input";
import Select from "@components/Select/Select";
import Field from "@components/Field/Field";
import Button from "@components/Button/Button";
import Row from "@components/Row/Row";
import { addTodo } from "@features/todos/services/todosQuery";
import { PRIORITY_OPTIONS } from "@features/todos/utils/constants";
import dayjs from "dayjs";
import styles from "../TodoItem/TodoItem.module.scss";

const TodoForm = () => {
    const intl = useIntl();
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
            <Field name="todoTitle" label={intl.formatMessage({ id: 'todos.title' })} required errors={errors}>
                <Input
                    register={register}
                    name="todoTitle"
                    label={intl.formatMessage({ id: 'todos.title' })}
                    placeholder={intl.formatMessage({ id: 'todos.title' })}
                    autoFocus
                    errors={errors}
                    required={intl.formatMessage({ id: 'todos.validation.titleRequired' })}
                    maxLength={{
                        value: 40,
                        message: intl.formatMessage({ id: 'todos.validation.titleMaxLength' }, { length: 40 })
                    }}
                />
            </Field>

            <Row equal>
                <Field name="todoPriority" label={intl.formatMessage({ id: 'todos.priority' })} errors={errors}>
                    <Select
                        register={register}
                        name="todoPriority"
                        nameKey="label"
                        items={PRIORITY_OPTIONS}
                        defaultValue={PRIORITY_OPTIONS[0].value}
                    />
                </Field>

                <Row gap="small" align="bottom">
                    <Field name="todoDueDate" label={intl.formatMessage({ id: 'todos.dueDate' })} errors={errors}>
                        <Input
                            type="date"
                            register={register}
                            name="todoDueDate"
                            defaultValue={currentDate}
                            errors={errors}
                            disabled={!isDueDate}
                        />
                    </Field>
                    
                    <Checkbox checked={isDueDate} onChange={handleToggleDueDate} className={styles.splitCheckbox}/>
                </Row>
            </Row>

            <Checkbox checked={newAutoMove} label={intl.formatMessage({ id: 'todos.autoMove' })} onChange={handleNewAutoMove} />

            <Row equal>
                <Button variation="secondary" onClick={handleCloseForm}>
                    <FormattedMessage id="common.cancel" />
                </Button>
                <Button type="submit">
                    <PlusIcon/>
                    <FormattedMessage id="todos.addTodo" />
                </Button>
            </Row>

            <Dialog.Close ref={closeDialogRef} hidden></Dialog.Close>
        </Form.Root>
    );
};

export default TodoForm;
