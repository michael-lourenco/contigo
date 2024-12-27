"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  initFirebase,
  signInWithGoogle,
  signOutFromGoogle,
  UserData,
  updateUserBestScore,
  updateUserCurrency,
} from "@/services/firebase/FirebaseService";
import { onAuthStateChanged, Auth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trophy, Clock, XCircle, Coins } from 'lucide-react';
import { PlayerStatistics } from "@/components/player/PlayerStatistics";

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function PlayerDashboard() {

  const [authenticatedButtons, setAuthenticatedButtons] = useState<number[]>(
    []
  );

  const [user, setUser] = useState<UserData | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [db, setDb] = useState<any>(null);

  useEffect(() => {
    const initializeFirebase = async () => {
      const firebaseInstance = await initFirebase();
      if (firebaseInstance) {
        setAuth(firebaseInstance.auth);
        setDb(firebaseInstance.db);
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
      });

      return () => unsubscribe();
    }
  }, [auth, db]);

  const fetchUserData = async (
    db: any,
    email: string
  ): Promise<UserData | null> => {
    try {
      const userRef = doc(db, "users", email);
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

  const handleLogin = async () => {
    const { auth } = await initFirebase();
    await signInWithGoogle(auth);
  };

  const handleLogout = async () => {
    if (auth) {
      await signOutFromGoogle(auth);
      setUser(null);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6 bg-slate-900 text-slate-50">
        <PlayerStatistics
          user={user}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
        />

      {/* Match History */}
      <Card className='bg-slate-900 text-slate-50'>
        <CardHeader className='bg-slate-900 text-slate-50'>
          <CardTitle className='bg-slate-900 text-slate-50'>Match History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto bg-slate-900 text-slate-50" >
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted bg-slate-900 text-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Score</th>
                  <th scope="col" className="px-6 py-3">Errors</th>
                  <th scope="col" className="px-6 py-3">Duration</th>
                </tr>
              </thead>
              <tbody>
                {user?.match_history ? user.match_history.map((match) => (
                  <tr key={match.id} className="border-b">
                    <td className="px-6 py-4">{formatDate(new Date(match.date))}</td>
                    <td className="px-6 py-4 font-medium">{match.score}</td>
                    <td className="px-6 py-4">{match.errors}</td>
                    <td className="px-6 py-4">{match.duration}</td>
                  </tr>
                )): null}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}