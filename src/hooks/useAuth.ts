import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  signInWithGoogle,
  signOutFromGoogle,
  handleAuthResponse,
} from "@/services/auth/NextAuthenticationService";
import {
  UserData,
  initUserFirebase,
  dbFromInit,
  authFromInit,
} from "@/services/firebase/FirebaseService";
import { onAuthStateChanged, Auth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
export function useAuth() {
  const localStorageUser =
    typeof window !== "undefined" && localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;

  const [auth, setAuth] = useState<Auth | null>(null);
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserData | null>(
    (localStorageUser as UserData) || null
  );
  const [loading, setLoading] = useState(true);
  const [db, setDb] = useState<any>(null);

  const handleLogin = async () => {
    await signInWithGoogle();
  };

  const handleLogout = async () => {
    await signOutFromGoogle();
    setUser(null);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (status === "authenticated" && session) {
        const userData = await handleAuthResponse(session, dbFromInit);
        if (userData) {
          setUser(userData);
        }
      } else if (status === "unauthenticated") {
        setUser(null);
      }
      setLoading(false); // Finalizando carregamento
    };

    initializeAuth();
  }, [session, status]);
  useEffect(() => {
    const initializeFirebase = async () => {
      const firebaseInstance = await initUserFirebase(authFromInit, dbFromInit);
      if (firebaseInstance) {
        setAuth(firebaseInstance.authFromInit);
        setDb(firebaseInstance.dbFromInit);
      } else {
        console.error("Falha na inicialização do Firebase");
      }
    };

    initializeFirebase();
  }, []);

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userData = await fetchUserData(db, user.email!);
          if (userData) {
            setUser(userData);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [auth, db]);

    const fetchUserData = async (
      db: any,
      email: string
    ): Promise<UserData | null> => {
      try {
        const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email);
        const docSnap = await getDoc(userRef);
  
        if (docSnap.exists()) {
          return docSnap.data() as UserData;
        } else {
          return null;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
      }
    };

    return { user, loading, status, handleLogin, handleLogout };
}
