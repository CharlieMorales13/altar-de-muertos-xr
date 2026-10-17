// Música y efectos sintetizados con Web Audio: sonido de autoría propia, sin archivos externos.
let ctx = null;
let master = null;
let musica = null;

export function initAudio() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0.7;
    master.connect(ctx.destination);
  }
  return ctx.resume();
}

function tone(freq, start, dur, { type = 'triangle', vol = 0.15, slide = 0 } = {}) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, start);
  if (slide) o.frequency.exponentialRampToValueAtTime(freq * slide, start + dur);
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(vol, start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  o.connect(g).connect(master);
  o.start(start);
  o.stop(start + dur + 0.02);
}

const SFX = {
  acierto: t => [659, 784, 988].forEach((f, i) => tone(f, t + i * 0.07, 0.3, { vol: 0.18 })),
  error: t => tone(196, t, 0.4, { type: 'sawtooth', vol: 0.12, slide: 0.6 }),
  colocar: t => tone(523, t, 0.15, { type: 'sine', vol: 0.2 }),
  nivel: t => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, t + i * 0.12, 0.4, { vol: 0.16 })),
  perder: t => [440, 392, 349, 294].forEach((f, i) => tone(f, t + i * 0.2, 0.4, { vol: 0.15 })),
  clic: t => tone(1000, t, 0.05, { type: 'square', vol: 0.06 }),
};

export function sfx(nombre) {
  if (ctx?.state === 'running') SFX[nombre]?.(ctx.currentTime);
}

// Vals lento en La menor (3/4), melodía original.
const MELODIA = [440, 0, 523, 494, 0, 440, 415, 0, 494, 440, 0, 0, 392, 0, 440, 494, 0, 523, 494, 0, 440, 330, 0, 0];
const BAJO = [110, 165, 165, 98, 147, 147, 131, 196, 196, 82, 123, 123];

export function iniciarMusica() {
  if (!ctx || musica) return;
  const paso = 60 / 132;
  let i = 0;
  let siguiente = ctx.currentTime + 0.1;
  musica = setInterval(() => {
    while (siguiente < ctx.currentTime + 0.4) {
      const m = MELODIA[i % MELODIA.length];
      if (m) tone(m, siguiente, paso * 1.6, { type: 'sine', vol: 0.06 });
      tone(BAJO[i % BAJO.length], siguiente, paso * 0.9, { type: 'triangle', vol: i % 3 === 0 ? 0.08 : 0.04 });
      siguiente += paso;
      i++;
    }
  }, 120);
}

export function detenerMusica() {
  clearInterval(musica);
  musica = null;
}

export function vibrar(patron) {
  try { navigator.vibrate?.(patron); } catch { /* no soportado */ }
}
