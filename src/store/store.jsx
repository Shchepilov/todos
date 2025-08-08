import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { useAuthStore } from "./storeAuth";
import { useTodosStore } from "@features/todos/store/store";
import { useNotesStore } from "@features/notes/store/store";
import { useBoardsStore } from "@features/boards/store/store";
import dayjs from "dayjs";

export const useStore = create(devtools(
    persist(
        (set, get) => ({
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

            clearStorage: () => set({ todos: [], user: null }),
        }),
        {
            name: "storage",
        }
    )
));
