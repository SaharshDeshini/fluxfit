import { create } from 'zustand';
import { auth, db } from '../lib/firebase';
import api from '../lib/api';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export const useAuthStore = create((set, get) => ({
    user: null,
    profile: null,
    loading: true,
    isNewUser: null,
    redirectTo: null,

    init: () => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                set({ user: currentUser });

                try {
                    const response = await api.post('/api/auth/verify');
                    const { success, isNewUser, redirectTo } = response.data;

                    if (success) {
                        set({ isNewUser, redirectTo });
                    }
                } catch (error) {
                    console.error("Backend verification failed:", error);
                }

                await get().fetchProfile(currentUser.uid);
            } else {
                set({ user: null, profile: null, isNewUser: null, redirectTo: null, loading: false });
            }
        });
        return unsubscribe;
    },

    fetchProfile: async (uid) => {
        try {
            const docRef = doc(db, 'users', uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                set({ profile: docSnap.data(), loading: false });
            } else {
                set({ profile: null, loading: false });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            set({ loading: false });
        }
    },

    login: async (email, password) => {
        set({ loading: true });
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },

    signup: async (email, password, name) => {
        set({ loading: true });
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const newProfile = {
                name,
                email,
                createdAt: serverTimestamp(),
            };

            await setDoc(doc(db, 'users', user.uid), newProfile);
            set({ profile: newProfile });
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },

    loginWithGoogle: async () => {
        set({ loading: true });
        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;

            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);
            let isNewUser = false;

            if (!docSnap.exists()) {
                isNewUser = true;
                const newProfile = {
                    name: user.displayName,
                    email: user.email,
                    createdAt: serverTimestamp(),
                };
                await setDoc(docRef, newProfile);
                set({ profile: newProfile });
            } else {
                set({ profile: docSnap.data() });
            }
            return { isNewUser };
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },

    updateProfile: async (data) => {
        set({ loading: true });
        try {
            // Use Firebase auth directly instead of Zustand state which might be empty on reload
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error("User not authenticated.");
            const docRef = doc(db, 'users', currentUser.uid);
            await setDoc(docRef, data, { merge: true });

            const docSnap = await getDoc(docRef);
            set({ profile: docSnap.data(), loading: false });
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },

    logout: async () => {
        set({ loading: true });
        try {
            await signOut(auth);
            set({ user: null, profile: null, loading: false });
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    }
}));
