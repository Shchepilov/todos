import { useStore } from "@store/store";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import dropdown from '@components/Dropdown/Dropdown.module.scss';
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import Button from "@components/Button/Button";
import styles from './Task.module.scss';

const Task = ({ task }) => {
    const deleteTask = useStore((state) => state.deleteTask);

    const handleDeleteTask = () => {
        deleteTask(task.id, task.boardId);
    };

    return (
        <div className={styles.item}>
            <a href="">{task.title}</a>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <Button variation="transparent" size="small">
                        <DotsVerticalIcon width={16} height={16} />
                    </Button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content className={dropdown.content} align="start" sideOffset={5}>
                        <DropdownMenu.Item className={dropdown.item} onSelect={() => console.log('Edit')}>Edit</DropdownMenu.Item>
                        <DropdownMenu.Item className={`${dropdown.item} ${dropdown.itemDanger}`} onSelect={handleDeleteTask}>Delete</DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </div>
    );
};

export default Task;
