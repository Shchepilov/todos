import { useState, useRef } from "react";
import { Dialog } from "radix-ui";
import { useForm } from "react-hook-form"
import * as Form from '@radix-ui/react-form';
import { useIntl, FormattedMessage } from 'react-intl';
import dayjs from "dayjs";
import { useStore } from "@store/store";
import Checkbox from "@components/Checkbox/Checkbox";
import Input from "@components/Input/Input";
import Select from "@components/Select/Select";
import Row from "@components/Row/Row";
import Field from "@components/Field/Field";
import Button from "@components/Button/Button";
import { updateTodo } from "@features/todos/services/todosQuery";
import { PRIORITY_OPTIONS } from "@features/todos/utils/constants";
import styles from "./TodoItem.module.scss";

const EditForm = ({ todo }) => {
    const intl = useIntl();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { content, priority, id, date, dueDate, autoMove } = todo;

    const currentDay = useStore((state) => state.currentDay);
    const currentDate = dayjs(currentDay).format("YYYY-MM-DD");
    const [isDueDate, setIsDueDate] = useState(!!dueDate);
    const [newAutoMove, setNewAutoMove] = useState(autoMove);
           
    const closeDialogRef = useRef(null);

    const handleIsDueDate = (e) => setIsDueDate(e.target.checked);
    const handleChangeAutoMove = (e) => setNewAutoMove(e.target.checked);
    const handleCloseForm = () => closeDialogRef.current?.click()

    const handleUpdateTodo = async (data) => {
        const { todoTitle, todoPriority, todoDueDate, todoDate } = data;
        const updatedDueDate = isDueDate ? todoDueDate : null;

        updateTodo(id, { 
            content: todoTitle,
            priority: todoPriority,
            date: todoDate,
            dueDate: updatedDueDate,
            autoMove: newAutoMove
        });

        handleCloseForm();
    };

    return (
        <Form.Root onSubmit={handleSubmit(handleUpdateTodo)} className="form">
            <Field name="todoTitle" label={intl.formatMessage({ id: 'todos.title' })} required errors={errors}>
                <Input
                    register={register}
                    name="todoTitle"
                    label={intl.formatMessage({ id: 'todos.title' })}
                    placeholder={intl.formatMessage({ id: 'todos.title' })}
                    autoFocus
                    errors={errors}
                    required={intl.formatMessage({ id: 'todos.validation.titleRequired' })}
                    defaultValue={content}
                    maxLength={{
                        value: 40,
                        message: intl.formatMessage({ id: 'todos.validation.titleMaxLength' }, { length: 40 })
                    }}
                />
            </Field>

            <Field name="todoPriority" label={intl.formatMessage({ id: 'todos.priority' })} errors={errors}>
                <Select
                    register={register}
                    name="todoPriority"
                    nameKey="label"
                    items={PRIORITY_OPTIONS}
                    defaultValue={priority}
                />
            </Field>

            <Row equal>
                <Field name="todoDate" label={intl.formatMessage({ id: 'common.created' })} errors={errors}>
                    <Input
                        type="date"
                        register={register}
                        name="todoDate"
                        defaultValue={date}
                        errors={errors}/>
                </Field>

                <Row gap="small" align="bottom">
                    <Field name="todoDueDate" label={intl.formatMessage({ id: 'todos.dueDate' })} errors={errors}>
                        <Input
                            type="date"
                            register={register}
                            name="todoDueDate"
                            defaultValue={dueDate || currentDate}
                            errors={errors}
                            disabled={!isDueDate}
                        />
                    </Field>
                    
                    <Checkbox checked={isDueDate} className={styles.splitCheckbox} onChange={handleIsDueDate}/>
                </Row>
            </Row>

            <Checkbox type="checkbox" checked={newAutoMove} label={intl.formatMessage({ id: 'todos.autoMove' })} onChange={handleChangeAutoMove} />

            <Row equal>
                <Button variation="secondary" onClick={handleCloseForm}>
                    <FormattedMessage id="common.cancel" />
                </Button>
                <Button type="submit">
                    <FormattedMessage id="common.save" />
                </Button>
            </Row>

            <Dialog.Close ref={closeDialogRef} hidden></Dialog.Close>
        </Form.Root>
    );
};

export default EditForm;
