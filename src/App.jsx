import { useEffect } from "react";
import { useStore } from "@store/store";
import Auth from "./pages/Auth/Auth";
import 'drag-drop-touch';
import AuthenticatedApp from "./pages/AuthenticatedApp/AuthenticatedApp";
import "@styles/global.scss";
import styles from "./App.module.scss";

const App = () => {
    const user = useStore((state) => state.user);
    const theme = useStore((state) => state.theme);

    useEffect(() => {
        document.body.setAttribute("data-theme", theme);
    },[theme]);

    return (
        <div className={styles.app}>
            {user ? <AuthenticatedApp /> : <Auth />}
        </div>
    );
};

export default App;
