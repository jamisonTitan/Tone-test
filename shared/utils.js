/* eslint-disable no-debugger */
import { MidiNoteNames } from "./midiNoteNames.js";

const MIDI_NOTES_SHARP = MidiNoteNames.sharp;
const MIDI_NOTES_FLAT = MidiNoteNames.flat;

const ALPHA_NAMES = ["A", "B", "C", "D", "E", "F", "G"];

export const NoteNameToMidi = noteName => {
  let midiKey = -1;
  for (let i = 0; i < MIDI_NOTES_SHARP.length; i++) {
    if (noteName === MIDI_NOTES_SHARP[i] || noteName === MIDI_NOTES_FLAT[i]) {
      midiKey = i; // found it
    }
  }
  return Number(midiKey); // It should be a number anyway but who the fuck cares i dont trust you javascript and im too lazy to use typescript
};

export const ScaleTypes = {
  MAJOR: [0, 2, 4, 5, 7, 9, 11, 12],
  MINOR: [0, 2, 3, 5, 7, 8, 10, 12]
};

export const MakeScale = (scaleType, keyNameAndOctave) => {
  let startingName = keyNameAndOctave;
  let offset;
  ALPHA_NAMES.forEach((name, i) => {
    if (startingName.includes(name)) {
      offset = i;
    }
  });
  let startingNote = NoteNameToMidi(startingName);
  let scaleDegrees = scaleType;
  let scale = [];

  for (let i = 0; i < scaleDegrees.length; i++) {
    if (
      MIDI_NOTES_SHARP[scaleDegrees[i] + startingNote].includes(
        ALPHA_NAMES[(offset + i) % ALPHA_NAMES.length]
      )
    ) {
      scale.push(MIDI_NOTES_SHARP[scaleDegrees[i] + startingNote]);
    } else if (
      MIDI_NOTES_FLAT[scaleDegrees[i] + startingNote].includes(
        ALPHA_NAMES[(offset + i) % ALPHA_NAMES.length]
      )
    ) {
      scale.push(MIDI_NOTES_FLAT[scaleDegrees[i] + startingNote]);
    } else {
      console.log(
        "oh shit :O",
        MIDI_NOTES_FLAT[i],
        "-------------",
        MIDI_NOTES_SHARP[i]
      );
      scale.push("C7"); // high note used to indicate error
    }
  }
  return scale;
};
