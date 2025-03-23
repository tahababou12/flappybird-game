export class Bird {
  public position: { x: number; y: number };
  public width: number = 34;
  public height: number = 24;
  public velocity: number = 0;
  public gravity: number;
  public flapStrength: number = -5;
  private frameIndex: number = 0;
  private frameCount: number = 0;
  private frameDelay: number = 5;
  private sprites: HTMLImageElement[] = [];
  private spriteLoaded: boolean = false;

  constructor(x: number, y: number, gravity: number) {
    this.position = { x, y };
    this.gravity = gravity;
    this.loadSprites();
  }

  private loadSprites(): void {
    const birdColors = ['yellow', 'blue', 'red'];
    const randomColor = birdColors[Math.floor(Math.random() * birdColors.length)];
    
    for (let i = 0; i < 3; i++) {
      const sprite = new Image();
      sprite.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="34" height="24" viewBox="0 0 34 24"><g fill="none"><path fill="${randomColor === 'yellow' ? '%23FFDB15' : randomColor === 'blue' ? '%2357D4FA' : '%23FE2C54'}" d="M12 0h14a8 8 0 0 1 8 8v8a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8v-4a4 4 0 0 1 4-4h2a6 6 0 0 0 6-6V0z"/><circle cx="26" cy="10" r="2" fill="white"/><circle cx="26" cy="10" r="1" fill="black"/><path fill="orange" d="M8 12h6l-3 6z"/><path fill="white" d="M0 8h8v4H0z"/></g></svg>`;
      this.sprites.push(sprite);
      
      // Ensure at least one sprite is loaded
      if (i === 0) {
        sprite.onload = () => {
          this.spriteLoaded = true;
        };
      }
    }
  }

  public flap(): void {
    this.velocity = this.flapStrength;
  }

  public update(): void {
    // Apply gravity
    this.velocity += this.gravity;
    this.position.y += this.velocity;
    
    // Animation
    this.frameCount++;
    if (this.frameCount >= this.frameDelay) {
      this.frameCount = 0;
      this.frameIndex = (this.frameIndex + 1) % this.sprites.length;
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    // Calculate rotation based on velocity
    const rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, this.velocity * 0.1));
    
    ctx.save();
    ctx.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
    ctx.rotate(rotation);
    
    if (this.spriteLoaded) {
      ctx.drawImage(
        this.sprites[this.frameIndex],
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
    } else {
      // Fallback if image doesn't load
      ctx.fillStyle = 'yellow';
      ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    }
    
    ctx.restore();
  }
}
