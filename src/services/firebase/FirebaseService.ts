import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signOut,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  Auth,
  User,
  UserCredential,
} from "firebase/auth";
import {
  collection,
  getFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  Firestore,
  DocumentData,
  DocumentSnapshot,
} from "firebase/firestore";
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
}

let globalDisplayName: string = "";
let globalUser: UserData | null = null;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!
}

function initFirebase(){
  const config = firebaseConfig;

  const app: FirebaseApp = initializeApp(config);
  const auth: Auth = getAuth(app);
  const db: Firestore = getFirestore(app);

  return { auth, db };

}

const {db, auth} = initFirebase();
async function initUserFirebase(auth: Auth, db: Firestore) {

    await setPersistence(auth, browserLocalPersistence);

    onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        globalUser = await fetchUserData(db, user.email!);
        if (globalUser) {
          localStorage.setItem("user", JSON.stringify(globalUser));
          displayUserInfo(
            globalUser.displayName,
            globalUser.best_score.value,
            globalUser.currency.value,
            globalUser.total_games.value,
            globalUser.photoURL,
          );
        } else {
          console.error("Usuário não encontrado na coleção 'users'.");
        }
      }
    });

    return { auth, db };
}

async function fetchUserData(
  db: Firestore,
  email: string,
): Promise<UserData | null> {
  try {
    const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email);
    const docSnap: DocumentSnapshot<DocumentData> = await getDoc(userRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

// Função para login com Google
async function signInWithGoogle(auth: Auth): Promise<void> {
  try {
    console.log("signInWithGoogle");
    const provider = new GoogleAuthProvider();
    const response: UserCredential = await signInWithPopup(auth, provider);
    await handleCredentialResponse(response);
  } catch (error) {
    console.error("Erro durante o login:", error);
  }
}


async function handleCredentialResponse(
  response: UserCredential,
): Promise<void> {
  console.log(`response: ${JSON.stringify(response.user.photoURL)}`);
  const idToken = (response as any)._tokenResponse.idToken;

  try {
    const backendResponse = await fetch(
      "https://contigo-api-git-master-michaellourencos-projects.vercel.app/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      },
    );

    if (backendResponse.ok) {
      const userData: UserData = await backendResponse.json();
      const googlePhotoURL = response.user.photoURL || "";

      userData.photoURL = googlePhotoURL;

      const userRef = doc(getFirestore(), process.env.NEXT_PUBLIC_USERS_COLLECTION!, userData.email);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const existingData = userDoc.data() as UserData;

        if (!existingData.photoURL || existingData.photoURL === "") {
          await updateDoc(userRef, { photoURL: googlePhotoURL });
          console.log("PhotoURL atualizado no Firebase.");
        } else {
          console.log("PhotoURL já existente no Firebase.");
        }
      } else {
        console.error("Usuário não encontrado no Firestore para atualização.");
      }

      localStorage.setItem("user", JSON.stringify(userData));
      console.log(`userData: ${JSON.stringify(userData)}`);
      globalUser = userData;

      displayUserInfo(
        userData.displayName,
        userData.best_score.value,
        userData.currency.value,
        userData.total_games.value,
        userData.photoURL,
      );
    } else {
      console.error("Erro ao fazer login:", backendResponse.statusText);
    }
  } catch (error) {
    console.error("Erro durante o login:", error);
  }
}

async function signOutFromGoogle(auth: Auth): Promise<void> {
  try {
    await signOut(auth);
    localStorage.removeItem("user");
    displayUserInfo("", 0, 0, 0, "");
  } catch (error) {
    console.error("Erro durante o logout:", error);
  }
}

function displayUserInfo(
  displayName: string,
  best_score: number,
  currency: number,
  total_games: number,
  photoURL: string,
): void {
  globalDisplayName = displayName;
  console.log(
    `User: ${displayName}, Best Score: ${best_score}, Currency: ${currency}, Total Games: ${total_games}, Photo URL: ${photoURL}`,
  );
}

async function updateUserBestScore(
  email: string,
  newBestScore: number,
): Promise<void> {
  const db = getFirestore();
  const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email);

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
          { merge: true },
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
  currency: number,
): Promise<void> {
  const db = getFirestore();
  const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email);

  try {
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();

      const currentCurrency = userData.currency?.value || 0;
      if (currency > 0) {
        await setDoc(
          userRef,
          {
            currency: {
              value: currentCurrency + currency,
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
        currency: { value: currency, updatedAt: new Date() },
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
  const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email);

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

    const usersCollection = collection(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!);
    const userDocs = await getDocs(usersCollection);
    console.log("userDocs LENGHT", userDocs.docs.length);
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
  const userRef = doc(db, process.env.NEXT_PUBLIC_USERS_COLLECTION!, email);

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

export {
  initFirebase,
  signInWithGoogle,
  signOutFromGoogle,
  displayUserInfo,
  handleCredentialResponse,
  sendLeaderboardToGamification,
  updateUserBestScore,
  updateUserCurrency,
  updateUserTotalGames,
  updateMatchHistory,
  initUserFirebase,
  db,
  auth
};

export type { UserData, MatchHistoryEntry };
