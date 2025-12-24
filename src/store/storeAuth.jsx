import { auth, googleAuthProvider, githubAuthProvider } from "../firebase";
import { signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";

export const useAuthStore = (set, get) => ({
    user: null,
    googleAccessToken: null,
    googleTokenExpiry: null,

    googleSignIn: async () => {
        try {
            const result = await signInWithPopup(auth, googleAuthProvider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;

            // Access token живе 1 годину (3600 секунд)
            const expiresAt = Date.now() + (3600 * 1000);

            set({
                user: result.user,
                googleAccessToken: token,
                googleTokenExpiry: expiresAt
            });
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

    // Примітка: refreshGoogleToken та isTokenExpiringSoon видалені, оскільки
    // Firebase Auth не підтримує автоматичне оновлення Google OAuth токенів.
    // Користувач має перелогінитись після експірації токену (через 1 годину).
});
