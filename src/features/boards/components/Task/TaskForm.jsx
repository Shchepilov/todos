import { useRef } from "react";
import { useForm } from "react-hook-form"
import { useStore } from "@store/store";
import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import { PlusIcon } from "@radix-ui/react-icons";
import Button from "@components/Button/Button";
import Input from "@components/Input/Input";
import Select from "@components/Select/Select";
import Field from "@components/Field/Field";
import { addTask } from "@features/boards/services/tasksQuery";
import { TASK_STATUS, TASK_TYPES } from "@features/boards/utils/constants";

const TaskForm = ({ columnId, boardId }) => {
    const columns = useStore((state) => state.columns);
    const boards = useStore((state) => state.boards);
    const activeBoard = boards?.find(board => board.id === boardId);
    const ownerName = activeBoard.owner.name;
    const closeDialogRef = useRef(null);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const closeDialog = () => closeDialogRef.current?.click();

    const handleAddTask = (data) => {
        const { taskTitle, taskType, taskPriority, columnId, taskAssignee, taskDescription, taskEstimation } = data;
        
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
                workLogsList: []
            }
        );
        
        closeDialogRef.current?.click();
    }

    return (
        <Form.Root onSubmit={handleSubmit(handleAddTask)} className="form">
            <Field name="taskEstimation" label="Estimate (3d 2h 30m)" errors={errors}>
                <Input
                    register={register}
                    name="taskEstimation"
                    placeholder="0d 0h 0m"
                    errors={errors}
                    pattern={{
                        value: /^(\d+d\s?)?(\d+h\s?)?(\d+m)?$/,
                        message: "Please use format: 3d 2h 30m"
                    }}
                    maxLength={{
                        value: 15,
                        message: "Estimation cannot exceed 15 characters"
                    }}
                />
            </Field>

            <Field name="taskType" label="Type" errors={errors}>
                <Select register={register} name="taskType" items={TASK_TYPES} defaultValue={TASK_TYPES[0].value} />
            </Field>

            <Field name="taskTitle" label="Title" errors={errors}>
                <Input
                    register={register}
                    name="taskTitle"
                    placeholder="Task title"
                    autoFocus
                    errors={errors}
                    required="Field is required"
                    maxLength={{
                        value: 100,
                        message: "Title cannot exceed 100 characters"
                    }}
                />
            </Field>

            <Field name="taskPriority" label="Priority" errors={errors}>
                <Select register={register} name="taskPriority" items={TASK_STATUS} defaultValue={TASK_STATUS[2].value} />
            </Field>

            <Field name="columnId" label="Column" errors={errors}>
                <Select register={register} name="columnId" items={columns} valueKey="id" defaultValue={columnId} />
            </Field>

            {activeBoard.watchersData && activeBoard.watchersData.length > 0 && (
                <Field name="taskAssignee" label="Assignee" errors={errors}>
                    <Select register={register} name="taskAssignee" items={activeBoard.watchersData} nameKey="watcherName" valueKey="watcherName" defaultValue="unassigned">
                        <option value="unassigned">Unassigned</option>
                        <option value={ownerName}>{ownerName}</option>
                    </Select>
                </Field>
            )}

            <Field name="taskDescription" label="Description" errors={errors}>
                <textarea 
                    rows={5} 
                    {...register("taskDescription", { 
                        maxLength: {
                            value: 200,
                            message: "Title cannot exceed 200 characters"
                        }})
                    }
                    placeholder="Task description" />
            </Field>

            <div className="button-group">
                <Button type="button" variation="secondary" onClick={closeDialog}>Cancel</Button>
                <Button type="submit"><PlusIcon />Add Task</Button>
            </div>

            <Dialog.Close ref={closeDialogRef} hidden></Dialog.Close>
        </Form.Root>
    );
};

export default TaskForm;
