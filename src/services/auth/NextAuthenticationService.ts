import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  DocumentData,
  DocumentSnapshot,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

interface MatchHistoryEntry {
  id: number;
  date: Date;
  score: number;
  errors: number;
  duration: string;
}

interface BestScoreData {
  value: number;
  updatedAt: Date;
}

interface CurrencyData {
  value: number;
  updatedAt: Date;
}

interface TotalGamesData {
  value: number;
  updatedAt: Date;
}

interface UserData {
  displayName: string;
  best_score: BestScoreData;
  currency: CurrencyData;
  total_games: TotalGamesData;
  email: string;
  match_history?: MatchHistoryEntry[];
  photoURL: string;
}

let globalUser: UserData | null = null;

async function initFirebase() {
  try {
    const backendResponse = await fetch(
      "https://contigo-api-git-master-michaellourencos-projects.vercel.app/firebaseConfig",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!backendResponse.ok) {
      throw new Error("Failed to fetch config");
    }

    const config = await backendResponse.json();
    const app = initializeApp(config);
    const auth = getAuth(app);
    const db = getFirestore(app);
    return { auth, db };
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    throw error;
  }
}

async function fetchUserData(email: string): Promise<UserData | null> {
  try {
    const { db } = await initFirebase();
    const userRef = doc(db, "users", email);
    const docSnap: DocumentSnapshot<DocumentData> = await getDoc(userRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

async function handleAuthResponse(
  session: Session | null,
): Promise<UserData | null> {
  if (!session?.user?.email) return null;

  try {
    const { db } = await initFirebase();
    const email = session.user.email;
    let userData = await fetchUserData(email);

    if (!userData) {
      userData = {
        displayName: session.user.name || "",
        email: email,
        photoURL: session.user.image || "",
        best_score: { value: 0, updatedAt: new Date() },
        currency: { value: 0, updatedAt: new Date() },
        total_games: { value: 0, updatedAt: new Date() },
        match_history: [],
      };

      const userRef = doc(db, "users", email);
      await setDoc(userRef, userData);
    }

    if (session.user.image && userData.photoURL !== session.user.image) {
      const userRef = doc(db, "users", email);
      await updateDoc(userRef, { photoURL: session.user.image });
      userData.photoURL = session.user.image;
    }

    globalUser = userData;
    localStorage.setItem("user", JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.error("Error handling auth response:", error);
    return null;
  }
}

async function signInWithGoogle(): Promise<void> {
  try {
    await signIn("google", { callbackUrl: "/player" });
  } catch (error) {
    console.error("Error during sign in:", error);
    throw error;
  }
}

async function signOutUser(): Promise<void> {
  try {
    await signOut({ callbackUrl: "/player" });
    localStorage.removeItem("user");
    globalUser = null;
  } catch (error) {
    console.error("Error during sign out:", error);
    throw error;
  }
}

export {
  initFirebase,
  signInWithGoogle,
  signOutUser as signOutFromGoogle,
  handleAuthResponse,
  fetchUserData,
};

export type { UserData, MatchHistoryEntry };
