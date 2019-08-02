let NUM_OF_KEYS_IN_OCTAVE,
  NUM_OF_OCTAVES,
  WIDTH,
  HEIGHT,
  SCALEX,
  SCALEY,
  MIN_NOTE_LENGTH; //
const ALPHA_NAMES = ["A", "B", "C", "D", "E", "F", "G"];
const keys = ["z", "x", "c", "v", "b", "n", "m", ","];
const NOTECOLORS = [
  "#8bc34a", //green
  "#26a69a", //teal
  "#ab47bc", //purple
  "#26c6da", //cyan
  "#d4e157", //lime green
  "#ff9800", //owange
  "#ff80ab", //pink
  "#8bc34a" //green
];
const eventKeys = [90, 88, 67, 86, 66, 78, 77, 188];
let filledNotes = [];
let pos;

const FilledNote = (_x, _y, _color) => {
  const x = _x,
    y = _y,
    color = _color;
  return {
    draw: () => {
      noStroke();
      fill(color);
      rect(x, y, SCALEX, SCALEY + 4);
      noFill();
      stroke("#000");
      strokeWeight(1);
      rect(x, y, SCALEX, SCALEY + 4);
    }
  };
};

const drawVerticalLine = (x, _strokeWeight) => {
  strokeWeight(_strokeWeight);
  line(x, HEIGHT, x, 0);
};

function setup() {
  NUM_OF_KEYS_IN_OCTAVE = 12;
  NUM_OF_OCTAVES = 8;
  WIDTH = 704;
  HEIGHT = 440;
  SCALEX = WIDTH / window.myStorage.VALID_NOTE_TIMES.length;
  SCALEY = HEIGHT / (NUM_OF_KEYS_IN_OCTAVE * NUM_OF_OCTAVES);
  MIN_NOTE_LENGTH = window.myStorage.VALID_NOTE_TIMES[1];
  let canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent("canvas-holder");
  background(240, 240, 240);
}

function draw() {
  pos = (Tone.Transport.getSecondsAtTime() * WIDTH) / Tone.Transport.loopEnd;
  background(240);
  filledNotes.forEach(filledNote => filledNote.draw());
  stroke("#000");
  window.myStorage.VALID_NOTE_TIMES.forEach(noteTime =>
    drawVerticalLine((noteTime * WIDTH) / Tone.Transport.loopEnd, 0.5)
  );
  drawVerticalLine(pos, 3);
}

function keyPressed() {
  keys.forEach((key, i) => {
    if (keyCode === eventKeys[i]) {
      const currentOctave = Number(window.myStorage.currentOctave);
      const currentKey = window.myStorage.currentKey;
      const numOfKeysInScale = window.myStorage.numOfNotesInCurrentScale;
      const indexOfCurrentKey = ALPHA_NAMES.indexOf(currentKey);
      let indexOfKey = keys.indexOf(key);
      let octaveHeight = SCALEY * (NUM_OF_KEYS_IN_OCTAVE - 1);
      let y =
        currentOctave * octaveHeight +
        indexOfKey * (NUM_OF_KEYS_IN_OCTAVE / numOfKeysInScale) * SCALEY +
        indexOfCurrentKey * SCALEY;
      y = Math.abs(HEIGHT - y - SCALEY);
      filledNotes.push(FilledNote(pos, y, NOTECOLORS[indexOfKey]));
    }
  });
}
