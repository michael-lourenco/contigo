"use client";

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
import { UserInfo } from "@/components/UserInfo";
import { PlayerStatistics } from "@/components/player/PlayerStatistics";
import { useNavigation } from "@/hooks/useNavigation";
import { PlayerMenu } from "@/components/player/PlayerMenu";
import { MatchHistory } from "@/components/player/MatchHistory";

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function PlayerDashboard() {
  const navigationService = useNavigation();

  const handleNavigation = (path: string) => () => {
    navigationService.navigateTo(path);
  };

  const localStorageUser =
    typeof window !== "undefined" && localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;

  const { data: session, status } = useSession();
  const [auth, setAuth] = useState<Auth | null>(null);
  const [db, setDb] = useState<any>(null);
  const [user, setUser] = useState<UserData | null>(
    (localStorageUser as UserData) || null
  );
  const [loading, setLoading] = useState(true);

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

  const handleLogin = async () => {
    await signInWithGoogle();
  };

  const handleLogout = async () => {
    await signOutFromGoogle();
    setUser(null);
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 bg-slate-900 text-slate-50">
      {status === "loading" ? (
        <p>Loading...</p>
      ) : (
        <>
          <UserInfo
            user={user}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
          />
          <PlayerStatistics
            user={user}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
          />
          <MatchHistory
            matchHistory={
              user?.match_history?.map((match) => ({
                ...match,
                id: String(match.id),
                date:
                  match.date instanceof Date
                    ? match.date.toISOString()
                    : match.date,
              })) || null
            }
          />
          <PlayerMenu
            onPlay={handleNavigation("/gameplay")}
            onSettings={handleNavigation("/settings")}
            onHowToPlay={handleNavigation("/how_to_play")}
          />
        </>
      )}
    </div>
  );
}
