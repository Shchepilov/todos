import { useStore } from "@store/store";
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import * as Form from '@radix-ui/react-form';
import { TrashIcon } from "@radix-ui/react-icons";
import Modal from "@components/Modal/Modal";
import styles from './Task.module.scss';
import Input from "@components/Input/Input";
import Select from "@components/Select/Select";
import Field from "@components/Field/Field";
import Button from '@components/Button/Button';
import { updateTask, deleteTask } from '@features/boards/services/tasksQuery';
import { TASK_STATUS, TASK_TYPES } from '@features/boards/utils/constants';

const TaskDetail = () => {
    const { boardId, taskId } = useParams();
    const navigate = useNavigate();
    const columns = useStore((state) => state.columns);
    const tasks = useStore((state) => state.tasks);
    const task = tasks.find(task => task.id === taskId);
    const boards = useStore((state) => state.boards);
    const activeBoard = boards?.find(board => board.id === boardId);
    const isWatcher = activeBoard?.isWatcher || false;
    
    const closeModal = () => {
        navigate(`/boards/${boardId}`);
    };
    
    const handleUpdateTask = (data) => {
        const { taskType, taskTitle, taskPriority, taskAssignee, taskDescription, columnId } = data;

        updateTask(taskId, {
            assignee: taskAssignee,
            type: taskType,
            title: taskTitle,
            priority: taskPriority,
            description: taskDescription,
            columnId: columnId
        });

        closeModal();
    };

    const handleDeleteTask = () => {
        deleteTask(taskId);
        closeModal();
    }

    const { register, handleSubmit, formState: { errors }, } = useForm();

    return (
        <Modal heading="Task Details" align="right" isDialogOpen={true} setIsDialogOpen={closeModal}>
            <Form.Root onSubmit={handleSubmit(handleUpdateTask)} className="form">
                <Field name="taskType" label="Type" errors={errors}>
                    <Select register={register} name="taskType" items={TASK_TYPES} defaultValue={task.type} />
                </Field>

                <Field name="taskTitle" label="Title" errors={errors}>
                    <Input
                        register={register}
                        defaultValue={task.title}
                        name="taskTitle"
                        label="Title"
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
                    <Select register={register} name="taskPriority" items={TASK_STATUS} defaultValue={task.priority} />
                </Field>

                <Field name="columnId" label="Column" errors={errors}>
                    <Select register={register} name="columnId" items={columns} valueKey="id" defaultValue={task.columnId} />
                </Field>

                {activeBoard.watchersData && activeBoard.watchersData.length > 0 && (
                    <Field name="taskAssignee" label="Assignee" errors={errors}>
                        <Select register={register} 
                                name="taskAssignee" 
                                items={activeBoard.watchersData} 
                                nameKey="watcherName" 
                                valueKey="watcherName"
                                defaultValue={task.assignee}>
                            <option value="unassigned">Unassigned</option>
                        </Select>
                    </Field>
                )}

                <Field name="taskDescription" label="Description" errors={errors}>
                    <textarea 
                        defaultValue={task.description}
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
                    {!isWatcher && (
                        <Button variation="confirmation" onClick={handleDeleteTask}>
                            <TrashIcon  width={18} height={18} /> Delete Task
                        </Button>
                    )}
                    <Button type="submit">Save</Button>
                </div>
            </Form.Root>
        </Modal>
    );
};

export default TaskDetail;
