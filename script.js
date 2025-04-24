let targetWord = '';
let currentRow = 0;
let currentTile = 0;
let gameOver = false;

const board = document.getElementById('board');
const message = document.getElementById('message');
const setupSection = document.querySelector('.setup-section');
const gameSection = document.querySelector('.game-section');
const startButton = document.getElementById('startGame');
const targetWordInput = document.getElementById('targetWord');

// Initialize the game board
function initializeBoard() {
    board.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        for (let j = 0; j < 5; j++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            row.appendChild(tile);
        }
        board.appendChild(row);
    }
}

// Start the game
startButton.addEventListener('click', () => {
    const word = targetWordInput.value.toUpperCase();
    if (word.length !== 5) {
        message.textContent = 'Please enter a 5-letter word';
        return;
    }
    targetWord = word;
    currentRow = 0;
    currentTile = 0;
    gameOver = false;
    message.textContent = '';
    setupSection.style.display = 'none';
    gameSection.style.display = 'block';
    initializeBoard();
});

// Handle keyboard input
document.addEventListener('keydown', (e) => {
    if (gameOver) return;

    if (e.key === 'Enter') {
        submitGuess();
    } else if (e.key === 'Backspace') {
        deleteLetter();
    } else if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
        insertLetter(e.key.toUpperCase());
    }
});

// Handle virtual keyboard clicks
document.querySelectorAll('.keyboard button').forEach(button => {
    button.addEventListener('click', () => {
        if (gameOver) return;

        const key = button.textContent;
        if (key === 'Enter') {
            submitGuess();
        } else if (key === 'Backspace') {
            deleteLetter();
        } else {
            insertLetter(key);
        }
    });
});

function insertLetter(letter) {
    if (currentTile < 5) {
        const row = board.children[currentRow];
        const tile = row.children[currentTile];
        tile.textContent = letter;
        currentTile++;
    }
}

function deleteLetter() {
    if (currentTile > 0) {
        currentTile--;
        const row = board.children[currentRow];
        const tile = row.children[currentTile];
        tile.textContent = '';
    }
}

function submitGuess() {
    if (currentTile !== 5) {
        message.textContent = 'Word must be 5 letters';
        return;
    }

    const row = board.children[currentRow];
    const guess = Array.from(row.children).map(tile => tile.textContent).join('');
    
    // Check each letter
    const targetLetters = targetWord.split('');
    const guessLetters = guess.split('');
    
    // First pass: mark correct letters
    guessLetters.forEach((letter, index) => {
        const tile = row.children[index];
        if (letter === targetLetters[index]) {
            tile.classList.add('correct');
            updateKeyboard(letter, 'correct');
            targetLetters[index] = null; // Mark as used
        }
    });
    
    // Second pass: mark present letters
    guessLetters.forEach((letter, index) => {
        const tile = row.children[index];
        if (!tile.classList.contains('correct')) {
            const targetIndex = targetLetters.indexOf(letter);
            if (targetIndex !== -1) {
                tile.classList.add('present');
                updateKeyboard(letter, 'present');
                targetLetters[targetIndex] = null; // Mark as used
            } else {
                tile.classList.add('absent');
                updateKeyboard(letter, 'absent');
            }
        }
    });

    if (guess === targetWord) {
        gameOver = true;
        message.textContent = 'Congratulations! You won!';
    } else if (currentRow === 5) {
        gameOver = true;
        message.textContent = `Game Over! The word was ${targetWord}`;
    } else {
        currentRow++;
        currentTile = 0;
    }
}

function updateKeyboard(letter, status) {
    const buttons = document.querySelectorAll('.keyboard button');
    buttons.forEach(button => {
        if (button.textContent === letter) {
            button.classList.add(status);
        }
    });
} 