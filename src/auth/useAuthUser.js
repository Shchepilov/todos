import { useSyncExternalStore } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@baseUrl/firebase";

// Resolves once Firebase has restored the session from IndexedDB.
// Created once at module level because use() needs a stable promise.
export const authReady = auth.authStateReady();

const subscribe = (onChange) => onAuthStateChanged(auth, onChange);
const getSnapshot = () => auth.currentUser;

// Firebase Auth is the single source of truth for the signed-in user.
export const useAuthUser = () => useSyncExternalStore(subscribe, getSnapshot);
