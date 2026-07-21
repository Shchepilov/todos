export const BOARDS_COLLECTION = 'boards';
export const COLUMNS_COLLECTION = 'columns';
export const TASKS_COLLECTION = 'tasks';

export const TASK_STATUS = [
    { name: 'Backlog', value: 1 },
    { name: 'Trivial', value: 2 },
    { name: 'Minor', value: 3 },
    { name: 'Major', value: 4 },
    { name: 'Critical', value: 5 },
    { name: 'Blocker', value: 6 }
]

export const TASK_TYPES = [
    { name: 'Feature', value: 'feature' },
    { name: 'Bug', value: 'bug' },
    { name: 'Change Request', value: 'cr' },
    { name: 'Improvement', value: 'improve' }
];

export const RETROSPECTIVE_TYPES = ['good', 'bad', 'suggestions'];

export const PLANNING_DECK = ['1h', '2h', '4h', '1d', '2d', '3d', '5d', '?'];

export const ESTIMATION_PATTERN = /^(\d+d\s?)?(\d+h\s?)?(\d+m)?$/;
export const ESTIMATION_MAX_LENGTH = 15;

export const COLUMN_VIEW_MODE = {
    NORMAL: 'normal',
    COMPACT: 'compact',
};
