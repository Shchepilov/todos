import { auth, googleAuthProvider, githubAuthProvider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";

// The signed-in user lives in Firebase Auth (see useAuthUser), not in this store.
export const useAuthStore = (set, get) => ({
    googleSignIn: () => signInWithPopup(auth, googleAuthProvider),
    githubSignIn: () => signInWithPopup(auth, githubAuthProvider),

    signOut: async () => {
        await signOut(auth);
        get().resetUserData();
    },
});
