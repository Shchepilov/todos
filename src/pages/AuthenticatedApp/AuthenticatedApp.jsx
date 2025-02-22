
import { useState, useEffect, useRef } from "react";
import { Routes, Route, NavLink, Navigate, useLocation } from "react-router-dom";
import Todos from "@features/todos/components/Todos/Todos";
import Notes from "@features/notes/components/Notes/Notes";
import Tasks from "@features/tasks/components/Tasks/Tasks";
import { useStore } from "@store/store";
import "@styles/global.scss";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import dropdown from '@components/Dropdown/Dropdown.module.scss';
import styles from './AuthenticatedApp.module.scss';
import logo from '@assets/logo.png';

const AuthenticatedApp = () => {
    const [sliderStyle, setSliderStyle] = useState({});
    const navRef = useRef(null);
    const location = useLocation();
    const user = useStore((state) => state.user);
    const signOut = useStore((state) => state.signOut);
    const removeUserData = useStore((state) => state.removeUserData);
    const errorMessage = useStore((state) => state.errorMessage);
    
    useEffect(() => {
        const activeLink = navRef.current.querySelector(`.${styles.active}`);
        if (activeLink) {
            document.fonts.ready.then(() => {
                const { offsetLeft, offsetWidth } = activeLink;
                setSliderStyle({ left: offsetLeft, width: offsetWidth });
            });  
        }
    }, [location]);

    return (
        <>
            <header className={styles.header}>
                <h1 className={styles.title}>
                    <img src={logo} className={styles.logo} alt="ACT" />
                </h1>

                <nav ref={navRef} className={styles.nav}>
                    <span className={styles.slider} style={{ ...sliderStyle }}/>
                    <NavLink to="/todos" className={({isActive}) => (isActive ? styles.active : null)}>Todos</NavLink>
                    <NavLink to="/notes" className={({isActive}) => (isActive ? styles.active : null)}>Notes</NavLink>
                    <NavLink to="/tasks" className={({isActive}) => (isActive ? styles.active : null)}>Tasks</NavLink>
                </nav>

                <div className={styles.user}>
                    

                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button className={styles.userTrigger}>
                                <span className={styles.userName}>{user.displayName}</span>
                                <img src={user.photoURL} className={styles.userImage} alt={user.displayName}/>
                            </button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Portal>
                            <DropdownMenu.Content className={dropdown.content} sideOffset={5} align="end">
                                <DropdownMenu.Item className={dropdown.item} disabled>
                                    {user.email}
                                </DropdownMenu.Item>

                                <DropdownMenu.Separator className={dropdown.separator} />

                                <DropdownMenu.Item className={dropdown.item + " " + dropdown.itemDanger} onSelect={() => removeUserData("todos")}>
                                    Clear All Todos
                                </DropdownMenu.Item>

                                <DropdownMenu.Item className={dropdown.item + " " + dropdown.itemDanger} onSelect={() => removeUserData("notes")}>
                                    Clear All Notes
                                </DropdownMenu.Item>

                                <DropdownMenu.Item className={dropdown.item} onSelect={signOut}>
                                    Sign Out
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>
            </header>
            
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

            <Routes>
                <Route path="/" element={<Navigate to="/todos" />} />
                <Route path="/todos" element={<Todos />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/tasks" element={<Tasks />} />
            </Routes>
        </>
    );
};

export default AuthenticatedApp;
