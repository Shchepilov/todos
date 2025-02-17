import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useStore } from '@store/store';
import styles from './Auth.module.scss';
import dropdown from '@components/Dropdown/Dropdown.module.scss';

const Auth = () => {
    const user = useStore((state) => state.user);
    const googleSignIn = useStore((state) => state.googleSignIn);
    const githubSignIn = useStore((state) => state.githubSignIn);
    const signOut = useStore((state) => state.signOut);
    const removeUserData = useStore((state) => state.removeUserData);

    return (
        <>
            {user ? (
                <header className={styles.header}>
                    <h1 className={styles.headerTitle}>ACT <span>Achieve. Complete. Thrive</span></h1>
                    <p className={styles.headerName}>{user.displayName}</p>

                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button className={styles.headerAvatar}>
                                <img src={user.photoURL} alt={user.displayName}/>
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
