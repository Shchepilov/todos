import { useState, useEffect, useRef } from "react";
import { Routes, Route, NavLink, Navigate, useLocation } from "react-router-dom";
import Auth from "@components/Auth/Auth";
import Todos from "@features/todos/components/Todos/Todos";
import Notes from "@features/notes/components/Notes/Notes";
import Tasks from "@features/tasks/components/Tasks/Tasks";
import { useStore } from "@store/store";
import styles from "./App.module.scss";

const App = () => {
    const [sliderStyle, setSliderStyle] = useState({});
    const navRef = useRef(null);
    const location = useLocation();
    

    const user = useStore((state) => state.user);
    const errorMessage = useStore((state) => state.errorMessage);

    useEffect(() => {
        const activeLink = navRef.current.querySelector(`.${styles.active}`);
        if (activeLink) {
          const { offsetLeft, offsetWidth } = activeLink;
          setSliderStyle({ left: offsetLeft, width: offsetWidth });
        }
    }, [location]);

    if (!user) {
        return <Auth />;
    }

    return (
        <div className={styles.app}>
            <Auth />
            
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
            <nav ref={navRef} className={styles.nav}>
                <div className={styles.slider} style={{ ...sliderStyle }}/>
                <NavLink to="/todos" className={({isActive}) => (isActive ? styles.active : null)}>Todos</NavLink>
                <NavLink to="/notes" className={({isActive}) => (isActive ? styles.active : null)}>Notes</NavLink>
                <NavLink to="/tasks" className={({isActive}) => (isActive ? styles.active : null)}>Tasks</NavLink>
            </nav>

            <Routes>
                <Route path="/" element={<Navigate to="/todos" />} />
                <Route path="/todos" element={<Todos />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/tasks" element={<Tasks />} />
            </Routes>
        </div>
    );
};

export default App;
