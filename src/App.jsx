import { useEffect } from "react";
import { useStore } from "@store/store";
import 'drag-drop-touch';
import 'dayjs/locale/uk';
import { IntlProvider } from 'react-intl';
import AuthenticatedApp from "./pages/AuthenticatedApp/AuthenticatedApp";
import Auth from "./pages/Auth/Auth";
import messages from "./locale/messages.js";
import "@styles/global.scss";
import styles from "./App.module.scss";


const App = () => {
    const user = useStore((state) => state.user);
    const theme = useStore((state) => state.theme);
    const locale = useStore((state) => state.locale);

    useEffect(() => {
        document.body.setAttribute("data-theme", theme);
    },[theme]);

    // Ensure we have valid messages and locale
    const validLocale = (locale === "en" || locale === "uk") ? locale : "en";
    const currentMessages = messages[validLocale] || messages.en;

    return (
        <div className={styles.app}>
            <IntlProvider 
                messages={currentMessages} 
                locale={validLocale}
                defaultLocale="en"
                onError={(err) => {
                    if (process.env.NODE_ENV === 'development') {
                        console.warn('react-intl error:', err);
                    }
                }}
            >
                {user ? <AuthenticatedApp /> : <Auth />}
            </IntlProvider>
        </div>
    );
};

export default App;
