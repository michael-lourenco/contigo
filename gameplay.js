
document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('.menu-links').classList.toggle('active');
});

function getRandomNumber(largestNumberPossible) {
    return Math.floor(Math.random() * Number(largestNumberPossible)) + 1;
}

let errorCount = 0;
let successCount = 0;
let generalTimer;
let timeRemaining = 180;
const possibleNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 44, 45, 48, 50, 54, 55, 60, 64, 66, 72, 75, 80, 90, 96, 100, 108, 120, 125, 144, 150, 180];
let remainNumbers = []
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
    remainNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 44, 45, 48, 50, 54, 55, 60, 64, 66, 72, 75, 80, 90, 96, 100, 108, 120, 125, 144, 150, 180]
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
}

function startNewGame() {
    resetGame();
}

function generateNewNumbers(diceList) {
    Object.keys(diceList).forEach(key => {
        const randomNumber = getRandomNumber(6);
        diceList[key].value = randomNumber;
        document.getElementById(diceList[key].element).innerText = randomNumber;
    });
}

function validate(value, button) {
    const calculoData = new CalculoData();
    const resultado = calculoData.resolve(diceList.firstDice.value, diceList.secondDice.value, diceList.thirdDice.value, value);

    if (resultado.valorEncontrado) {
        document.getElementById('result').innerText = 'Resultado existe';
        button.classList.add('authenticated');
        button.disabled = true;
        successCount++;
        removeNumber(value);
        document.getElementById('successes').innerText = `${successCount}`;
    } else {
        document.getElementById('result').innerText = 'Resultado não existe';
        errorCount++;
        document.getElementById('errors').innerText = `${errorCount}`;
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

    if (!resultExists) {
        document.getElementById('result').innerText = 'Pulou corretamente';
        document.getElementById('successes').innerText = `${successCount}`;
    } else {
        document.getElementById('result').innerText = 'Pulou errado';
        errorCount++;
        document.getElementById('errors').innerText = `${errorCount}`;
        if (errorCount >= 3) {
            endGame({ elementGameOver: 'game-over', elementNewGameButton: 'new-game-button', elementJumpButton: 'jump-button'});
            return;
        }
    }

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

window.onload = () => {
    document.getElementById('new-game-button').style.display = 'block';
    document.getElementById('jump-button').style.display = 'none';
};
