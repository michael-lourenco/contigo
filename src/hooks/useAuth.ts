import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  signInWithGoogle,
  signOutFromGoogle,
  handleAuthResponse,
} from "@/services/auth/NextAuthenticationService";
import {
  fetchUserData,
  UserData,
  initUserFirebase,
  dbFirestore,
  authFirestore,
} from "@/services/firebase/FirebaseService";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  Auth,
} from "firebase/auth";

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
      if (status === "loading") {
        return;
      }
      if (status === "unauthenticated") {
        setUser(null);
        setLoading(false);
        return;
      }
      if (status !== "authenticated" || !session || !auth) {
        return;
      }

      try {
        const email = session.user?.email ?? undefined;
        const needsFirebaseLink =
          session.idToken &&
          (!auth.currentUser ||
            (email && auth.currentUser.email !== email));

        if (needsFirebaseLink && session.idToken) {
          const credential = GoogleAuthProvider.credential(session.idToken);
          await signInWithCredential(auth, credential);
        }

        const userData = await handleAuthResponse(session, dbFirestore);
        if (userData) {
          setUser(userData);
        }
      } catch (e) {
        console.error("Erro ao sincronizar sessão com o Firebase:", e);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [session, status, auth]);

  useEffect(() => {
    const initializeFirebase = async () => {
      const firebaseInstance = await initUserFirebase(authFirestore, dbFirestore);
      if (firebaseInstance) {
        setAuth(firebaseInstance.authFirestore);
        setDb(firebaseInstance.dbFirestore);
      } else {
        console.error("Falha na inicialização do Firebase");
      }
    };

    initializeFirebase();
  }, []);

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const userData = await fetchUserData(db, firebaseUser.email!);
          if (userData) {
            setUser(userData);
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [auth, db]);

  return { user, loading, status, handleLogin, handleLogout };
}
