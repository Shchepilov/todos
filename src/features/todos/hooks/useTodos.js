import { useEffect } from "react";
import { useStore } from "@store/store";
import { useCollection } from 'react-firebase-hooks/firestore';
import { fetchAllTodos, updateAutoMoveTodos } from "@features/todos/services/todosQuery";
import dayjs from "dayjs";

const useTodos = () => {
    const userId = useStore((state) => state.user.uid);
    const currentDay = useStore((state) => state.currentDay);
    const setTodos = useStore((state) => state.setTodos);
    const setAllTodos = useStore((state) => state.setAllTodos);
    const date = dayjs(currentDay).format("YYYY-MM-DD");

    const allTodosQuery = fetchAllTodos(userId);
    const [allTodosSnapshot, loading, error] = useCollection(allTodosQuery);

    updateAutoMoveTodos(userId);

    useEffect(() => {
        if (allTodosSnapshot) {
            const allTodos = allTodosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            const dayTodos = allTodos.filter(todo => todo.date === date);
            const dayTodosSorted = dayTodos.sort((a, b) => {
                if (a.priority === b.priority) {
                    return a.timestamp - b.timestamp;
                }
                return b.priority - a.priority;
            });

            setTodos(dayTodosSorted);
            setAllTodos(allTodos);
        }
    }, [allTodosSnapshot, currentDay]);

    return { loading, error };
}
 
export default useTodos;
