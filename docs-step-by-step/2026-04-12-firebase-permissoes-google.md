# Step-by-step: correção “Missing or insufficient permissions” após Google Sign-In

## Contexto

- Login com Google usa **NextAuth** (`signIn("google")`).
- Leitura/escrita no **Firestore** usa o SDK do Firebase (`getDoc`, `setDoc`, etc.).
- As regras de segurança do Firestore avaliam **`request.auth`** (Firebase Authentication), não a sessão do NextAuth.
- Sem sessão no Firebase Auth, `getDoc` falha com `FirebaseError: Missing or insufficient permissions`.

## Alterações realizadas

### 1. `src/app/api/auth/[...nextauth]/route.ts`

- No callback `jwt`, persistir `account.id_token` (Google OAuth) em `token.idToken` quando o usuário completa o login.
- No callback `session`, expor `session.idToken` para o cliente usar no Firebase.

### 2. `types/next-auth.d.ts`

- Estender `Session` com `idToken?: string`.
- Estender `JWT` com `idToken?: string`.

### 3. `src/hooks/useAuth.ts`

- Importar `GoogleAuthProvider` e `signInWithCredential` do `firebase/auth`.
- Depois que `auth` (Firebase) está pronto e a sessão NextAuth está autenticada:
  - Se houver `session.idToken` e ainda não houver usuário Firebase (ou e-mail diferente), chamar `signInWithCredential` com a credencial Google.
  - Em seguida chamar `handleAuthResponse` (que faz `getDoc` / cria documento).
- Remover `setUser(null)` do `onAuthStateChanged` quando não há usuário Firebase, para não apagar o estado enquanto o NextAuth ainda está autenticado (o efeito da sessão trata logout).
- Ajustar o fluxo de `loading` para aguardar `auth` e tratar `status === "loading"`.

### 4. `src/services/auth/NextAuthenticationService.ts`

- Importar `signOut` do Firebase Auth como `firebaseSignOut` e `authFirestore`.
- Em `signOutUser`, chamar `firebaseSignOut(authFirestore)` antes do `signOut` do NextAuth, para alinhar logout nos dois sistemas.

## Arquivos e funções (referência rápida)

| Arquivo | Função |
|---------|--------|
| `FirebaseService.ts` | Inicializa app Firestore/Auth; `fetchUserData` lê o documento do usuário na coleção `NEXT_PUBLIC_USERS_COLLECTION`. |
| `NextAuthenticationService.ts` | `handleAuthResponse` sincroniza dados com Firestore após login; agora o logout também encerra a sessão Firebase. |
| `useAuth.ts` | Hook que liga NextAuth + Firebase Auth antes de acessar o Firestore. |

## Regras do Firestore (Console Firebase)

Garanta que as regras permitam acesso a utilizadores autenticados no Firebase. Exemplo quando o ID do documento é o **e-mail**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{collection}/{userEmail} {
      allow read, write: if request.auth != null
        && request.auth.token.email == userEmail;
    }
  }
}
```

Substitua `{collection}` pelo valor de `NEXT_PUBLIC_USERS_COLLECTION`. Ajuste a condição se usar outro modelo (por exemplo UID como ID do documento).

## Manutenibilidade e próximos passos

- A solução reutiliza o `id_token` do fluxo OAuth já obtido pelo NextAuth, evitando `firebase-admin` e um endpoint de custom token.
- Limitação: se o JWT guardar um `id_token` expirado e o utilizador apagar apenas os dados do Firebase no browser (mantendo cookies do NextAuth), `signInWithCredential` pode falhar; nesse caso faz sentido um endpoint com **custom token** (Admin SDK) ou novo login Google.
