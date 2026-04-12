# Limpeza: remoção de vestígios de “story” / estórias

## Código

- **`User.ts`:** removidos `StoryEntry` e o campo `story` em `UserData`.
- **`firebase/FirebaseService.ts`:** removidos import e campo `story` em `UserData`.
- **`NextAuthenticationService.ts`:** removidos tipos/campo `story` e `story: []` na criação de utilizador.
- **`src/services/FirebaseService.ts`:** ficheiro duplicado e não referenciado removido (continha `HistoryEntry`/`updateHistory` paralelos ao módulo antigo).

Documentos Firestore antigos podem ainda ter o campo `story`; a app deixa de tipar ou inicializar esse campo.
