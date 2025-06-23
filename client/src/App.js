import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/App.css';
import Board from './components/Board';

function App() {
  const [gameState, setGameState] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [error, setError] = useState(null);

  const fetchGameState = async () => {
    try {
      const response = await axios.get('/api/game/state');
      setGameState(response.data.gameState);
      setCurrentPlayer(response.data.currentPlayer);
      setWinner(response.data.winner);
    } catch (err) {
      setError('Error fetching game state');
    }
  };

  useEffect(() => {
    fetchGameState();
  }, []);

  const handleCellClick = async (index) => {
    if (gameState[index] || winner) return;

    try {
      const response = await axios.post('/api/game/move', { position: index });
      setGameState(response.data.gameState);
      setCurrentPlayer(response.data.currentPlayer);
      setWinner(response.data.winner);
    } catch (err) {
      setError('Error processing move');
    }
  };

  const handleReset = async () => {
    try {
      const response = await axios.post('/api/game/reset');
      setGameState(response.data.gameState);
      setCurrentPlayer(response.data.currentPlayer);
      setWinner(response.data.winner);
      setError(null);
    } catch (err) {
      setError('Error resetting game');
    }
  };

  return (
    <div className="app">
      <h1>Tic-Tac-Toe (Triqui)</h1>
      {error && <div className="error">{error}</div>}
      <div className="status">
        {winner 
          ? `Winner: ${winner}` 
          : gameState.every(cell => cell) 
          ? 'Game Draw' 
          : `Current Player: ${currentPlayer}`}
      </div>
      <Board squares={gameState} onClick={handleCellClick} />
      <button className="reset-btn" onClick={handleReset}>Reset Game</button>
    </div>
  );
}

export default App;