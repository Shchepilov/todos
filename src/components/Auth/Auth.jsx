import { useState } from 'react';
import Dropdown from '../Dropdown/Dropdown';
import { useStore } from '../../store/store';
import styles from './Auth.module.scss';

const Auth = () => {
    const user = useStore((state) => state.user);
    const googleSignIn = useStore((state) => state.googleSignIn);
    const githubSignIn = useStore((state) => state.githubSignIn);
    const signOut = useStore((state) => state.signOut);
    const removeUserData = useStore((state) => state.removeUserData);

    const [showSettings, setShowSettings] = useState(false);

    return (
        <>
            {user ? (
                <header className={styles.header}>
                    <h1 className={styles.headerTitle}>ACT <span>Achieve. Complete. Thrive</span></h1>
                    <p className={styles.headerName}>{user.displayName}</p>
                    <button className={`${styles.headerAvatar} ${showSettings ? styles.accountActive: null}`}  onClick={() => setShowSettings(!showSettings)}>
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
                    <button onClick={googleSignIn}>Sign In with Google</button>
                    <button onClick={githubSignIn}>Sign In with Github</button>
                </div>
            )}
        </>    
    );
};

export default Auth;
