export class Background {
  private width: number;
  private height: number;
  private groundHeight: number = 80;
  private cloudPositions: { x: number; y: number; size: number }[] = [];
  private buildingPositions: { x: number; width: number; height: number }[] = [];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    
    // Generate clouds
    for (let i = 0; i < 5; i++) {
      this.cloudPositions.push({
        x: Math.random() * this.width,
        y: Math.random() * (this.height / 2 - 30),
        size: 20 + Math.random() * 30
      });
    }
    
    // Generate buildings
    let x = 0;
    while (x < this.width) {
      const width = 20 + Math.random() * 40;
      const height = 40 + Math.random() * 60;
      this.buildingPositions.push({
        x,
        width,
        height
      });
      x += width + 5;
    }
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    // Sky
    ctx.fillStyle = '#71C5CF';
    ctx.fillRect(0, 0, this.width, this.height);
    
    // Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (const cloud of this.cloudPositions) {
      ctx.beginPath();
      ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
      ctx.arc(cloud.x + cloud.size * 0.5, cloud.y - cloud.size * 0.3, cloud.size * 0.7, 0, Math.PI * 2);
      ctx.arc(cloud.x + cloud.size, cloud.y, cloud.size * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Buildings
    ctx.fillStyle = '#4D8A9E';
    for (const building of this.buildingPositions) {
      ctx.fillRect(
        building.x,
        this.height - this.groundHeight - building.height,
        building.width,
        building.height
      );
      
      // Windows
      ctx.fillStyle = '#FFDB15';
      const windowSize = 5;
      const windowGap = 8;
      const windowRows = Math.floor(building.height / windowGap) - 1;
      const windowCols = Math.floor(building.width / windowGap) - 1;
      
      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
          // Only draw some windows (random pattern)
          if (Math.random() > 0.5) {
            ctx.fillRect(
              building.x + windowGap + col * windowGap,
              this.height - this.groundHeight - building.height + windowGap + row * windowGap,
              windowSize,
              windowSize
            );
          }
        }
      }
      
      ctx.fillStyle = '#4D8A9E';
    }
    
    // Ground
    ctx.fillStyle = '#DED895';
    ctx.fillRect(0, this.height - this.groundHeight, this.width, this.groundHeight);
    
    // Grass
    ctx.fillStyle = '#8DD853';
    ctx.fillRect(0, this.height - this.groundHeight, this.width, 15);
    
    // Ground pattern
    ctx.fillStyle = '#C9B268';
    for (let i = 0; i < this.width; i += 30) {
      ctx.fillRect(i, this.height - this.groundHeight + 20, 15, 5);
      ctx.fillRect(i + 15, this.height - this.groundHeight + 40, 15, 5);
      ctx.fillRect(i, this.height - this.groundHeight + 60, 15, 5);
    }
  }
}
