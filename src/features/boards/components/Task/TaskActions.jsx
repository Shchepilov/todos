import { TrashIcon } from "@radix-ui/react-icons";
import { useIntl } from 'react-intl';
import Button from "@components/Button/Button";
import { deleteTask } from '@features/boards/services/tasksQuery';

const TaskActions = ({ task, isWatcher, className }) => {
    const intl = useIntl();
    
    const handleDeleteTask = () => deleteTask(task.id);

    if (isWatcher) return null;

    return (
        <Button 
            variation="transparent" 
            className={className} 
            size="small" 
            aria-label={intl.formatMessage({ id: 'boards.deleteTaskAriaLabel' })}>
            <TrashIcon onClick={handleDeleteTask} />
        </Button>
    );
};

export default TaskActions;