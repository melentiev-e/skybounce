import * as PIXI from 'pixi.js';
import * as math from '@pixi/math';
import '@pixi/math-extras';

// Create a PixiJS application
const app = new PIXI.Application({ width: 600, height: 800 });

// Add the PixiJS application to the HTML document
document.body.appendChild(app.view as unknown as HTMLElement);

// Create a red square
const square = new PIXI.Graphics();
square.beginFill(0xFF0000);
square.drawRect(0, 0, 100, 100);
square.endFill();
square.pivot.set(50, 100);

// Set the ground position
const groundY = app.screen.height;
// initial position - bottom, middle
let location = new math.Point(app.screen.width / 2, groundY);
square.x = location.x;
square.y = location.y;
let acceleration = new math.Point(0.3, -9);
const mass = 1;
let gravity = new math.Point(0, 0.1 * mass);

// Add the square to the stage
app.stage.addChild(square);

let velocity = new math.Point(0,0);

// Animate the square
app.ticker.add((dt) => {
  velocity = velocity.add(acceleration);
  velocity = velocity.add(gravity);
  acceleration = acceleration.multiply(new math.Point(0, 0));

  checkEdges();
  
  location = location.add(velocity);
  square.x = location.x;
  square.y = location.y;

});

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    acceleration.set(-0.3, -4);
  } else if (e.key === 'ArrowRight') {

    acceleration.set(0.3, -4);
  }
});


function checkEdges() {
  // Bounce off the ground
  if (location.y > groundY) {
    location.y = groundY;
    velocity.y = 0;
    velocity.x = 0;
  }
  // Bounce off the left wall
  if (location.x < 0) {
    location.x = 0;
    velocity.x *= -1;
  }
  // Bounce off the right wall
  if (location.x > app.screen.width) {
    location.x = app.screen.width;
    velocity.x *= -1;
  }
  // Bounce off the top wall
  if (location.y < 0) {
    location.y = 0;
    velocity.y *= -1;
  }
}

