# Duração da partida: 3 → 5 minutos

## Alterações

- **`src/app/gameplay/page.tsx`**: Constante `GAME_DURATION_SECONDS = 5 * 60`; estado inicial do temporizador e reset em `startNewGame` passam a usar essa constante (antes: `180` segundos).
- **`src/app/how_to_play/page.tsx`**: Texto dos componentes do jogo atualizado para “tempo principal de 5 minutos”.

## Nota

O valor `180` na lista `possibleNumbers` (tabuleiro) mantém-se: é um alvo numérico do jogo, não o tempo.
