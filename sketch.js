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
    fill(filledNote.color);
    rect(filledNote.x, filledNote.y, SCALEX, SCALEY);
  });
  for (let i = 0; i < WIDTH / SCALEX; i++) {
    for (let j = 0; j < HEIGHT / SCALEY; j++) {
      noFill();
      stroke("#000");
      strokeWeight(0.1);
      rect(i * SCALEX, j * SCALEY, SCALEX, SCALEY);
    }
  }
}

function keyPressed() {
  keys.forEach((key, i) => {
    if (keyCode === eventKeys[i]) {
      currentOctave = Number(window.myStorage.currentOctave);
      let indexOfKey = keys.indexOf(key);
      let octaveHeight = SCALEY * 8;
      //something wrong with calculating the scale for the filledNotes
      let y = currentOctave * octaveHeight + 1 + (indexOfKey + 1) * 8;
      y = Math.abs(HEIGHT - y);
      filledNotes.push(FilledNote(pos, y, "#000"));
    }
  });
}
