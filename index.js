import { MakeScale, ScaleTypes } from "./shared/utils.js";
let prevScalesIndex = 0;
let currentScale = MakeScale(ScaleTypes.MINOR, "C3");
let prevScales = [currentScale];
const LOOP_LENGTH = Tone.Time("1m").toSeconds();
const MIN_NOTE_LENGTH = Tone.Time("8n").toSeconds();
const VALID_NOTE_TIMES = [
  ...Array(Math.floor(LOOP_LENGTH / MIN_NOTE_LENGTH) + 1)
] //empty array with indexes for values
  .map((_, i) => i)
  .map(noteTime => noteTime * MIN_NOTE_LENGTH);

Tone.Transport.bpm.value = 120;

window.myStorage = {
  currentOctave: 3,
  currentKey: "C",
  numOfNotesInCurrentScale: currentScale.length,
  VALID_NOTE_TIMES: VALID_NOTE_TIMES
};

let synth = new Tone.PolySynth(6, Tone.Synth, {
  oscillator: {
    type: "sine",
    partials: [0, 2, 3, 4]
  }
}).toMaster();

const tile = (note, num) => {
  return `
  <div class='tile' id='tile-${num}'>${note}</div>
  `;
};

const Key = (_keyName, _isPlaying = false) => {
  return {
    keyName: _keyName,
    isPlaying: _isPlaying
  };
};

const keys = ["z", "x", "c", "v", "b", "n", "m", ","].map(key => Key(key));

$(document).ready(() => {
  currentScale.forEach((key, i) => {
    $("#tile-holder").append(tile(key, i));
    $(`#tile-${i}`).on("click", () => {
      synth.triggerAttackRelease(key, "8n");
    });
  });
  Tone.Transport.start();
  Tone.Transport.loop = true;
  Tone.Transport.loopStart = 0;
  Tone.Transport.loopEnd = "1m";
});

const handleChangeKey = () => {
  $("#tile-holder").empty();
  let note = capitalize($("#root"));
  currentScale = MakeScale(ScaleTypes.MINOR, note);
  prevScales.push(currentScale);
  prevScalesIndex++;
  window.myStorage = {
    currentOctave: isolateOctave(note),
    currentKey: note.charAt(0),
    numOfNotesInCurrentScale: currentScale.length,
    VALID_NOTE_TIMES: VALID_NOTE_TIMES
  };
  currentScale.forEach((note, i) => {
    $("#tile-holder").append(tile(note, i));
  });
};

const playNote = (key, i) => {
  if (!key.isPlaying) {
    Tone.context.resume();
    key.isPlaying = true;
    //synth.triggerAttack([currentScale[i]]);
    $(`#tile-${i}`).css("background-color", "#880033");
  }
};

const addScheduleReleaseToloop = (note, tileIndex, time) => {
  Tone.Transport.schedule(time => {
    synth.triggerRelease([note]);
    $(`#tile-${tileIndex}`).css("background-color", "#640032");
  }, time);
};

const addScheduleAttackReleaseToLoop = (note, tileIndex) => {
  const currentTime = Tone.Transport.getSecondsAtTime();
  let distToValidNoteTimes = [];
  for (let i = 0; i < VALID_NOTE_TIMES.length; i++) {
    distToValidNoteTimes.push(Math.abs(currentTime - VALID_NOTE_TIMES[i]));
  }
  // VALID_NOTE_TIMES.map(noteTime =>
  //   Math.abs(currentTime - noteTime)
  // );
  const quantizedTime =
    VALID_NOTE_TIMES[
      distToValidNoteTimes.indexOf(Math.min(...distToValidNoteTimes))
    ];
  Tone.Transport.schedule(time => {
    synth.triggerAttackRelease(note, Tone.Time("8n").toSeconds()); //`@${MIN_NOTE_LENGTH}`);
  }, quantizedTime);
};

$(document) //click handlers
  .keypress(e => {
    if (e.key === "Enter") {
      handleChangeKey();
    }
    keys.forEach((key, i) => {
      if (e.key === key.keyName) {
        addScheduleAttackReleaseToLoop(prevScales[prevScalesIndex][i], i);
        playNote(key, i);
      }
    });
  })
  .keyup(e => {
    keys.forEach((key, i) => {
      if (e.key === key.keyName) {
        Tone.context.resume();
        //synth.triggerRelease([currentScale[i]]);
        key.isPlaying = false;
        //addScheduleReleaseToloop(prevScales[prevScalesIndex][i], i);
        $(`#tile-${i}`).css("background-color", "#640032");
      }
    });
  });

const capitalize = string => {
  return (
    string
      .slice()
      .val()
      .charAt(0)
      .toUpperCase() + string.val().slice(1)
  );
};

const isolateOctave = scaleSignature => {
  return scaleSignature
    .slice()
    .split("")
    .filter(char =>
      ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(char)
    )[0];
};
