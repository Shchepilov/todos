import { Link2Icon, CommitIcon } from "@radix-ui/react-icons";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { FormattedMessage } from 'react-intl';
import Button from '@components/Button/Button';
import dropdown from '@components/Dropdown/Dropdown.module.scss';

const TaskCopyMenu = ({ task, activeBoard }) => { 
    const handleCopyLink = () => {
        const link = `${window.location.origin}/boards/${task.boardId}/tasks/${task.id}`;
        navigator.clipboard.writeText(link);
    };

    const handleCopyCommitMessage = () => {
        const commitMessage = `${activeBoard.prefix}-${task.number}:${task.type.toUpperCase()}:${task.title}`;
        navigator.clipboard.writeText(commitMessage);
    };

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <Button type="icon" variation="transparent">
                    <Link2Icon width={14} height={14} />
                </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content className={dropdown.content} align="start" sideOffset={5}>
                    <DropdownMenu.Item className={dropdown.item} onSelect={handleCopyLink}>
                        <Link2Icon />
                        <FormattedMessage id="boards.copyLink" />
                    </DropdownMenu.Item>

                    <DropdownMenu.Item className={dropdown.item} onSelect={handleCopyCommitMessage}>
                        <CommitIcon />
                        <FormattedMessage id="boards.copyCommitMessage" />
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};

export default TaskCopyMenu;
