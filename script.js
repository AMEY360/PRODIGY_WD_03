let cells = document.querySelectorAll('.cell');
let currentPlayer = 'X';
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

let gameMode = 'PvP';
let aiDifficulty = 'Easy';

let scoreX = 0, scoreO = 0, scoreDraw = 0;

const statusDisplay = document.getElementById('status');
const scoreXDisplay = document.getElementById('scoreX');
const scoreODisplay = document.getElementById('scoreO');
const scoreDrawDisplay = document.getElementById('scoreDraw');
const playerOScore = document.getElementById('playerOScore');

const winningConditions = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

document.getElementById('pvp').addEventListener('click', () => {
    gameMode = 'PvP';
    resetGame();
    document.getElementById('difficulty-selection').style.display = 'none';
    playerOScore.textContent = 'Player O: ';
});

document.getElementById('pvai').addEventListener('click', () => {
    gameMode = 'PvAI';
    resetGame();
    document.getElementById('difficulty-selection').style.display = 'block';
    playerOScore.textContent = 'AI (O): ';
});

document.getElementById('easy').addEventListener('click', () => aiDifficulty = 'Easy');
document.getElementById('hard').addEventListener('click', () => aiDifficulty = 'Hard');

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
document.getElementById('reset').addEventListener('click', resetGame);

function handleCellClick(e) {
    const clickedCell = e.target;
    const clickedIndex = clickedCell.getAttribute('data-index');

    if (gameState[clickedIndex] !== "" || !gameActive) return;

    gameState[clickedIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    if (checkWin()) {
        highlightWinningCells();
        statusDisplay.textContent = `${currentPlayer} Wins! 🎉`;
        updateScore(currentPlayer);
        gameActive = false;
        return;
    }

    if (!gameState.includes("")) {
        statusDisplay.textContent = "It's a Draw!";
        scoreDraw++;
        scoreDrawDisplay.textContent = scoreDraw;
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;

    if (gameMode === 'PvAI' && currentPlayer === 'O') {
        setTimeout(aiMove, 500);
    }
}

function aiMove() {
    if (!gameActive) return;

    let moveIndex;

    if (aiDifficulty === 'Easy') {
        let emptyCells = [];
        gameState.forEach((cell, index) => {
            if (cell === "") emptyCells.push(index);
        });
        moveIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    } else {
        moveIndex = minimax(gameState, 'O').index;
    }

    if (moveIndex === undefined) return;

    gameState[moveIndex] = currentPlayer;
    cells[moveIndex].textContent = currentPlayer;

    if (checkWin()) {
        highlightWinningCells();
        statusDisplay.textContent = `${currentPlayer} Wins! 🎉`;
        updateScore(currentPlayer);
        gameActive = false;
        return;
    }

    if (!gameState.includes("")) {
        statusDisplay.textContent = "It's a Draw!";
        scoreDraw++;
        scoreDrawDisplay.textContent = scoreDraw;
        gameActive = false;
        return;
    }

    currentPlayer = 'X';
    statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
}

function minimax(newBoard, player) {
    let availSpots = newBoard.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);

    if (checkWinner(newBoard, 'X')) return { score: -10 };
    if (checkWinner(newBoard, 'O')) return { score: 10 };
    if (availSpots.length === 0) return { score: 0 };

    let moves = [];

    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if (player === 'O') {
            let result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            let result = minimax(newBoard, 'O');
            move.score = result.score;
        }

        newBoard[availSpots[i]] = "";
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function checkWinner(board, player) {
    return winningConditions.some(condition => {
        return condition.every(index => board[index] === player);
    });
}

function checkWin() {
    return winningConditions.some(condition => {
        return condition.every(index => gameState[index] === currentPlayer);
    });
}

function highlightWinningCells() {
    winningConditions.forEach(condition => {
        if (condition.every(index => gameState[index] === currentPlayer)) {
            condition.forEach(index => cells[index].classList.add('winning'));
        }
    });
}

function updateScore(winner) {
    if (winner === 'X') {
        scoreX++;
        scoreXDisplay.textContent = scoreX;
    } else if (winner === 'O') {
        scoreO++;
        scoreODisplay.textContent = scoreO;
    }
}

function resetGame() {
    gameState = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('winning');
    });
    currentPlayer = 'X';
    gameActive = true;
    statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
}
