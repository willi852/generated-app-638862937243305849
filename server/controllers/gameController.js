const express = require('express');
const router = express.Router();

// Simple game state
let gameState = Array(9).fill(null);
let currentPlayer = 'X';
let winner = null;

// Reset game to initial state
const resetGame = () => {
  gameState = Array(9).fill(null);
  currentPlayer = 'X';
  winner = null;
};

// Check if there's a winner
const checkWinner = (squares) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

// API endpoints
router.get('/state', (req, res) => {
  try {
    res.json({ gameState, currentPlayer, winner });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching game state' });
  }
});

router.post('/move', (req, res) => {
  try {
    const { position } = req.body;
    
    if (winner || gameState[position]) {
      return res.status(400).json({ message: 'Invalid move' });
    }

    gameState[position] = currentPlayer;
    winner = checkWinner(gameState);

    if (!winner) {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }

    res.json({ gameState, currentPlayer, winner });
  } catch (error) {
    res.status(500).json({ message: 'Error processing move' });
  }
});

router.post('/reset', (req, res) => {
  try {
    resetGame();
    res.json({ gameState, currentPlayer, winner });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting game' });
  }
});

module.exports = router;