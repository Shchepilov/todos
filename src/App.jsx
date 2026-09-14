import { Suspense, use, useEffect } from "react";
import { useStore } from "@store/store";
import 'drag-drop-touch';
import 'dayjs/locale/uk';
import { IntlProvider } from 'react-intl';
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import messages from "./locale/messages.js";
import { authReady, useAuthUser } from "@baseUrl/auth/useAuthUser";
import "@styles/global.scss";
import styles from "./App.module.scss";

const AuthGate = () => {
    use(authReady);
    const user = useAuthUser();

    return user ? <Home /> : <Login />;
};

const App = () => {
    const theme = useStore((state) => state.theme);
    const locale = useStore((state) => state.locale);

    useEffect(() => {
        document.body.setAttribute("data-theme", theme);
    },[theme]);

    return (
        <div className={styles.app}>
            <IntlProvider
                messages={messages[locale]}
                locale={locale}
                defaultLocale={locale}
            >
                <Suspense fallback={null}>
                    <AuthGate />
                </Suspense>
            </IntlProvider>
        </div>
    );
};

export default App;
