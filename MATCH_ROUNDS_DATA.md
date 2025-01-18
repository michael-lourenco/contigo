# Match Rounds Data

## Objetivo
Salvar os dados de cada rodada (`round`) e enviá-los para o Firebase junto com o objeto `MatchHistory`.

## Regras de Negócio

### Estrutura de Dados
Cada rodada (`round`) será representada como um objeto com os seguintes atributos:

```json
{
  "dice_1": "Número do primeiro dado",
  "dice_2": "Número do segundo dado",
  "dice_3": "Número do terceiro dado",
  "choosed_value": "Valor escolhido pelo jogador",
  "time": "Tempo gasto na rodada (em segundos)",
  "success": "Booleano indicando se o jogador acertou (true) ou errou (false)",
  "errors": "Quantidade de erros possiveis no momento",
  "createdAt": "Timestamp da criação da rodada"
}
```

### Variável `roundsData`
- **Descrição**: Contém os dados de todas as rodadas da partida.
- **Estrutura Inicial**: Deve ser inicializada como um array vazio no início de cada partida, utilizando o hook `useState` do React.

### Regras Operacionais

#### 1. Início da Partida
- Limpar qualquer informação existente em `roundsData`.
- Inicializar `roundsData` como um array vazio utilizando `useState`:

```javascript
const [roundsData, setRoundsData] = useState([]);

useEffect(() => {
  // Reseta os dados no início da partida
  setRoundsData([]);
}, []); // Dependência vazia para executar apenas na montagem
```

#### 2. Fim de Cada Rodada
- Após verificar o resultado da rodada (se o jogador acertou ou errou), adicionar os dados da rodada atual ao estado `roundsData` usando a função `setRoundsData`.  

Exemplo:

```javascript
const handleRoundEnd = (round) => {
  setRoundsData((prevRounds) => [
    ...prevRounds,
    {
      dice_1: round.dice_1,
      dice_2: round.dice_2,
      dice_3: round.dice_3,
      choosed_value: round.choosed_value,
      time: round.time,
      success: round.success,
      errors: round.errors
      createdAt: new Date().toISOString()
    }
  ]);
};
```

#### 3. Fim da Partida
- Quando a partida terminar, enviar o array `roundsData` como parte do objeto `updateMatchHistory` para o Firebase. Use o hook `useEffect` para monitorar o final da partida, se necessário.

Exemplo:

```javascript
const handleGameEnd = () => {
  const updateMatchHistory = {
    matchId: "ID da partida",
    playerId: "ID do jogador",
    score: "Pontuação final",
    timePlayed: "Tempo total da partida",
    roundsData
  };

  // Função fictícia para envio ao Firebase
  sendToFirebase(updateMatchHistory);
};
```

### Atualização do `updateMatchHistory`
- Adicionar o atributo `roundsData` ao objeto `updateMatchHistory` que será enviado ao Firebase.
- Exemplo de estrutura do `updateMatchHistory`:

```json
{
  "matchId": "ID da partida",
  "playerId": "ID do jogador",
  "score": "Pontuação final",
  "timePlayed": "Tempo total da partida",
  "roundsData": [
    {
      "dice_1": 3,
      "dice_2": 5,
      "dice_3": 2,
      "choosed_value": 5,
      "time": 12,
      "success": true,
      "createdAt": "2025-01-17T10:00:00.000Z"
    },
    ...
  ]
}
```

## Considerações Gerais
1. Certifique-se de validar os dados da rodada antes de adicioná-los ao `roundsData`.
2. O atributo `createdAt` deve registrar o timestamp no momento em que a rodada foi finalizada.
3. Garanta que o envio ao Firebase inclua o atributo `roundsData` sem modificar a estrutura existente de `updateMatchHistory`.

## Objetivo Final
Registrar e persistir os dados detalhados de cada rodada para posterior análise e histórico das partidas.
