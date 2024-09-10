import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signOut, signInWithPopup, setPersistence, browserLocalPersistence, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

let globalDisplayName = '';
let globalUser = {};

async function firebaseConfig() { 
    const backendResponse = await fetch('https://contigo-api-git-master-michaellourencos-projects.vercel.app/firebaseConfig', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        },
    });
    if (!backendResponse.ok) {
        console.error('Failed to fetch config:', backendResponse.statusText);
        return null;
    }

    const data = await backendResponse.json();  // Corrigido para processar o JSON corretamente
    return data;
}

const config = await firebaseConfig()

const app = initializeApp(config);

const auth = getAuth(app);

const db = getFirestore(app);

setPersistence(auth, browserLocalPersistence)
    .then(() => {
        onAuthStateChanged(auth, async (user) => {

            if (user) {
                globalUser = user
                const userRef = doc(db, 'users', user.email);

                const docSnap = await getDoc(userRef);

                if (docSnap.exists()) {

                    const userData = docSnap.data();
                    localStorage.setItem('user', JSON.stringify(userData));
                    globalUser = userData

                    displayUserInfo(userData.displayName, userData.best);

                    document.getElementById('google-sign-in-button').style.display = 'none';

                    document.getElementById('google-sign-out-button').style.display = 'block';

                } else {

                    console.error("Usuário não encontrado na coleção 'users'.");

                }
            } else {

                document.getElementById('google-sign-in-button').style.display = 'block';

                document.getElementById('google-sign-out-button').style.display = 'none';

            }
        });
    })
    .catch((error) => {

        console.error("Erro ao configurar persistência:", error);

    });

async function signInWithGoogle() {
    try {
        const provider = new GoogleAuthProvider();

        const response = await signInWithPopup(auth, provider);

        handleCredentialResponse(response)

    } catch (error) {

        console.error('Erro durante o login:', error);

    }
}

window.signInWithGoogle = signInWithGoogle;

async function handleCredentialResponse(response) {
    const idToken = response._tokenResponse.idToken;

    try {
    const backendResponse = await fetch('https://contigo-api-git-master-michaellourencos-projects.vercel.app/login', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idToken: idToken })
    });

    if (backendResponse.ok) {
        const userData = await backendResponse.json();
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        globalUser = userData

        displayUserInfo(userData.displayName, userData.best);
    } else {
        console.error('Erro ao fazer login:', backendResponse.statusText);
    }

    document.getElementById('google-sign-in-button').style.display = 'none';
    document.getElementById('google-sign-out-button').style.display = 'block';
    } catch (error) {
        console.error('Erro durante o login:', error);
    }
}

window.handleCredentialResponse = handleCredentialResponse;

async function signOutFromGoogle() {
    try {

        await signOut(auth);
        
        const userInfoContainer = document.getElementById('user-info');

        userInfoContainer.innerHTML = '';

        localStorage.removeItem('user');
                        
        document.getElementById('google-sign-in-button').style.display = 'block';

        document.getElementById('google-sign-out-button').style.display = 'none';

    } catch (error) {

        console.error('Erro durante o logout:', error);

    }
}

window.signOutFromGoogle = signOutFromGoogle;

function displayUserInfo(displayName, best) {

    if(displayName) {

        globalDisplayName = displayName

    }
    
    const userInfoContainer = document.getElementById('user-info');

    userInfoContainer.innerHTML = `
        <i class="fas fa-user"></i> ${displayName} <i class="fas fa-trophy"></i> ${best}</p>
    `;

}

window.displayUserInfo = displayUserInfo;

async function UpdateDbEndGame({ elementGameOver, elementNewGameButton }) {

    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {

        if (successCount > user.best) {

            const backendResponse = await fetch('https://contigo-api-git-master-michaellourencos-projects.vercel.app/update-score', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: user.email, score: successCount })
            });

            displayUserInfo(globalDisplayName, successCount)

        }                

    }
}

window.UpdateDbEndGame = UpdateDbEndGame;
