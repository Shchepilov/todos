import Select from "@components/Select/Select";
import Row from "@components/Row/Row";
import { updateTask } from '@features/boards/services/tasksQuery';
import { TASK_STATUS } from "@features/boards/utils/constants";

const TaskEditForm = ({ task, columns, register, className, activeBoard }) => {
    const handleChangeColumn = (e) => updateTask(task.id, { columnId: e.target.value });
    const handleChangePriority = (e) => updateTask(task.id, { priority: e.target.value });
    const handleChangeSprint = (e) => updateTask(task.id, { sprint: e.target.value });

    return (
        <>
            <Row gap='small'>
                <Select 
                    register={register}
                    className={className} 
                    name="taskPriority"
                    items={TASK_STATUS}
                    onChange={handleChangePriority}
                    value={task.priority} 
                />
                <Select 
                    register={register}
                    className={className}
                    name="columnId"
                    items={columns}
                    valueKey="id"
                    onChange={handleChangeColumn}
                    value={task.columnId} 
                />
            </Row>
            <Row gap='small'>
                {activeBoard?.sprints && activeBoard.sprints.length > 0 && (
                    <Select
                        register={register}
                        className={className}
                        name="taskSprint"
                        items={activeBoard.sprints}
                        nameKey="name"
                        valueKey="id"
                        onChange={handleChangeSprint}
                        value={task.sprint || ''} 
                    >
                        <option value="">No Sprint</option>
                    </Select>
                )}
            </Row>
        </>
    );
};

export default TaskEditForm;
