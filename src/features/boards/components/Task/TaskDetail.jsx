import { useState } from 'react';
import { useStore } from "@store/store";
import { useParams, useNavigate } from 'react-router-dom';
import { TrashIcon } from "@radix-ui/react-icons";
import Modal from "@components/Modal/Modal";
import styles from './Task.module.scss';
import Button from '@components/Button/Button';
import { updateTask, deleteTask } from '@features/boards/services/tasksQuery';
import { TASK_STATUS } from '@features/boards/utils/constants';

const TaskDetail = () => {
    const { boardId, taskId } = useParams();
    const navigate = useNavigate();
    const columns = useStore((state) => state.columns);
    const tasks = useStore((state) => state.tasks);
    const task = tasks.find(task => task.id === taskId);
    const boards = useStore((state) => state.boards);
    const activeBoard = boards?.find(board => board.id === boardId);
    const isWatcher = activeBoard?.isWatcher || false;
    const [descriptionValue, setDescriptionValue] = useState(task.description);
    const [titleValue, setTitleValue] = useState(task.title);
    
    const closeModal = () => {
        navigate(`/boards/${boardId}`);
    };

    const handleChangeTitle = (e) => setTitleValue(e.target.value);
    const handleUpdateTitle = (e) => updateTask(taskId, { title: e.target.value });
    const handleChangeColumn = (e) => updateTask(taskId, { columnId: e.target.value });
    const handleChangeDescription = (e) => setDescriptionValue(e.target.value);
    const handleUpdateDescription = (e) => updateTask(taskId, { description: e.target.value });
    const handleUpdatePriority = (e) => updateTask(taskId, { priority: e.target.value });
    const handleChangeAssignee = (e) => updateTask(taskId, { assignee: e.target.value });
    
    const handleDeleteTask = () => {
        deleteTask(taskId);
        closeModal();
    }

    return (
        <Modal heading="Task Details" align="right" isDialogOpen={true} setIsDialogOpen={closeModal}>
            <div className={`${styles.taskDetail} form`}>
                <div className="row">
                    <div className="field">
                        <label className="label">Title</label>
                        <input type="text" value={titleValue} onChange={handleChangeTitle} onBlur={handleUpdateTitle} />
                    </div>
                </div>

                <div className="row">
                    <div className="field">
                        <label className="label">Column</label>
                        <select value={task.columnId} onChange={handleChangeColumn}>
                            {columns.map(column => (
                                <option key={column.id} value={column.id}>{column.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="row">
                    <div className="field">
                        <label className="label">Priority</label>
                        <select value={task.priority} onChange={handleUpdatePriority}>
                            {TASK_STATUS.map((status, index) => (
                                <option key={index} value={status.value}>{status.name}</option>
                            ))}
                        </select>    
                    </div>
                </div>

                <div className="row">
                    <div className="field">
                        <label className="label">Description</label>
                        <textarea rows={5} value={descriptionValue} onChange={handleChangeDescription} placeholder="Description" onBlur={handleUpdateDescription}></textarea>
                    </div>
                </div>

                {activeBoard.watchersData && activeBoard.watchersData.length > 0 && (
                    <div className="row">
                        <div className="field">
                            <label className="label">Assignee</label>
                            
                            <select onChange={handleChangeAssignee} value={task.assignee}>
                                <option value="">Unassigned</option>
                                
                                {activeBoard.watchersData.map(watcher => (
                                    <option key={watcher.watcherEmail} value={watcher.watcherName}>
                                        {watcher.watcherName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
                
                {!isWatcher && (
                    <Button variation="confirmation" className={styles.detailDeleteButton} onClick={handleDeleteTask} aria-label="Delete task">
                        <TrashIcon  width={18} height={18} /> Delete Task
                    </Button>
                )}
            </div>
        </Modal>
    );
};

export default TaskDetail;
