import Auth from "./pages/Auth/Auth";
import AuthenticatedApp from "./pages/AuthenticatedApp/AuthenticatedApp";
import { useStore } from "@store/store";
import "@styles/global.scss";
import styles from "./App.module.scss";

const App = () => {
    const user = useStore((state) => state.user);

    return (
        <div className={styles.app}>
            {user ? <AuthenticatedApp /> : <Auth />}
        </div>
    );
};

export default App;
