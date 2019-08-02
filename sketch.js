let NUM_OF_KEYS_IN_OCTAVE, NUM_OF_OCTAVES, WIDTH, HEIGHT, SCALEX, SCALEY;
const ALPHA_NAMES = ["A", "B", "C", "D", "E", "F", "G"];
const keys = ["z", "x", "c", "v", "b", "n", "m", ","];
const NOTE_COLORS = [
  "#8bc34a", //green
  "#26a69a", //teal
  "#ab47bc", //purple
  "#26c6da", //cyan
  "#d4e157", //lime green
  "#ff9800", //owange
  "#ff80ab", //pink
  "#8bc34a" //green
];
const LOOP_LENGTH = Tone.Time("1m").toSeconds();
const MIN_NOTE_LENGTH = Tone.Time("8n").toSeconds();
const VALID_NOTE_TIMES = [
  ...Array(Math.floor(LOOP_LENGTH / MIN_NOTE_LENGTH) + 1)
] //empty array with indexes for values
  .map((_, i) => i)
  .map(noteTime => noteTime * MIN_NOTE_LENGTH);
const eventKeys = [90, 88, 67, 86, 66, 78, 77, 188];
let filledNotes = [];
let currPos;

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
  SCALEX = WIDTH / VALID_NOTE_TIMES.length;
  SCALEY = HEIGHT / (NUM_OF_KEYS_IN_OCTAVE * NUM_OF_OCTAVES);
  let canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent("canvas-holder");
  background(240, 240, 240);
}

function draw() {
  currPos =
    (Tone.Transport.getSecondsAtTime() * WIDTH) / Tone.Transport.loopEnd;
  background(240);
  filledNotes.forEach(filledNote => filledNote.draw());
  stroke("#000");
  VALID_NOTE_TIMES.forEach(noteTime =>
    drawVerticalLine((noteTime * WIDTH) / Tone.Transport.loopEnd, 0.5)
  );
  drawVerticalLine(currPos, 3);
}

function keyPressed() {
  keys.forEach((key, i) => {
    if (keyCode === eventKeys[i]) {
      const currentOctave = Number(window.myStorage.currentOctave);
      const currentKey = window.myStorage.currentKey;
      const numOfKeysInScale = window.myStorage.numOfNotesInCurrentScale;
      const indexOfCurrentKey = ALPHA_NAMES.indexOf(currentKey);
      currPos =
        (Tone.Transport.getSecondsAtTime() * WIDTH) / Tone.Transport.loopEnd;
      let indexOfKey = keys.indexOf(key);
      let octaveHeight = SCALEY * (NUM_OF_KEYS_IN_OCTAVE - 1);
      let y =
        currentOctave * octaveHeight +
        indexOfKey * (NUM_OF_KEYS_IN_OCTAVE / numOfKeysInScale) * SCALEY +
        indexOfCurrentKey * SCALEY;
      y = Math.abs(HEIGHT - y - SCALEY);
      let distToValidNoteTimes = [];
      for (let i = 0; i < VALID_NOTE_TIMES.length; i++) {
        let j = VALID_NOTE_TIMES[i];
        console.log(j);
        distToValidNoteTimes.push(
          Math.abs(Tone.Transport.getSecondsAtTime() - j)
        );
      }
      // VALID_NOTE_TIMES.map(noteTime => {
      //   return Math.abs(currPos - noteTime);
      // });
      const index = distToValidNoteTimes.indexOf(
        Math.min(...distToValidNoteTimes)
      );
      const quantizedTime = VALID_NOTE_TIMES[index];
      const xpos = WIDTH * (quantizedTime / Tone.Transport.loopEnd);
      filledNotes.push(FilledNote(xpos, y, NOTE_COLORS[indexOfKey]));
    }
  });
}
