import Auth from "./pages/Auth/Auth";
import AuthenticatedApp from "./pages/AuthenticatedApp/AuthenticatedApp";
import { useStore } from "@store/store";
import "@styles/global.scss";
import styles from "./App.module.scss";

const App = () => {
    const user = useStore((state) => state.user);
    const theme = useStore((state) => state.theme);

    return (
        <div className={styles.app} data-theme={theme}>
            {user ? <AuthenticatedApp /> : <Auth />}
        </div>
    );
};

export default App;
