import { useRef } from 'react';
import { useStore } from "@store/store";

export const useDragAndDrop = (task, styles) => {
    const taskRef = useRef(null);
    const droppedColumnId = useStore((state) => state.droppedColumnId);
    const setDroppedColumnId = useStore((state) => state.setDroppedColumnId);

    const handleDragStart = (e) => {
        setDroppedColumnId(task.columnId);
        e.dataTransfer.setData("taskId", task.id);
        e.dataTransfer.setData("columnId", task.columnId);
        
        taskRef.current.classList.add(styles.dragging);
        const taskWidth = taskRef.current.offsetWidth;
    
        e.dataTransfer.setDragImage(taskRef.current, taskWidth - 15, 20);
    };

    const handleDragEnd = () => {
        if (task.columnId === droppedColumnId) {
            taskRef.current.classList.remove(styles.dragging);
        }
    };

    return {
        taskRef,
        handleDragStart,
        handleDragEnd,
        droppedColumnId
    };
};