import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import Auth from "./components/Auth/Auth";
import Todos from "./pages/Todos/Todos";
import Notes from "./pages/Notes/Notes";
import { useStore } from "./store/store";
import styles from "./App.module.scss";

const App = () => {
    const user = useStore((state) => state.user);
    const errorMessage = useStore((state) => state.errorMessage);

    if (!user) {
        return <Auth />;
    }

    return (
        <div className={styles.app}>
            <Auth />
            
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

            <BrowserRouter>
                <nav className={styles.nav}>
                    <NavLink to="/todos" className={({isActive}) => (isActive ? styles.navLinkActive : null)}>Todos</NavLink>
                    <NavLink to="/notes" className={({isActive}) => (isActive ? styles.navLinkActive : null)}>Notes</NavLink>
                </nav>

                <Routes>
                    <Route path="/" element={<Navigate to="/todos" replace />} />
                    <Route path="/todos" element={<Todos />} />
                    <Route path="/notes" element={<Notes />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
