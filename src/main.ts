import './style.css';
import { Game } from './game/Game';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1 class="game-title">Flappy Bird</h1>
    <canvas id="game-canvas" width="320" height="480"></canvas>
    <div class="score-display">Score: <span id="score">0</span></div>
    <div class="instructions">
      Press SPACE to flap<br>
      Click or tap to start
    </div>
  </div>
`;

// Initialize the game
const game = new Game('game-canvas');
game.start();
