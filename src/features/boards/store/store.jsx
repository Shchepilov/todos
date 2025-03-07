import { useBoardStore } from "./storeBoard";
import { useColumnStore } from "./storeColumn";
import { useTaskStore } from "./storeTask";

export const useBoardsStore = (set, get) => ({
    ...useBoardStore(set, get),
    ...useColumnStore(set, get),
    ...useTaskStore(set, get)
});
