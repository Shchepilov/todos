import { useStore } from "@store/store";
import { useIntl, FormattedMessage } from 'react-intl';
import { TASK_TYPES, TASK_STATUS } from "@features/boards/utils/constants";
import Button from '@components/Button/Button';
import Checkbox from '@components/Checkbox/Checkbox';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import dropdown from '@components/Dropdown/Dropdown.module.scss';
import { MixerHorizontalIcon, Cross2Icon } from '@radix-ui/react-icons';
import styles from './TaskFilter.module.scss';

const TaskFilter = () => {
    const intl = useIntl();
    const activeBoardId = useStore((state) => state.activeBoardId);
    const filters = useStore((state) => state.taskFilters[activeBoardId]) || {
        assignee: [],
        type: [],
        priority: []
    };
    const setTaskFilters = useStore((state) => state.setTaskFilters);
    const boards = useStore((state) => state.boards);
    
    const activeBoard = boards?.find(board => board.id === activeBoardId);
    
    const assignees = [];

    if (activeBoard) {
        assignees.push({
            value: 'unassigned',
            displayName: intl.formatMessage({ id: "boards.unassigned" })
        });
        
        if (activeBoard.owner) {
            assignees.push({
                value: activeBoard.owner.name,
                displayName: activeBoard.owner.name
            });
        }
        
        if (activeBoard.watchersData && activeBoard.watchersData.length > 0) {
            activeBoard.watchersData.forEach(watcher => {
                assignees.push({
                    value: watcher.watcherName,
                    displayName: watcher.watcherName
                });
            });
        }
    }

    const handleFilterToggle = (filterType, value) => {
        const currentValues = filters[filterType] || [];
        const isSelected = currentValues.includes(value);
        
        const newValues = isSelected ? currentValues.filter(v => v !== value) : [...currentValues, value];
            
        setTaskFilters(activeBoardId, {
            ...filters,
            [filterType]: newValues
        });
    };

    const clearFilters = () => {
        setTaskFilters(activeBoardId, {
            assignee: [],
            type: [],
            priority: []
        });
    };

    const hasActiveFilters = (filters.assignee?.length > 0) || (filters.type?.length > 0) || (filters.priority?.length > 0);
    const activeFiltersCount = (filters.assignee?.length || 0) + (filters.type?.length || 0) + (filters.priority?.length || 0);

    if (!activeBoard) {
        return null;
    }

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <Button size="small" className={styles.filterButton}>
                    <MixerHorizontalIcon />
                    <FormattedMessage id="boards.filter.filters" />
                    {activeFiltersCount > 0 && <span>{activeFiltersCount}</span>}
                </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content className={`${dropdown.content} ${styles.dropdownContent}`} align="end" sideOffset={5}>
                    
                    {activeBoard.watchersData && activeBoard.watchersData.length > 0 && (
                        <>
                            <div className={styles.section}>
                                <h5><FormattedMessage id="boards.filter.assignee" /></h5>

                                {assignees.map((assignee) => (
                                    <DropdownMenu.Item key={assignee.value} className={styles.checkboxItem} onSelect={(e) => e.preventDefault()}>
                                        <Checkbox
                                            label={assignee.displayName}
                                            checked={filters.assignee?.includes(assignee.value) || false}
                                            onChange={() => handleFilterToggle('assignee', assignee.value)}
                                        />
                                    </DropdownMenu.Item>
                                ))}
                            </div>

                            <DropdownMenu.Separator className={`${dropdown.separator} ${styles.separator}`} />
                        </>
                    )}

                    <div className={styles.section}>
                        <h5><FormattedMessage id="boards.filter.type" /></h5>

                        {TASK_TYPES.map((type) => (
                            <DropdownMenu.Item key={type.value} className={styles.checkboxItem} onSelect={(e) => e.preventDefault()}>
                                <Checkbox
                                    label={type.name}
                                    checked={filters.type?.includes(type.value) || false}
                                    onChange={() => handleFilterToggle('type', type.value)}
                                />
                            </DropdownMenu.Item>
                        ))}
                    </div>

                    <DropdownMenu.Separator className={`${dropdown.separator} ${styles.separator}`} />

                    <div className={styles.section}>
                        <h5><FormattedMessage id="boards.filter.priority" /></h5>

                        {TASK_STATUS.map((status) => (
                            <DropdownMenu.Item key={status.value} className={styles.checkboxItem} onSelect={(e) => e.preventDefault()}>
                                <Checkbox
                                    label={status.name}
                                    checked={filters.priority?.includes(status.value) || false}
                                    onChange={() => handleFilterToggle('priority', status.value)}
                                />
                            </DropdownMenu.Item>
                        ))}
                    </div>

                    {hasActiveFilters && (
                        <>
                            <DropdownMenu.Separator className={`${dropdown.separator} ${styles.separator}`} />
                            <DropdownMenu.Item className={styles.clearItem} onSelect={clearFilters}>
                                <Cross2Icon width={18} height={18} />
                                <FormattedMessage id="boards.filter.clear" />
                            </DropdownMenu.Item>
                        </>
                    )}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};

export default TaskFilter;
