import { useState } from 'react';
import Dropdown from '../Dropdown/Dropdown';
import { useStore } from '../../store/store';
import styles from './Auth.module.scss';

const Auth = () => {
    const user = useStore((state) => state.user);
    const signIn = useStore((state) => state.signIn);
    const signOut = useStore((state) => state.signOut);
    const removeUserData = useStore((state) => state.removeUserData);

    const [showSettings, setShowSettings] = useState(false);

    return (
        <>
            {user ? (
                <header className={styles.header}>
                    <h1 className={styles.headerTitle}>ACT <span>Achieve. Complete. Thrive</span></h1>
                    <p>{user.displayName}</p>
                    <button className={`${styles.account} ${showSettings ? styles.accountActive: null}`}  onClick={() => setShowSettings(!showSettings)}>
                        <img src={user.photoURL} alt={user.displayName}/>
                    </button>

                    {showSettings && (
                        <Dropdown>
                            <ul >
                                <li>{user.email}</li>
                                
                                <li>
                                    <button onClick={removeUserData}>Clear All Todos</button>
                                </li>
                                <li>
                                    <button onClick={signOut}>Sign Out</button>
                                </li>
                            </ul>
                        </Dropdown>
                    )}
                </header>
            ) : (
                <div className={styles.guest}>
                    <h1 className={styles.guestTitle}>ACT <span>Achieve. Complete. Thrive</span></h1>
                    <button onClick={signIn}>Sign In with Google</button>
                </div>
            )}
        </>    
    );
};

export default Auth;
