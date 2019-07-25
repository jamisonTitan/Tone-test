import { MakeScale, ScaleTypes } from "./shared/utils.js";
let prevScales = [MakeScale(ScaleTypes.MINOR, "C0")];
let prevScalesIndex = 0;
let currentScale = MakeScale(ScaleTypes.MINOR, "C0");
window.myStorage = {
  currentOctave: 0
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
  Tone.Transport.loopEnd = "2m";
});

const addScheduleReleaseToloop = (note, tileIndex) => {
  Tone.Transport.schedule(time => {
    synth.triggerRelease([note]);
    $(`#tile-${tileIndex}`).css("background-color", "#640032");
  }, Tone.Transport.getSecondsAtTime());
};

const addScheduleAttackToLoop = (note, tileIndex) => {
  Tone.Transport.schedule(time => {
    synth.triggerAttack([note]);
    $(`#tile-${tileIndex}`).css("background-color", "#880033");
  }, Tone.Transport.getSecondsAtTime());
};

$(document) //click handlers
  .keypress(e => {
    if (e.key === "Enter") {
      $("#tile-holder").empty();
      let note = capitalize($("#root"));
      window.myStorage.currentOctave = isolateOctave(note);
      console.log(window.myStorage.currentOctave, "co");
      console.log(MakeScale(ScaleTypes.MINOR, note));
      currentScale = MakeScale(ScaleTypes.MINOR, note);
      prevScales.push(currentScale);
      prevScalesIndex++;
      currentScale.forEach((note, i) => {
        $("#tile-holder").append(tile(note, i));
        $(`#tile-${i}`).on("click", () => {
          synth.triggerAttackRelease(note, "8n");
        });
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
        addScheduleReleaseToloop(prevScales[prevScalesIndex][i], i);
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
