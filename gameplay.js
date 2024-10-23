
// document.querySelector('.menu-toggle').addEventListener('click', function() {
//     document.querySelector('.menu-links').classList.toggle('active');
// });
const audioGameStart = new Audio('/audio/game-start-6104.mp3');
const audioWrongAnswer = new Audio('/audio/wrong-answer-129254.mp3');
const audioCorrectAnswer = new Audio('/audio/mixkit-correct-answer-tone-2870.wav');

function getRandomNumber(largestNumberPossible) {
    return Math.floor(Math.random() * Number(largestNumberPossible)) + 1;
}

let errorCount = 0;
let successCount = 0;
let generalTimer;
let timeRemaining = 180;
const possibleNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 44, 45, 48, 50, 54, 55, 60, 64, 66, 72, 75, 80, 90, 96, 100, 108, 120, 125, 144, 150, 180];
let remainNumbers = []
let choices = []

const diceList = {
    firstDice:{
            element: 'firstDice',
            value: 0
        },
    secondDice:{
            element: 'secondDice',
            value: 0
        },
    thirdDice:{
            element: 'thirdDice',
            value: 0
        }
}

function resetGame() {
    errorCount = 0;
    successCount = 0;
    timeRemaining = 180;
    remainNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 44, 45, 48, 50, 54, 55, 60, 64, 66, 72, 75, 80, 90, 96, 100, 108, 120, 125, 144, 150, 180];
    choices = [];
    document.getElementById('errors').innerText = `${errorCount}`;
    document.getElementById('successes').innerText = `${successCount}`;
    document.getElementById('game-over').innerText = '';
    document.getElementById('result').innerText = '';
    document.getElementById('timer').innerText = '00';
    document.getElementById('general-timer').innerText = `03:00`;
    document.getElementById('new-game-button').style.display = 'none';
    document.getElementById('jump-button').style.display = 'block';
    clearInterval(generalTimer);
    startGeneralTimer('general-timer');
    generateNewNumbers(diceList);
    populateGrid(possibleNumbers, 64);
    renderChoices();
}

function startNewGame() {
    audioGameStart.currentTime = 0;
    audioGameStart.play();
    resetGame();
}

function generateNewNumbers(diceList) {
    Object.keys(diceList).forEach(key => {
        const randomNumber = getRandomNumber(6);
        diceList[key].value = randomNumber;
        document.getElementById(diceList[key].element).innerText = randomNumber;
    });
    displayExpressionsTips();
}

function validate(value, button) {
    const calculoData = new CalculoData();
    const resultado = calculoData.resolve(diceList.firstDice.value, diceList.secondDice.value, diceList.thirdDice.value, value);
    
    document.getElementById('jump-button').style.display = 'none';

    if (resultado.valorEncontrado) {
        showSuccess();
        button.classList.add('authenticated');
        button.disabled = true;
        successCount++;
        removeNumber(value);
        updateChoices(diceList.firstDice.value, diceList.secondDice.value, diceList.thirdDice.value, value, true);
        document.getElementById('successes').innerText = `${successCount}`;
    } else {
        shakeHeartBroken();
        errorCount++;
        document.getElementById('errors').innerText = `${errorCount}`;
        updateChoices(diceList.firstDice.value, diceList.secondDice.value, diceList.thirdDice.value, value, false);
        if (errorCount >= 3) {
            endGame({ elementGameOver: 'game-over', elementNewGameButton: 'new-game-button', elementJumpButton: 'jump-button'});
            return;
        }
    }

    disableNonAuthenticatedGridButtons();

    let timer = 2;

    document.getElementById('timer').innerText = `${timer}`;

    const interval = setInterval(() => {
        timer--;
        document.getElementById('timer').innerText = `${timer}`;
        if (timer === 0) {
            clearInterval(interval);
            generateNewNumbers(diceList);
            document.getElementById('result').innerText = '';
            document.getElementById('timer').innerText = '00';
            document.getElementById('jump-button').style.display = 'block';
            enableGridButtons({element:'.grid-item button', disable: false});
        }
    }, 1000);
}

