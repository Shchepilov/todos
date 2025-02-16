import TodoList from "../../components/TodoList/TodoList";
import DayNavigation from "../../components/DayNavigation/DayNavigation";
import TodoCalendar from "../../components/TodoCalendar/TodoCalendar";
import TodoForm from "../../components/TodoForm/TodoForm";
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