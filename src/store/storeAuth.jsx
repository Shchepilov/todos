import { auth, googleAuthProvider, githubAuthProvider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";

export const useAuthStore = (set, get) => ({
    user: null,

    googleSignIn: async () => {
        try {
            const result = await signInWithPopup(auth, googleAuthProvider);
            set({ user: result.user });
        } catch (error) {
            throw new Error(error.message);
        }
    },

    githubSignIn: async () => {
        try {
            const result = await signInWithPopup(auth, githubAuthProvider);
            set({ user: result.user });
        } catch (error) {
            throw new Error(error.message);
        }
    },

    signOut: async () => {
        try {
            await signOut(auth);
            get().clearStorage();
            localStorage.clear();
            window.location.href = "/";
        } catch (error) {
            throw new Error(error.message);
        }
    },

    setUser: (user) => set({ user })
});