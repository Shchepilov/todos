import { useStore } from '../../store/store';
import styles from './Auth.module.scss';

const Auth = () => {
    const user = useStore((state) => state.user);
    const signIn = useStore((state) => state.signIn);
    const signOut = useStore((state) => state.signOut);

    return (
        <>
            {user ? (
                <header className={styles.header}>
                    <p>{user.displayName}</p>
                    <img src={user.photoURL} alt={user.displayName}/>
                    <button onClick={signOut}>Sign Out</button>
                </header>
            ) : (
                <div className={styles.guest}>
                    <button onClick={signIn}>Sign In with Google</button>
                </div>
            )}
        </>    
    );
};

export default Auth;
