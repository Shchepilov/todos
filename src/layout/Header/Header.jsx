
import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useStore } from "@store/store";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Switch } from "radix-ui";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import logo from '@assets/logo.png';
import "@styles/global.scss";
import switcherStyles from'@components/Switcher/Switch.module.scss';
import dropdown from '@components/Dropdown/Dropdown.module.scss';
import styles from './Header.module.scss';


const Header = () => {
    const [sliderStyle, setSliderStyle] = useState({});
    const [pageLink, setPageLink] = useState('');
    const navRef = useRef(null);
    const location = useLocation();
    const user = useStore((state) => state.user);
    const signOut = useStore((state) => state.signOut);
    const removeAllTodos = useStore((state) => state.removeAllTodos);
    const toggleTheme = useStore((state) => state.toggleTheme);
    const isDarkTheme = useStore((state) => state.theme === 'dark');
    
    useEffect(() => {
        const activeLink = navRef.current.querySelector(`.${styles.active}`);
        if (activeLink) {
            document.fonts.ready.then(() => {
                const { offsetLeft, offsetWidth } = activeLink;
                
                setPageLink(activeLink.href.split('/').pop());
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
                    <span className={styles.slider} data-page={pageLink} style={{ ...sliderStyle }}/>
                    <NavLink to="/todos" className={({isActive}) => (isActive ? styles.active : null)}>Todos</NavLink>
                    <NavLink to="/notes" className={({isActive}) => (isActive ? styles.active : null)}>Notes</NavLink>
                    <NavLink to="/boards" className={({isActive}) => (isActive ? styles.active : null)}>Boards</NavLink>
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
                                    {user.providerData[0].email}
                                </DropdownMenu.Item>

                                <DropdownMenu.Separator className={dropdown.separator} />

                                <DropdownMenu.Item className={dropdown.item} onSelect={(e) => e.preventDefault()}>
                                    Light
                                    <Switch.Root className={switcherStyles.wrapper} onCheckedChange={toggleTheme} checked={isDarkTheme}>
                                        <SunIcon className={switcherStyles.icon}/>
                                        <Switch.Thumb className={switcherStyles.switcher} />
                                        <MoonIcon className={switcherStyles.icon}/>
                                    </Switch.Root>
                                    Dark
                                </DropdownMenu.Item>

                                <DropdownMenu.Item className={dropdown.item + " " + dropdown.itemDanger} onSelect={() => removeAllTodos()}>
                                    Clear All Todos
                                </DropdownMenu.Item>

                                <DropdownMenu.Item className={dropdown.item} onSelect={signOut}>
                                    Sign Out
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>
            </header>
        </>
    );
};

export default Header;
