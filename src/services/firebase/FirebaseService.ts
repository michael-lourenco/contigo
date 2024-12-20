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

interface BestScoreData {
  value: number;
  updatedAt: Date;
}

// Tipos globais para os dados do usuário
interface UserData {
  displayName: string;
  best_score: BestScoreData;
  email: string;
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

interface FirestoreUser {
  id: string;
  displayName: string;
  email: string;
  best_score?: BestScore;
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

// Função para buscar a configuração do Firebase no backend
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

// Inicializar Firebase com a configuração dinâmica
async function initFirebase(): Promise<{ auth: Auth; db: Firestore }> {
  const config = await firebaseConfig();
  if (config) {
    const app: FirebaseApp = initializeApp(config);
    const auth: Auth = getAuth(app);
    const db: Firestore = getFirestore(app);

    await setPersistence(auth, browserLocalPersistence);

    onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        globalUser = await fetchUserData(db, user.email!);
        if (globalUser) {
          localStorage.setItem("user", JSON.stringify(globalUser));
          displayUserInfo(globalUser.displayName, globalUser.best_score.value);
        } else {
          console.error("Usuário não encontrado na coleção 'users'.");
        }
      }
    });

    return { auth, db }; // Não retorna mais null
  } else {
    throw new Error("Firebase initialization failed.");
  }
}

// Função para buscar os dados do usuário
async function fetchUserData(
  db: Firestore,
  email: string
): Promise<UserData | null> {
  try {
    const userRef = doc(db, "users", email);
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
    const provider = new GoogleAuthProvider();
    const response: UserCredential = await signInWithPopup(auth, provider);
    await handleCredentialResponse(response);
  } catch (error) {
    console.error("Erro durante o login:", error);
  }
}

// Função para tratar a resposta do Google
async function handleCredentialResponse(
  response: UserCredential
): Promise<void> {
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
      }
    );

    if (backendResponse.ok) {
      const userData: UserData = await backendResponse.json();
      localStorage.setItem("user", JSON.stringify(userData));
      globalUser = userData;
      displayUserInfo(userData.displayName, userData.best_score.value);
    } else {
      console.error("Erro ao fazer login:", backendResponse.statusText);
    }
  } catch (error) {
    console.error("Erro durante o login:", error);
  }
}

// Função para logout
async function signOutFromGoogle(auth: Auth): Promise<void> {
  try {
    await signOut(auth);
    localStorage.removeItem("user");
    displayUserInfo("", 0); // Limpa as informações ao fazer logout
  } catch (error) {
    console.error("Erro durante o logout:", error);
  }
}

// Função para exibir as informações do usuário
function displayUserInfo(displayName: string, best_score: number): void {
  globalDisplayName = displayName;
  // Exibir informações do usuário na interface Next.js
  console.log(`User: ${displayName}, Best Score: ${best_score}`);
}

async function updateUserBestScore(
  email: string,
  newBestScore: number
): Promise<void> {
  const db = getFirestore();
  const userRef = doc(db, "users", email);

  try {
    const userSnap = await getDoc(userRef);

    // Verifica se o campo `best_score` já existe
    if (userSnap.exists()) {
      const userData = userSnap.data();

      // Atualiza apenas se o novo score for maior ou se o campo não existir
      const currentBestScore = userData.best_score?.value || 0;
      if (newBestScore > currentBestScore) {
        await setDoc(
          userRef,
          { best_score: { value: newBestScore, updatedAt: new Date().toISOString() } },
          { merge: true }
        );
        console.log("User best score updated successfully.");
      } else {
        console.log("New score is not higher. No update performed.");
      }
    } else {
      // Cria o documento com o campo `best_score` se ele não existir
      await setDoc(userRef, {
        best_score: { value: newBestScore, updatedAt: new Date() },
      });
      console.log("User document created with best score.");
    }
  } catch (error) {
    console.error("Error updating user best score:", error);
  }
}

async function sendLeaderboardToGamification(): Promise<void> {
  try {
    // Initialize Firebase internally
    const { db } = await initFirebase();
    
    const usersCollection = collection(db, "users");
    const userDocs = await getDocs(usersCollection);
    console.log("userDocs LENGHT", userDocs.docs.length);
    const leaderboard: LeaderboardEntry[] = userDocs.docs
      .map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as FirestoreUser)
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
      type:"SCORE_ORDER_LARGER_IS_BETTER",
    };

    await axios.post(
      "https://l7m9t7ooy6.execute-api.us-east-1.amazonaws.com/dev/leaderboards/create",
      payload,
      {
        headers: {
          "x-api-key":
            "e5cefdc3-d468-4e32-aa86-b48b6bbd07c8|d41d8cd98f00b204e9800998ecf8427e",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Leaderboard sent successfully");
  } catch (error) {
    console.error("Error sending leaderboard:", error);
    throw error;
  }
}

// Exportar funções para uso em páginas Next.js
export {
  initFirebase,
  signInWithGoogle,
  signOutFromGoogle,
  displayUserInfo,
  handleCredentialResponse,
  sendLeaderboardToGamification,
  updateUserBestScore,
};

// Re-exportar o tipo UserData
export type { UserData };
