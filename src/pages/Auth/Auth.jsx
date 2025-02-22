import { useStore } from '@store/store';
import styles from './Auth.module.scss';
import logo from '@assets/logo.png';
import googleLogo from '@assets/google.svg';
import githubLogo from '@assets/github.svg';

const Auth = () => {
    const googleSignIn = useStore((state) => state.googleSignIn);
    const githubSignIn = useStore((state) => state.githubSignIn);

    return (
        <>
            <div className={styles.guest}>
                <h1 className={styles.guestTitle}>
                    <img src={logo} className={styles.logo} alt="ACT" />
                </h1>

                <button onClick={googleSignIn} className={styles.signButton}>
                    <img src={googleLogo} alt="Google Logo" />
                    <span>Sign In with Google</span>
                </button>
                
                <button onClick={githubSignIn} className={styles.signButton}>
                    <img src={githubLogo} alt="Github Logo" />
                    <span>Sign In with Github</span>
                </button>
            </div>
        </>    
    );
};

export default Auth;
