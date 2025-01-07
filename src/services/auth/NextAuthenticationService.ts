import { collection, getFirestore, doc, getDoc, getDocs, setDoc, updateDoc, Firestore, DocumentSnapshot, DocumentData } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence, Auth } from "firebase/auth";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

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

interface BestScore {
  value: number;
  updatedAt: Date;
}

interface Currency {
  value: number;
  updatedAt: Date;
}
interface FirestoreUser {
  id: string;
  displayName: string;
  email: string;
  best_score?: BestScore;
  currency?: Currency;
}
interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  date: Date;
}

interface LeaderboardPayload {
  id: string;
  name: string;
  owner: string;
  description: string;
  leaderboard: LeaderboardEntry[];
  date: string;
  type: string;
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

const USERS_COLLECTION = "users";

let globalUser: UserData | null = null;

async function firebaseConfig(): Promise<Record<string, string> | null> {
  try {
    const backendResponse = await fetch(
      "https://contigo-api-git-master-michaellourencos-projects.vercel.app/firebaseConfig",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!backendResponse.ok) {
      console.error("Failed to fetch config:", backendResponse.statusText);
      return null;
    }

    const data = await backendResponse.json();
    return data;
  } catch (error) {
    console.error("Error fetching Firebase config:", error);
    return null;
  }
}

async function initFirebase(): Promise<{ auth: Auth; db: Firestore }> {
  const config = await firebaseConfig();
  if (config) {
    const app = initializeApp(config);
    const auth = getAuth(app);
    const db = getFirestore(app);

    await setPersistence(auth, browserLocalPersistence);

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        globalUser = await fetchUserData(db, user.email!);
        if (globalUser) {
          localStorage.setItem("user", JSON.stringify(globalUser));
          displayUserInfo(globalUser);
        } else {
          console.error("User not found in 'users' collection.");
        }
      }
    });

    return { auth, db };
  } else {
    throw new Error("Firebase initialization failed.");
  }
}