function verifyNumbers(remainNumbers) {
    const calculationData = new CalculoData();
    for (let i = 0; i < remainNumbers.length; i++) {
        const result = calculationData.resolve(diceList.firstDice.value, diceList.secondDice.value, diceList.thirdDice.value, remainNumbers[i]);
        if (result.valorEncontrado) {
            return true; 
        }
    }
    return false; 
}

function jump() {

    const resultExists = verifyNumbers(remainNumbers)
    
    document.getElementById('jump-button').style.display = 'none';

    if (!resultExists) {
        showSuccess()
        updateChoices(diceList.firstDice.value, diceList.secondDice.value, diceList.thirdDice.value, 'jump', true);
        
        document.getElementById('successes').innerText = `${successCount}`;
    } else {      
        shakeHeartBroken()
        errorCount++;
        document.getElementById('errors').innerText = `${errorCount}`;
        updateChoices(diceList.firstDice.value, diceList.secondDice.value, diceList.thirdDice.value, 'jump', false);
        if (errorCount >= 3) {
            endGame({ elementGameOver: 'game-over', elementNewGameButton: 'new-game-button', elementJumpButton: 'jump-button'});
            return;
        }
    }

    disableNonAuthenticatedGridButtons();

    let timer = 2;

    document.getElementById('timer').innerText = `${timer}`;

    const interval = setInterval(() => {
        timer--;
        document.getElementById('timer').innerText = `${timer}`;
        if (timer === 0) {
            clearInterval(interval);
            generateNewNumbers(diceList);
            document.getElementById('result').innerText = '';
            document.getElementById('timer').innerText = '00';
            document.getElementById('jump-button').style.display = 'block';
            enableGridButtons({element:'.grid-item button', disable: false});

        }
    }, 1000);
}

function disableNonAuthenticatedGridButtons() {
    document.querySelectorAll('.grid-item button').forEach(btn => {
        if (!btn.classList.contains('authenticated')) {
            btn.disabled = true;
        }
    });
}

function enableGridButtons({element = '.grid-item button', disable =  false}) {
    document.querySelectorAll(element).forEach(btn => {
        if (!btn.classList.contains('authenticated')) {
            btn.disabled = disable;
        }
    });
}

function startGeneralTimer(element) {
    generalTimer = setInterval(() => {
        timeRemaining--;
        const minutes = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
        const seconds = (timeRemaining % 60).toString().padStart(2, '0');
        document.getElementById(element).innerText = `${minutes}:${seconds}`;

        if (timeRemaining <= 0) {
            endGame({ elementGameOver: 'game-over', elementNewGameButton: 'new-game-button', elementJumpButton: 'jump-button'});
        }
    }, 1000);
}

