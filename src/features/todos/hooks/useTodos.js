import { useEffect } from "react";
import { useStore } from "@store/store";
import { useAuthUser } from "@baseUrl/auth/useAuthUser";
import { useCollection } from 'react-firebase-hooks/firestore';
import { fetchAllTodos, updateAutoMoveTodos } from "@features/todos/services/todosQuery";
import dayjs from "dayjs";

// Call once per page: every call opens its own subscription.
// today comes from useToday, so the move runs again when a new day starts.
const useTodos = (today) => {
    const userId = useAuthUser().uid;
    const currentDay = useStore((state) => state.currentDay);
    const setTodos = useStore((state) => state.setTodos);
    const setAllTodos = useStore((state) => state.setAllTodos);
    const date = dayjs(currentDay).format("YYYY-MM-DD");

    const allTodosQuery = fetchAllTodos(userId);
    const [allTodosSnapshot, loading, error] = useCollection(allTodosQuery);

    // Unfinished auto-move todos from past days go to today: when the page opens and again when a new day starts.
    // If it fails, for example offline, it runs again the next time.
    useEffect(() => {
        updateAutoMoveTodos(userId, today).catch(console.error);
    }, [userId, today]);

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
    }, [allTodosSnapshot, date, setTodos, setAllTodos]);

    return { loading, error };
}
 
export default useTodos;
