import TodoList from "../TodoList/TodoList";
import DayNavigation from "../DayNavigation/DayNavigation";
import TodoCalendar from "../TodoCalendar/TodoCalendar";
import styles from "./Todos.module.scss";

const Todos = () => {
    return ( 
        <div className={styles.layout}>
            <aside className={styles.aside}>
                <TodoCalendar />
            </aside>

            <main className={styles.main}>
                <DayNavigation />
                <TodoList />
            </main>
        </div>
     );
}
 
export default Todos;