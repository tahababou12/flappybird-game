import { Bird } from './Bird';
import { Pipe } from './Pipe';
import { Background } from './Background';
import { GameState } from './GameState';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private bird: Bird;
  private pipes: Pipe[] = [];
  private background: Background;
  private score: number = 0;
  private frameCount: number = 0;
  private lastPipeFrame: number = 0;
  private gameState: GameState = GameState.Start;
  private scoreElement: HTMLElement;
  private gravity: number = 0.25;
  private pipeGap: number = 120;
  private pipeSpawnInterval: number = 90;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.bird = new Bird(50, this.canvas.height / 2 - 12, this.gravity);
    this.background = new Background(this.canvas.width, this.canvas.height);
    this.scoreElement = document.getElementById('score')!;

    // Event listeners
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        this.handleInput();
      }
    });

    this.canvas.addEventListener('click', () => {
      this.handleInput();
    });

    // Mobile touch support
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.handleInput();
    });
  }

  private handleInput(): void {
    switch (this.gameState) {
      case GameState.Start:
        this.gameState = GameState.Playing;
        break;
      case GameState.Playing:
        this.bird.flap();
        break;
      case GameState.GameOver:
        this.reset();
        this.gameState = GameState.Start;
        break;
    }
  }

  private reset(): void {
    this.bird = new Bird(50, this.canvas.height / 2 - 12, this.gravity);
    this.pipes = [];
    this.score = 0;
    this.frameCount = 0;
    this.lastPipeFrame = 0;
    this.updateScore();
  }

  private updateScore(): void {
    this.scoreElement.textContent = `Score: ${this.score}`;
  }

  private spawnPipe(): void {
    const minHeight = 50;
    const maxHeight = this.canvas.height - this.pipeGap - minHeight;
    const height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
    
    this.pipes.push(new Pipe(this.canvas.width, 0, height, 'top'));
    this.pipes.push(new Pipe(this.canvas.width, height + this.pipeGap, this.canvas.height - height - this.pipeGap, 'bottom'));
  }

  private update(): void {
    if (this.gameState === GameState.Playing) {
      this.frameCount++;
      
      // Spawn pipes
      if (this.frameCount - this.lastPipeFrame > this.pipeSpawnInterval) {
        this.spawnPipe();
        this.lastPipeFrame = this.frameCount;
      }
      
      // Update bird
      this.bird.update();
      
      // Update pipes
      for (let i = 0; i < this.pipes.length; i++) {
        this.pipes[i].update();
        
        // Check if bird passed a pipe
        if (this.pipes[i].position.x + this.pipes[i].width < this.bird.position.x && !this.pipes[i].passed && this.pipes[i].type === 'top') {
          this.pipes[i].passed = true;
          this.score++;
          this.updateScore();
        }
        
        // Check collision
        if (this.checkCollision(this.bird, this.pipes[i])) {
          this.gameState = GameState.GameOver;
        }
      }
      
      // Remove pipes that are off screen
      this.pipes = this.pipes.filter(pipe => pipe.position.x > -pipe.width);
      
      // Check if bird hit the ground or ceiling
      if (this.bird.position.y <= 0 || this.bird.position.y + this.bird.height >= this.canvas.height) {
        this.gameState = GameState.GameOver;
      }
    }
  }

  private checkCollision(bird: Bird, pipe: Pipe): boolean {
    return (
      bird.position.x < pipe.position.x + pipe.width &&
      bird.position.x + bird.width > pipe.position.x &&
      bird.position.y < pipe.position.y + pipe.height &&
      bird.position.y + bird.height > pipe.position.y
    );
  }

  private render(): void {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw background
    this.background.draw(this.ctx);
    
    // Draw pipes
    for (const pipe of this.pipes) {
      pipe.draw(this.ctx);
    }
    
    // Draw bird
    this.bird.draw(this.ctx);
    
    // Draw game state messages
    if (this.gameState === GameState.Start) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.fillStyle = 'white';
      this.ctx.font = '20px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Click to Start', this.canvas.width / 2, this.canvas.height / 2);
    } else if (this.gameState === GameState.GameOver) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.fillStyle = 'white';
      this.ctx.font = '20px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Game Over', this.canvas.width / 2, this.canvas.height / 2 - 20);
      this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
      this.ctx.fillText('Click to Restart', this.canvas.width / 2, this.canvas.height / 2 + 60);
    }
  }

  private gameLoop(): void {
    this.update();
    this.render();
    requestAnimationFrame(() => this.gameLoop());
  }

  public start(): void {
    this.updateScore(); // Initialize score display
    this.gameLoop();
  }
}
