import { PersonIcon } from "@radix-ui/react-icons";
import { FormattedMessage } from 'react-intl';
import Select from "@components/Select/Select";
import { updateTask } from '@features/boards/services/tasksQuery';

const TaskAssignment = ({ task, activeBoard, register, className }) => {
    const handleChangeAssignee = (e) => updateTask(task.id, { assignee: e.target.value });

    if (!activeBoard.watchersData || activeBoard.watchersData.length === 0) {
        return null;
    }

    return (
        <>
            <PersonIcon width={18} height={18} />
            
            <Select 
                register={register}
                id="taskAssignee"
                className={className}
                name="taskAssignee" 
                items={activeBoard.watchersData} 
                nameKey="watcherName" 
                valueKey="watcherName" 
                onChange={handleChangeAssignee}
                value={task.assignee}>
                <option value="unassigned">
                    <FormattedMessage id="boards.unassigned" />
                </option>
                <option value={activeBoard.owner.name}>{activeBoard.owner.name}</option>
            </Select>
        </>
    );
};

export default TaskAssignment;