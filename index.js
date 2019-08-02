import { MakeScale, ScaleTypes } from "./shared/utils.js";
let prevScalesIndex = 0;
let currentScale = MakeScale(ScaleTypes.MINOR, "C0");
let prevScales = [currentScale];
const LOOP_LENGTH = 2;
const MIN_NOTE_LENGTH = LOOP_LENGTH / 16;
const generateVALID_NOTE_TIMES = (noteType, LOOP_LENGTH) => {
  let result = [];
  for (let i = 0; i < LOOP_LENGTH; i += noteType) {
    result.push(i);
  }
  return result;
};
const VALID_NOTE_TIMES = generateVALID_NOTE_TIMES(MIN_NOTE_LENGTH, LOOP_LENGTH);
console.log(VALID_NOTE_TIMES);

window.myStorage = {
  currentOctave: 0,
  currentKey: "C",
  numOfNotesInCurrentScale: currentScale.length,
  VALID_NOTE_TIMES: VALID_NOTE_TIMES
};

var synth = new Tone.PolySynth(6, Tone.Synth, {
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

const Key = (_keyName, _isPlaying) => {
  return {
    keyName: _keyName,
    isPlaying: _isPlaying
  };
};

const keys = ["z", "x", "c", "v", "b", "n", "m", ","].map(key =>
  Key(key, false)
);

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

const addScheduleReleaseToloop = (note, tileIndex, time) => {
  Tone.Transport.schedule(time => {
    synth.triggerRelease([note]);
    $(`#tile-${tileIndex}`).css("background-color", "#640032");
  }, time);
};

const addScheduleAttackToLoop = (note, tileIndex) => {
  const time = Tone.Transport.getSecondsAtTime();
  const distanceToValidNoteTimes = window.myStorage.VALID_NOTE_TIMES.map(
    noteTime => Math.abs(time - noteTime)
  );
  const quantizedTime =
    window.myStorage.VALID_NOTE_TIMES[
      distanceToValidNoteTimes.indexOf(Math.min(...distanceToValidNoteTimes))
    ];
  console.log(quantizedTime);
  Tone.Transport.schedule(time => {
    synth.triggerAttack([note]);
    $(`#tile-${tileIndex}`).css("background-color", "#880033");
  }, quantizedTime);
  addScheduleReleaseToloop(note, tileIndex, quantizedTime + MIN_NOTE_LENGTH);
};

$(document) //click handlers
  .keypress(e => {
    if (e.key === "Enter") {
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
      debugger;
      currentScale.forEach((note, i) => {
        $("#tile-holder").append(tile(note, i));
      });
    }
    keys.forEach((key, i) => {
      if (e.key === key.keyName) {
        if (!key.isPlaying) {
          Tone.context.resume();
          key.isPlaying = true;
          //synth.triggerAttack([currentScale[i]]);
          addScheduleAttackToLoop(prevScales[prevScalesIndex][i], i);
          $(`#tile-${i}`).css("background-color", "#880033");
        }
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
