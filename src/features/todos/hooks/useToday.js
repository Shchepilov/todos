import { useEffect, useState } from "react";
import dayjs from "dayjs";

const getToday = () => dayjs().format("YYYY-MM-DD");

// Today's date that also changes after midnight while the app stays open.
// Checked every minute and when the tab becomes visible, because timers are delayed while the computer sleeps.
const useToday = () => {
    const [today, setToday] = useState(getToday);

    useEffect(() => {
        const update = () => setToday(getToday());
        const timer = setInterval(update, 60 * 1000);
        document.addEventListener("visibilitychange", update);

        return () => {
            clearInterval(timer);
            document.removeEventListener("visibilitychange", update);
        };
    }, []);

    return today;
};

export default useToday;
