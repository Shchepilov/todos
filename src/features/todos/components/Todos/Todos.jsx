import TodoList from "../TodoList/TodoList";
import DayNavigation from "../DayNavigation/DayNavigation";
import TodoCalendar from "../TodoCalendar/TodoCalendar";
import TodoForm from "../TodoForm/TodoForm";
import styles from "./Todos.module.scss";

const Todos = () => {
    return ( 
        <div className={styles.layout}>
            <aside>
                <TodoCalendar />
            </aside>

            <main>
                <DayNavigation />
                <TodoForm />
                <TodoList />
            </main>
        </div>
     );
}
 
export default Todos;