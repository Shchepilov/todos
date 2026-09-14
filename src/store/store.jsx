import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { useAuthStore } from "./storeAuth";
import { useTodosStore } from "@features/todos/store/store";
import { useNotesStore } from "@features/notes/store/store";
import { useBoardsStore } from "@features/boards/store/store";
import dayjs from "dayjs";

// The old "storage" key kept a copy of the Firebase User with its tokens, so it is removed.
try {
    localStorage.removeItem("storage");
} catch {
    // Storage is unavailable, nothing to clean up.
}

export const useStore = create(devtools(
    persist(
        (set, get, api) => ({
            currentDay: dayjs(),
            theme: "dark",
            locale: "en",
            setLocale: () => set((state) => ({ locale: state.locale === "en" ? "uk" : "en" })),
            toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
            setCurrentDay: (currentDay) => set({ currentDay }),

            ...useAuthStore(set, get),
            ...useTodosStore(set, get),
            ...useNotesStore(set, get),
            ...useBoardsStore(set, get),

            // Drop the previous user's data on sign-out. Theme and locale are device settings, so they stay.
            resetUserData: () => set((state) => ({
                ...api.getInitialState(),
                theme: state.theme,
                locale: state.locale,
            })),
        }),
        {
            name: "act-settings",
        }
    )
));
