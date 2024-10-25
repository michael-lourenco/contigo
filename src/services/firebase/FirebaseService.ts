import { initializeApp, FirebaseApp } from 'firebase/app';
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
    UserCredential
} from 'firebase/auth';
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    Firestore,
    DocumentData,
    DocumentSnapshot
} from 'firebase/firestore';

// Tipos globais para os dados do usuário
interface UserData {
    displayName: string;
    best: number;
    email: string;
}

let globalDisplayName: string = '';
let globalUser: UserData | null = null;

// Função para buscar a configuração do Firebase no backend
async function firebaseConfig(): Promise<Record<string, string> | null> {
    try {
        const backendResponse = await fetch('https://contigo-api-git-master-michaellourencos-projects.vercel.app/firebaseConfig', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!backendResponse.ok) {
            console.error('Failed to fetch config:', backendResponse.statusText);
            return null;
        }

        const data = await backendResponse.json();
        return data;
    } catch (error) {
        console.error('Error fetching Firebase config:', error);
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
                    localStorage.setItem('user', JSON.stringify(globalUser));
                    displayUserInfo(globalUser.displayName, globalUser.best);
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
async function fetchUserData(db: Firestore, email: string): Promise<UserData | null> {
    try {
        const userRef = doc(db, 'users', email);
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
        console.error('Erro durante o login:', error);
    }
}

// Função para tratar a resposta do Google
async function handleCredentialResponse(response: UserCredential): Promise<void> {
    const idToken = (response as any)._tokenResponse.idToken;

    try {
        const backendResponse = await fetch('https://contigo-api-git-master-michaellourencos-projects.vercel.app/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken }),
        });

        if (backendResponse.ok) {
            const userData: UserData = await backendResponse.json();
            localStorage.setItem('user', JSON.stringify(userData));
            globalUser = userData;
            displayUserInfo(userData.displayName, userData.best);
        } else {
            console.error('Erro ao fazer login:', backendResponse.statusText);
        }
    } catch (error) {
        console.error('Erro durante o login:', error);
    }
}

// Função para logout
async function signOutFromGoogle(auth: Auth): Promise<void> {
    try {
        await signOut(auth);
        localStorage.removeItem('user');
        displayUserInfo('', 0); // Limpa as informações ao fazer logout
    } catch (error) {
        console.error('Erro durante o logout:', error);
    }
}

// Função para exibir as informações do usuário
function displayUserInfo(displayName: string, best: number): void {
    globalDisplayName = displayName;
    // Exibir informações do usuário na interface Next.js
    console.log(`User: ${displayName}, Best Score: ${best}`);
}

// Exportar funções para uso em páginas Next.js
export {
    initFirebase,
    signInWithGoogle,
    signOutFromGoogle,
    displayUserInfo,
    handleCredentialResponse
};

// Re-exportar o tipo UserData
export type { UserData };