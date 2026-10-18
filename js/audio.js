// Efectos sintetizados con Web Audio (autoría propia) y música desde assets/audio.
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

// Música: "Dios nunca muere" (Macedonio Alcalá) en guitarra, en bucle (ver créditos en el README).
export function iniciarMusica() {
  if (musica) return;
  musica = new Audio('assets/audio/musica.mp3');
  musica.loop = true;
  musica.volume = 0.45;
  musica.play().catch(() => { musica = null; }); // sin permiso de audio: el juego sigue sin música
}

export function detenerMusica() {
  musica?.pause();
  musica = null;
}

export function vibrar(patron) {
  try { navigator.vibrate?.(patron); } catch { /* no soportado */ }
}