async function fetchUserData(db: Firestore, email: string): Promise<UserData | null> {
  try {
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


async function handleAuthResponse(session: Session | null): Promise<UserData | null> {
  if (!session?.user?.email) return null;

  try {
    const { db } = await initFirebase();
    const email = session.user.email;
    let userData = await fetchUserData(db, email);

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

async function updateUserBestScore(email: string, newBestScore: number): Promise<void> {
  const db = getFirestore();
  const userRef = doc(db, "users", email);

  try {
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();

      const currentBestScore = userData.best_score?.value || 0;
      if (newBestScore > currentBestScore) {
        await setDoc(
          userRef,
          {
            best_score: {
              value: newBestScore,
              updatedAt: new Date().toISOString(),
            },
          },
          { merge: true }
        );
        console.log("User best score updated successfully.");
      } else {
        console.log("New score is not higher. No update performed.");
      }
    } else {
      await setDoc(userRef, {
        best_score: { value: newBestScore, updatedAt: new Date() },
      });
      console.log("User document created with best score.");
    }
  } catch (error) {
    console.error("Error updating user best score:", error);
  }
}

async function updateUserCurrency(
  email: string,
  value: number,
): Promise<void> {
  const db = getFirestore();
  const userRef = doc(db, "users", email);

  try {
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();

      const currentCurrency = userData.currency?.value || 0;
      if (value > 0) {
        await setDoc(
          userRef,
          {
            currency: {
              value: currentCurrency + value,
              updatedAt: new Date().toISOString(),
            },
          },
          { merge: true },
        );
        console.log("User best score updated successfully.");
      } else {
        console.log("New score is not higher. No update performed.");
      }
    } else {
      await setDoc(userRef, {
        currency: { value: value, updatedAt: new Date() },
      });
      console.log("User document created with best score.");
    }
  } catch (error) {
    console.error("Error updating user best score:", error);
  }
}

async function updateUserTotalGames(
  email: string,
  value: number,
): Promise<void> {
  const db = getFirestore();
  const userRef = doc(db, "users", email);

  try {
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();

      const currentTotalGames = userData.total_games?.value || 0;
      if (value > 0) {
        await setDoc(
          userRef,
          {
            total_games: {
              value: currentTotalGames + value,
              updatedAt: new Date().toISOString(),
            },
          },
          { merge: true },
        );
        console.log("User number of games updated successfully.");
      } else {
        console.log("New score is not higher. No update performed.");
      }
    } else {
      await setDoc(userRef, {
        total_games: { value: value, updatedAt: new Date() },
      });
      console.log("User document created with number of games.");
    }
  } catch (error) {
    console.error("Error updating user number of games:", error);
  }
}

async function sendLeaderboardToGamification(): Promise<void> {
  try {
    const { db } = await initFirebase();

    const usersCollection = collection(db, "users");
    
    const userDocs = await getDocs(usersCollection);

    const leaderboard: LeaderboardEntry[] = userDocs.docs
      .map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as FirestoreUser,
      )
      .filter((user) => user.best_score?.value !== undefined)
      .map((user) => ({
        id: user.id,
        name: user.displayName,
        score: user.best_score!.value,
        date: user.best_score!.updatedAt,
      }))
      .sort((a, b) => b.score - a.score);

    if (leaderboard.length === 0) {
      console.log("No users with scores found");
      return;
    }

    const payload: LeaderboardPayload = {
      id: uuidv4(),
      name: "Ranking CONTI GO",
      owner: process.env.NEXT_PUBLIC_GAMIFICATION_API_KEY || "",
      description: "ranking do jogo contigo",
      leaderboard,
      date: new Date().toISOString(),
      type: "SCORE_ORDER_LARGER_IS_BETTER",
    };

    await axios.post(
      `${process.env.NEXT_PUBLIC_GAMIFICATION_API_URL}/leaderboards/create`,
      payload,
      {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_GAMIFICATION_API_KEY || "",
          "Content-Type": "application/json",
        },
      },
    );

    console.log("Leaderboard sent successfully");
  } catch (error) {
    console.error("Error sending leaderboard:", error);
    throw error;
  }
}

async function updateMatchHistory(
  email: string,
  matchData: Omit<MatchHistoryEntry, "id">,
): Promise<void> {
  const db = getFirestore();

  const userRef = doc(db, "users", email);

  try {
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const currentHistory = userData.match_history || [];

      const maxId = currentHistory.reduce(
        (max: number, match: MatchHistoryEntry) => Math.max(max, match.id),
        0,
      );

      const newMatch = {
        ...matchData,
        id: maxId + 1,
        date: new Date(matchData.date).toISOString(),
      };

      const updatedHistory = [newMatch, ...currentHistory];

      const limitedHistory = updatedHistory.slice(0, 10);

      await setDoc(
        userRef,
        {
          match_history: limitedHistory,
        },
        { merge: true },
      );
      console.log("Match history updated successfully.");
    } else {
      await setDoc(userRef, {
        match_history: [
          {
            ...matchData,
            id: 1,
            date: new Date(matchData.date).toISOString(),
          },
        ],
      });
      console.log("User document created with first match history entry.");
    }
  } catch (error) {
    console.error("Error updating match history:", error);
    throw error;
  }
}

function displayUserInfo(user: UserData): void {
  console.log(
    `User: ${user.displayName}, Best Score: ${user.best_score.value}, Currency: ${user.currency.value}, Total Games: ${user.total_games.value}, Photo URL: ${user.photoURL}`
  );
}

export {
  initFirebase,
  signInWithGoogle,
  signOutUser as signOutFromGoogle,
  handleAuthResponse,
  updateUserBestScore,
  displayUserInfo,
  sendLeaderboardToGamification,
  updateUserCurrency,
  updateUserTotalGames,
  updateMatchHistory,
};

export type { UserData, MatchHistoryEntry };
