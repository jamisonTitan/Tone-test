// import { getCurrentOctave } from "./index.js";

// console.log(getCurrentOctave());
let WIDTH, HEIGHT;
const keys = ["z", "x", "c", "v", "b", "n", "m", ","];
const eventKeys = [90, 88, 67, 86, 66, 78, 77, 188];
const SCALEX = 6;
const SCALEY = 6;
let filledNotes = [];
let pos;

const FilledNote = (_x, _y, _color) => {
  return {
    x: _x,
    y: _y,
    color: _color
  };
};

function setup() {
  WIDTH = 700;
  HEIGHT = WIDTH / 1.6;
  let canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent("canvas-holder");
  background(240, 240, 240);
}

function draw() {
  pos = (Tone.Transport.getSecondsAtTime() * WIDTH) / Tone.Transport.loopEnd;
  strokeWeight(2);
  background(255, 0, 255);
  line(pos, HEIGHT, pos, 0);
  filledNotes.forEach((filledNote, i) => {
    noStroke();
    fill(filledNote.color);
    rect(filledNote.x, filledNote.y, SCALEX, SCALEY);
  });
  for (let i = -SCALEX; i < WIDTH; i += SCALEX) {
    for (let j = -SCALEY; j < HEIGHT; j += SCALEY) {
      noFill();
      stroke("#000");
      strokeWeight(0.1);
      rect(i, j, SCALEX - 1, SCALEY - 1);
    }
  }
}

function keyPressed() {
  keys.forEach((key, i) => {
    if (keyCode === eventKeys[i]) {
      currentOctave = Number(window.myStorage.currentOctave);
      let indexOfKey = keys.indexOf(key);
      let numOfKeys = 8;
      let octaveHeight = SCALEY * numOfKeys;
      //something wrong with calculating the scale for the filledNotes
      let y = currentOctave * (octaveHeight + 1) + indexOfKey * SCALEY;
      y = Math.abs(HEIGHT - y) - SCALEY;
      filledNotes.push(FilledNote(pos, y, "#000"));
    }
  });
}
