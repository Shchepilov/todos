import { useRef } from "react";
import { useForm } from "react-hook-form"
import { useStore } from "@store/store";
import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import { PlusIcon } from "@radix-ui/react-icons";
import { useIntl, FormattedMessage } from 'react-intl';
import Button from "@components/Button/Button";
import Input from "@components/Input/Input";
import Select from "@components/Select/Select";
import Field from "@components/Field/Field";
import Row from "@components/Row/Row";
import { addTask } from "@features/boards/services/tasksQuery";
import { TASK_STATUS, TASK_TYPES } from "@features/boards/utils/constants";

const TaskForm = ({ columnId, boardId }) => {
    const intl = useIntl();
    const columns = useStore((state) => state.columns);
    const boards = useStore((state) => state.boards);
    const activeBoard = boards?.find(board => board.id === boardId);
    const ownerName = activeBoard.owner.name;
    const closeDialogRef = useRef(null);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const closeDialog = () => closeDialogRef.current?.click();

    const handleAddTask = (data) => {
        const { taskTitle, taskType, taskPriority, columnId, taskAssignee, taskDescription, taskEstimation, taskSprint } = data;
        
        addTask(
            boardId, 
            columnId, 
            { 
                type: taskType,
                title: taskTitle, 
                priority: taskPriority,
                description: taskDescription || '',
                assignee: taskAssignee || 'unassigned',
                estimation: taskEstimation || null,
                loggedTime: null,
                workLogsList: [],
                sprint: taskSprint || null
            }
        );
        
        closeDialogRef.current?.click();
    }

    return (
        <Form.Root onSubmit={handleSubmit(handleAddTask)} className="form">
            <Field name="taskEstimation" label={intl.formatMessage({ id: 'boards.taskEstimation' })} errors={errors}>
                <Input
                    register={register}
                    name="taskEstimation"
                    placeholder="0d 0h 0m"
                    errors={errors}
                    pattern={{
                        value: /^(\d+d\s?)?(\d+h\s?)?(\d+m)?$/,
                        message: intl.formatMessage({ id: 'boards.validation.estimationFormat' })
                    }}
                    maxLength={{
                        value: 15,
                        message: intl.formatMessage({ id: 'boards.validation.estimationMaxLength' }, { length: 15 })
                    }}
                />
            </Field>

            <Field name="taskType" label={intl.formatMessage({ id: 'boards.taskType' })} errors={errors}>
                <Select register={register} name="taskType" items={TASK_TYPES} defaultValue={TASK_TYPES[0].value} />
            </Field>

            <Field name="taskTitle" label={intl.formatMessage({ id: 'boards.taskTitle' })} required errors={errors}>
                <Input
                    register={register}
                    name="taskTitle"
                    placeholder={intl.formatMessage({ id: 'boards.taskTitle' })}
                    autoFocus
                    errors={errors}
                    required={intl.formatMessage({ id: 'common.validation.titleRequired' })}
                    maxLength={{
                        value: 100,
                        message: intl.formatMessage({ id: 'boards.validation.titleMaxLength' }, { length: 100 })
                    }}
                />
            </Field>

            <Field name="taskPriority" label={intl.formatMessage({ id: 'common.priority' })} errors={errors}>
                <Select register={register} name="taskPriority" items={TASK_STATUS} defaultValue={TASK_STATUS[2].value} />
            </Field>

            <Field name="columnId" label={intl.formatMessage({ id: 'boards.taskColumn' })} errors={errors}>
                <Select register={register} name="columnId" items={columns} valueKey="id" defaultValue={columnId} />
            </Field>

            {activeBoard.sprints && activeBoard.sprints.length > 0 && (
                <Field name="taskSprint" label={intl.formatMessage({ id: 'boards.taskSprint' })} errors={errors}>
                    <Select register={register} name="taskSprint" items={activeBoard.sprints} nameKey="name" valueKey="id">
                        <option value="">{intl.formatMessage({ id: 'boards.noSprint' })}</option>
                    </Select>
                </Field>
            )}

            {activeBoard.watchersData && activeBoard.watchersData.length > 0 && (
                <Field name="taskAssignee" label={intl.formatMessage({ id: 'boards.taskAssignee' })} errors={errors}>
                    <Select register={register} name="taskAssignee" items={activeBoard.watchersData} nameKey="watcherName" valueKey="watcherName" defaultValue="unassigned">
                        <option value="unassigned"><FormattedMessage id="boards.unassigned" /></option>
                        <option value={ownerName}>{ownerName}</option>
                    </Select>
                </Field>
            )}

            <Field name="taskDescription" label={intl.formatMessage({ id: 'boards.taskDescription' })} errors={errors}>
                <textarea 
                    rows={5} 
                    {...register("taskDescription", { 
                        maxLength: {
                            value: 200,
                            message: intl.formatMessage({ id: 'boards.validation.descriptionMaxLength' }, { length: 200 })
                        }})
                    }
                    placeholder={intl.formatMessage({ id: 'boards.taskDescription' })} />
            </Field>

            <Row equal>
                <Button type="button" variation="secondary" onClick={closeDialog}>
                    <FormattedMessage id="common.cancel" />
                </Button>
                <Button type="submit">
                    <PlusIcon />
                    <FormattedMessage id="boards.addTask" />
                </Button>
            </Row>

            <Dialog.Close ref={closeDialogRef} hidden></Dialog.Close>
        </Form.Root>
    );
};

export default TaskForm;
