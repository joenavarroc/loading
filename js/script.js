import { melody as invierno, bpm as bpmInv, meter as meterInv } from "./invierno.js";
import { melody as verano, bpm as bpmVer, meter as meterVer } from "./verano.js";
import { melody as primavera, bpm as bpmPrim, meter as meterPrim } from "./primavera.js";
import { melody as otoño, bpm as bpmOto, meter as meterOto } from "./otoño.js";

/* 🇦🇷 estaciones hemisferio sur */
function getSeasonArgentina() {
  const m = new Date().getMonth();

  if (m === 11 || m === 0 || m === 1)
    return { melody: verano, bpm: bpmVer, meter: meterVer };

  if (m >= 2 && m <= 4)
    return { melody: otoño, bpm: bpmOto, meter: meterOto };

  if (m >= 5 && m <= 7)
    return { melody: invierno, bpm: bpmInv, meter: meterInv };

  return { melody: primavera, bpm: bpmPrim, meter: meterPrim };
}

const { melody, bpm, meter } = getSeasonArgentina();

const beatsPerBar = parseInt(meter.split("/")[0]);

const notesLayer = document.querySelector('.notes-layer');
const symbols = ['♪','♫','♬','♩'];

const palette = [
  "#8fd3ff",
  "#5ddcff",
  "#7b7cff",
  "#a78bfa",
  "#38bdf8"
];

let index = 0;

/* ⏱️ tempo real */
const beatMs = 60000 / bpm;

/* sincroniza el péndulo con el tempo */
document.documentElement.style.setProperty("--beat", beatMs + "ms");

function createNote() {
  const note = document.createElement('div');
  note.classList.add('note');

  note.style.animationDuration = beatMs * 2 + "ms";

  note.textContent = symbols[Math.floor(Math.random() * symbols.length)];

  const offsetX = (Math.random() * 80 - 40) + "px";
  note.style.setProperty('--x', offsetX);

  note.style.fontSize = (16 + Math.random() * 12) + "px";

  const color = palette[Math.floor(Math.random() * palette.length)];
  note.style.color = color;
  note.style.textShadow = `0 0 8px ${color}`;

  /* 🎼 nota real */
  note.dataset.pitch = melody[index];

  const isDownbeat = index % beatsPerBar === 0;

  if (isDownbeat) {
    note.style.transform = "scale(1.4)";
    note.style.textShadow = "0 0 16px #ffffff";
  }

  index = (index + 1) % melody.length;

  notesLayer.appendChild(note);
  setTimeout(() => note.remove(), 3000);
}

/* ⏲️ disparo rítmico real */
document.documentElement.style.setProperty("--beat", beatMs + "ms");

let nextNoteTime = performance.now() + beatMs;


function scheduler() {
  const now = performance.now();

  if (now >= nextNoteTime) {

    createNote();

    setTimeout(createNote, beatMs / 3);

    nextNoteTime += beatMs;
  }

  requestAnimationFrame(scheduler);
}

scheduler();