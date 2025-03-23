export class Pipe {
  public position: { x: number; y: number };
  public width: number = 52;
  public height: number;
  public speed: number = 2;
  public passed: boolean = false;
  public type: 'top' | 'bottom';

  constructor(x: number, y: number, height: number, type: 'top' | 'bottom') {
    this.position = { x, y };
    this.height = height;
    this.type = type;
  }

  public update(): void {
    this.position.x -= this.speed;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    // Draw pipe body
    ctx.fillStyle = '#74BF2E';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    
    // Draw pipe border
    ctx.strokeStyle = '#2C9C0E';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
    
    // Draw pipe cap
    const capHeight = 24;
    const capWidth = 60;
    const capX = this.position.x - (capWidth - this.width) / 2;
    
    let capY;
    if (this.type === 'top') {
      capY = this.position.y + this.height - capHeight;
    } else {
      capY = this.position.y;
    }
    
    ctx.fillStyle = '#74BF2E';
    ctx.fillRect(capX, capY, capWidth, capHeight);
    
    ctx.strokeStyle = '#2C9C0E';
    ctx.lineWidth = 2;
    ctx.strokeRect(capX, capY, capWidth, capHeight);
  }
}
