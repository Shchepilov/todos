import common from './common.js';
import header from '@layout/Header/locales.js';
import todos from '@features/todos/locales/locales.js';
import notes from '@features/notes/locales/locales.js';
import boards from '@features/boards/locales/locales.js';

const messages = {
    en: {
        ...common.en,
        ...header.en,
        ...todos.en,
        ...notes.en,
        ...boards.en,
    },
    uk: {
        ...common.uk,
        ...header.uk,
        ...todos.uk,
        ...notes.uk,
        ...boards.uk,
    }
};

export default messages;
