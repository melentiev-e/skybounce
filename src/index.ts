import * as PIXI from 'pixi.js';

// Create a PixiJS application
const app = new PIXI.Application({ width: 800, height: 600 });

// Add the PixiJS application to the HTML document
document.body.appendChild(app.view as unknown as HTMLElement);

// Create a red square
const square = new PIXI.Graphics();
square.beginFill(0xFF0000);
square.drawRect(0, 0, 100, 100);
square.endFill();

// Add the square to the stage
app.stage.addChild(square);

// Animate the square
app.ticker.add(() => {
  square.x += 1;
  if (square.x > app.screen.width) {
    square.x = -square.width;
  }
});
