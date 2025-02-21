import { useStore } from '@store/store';
import styles from './Auth.module.scss';

const Auth = () => {
    const googleSignIn = useStore((state) => state.googleSignIn);
    const githubSignIn = useStore((state) => state.githubSignIn);

    return (
        <>
            <div className={styles.guest}>
                <h1 className={styles.guestTitle}>ACT <span>Achieve. Complete. Thrive</span></h1>
                <button onClick={googleSignIn}>Sign In with Google</button>
                <button onClick={githubSignIn}>Sign In with Github</button>
            </div>
        </>    
    );
};

export default Auth;
