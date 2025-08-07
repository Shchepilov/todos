
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
import ukraineFlag from '@assets/svg/ukraine-flag.svg';

import { FormattedMessage } from 'react-intl';

const Header = () => {
    const [sliderStyle, setSliderStyle] = useState({});
    const [pageLink, setPageLink] = useState('');
    const navRef = useRef(null);
    const location = useLocation();
    const user = useStore((state) => state.user);
    const signOut = useStore((state) => state.signOut);
    const toggleTheme = useStore((state) => state.toggleTheme);
    const isDarkTheme = useStore((state) => state.theme === 'dark');
    const locale = useStore((state) => state.locale);
    const setLocale = useStore((state) => state.setLocale);
    
    useEffect(() => {
        const activeLink = navRef.current.querySelector(`.${styles.active}`);
        if (activeLink) {
            document.fonts.ready.then(() => {
                const { offsetLeft, offsetWidth } = activeLink;
                
                setPageLink(activeLink.href.split('/').pop());
                setSliderStyle({ left: offsetLeft, width: offsetWidth });
            });  
        }
    }, [location, locale]);

    return (
        <>
            <header className={styles.header}>
                <h1 className={styles.title}>
                    <img src={logo} className={styles.logo} alt="ACT" />
                </h1>

                <nav ref={navRef} className={styles.nav}>
                    <span className={styles.slider} data-page={pageLink} style={{ ...sliderStyle }}/>
                    <NavLink to="/todos" className={({isActive}) => (isActive ? styles.active : null)}><FormattedMessage id="nav.todos" /></NavLink>
                    <NavLink to="/notes" className={({isActive}) => (isActive ? styles.active : null)}><FormattedMessage id="nav.notes" /></NavLink>
                    <NavLink to="/boards" className={({isActive}) => (isActive ? styles.active : null)}><FormattedMessage id="nav.boards" /></NavLink>
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
                                    <FormattedMessage id="header.theme.light" />
                                    <Switch.Root className={switcherStyles.wrapper} onCheckedChange={toggleTheme} checked={isDarkTheme}>
                                        <SunIcon className={switcherStyles.icon}/>
                                        <Switch.Thumb className={switcherStyles.switcher} />
                                        <MoonIcon className={switcherStyles.icon}/>
                                    </Switch.Root>
                                    <FormattedMessage id="header.theme.dark" />
                                </DropdownMenu.Item>

                                <DropdownMenu.Item className={dropdown.item} onSelect={setLocale}>
                                    <FormattedMessage id={`header.language.${locale}`} />
                                    { locale === 'en' && <img src={ukraineFlag} className={styles.flag} alt="Ukrainian Flag" /> }
                                </DropdownMenu.Item>

                                <DropdownMenu.Item className={dropdown.item} onSelect={signOut}>
                                    <FormattedMessage id="header.signOut" />
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
