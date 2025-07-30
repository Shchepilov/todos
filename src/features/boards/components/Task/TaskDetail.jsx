import { useStore } from "@store/store";
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import * as Form from '@radix-ui/react-form';
import { ReaderIcon, TrashIcon } from "@radix-ui/react-icons";
import Modal from "@components/Modal/Modal";
import Input from "@components/Input/Input";
import Select from "@components/Select/Select";
import Field from "@components/Field/Field";
import Row from "@components/Row/Row";
import Button from '@components/Button/Button';
import LogsForm from './logsForm';
import ProgressBar from "@features/boards/components/ProgressBar/ProgressBar";
import styles from './Task.module.scss';
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

    const userEmail = useStore((state) => state.user.providerData[0].email);
    const ownerName = activeBoard.owner.name;
    const userName = activeBoard.watchersData.find(watcher => watcher.watcherEmail === userEmail)?.watcherName || ownerName;

    const { register, handleSubmit, formState: { errors } } = useForm();
    
    const closeModal = () => {
        navigate(`/boards/${boardId}`);
    };
    
    const handleUpdateTask = (data) => {
        const { taskType, taskTitle, taskPriority, taskAssignee, taskDescription, columnId, taskEstimation } = data;

        updateTask(task.id, {
            assignee: taskAssignee,
            type: taskType,
            title: taskTitle,
            priority: taskPriority,
            description: taskDescription,
            columnId: columnId,
            estimation: taskEstimation || null
        });

        closeModal();
    };

    const handleDeleteTask = () => {
        deleteTask(task.id);
        closeModal();
    }

    return (
        <Modal heading="Task Details" size="medium" isDialogOpen={true} setIsDialogOpen={closeModal}>
            <Form.Root onSubmit={handleSubmit(handleUpdateTask)} className="form" id="taskDetailForm">
                <Field name="taskType" label="Type" errors={errors}>
                    <Select register={register} name="taskType" items={TASK_TYPES} defaultValue={task.type} />
                </Field>

                <Field name="taskTitle" label="Title" errors={errors}>
                    <Input
                        register={register}
                        defaultValue={task.title}
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

                <Row equal>
                    <Field name="taskPriority" label="Priority" errors={errors}>
                        <Select register={register} name="taskPriority" items={TASK_STATUS} defaultValue={task.priority} />
                    </Field>

                    <Field name="columnId" label="Column" errors={errors}>
                        <Select register={register} name="columnId" items={columns} valueKey="id" defaultValue={task.columnId} />
                    </Field>
                </Row>
                
                {activeBoard.watchersData && activeBoard.watchersData.length > 0 && (
                    <Field name="taskAssignee" label="Assignee" errors={errors}>
                        <Select register={register} 
                                name="taskAssignee" 
                                items={activeBoard.watchersData} 
                                nameKey="watcherName" 
                                valueKey="watcherName"
                                defaultValue={task.assignee}>
                            <option value="unassigned">Unassigned</option>
                            <option value={activeBoard.owner.name}>{activeBoard.owner.name}</option>
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

                <Field name="taskEstimation" label="Estimate (3d 2h 30m)" errors={errors}>
                    <Input
                        register={register}
                        name="taskEstimation"
                        placeholder="0d 0h 0m"
                        defaultValue={task.estimation}
                        errors={errors}
                        pattern={{
                            value: /^(\d+d\s?)?(\d+h\s?)?(\d+m)?$/,
                            message: "Please use format like: 3d 2h 30m (days, hours, minutes)"
                        }}
                        maxLength={{
                            value: 15,
                            message: "Estimation cannot exceed 15 characters"
                        }}
                    />
                </Field>
            </Form.Root>

            <section className={styles.logSection}>
                {(task.estimation && task.loggedTime) ? (
                    <ProgressBar estimation={task.estimation} loggedTime={task.loggedTime} />
                ) : (task.loggedTime && <p className={styles.loggedTime}>logged: {task.loggedTime}</p>)}

                <LogsForm task={task} userName={userName} loggedTime={task.loggedTime} />
            </section>

            <Row justify="between" > 
                {!isWatcher && (
                    <Button type="button" variation="confirmation" onClick={handleDeleteTask}>
                        <TrashIcon  width={18} height={18} /> Delete
                    </Button>
                )}
                <Button type="submit" form="taskDetailForm">
                   <ReaderIcon /> Save
                </Button>
            </Row>
        </Modal>
    );
};

export default TaskDetail;
