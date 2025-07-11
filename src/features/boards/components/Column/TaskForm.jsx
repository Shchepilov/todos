import { useRef } from "react";
import { useForm } from "react-hook-form"
import { useStore } from "@store/store";
import * as Dialog from '@radix-ui/react-dialog';
import { PlusIcon } from "@radix-ui/react-icons";
import Button from "@components/Button/Button";
import { addTask } from "@features/boards/services/tasksQuery";
import { TASK_STATUS, TASK_TYPES } from "@features/boards/utils/constants";

const TaskForm = ({ columnId, boardId }) => {
    const columns = useStore((state) => state.columns);
    const boards = useStore((state) => state.boards);
    const activeBoard = boards?.find(board => board.id === boardId);
    const closeDialogRef = useRef(null);
    const { register, handleSubmit, formState: { errors }, } = useForm();

    const closeDialog = () => closeDialogRef.current?.click();

    const handleAddTask = (data) => {
        const { taskTitle, taskType, taskPriority, columnId, taskAssignee } = data;

        addTask(
            boardId, 
            columnId, 
            { 
                type: taskType,
                title: taskTitle, 
                priority: taskPriority,
                assignee: taskAssignee 
            }
        );
        
        closeDialogRef.current?.click();
    }

    return (
        <form onSubmit={handleSubmit(handleAddTask)} className="form">
            <div className="row">
                <div className="field">
                    <label className="label">Type</label>
                    <select defaultValue={TASK_TYPES[0].value} {...register("taskType")}>
                        {TASK_TYPES.map((type, index) => (
                            <option key={index} value={type.value}>{type.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            
            <div className="row">
                <div className="field">
                    <label className="label">Title</label>
                    <input
                        {...register("taskTitle", { 
                            required: "Field is required",
                            maxLength: {
                                value: 100,
                                message: "Title cannot exceed 100 characters"
                            }})
                        } 
                        className={errors.taskTitle && 'invalid'} 
                        autoFocus 
                        placeholder="Task title" />
                    {errors.taskTitle && <span className="error">{errors.taskTitle.message}</span>}
                </div>
            </div>

            <div className="row">
                <div className="field">
                    <label className="label">Priority</label>
                    <select defaultValue={TASK_STATUS[2].value} {...register("taskPriority")}>
                        <option disabled>Select priority</option>
                        {TASK_STATUS.map((status, index) => (
                            <option key={index} value={status.value}>{status.name}</option>
                        ))}
                    </select>    
                </div>
            </div>

            <div className="row">
                <div className="field">
                    <label className="label">Column</label>
                    <select defaultValue={columnId} {...register("columnId")}>
                        {columns.map(column => (
                            <option key={column.id} value={column.id}>{column.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {activeBoard.watchersData && activeBoard.watchersData.length > 0 && (
                <div className="row">
                    <div className="field">
                        <label className="label">Assignee</label>
                        
                        <select defaultValue="unassigned" {...register("taskAssignee")}>
                            <option value="unassigned">Unassigned</option>
                            
                            {activeBoard.watchersData.map(watcher => (
                                <option key={watcher.watcherEmail} value={watcher.watcherName}>
                                    {watcher.watcherName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            <div className="button-group">
                <Button type="button" variation="secondary" onClick={closeDialog}>Cancel</Button>
                <Button type="submit"><PlusIcon/>Add Task</Button>
            </div>

            <Dialog.Close ref={closeDialogRef} hidden></Dialog.Close>
        </form>
    );
};

export default TaskForm;
