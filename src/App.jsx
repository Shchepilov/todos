import { useStore } from "./store/store";

import Auth from "./components/Auth/Auth";
import TodoList from "./components/TodoList/TodoList";
import DayNavigation from "./components/DayNavigation/DayNavigation";
import TodoCalendar from "./components/TodoCalendar/TodoCalendar";
import TodoForm from "./components/TodoForm/TodoForm";
import styles from "./App.module.css";

const App = () => {
    const user = useStore((state) => state.user);
    //const errorMessage = useStore((state) => state.errorMessage);

    if (!user) {
        return <Auth />;
    }

    return (
        <div className={styles.App}>
            <Auth />
            {/* {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>} */}
            <div className={styles.Layout}>
                <div className={styles.leftCol}>
                    <TodoCalendar />
                </div>

                <div className={styles.rightCol}>
                    <DayNavigation />
                    <TodoForm />
                    <TodoList />
                </div>
            </div>
        </div>
    );
};

export default App;
