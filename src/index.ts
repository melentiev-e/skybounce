import * as PIXI from 'pixi.js';
import * as math from '@pixi/math';
import '@pixi/math-extras';
import { lineIntersection, segmentIntersection } from '@pixi/math-extras';

// Create a PixiJS application
const app = new PIXI.Application({
  width: 600, height: 800
});
app.stage.eventMode = 'dynamic'
app.stage.width = 600;
app.stage.height = 800;
// Add the PixiJS application to the HTML document
document.body.appendChild(app.view as unknown as HTMLElement);
app.stage.on('pointermove', pointerMoveHandler);
// Create a red square
const square = new PIXI.Graphics();
square.beginFill(0xFF0000);
square.drawRect(0, 0, 100, 100);
square.endFill();
square.pivot.set(50, 50);

const shelve = new PIXI.Graphics();
function drawShelve(color: PIXI.ColorSource | undefined) {
  shelve.clear();
  shelve.beginFill(color);
  shelve.drawRect(0, 0, 100, 10);
  shelve.endFill();
}
drawShelve(0x00FF00);
shelve.pivot.set(0, 10);
shelve.x = 0;
shelve.y = 600;

// Set the ground position
const groundY = app.screen.height - 50;
// initial position - bottom, middle
let location = new math.Point(app.screen.width / 2, groundY);
square.x = location.x;
square.y = location.y;
let acceleration = new math.Point(0, -0);
const mass = 3;
let gravity = new math.Point(0, 0.1 * mass);

const velocityVector = new PIXI.Graphics();
let lastLines : PIXI.Point[][] = [];
// Add the square to the stage
app.stage.addChild(square);
app.stage.addChild(shelve);
app.stage.addChild(velocityVector);

let velocity = new math.Point(0, 0);

const squareBounds = new PIXI.Graphics();
app.stage.addChild(squareBounds);

function getNextLocation() {
  const v = velocity.add(acceleration).add(gravity);
  return location.add(v);
}
let mouseLocation = new PIXI.Point(0, 0);
// Animate the square
app.ticker.add((dt) => {

  // move square to cursor position
  square.x = mouseLocation.x;
  square.y = mouseLocation.y;


  velocity = velocity.add(acceleration);
  velocity = velocity.add(gravity);
  acceleration = acceleration.multiply(new math.Point(0, 0));

  location = location.add(velocity);
  square.x = location.x;
  square.y = location.y;

  // draw velocity vector
  velocityVector.clear();
  velocityVector.lineStyle(5, 0xFFFFFF);
  velocityVector.moveTo(location.x, location.y);
  const nextLocation = getNextLocation();
  velocityVector.lineTo(nextLocation.x, nextLocation.y);
  velocityVector.endFill();

  // calculate velocity vector angle
  const angle = Math.atan2(velocity.y, velocity.x);
  // rotate square
  square.rotation = angle;

  // velocityVector.clear();
  // velocityVector.lineStyle(5, 0xFFFFFF);
  // velocityVector.position.set(200,200)
  // velocityVector.lineTo(0,100)
  // velocityVector.rotation += PIXI.DEG_TO_RAD * 1;
  // console.log(velocityVector.currentPath.points)
  // velocityVector.endFill(); 
  checkEdges();
  // check if square bounce off the bottom of the shelve
  //checkShelve();
  if (checkShelve())
    {
      drawShelve(0xFF0000);
      // draw lines from lastLines
      lastLines.forEach(line => {
      const line1 = new PIXI.Graphics();
      line1.lineStyle(5, 0xFFFFFF);
      line1.moveTo(line[0].x, line[0].y);
      line1.lineTo(line[1].x, line[1].y);
      line1.endFill();
      app.stage.addChild(line1);
      });

      
      app.ticker.stop();
    }
  else
    {
      drawShelve(0x00FF00);
    }


});

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    velocity.set(-2, -10);
  } else if (e.key === 'ArrowRight') {

    velocity.set(2, -10);
  }
});

/**
 * Check collision between square and shelve 
 * 
 */
function checkShelve() {

  const sides = ['top', 'right', 'bottom', 'left']
  const pointsOfSquare = [
    square.toGlobal(new PIXI.Point(0, 0)),
    square.toGlobal(new PIXI.Point(square.width, 0)),
    square.toGlobal(new PIXI.Point(square.width, square.height)),
    square.toGlobal(new PIXI.Point(0, square.height))
  ];

  const pointsOfShelve = [
    shelve.toGlobal(new PIXI.Point(0, 0)),
    shelve.toGlobal(new PIXI.Point(shelve.width, 0)),
    shelve.toGlobal(new PIXI.Point(shelve.width, shelve.height)),
    shelve.toGlobal(new PIXI.Point(0, shelve.height))];

   // start console log group

   lastLines = [];
  for (let i = 0; i < pointsOfSquare.length; i++) {
    for (let j = 0; j < pointsOfShelve.length; j++) {

      let pointsLine1 = [pointsOfSquare[i], pointsOfSquare[(i + 1) % pointsOfSquare.length]];
      let pointsLine2 = [pointsOfShelve[j], pointsOfShelve[(j + 1) % pointsOfShelve.length]];

      const intersectionPoint = segmentIntersection(pointsLine1[0], pointsLine1[1], pointsLine2[0], pointsLine2[1]);
      if (!isNaN(intersectionPoint.x)) {
        lastLines = [...lastLines, pointsLine1, pointsLine2];
      }
    }
  }
  if(lastLines.length > 0)
    return true;
  // end console log group

  return false;



}


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

function pointerMoveHandler(event: PIXI.FederatedPointerEvent): void {
  mouseLocation = event.global
}