function endGame({ elementGameOver, elementNewGameButton, elementJumpButton}) {
    UpdateDbEndGame({ elementGameOver, elementNewGameButton});
    clearInterval(generalTimer);
    enableGridButtons({element:'.grid-item button', disable: true});
    document.getElementById('result').innerText = '';
    document.getElementById(elementGameOver).innerText = 'Game Over!';
    document.getElementById(elementNewGameButton).style.display = 'block';
    document.getElementById(elementJumpButton).style.display = 'none';
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function removeNumber(num) {
    const index = remainNumbers.indexOf(num); 
    if (index !== -1) {
      remainNumbers.splice(index, 1);
    } else {
      console.log(`Number ${num} not found in array.`);
    }
  }

function populateGrid(arrayNumbers, quantityGridItems) {
    const shuffledNumbers = shuffle(arrayNumbers.slice(0, quantityGridItems));
    const grid = document.getElementById('grid');

    grid.innerHTML = ''; 

    for (let i = 0; i < quantityGridItems; i++) {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        const button = document.createElement('button');
        
        button.innerText = shuffledNumbers[i];
        button.onclick = function() {
            validate(shuffledNumbers[i], button);
        };
        gridItem.appendChild(button);
        grid.appendChild(gridItem);
    }
}

function copyPixKey() {
    const pixKey = '15920006629';
    navigator.clipboard.writeText(pixKey).then(() => {
        const message = document.getElementById('pix-message');
        message.style.display = 'block';
        setTimeout(() => {
            message.style.display = 'none';
        }, 2000);
    }).catch(err => {
        console.error('Error copying key PIX: ', err);
    });
}

function shakeHeartBroken() {
    const resultDiv = document.getElementById("result");

    // Limpa o conteúdo anterior e adiciona o ícone heart-broken
    resultDiv.innerHTML = '<i id="heartIcon" class="fas fa-heart-broken fa-icon shake" aria-hidden="true"></i>';

    // Toca o áudio
    audioWrongAnswer.currentTime = 0;
    audioWrongAnswer.play();
    // Remove a classe "shake" após a animação
    setTimeout(() => {
        const heartIcon = document.getElementById("heartIcon");
        heartIcon.classList.remove("shake");
    }, 500); // tempo igual à duração da animação
}

function showSuccess() {
    const resultDiv = document.getElementById("result");

    // Limpa o conteúdo anterior e adiciona o ícone heart-broken
    resultDiv.innerHTML = '<i id="successIcon" class="fas fa-check-circle correct" aria-hidden="true"></i>';

    // Toca o áudio
    audioCorrectAnswer.currentTime = 0;
    audioCorrectAnswer.play();

    // Remove a classe "shake" após a animação
    setTimeout(() => {
        const successIcon = document.getElementById("successIcon");
        successIcon.classList.remove("correct");
    }, 500); // tempo igual à duração da animação
}

// As expressões a serem exibidas
const expressions = [
    { before: '', middle1: '+', middle2: '+', after: '' },
    { before: '', middle1: '+', middle2: '-', after: '' },
    { before: '', middle1: '+', middle2: '*', after: '' },
    { before: '', middle1: '+', middle2: '/', after: '' },
    { before: '', middle1: '-', middle2: '+', after: '' },
    { before: '', middle1: '-', middle2: '-', after: '' },
    { before: '', middle1: '-', middle2: '*', after: '' },
    { before: '', middle1: '-', middle2: '/', after: '' },
    { before: '', middle1: '*', middle2: '+', after: '' },
    { before: '', middle1: '*', middle2: '-', after: '' },
    { before: '', middle1: '*', middle2: '*', after: '' },
    { before: '', middle1: '*', middle2: '/', after: '' },
    { before: '', middle1: '/', middle2: '+', after: '' },
    { before: '', middle1: '/', middle2: '-', after: '' },
    { before: '', middle1: '/', middle2: '*', after: '' },
    { before: '', middle1: '/', middle2: '/', after: '' },
    { before: '(', middle1: '+', middle2: ') +', after: '' },
    { before: '(', middle1: '+', middle2: ') -', after: '' },
    { before: '(', middle1: '+', middle2: ') *', after: '' },
    { before: '(', middle1: '+', middle2: ') /', after: '' },
    { before: '(', middle1: '-', middle2: ') +', after: '' },
    { before: '(', middle1: '-', middle2: ') -', after: '' },
    { before: '(', middle1: '-', middle2: ') *', after: '' },
    { before: '(', middle1: '-', middle2: ') /', after: '' },
    { before: '(', middle1: '*', middle2: ') +', after: '' },
    { before: '(', middle1: '*', middle2: ') -', after: '' },
    { before: '(', middle1: '*', middle2: ') *', after: '' },
    { before: '(', middle1: '*', middle2: ') /', after: '' },
    { before: '(', middle1: '/', middle2: ') +', after: '' },
    { before: '(', middle1: '/', middle2: ') -', after: '' },
    { before: '(', middle1: '/', middle2: ') *', after: '' },
    { before: '(', middle1: '/', middle2: ') /', after: '' },
    { before: '', middle1: '+ (', middle2: '+', after: ')' },
    { before: '', middle1: '+ (', middle2: '-', after: ')' },
    { before: '', middle1: '+ (', middle2: '*', after: ')' },
    { before: '', middle1: '+ (', middle2: '/', after: ')' },
    { before: '', middle1: '- (', middle2: '+', after: ')' },
    { before: '', middle1: '- (', middle2: '-', after: ')' },
    { before: '', middle1: '- (', middle2: '*', after: ')' },
    { before: '', middle1: '- (', middle2: '/', after: ')' },
    { before: '', middle1: '* (', middle2: '+', after: ')' },
    { before: '', middle1: '* (', middle2: '-', after: ')' },
    { before: '', middle1: '* (', middle2: '*', after: ')' },
    { before: '', middle1: '* (', middle2: '/', after: ')' },
    { before: '', middle1: '/ (', middle2: '+', after: ')' },
    { before: '', middle1: '/ (', middle2: '-', after: ')' },
    { before: '', middle1: '/ (', middle2: '*', after: ')' },
    { before: '', middle1: '/ (', middle2: '/', after: ')' }
];

let currentExpressionIndex = Math.floor(Math.random() * expressions.length);
let currentIndexToShow = 0;
let quantityExpressionsToShow = 5;

// Função para mostrar a expressão
function showExpression() {
    // Obtém os elementos das expressões
    const expressionBefore = document.querySelector('.expression-before');
    const expressionMiddle1 = document.querySelector('.expression-middle-1');
    const expressionMiddle2 = document.querySelector('.expression-middle-2');
    const expressionAfter = document.querySelector('.expression-after');

    // Atualiza as expressões conforme o índice atual
    expressionBefore.innerText = expressions[currentExpressionIndex].before;
    expressionMiddle1.innerText = expressions[currentExpressionIndex].middle1;
    expressionMiddle2.innerText = expressions[currentExpressionIndex].middle2;
    expressionAfter.innerText = expressions[currentExpressionIndex].after;

    // Gerar um índice aleatório do array expressions
    currentExpressionIndex = Math.floor(Math.random() * expressions.length);
    currentIndexToShow++
    console.log('currentIndexToShow')
    console.log(currentIndexToShow)
    // Se todas as expressões foram mostradas, limpa as expressões e restaura o estado original
    if (currentIndexToShow >= quantityExpressionsToShow) {
        
        setTimeout(() => {
            expressionBefore.innerText = '';  // Limpa as expressões
            expressionMiddle1.innerText = '';
            expressionMiddle2.innerText = '';
            expressionAfter.innerText = '';
        }, 500);
        
    }
}

// Função para iniciar a exibição das expressões
function displayExpressionsTips() {
    console.log(diceList.firstDice.value)
    console.log(diceList.secondDice.value)
    console.log(diceList.thirdDice.value)
    // Atualizando o conteúdo das divs dos dados (dices)
    document.getElementById(diceList.firstDice.element).innerText = diceList.firstDice.value;
    document.getElementById(diceList.secondDice.element).innerText = diceList.secondDice.value;
    document.getElementById(diceList.thirdDice.element).innerText = diceList.thirdDice.value;

    // Intervalo para exibir as expressões em 0.3 segundos
    const interval = setInterval(() => {
        showExpression();
        if (currentIndexToShow >= quantityExpressionsToShow) {
            currentExpressionIndex = currentExpressionIndex = Math.floor(Math.random() * expressions.length);
            currentIndexToShow = 0;
            clearInterval(interval);  // Para o loop após exibir todas as expressões

        }
    }, 500);  // Intervalo de 0.3 segundos entre exibições
}

function updateChoices(firstDice = '', secondDice = '', thirdDice = '', value = '', success = false) {
    const choicesPayload = {
        firstDice, 
        secondDice, 
        thirdDice, 
        value,
        success
    }

    choices.push(choicesPayload)
    renderChoices()
}

function renderChoices() {
    const choicesUl = document.getElementById('choices-ul');
    choicesUl.innerHTML = ''; // Clear the current list

    // Loop through the reversed choices array and create list items
    choices.slice().reverse().forEach((choice, index) => {
        
        const listItem = document.createElement('li');
        listItem.className = 'choice-item';
        listItem.innerHTML = `
            ${choices.length - index}.  
           ${choice.success ? '<i class="fas fa-check-circle successIconChoosed" aria-hidden="true"></i>' : '<i class="fas fa-heart-broken fa-icon heartIconChoosed" aria-hidden="true"></i>'}
            [${choice.firstDice}] 
            [${choice.secondDice}] 
            [${choice.thirdDice}] = 
            [${choice.value}]
            
        `;
        choicesUl.appendChild(listItem);
    });
}

window.onload = () => {
    document.getElementById('new-game-button').style.display = 'block';
    document.getElementById('jump-button').style.display = 'none';
    audioGameStart.preload = 'auto';
    audioWrongAnswer.preload = 'auto';
    audioCorrectAnswer.preload = 'auto';
};
