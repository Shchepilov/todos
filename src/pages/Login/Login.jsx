import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useStore } from '@store/store';
import styles from './Login.module.scss';
import logo from '@assets/logo.png';
import googleLogo from '@assets/google.svg';
import githubLogo from '@assets/github.svg';

// Closing the popup or opening a second one is the user's choice, not an error.
const IGNORED_ERROR_CODES = ['auth/popup-closed-by-user', 'auth/cancelled-popup-request'];

const Login = () => {
    const googleSignIn = useStore((state) => state.googleSignIn);
    const githubSignIn = useStore((state) => state.githubSignIn);
    const [errorCode, setErrorCode] = useState(null);

    const handleSignIn = (signIn) => {
        setErrorCode(null);
        signIn().catch((error) => {
            if (!IGNORED_ERROR_CODES.includes(error.code)) setErrorCode(error.code ?? 'unknown');
        });
    };

    return (
        <>
            <div className={styles.guest}>
                <h1 className={styles.guestTitle}>
                    <img src={logo} className={styles.logo} alt="ACT" />
                </h1>

                <button onClick={() => handleSignIn(googleSignIn)} className={styles.signButton}>
                    <img src={googleLogo} alt="Google Logo" />
                    <span>Sign In with Google</span>
                </button>
                
                <button onClick={() => handleSignIn(githubSignIn)} className={styles.signButton}>
                    <img src={githubLogo} alt="Github Logo" />
                    <span>Sign In with Github</span>
                </button>

                {errorCode && (
                    <p role="alert" className={styles.error}>
                        <FormattedMessage id="common.signInError" />
                    </p>
                )}
            </div>
        </>    
    );
};

export default Login;
