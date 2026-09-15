import TodoList from "../TodoList/TodoList";
import DayNavigation from "../DayNavigation/DayNavigation";
import TodoCalendar from "../TodoCalendar/TodoCalendar";
import useTodos from "@features/todos/hooks/useTodos";
import useToday from "@features/todos/hooks/useToday";
import styles from "./Todos.module.scss";

const Todos = () => {
    // One clock for the whole page, so the move, the calendar and the "Today" label switch days together.
    const today = useToday();
    const { loading } = useTodos(today);

    return (
        <div className={styles.layout}>
            <aside className={styles.aside}>
                <TodoCalendar today={today} />
            </aside>

            <main className={styles.main}>
                <DayNavigation today={today} />
                <TodoList loading={loading} />
            </main>
        </div>
     );
}

export default Todos;
