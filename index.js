/* eslint-disable no-debugger */
/* eslint-disable no-undef */
import { MakeScale, ScaleTypes } from "./shared/utils.js";
let currentScale = MakeScale(ScaleTypes.MINOR, "C4");
var synth = new Tone.PolySynth(6, Tone.Synth, {
  oscillator: {
    type: "sawtooth",
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
  MakeScale(ScaleTypes.MINOR, "C0").forEach((key, i) => {
    $("#tile-holder").append(tile(key, i));
    $(`#tile-${i}`).on("click", () => {
      synth.triggerAttackRelease(key, "8n");
    });
  });

  $("#enter").on("click", () => {
    let note = //Capitalize first letter
      $("#root")
        .val()
        .charAt(0)
        .toUpperCase() +
      $("#root")
        .val()
        .slice(1);
    console.log(MakeScale(ScaleTypes.MINOR, note));
    $("#tile-container").empty();
  });
});

// const onkeydown = e => {
//   $(`#tile-${Object.keys(keyToPitch).indexOf(e.key)}`).css(
//     "background-color",
//     "#eee"
//   );
//   synth.triggerAttack(keyToPitch[e.key], Tone.context.currentTime);
// };
// const onkeyup = e => {
//   $(`#tile-${Object.keys(keyToPitch).indexOf(e.key)}`).css(
//     "background-color",
//     "rgba(100, 0, 50, 0.8)"
//   );
//   synth.triggerRelease(keyToPitch[e.key]);
// };

// window.addEventListener("keydown", onkeydown);
// window.addEventListener("keyup", onkeyup);

$(document)
  .keypress(e => {
    console.log("keydown");
    Tone.context.resume();
    if (e.key === "Enter") {
      $("#tile-holder").empty();
      let note = //Capitalize first letter
        $("#root")
          .val()
          .charAt(0)
          .toUpperCase() +
        $("#root")
          .val()
          .slice(1);
      console.log(MakeScale(ScaleTypes.MINOR, note));
      currentScale = MakeScale(ScaleTypes.MINOR, note);
      currentScale.forEach((note, i) => {
        $("#tile-holder").append(tile(note, i));
        $(`#tile-${i}`).on("click", () => {
          synth.triggerAttackRelease(note, "8n");
        });
      });
    }
    keys.forEach((key, i) => {
      if (e.key === key.keyName) {
        Tone.context.resume();
        if (!key.isPlaying) {
          key.isPlaying = true;
          synth.triggerAttack([currentScale[i]]);
        }
      }
    });
  })
  .keyup(e => {
    keys.forEach((key, i) => {
      if (e.key === key.keyName) {
        Tone.context.resume();
        key.isPlaying = false;
        synth.triggerRelease([currentScale[i]]);
      }
    });
  });
