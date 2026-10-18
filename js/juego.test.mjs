// Prueba rápida de reglas y puntaje: node js/juego.test.mjs
import assert from 'node:assert/strict';
import { Partida, NIVELES, favoritosHasta } from './juego.js';

const p = new Partida();
assert.equal(p.estado, 'jugando');
assert.equal(p.tocar(true), 100, 'primer acierto x1');
assert.equal(p.tocar(true), 200, 'combo x2');
assert.equal(p.tocar(false), -50, 'error resta');
assert.equal(p.combo, 1, 'error reinicia combo');
assert.equal(p.puntos, 250);

// completar el nivel 1 con mucho tiempo → 3 estrellas y bono por segundos
const q = new Partida();
q.avanzar(10);
for (let i = 0; i < NIVELES[0].meta; i++) q.tocar(true);
assert.equal(q.estado, 'ganado');
assert.equal(q.estrellas[0], 3);
assert.ok(q.puntos > 0);
assert.equal(q.tocar(true), null, 'no cuenta toques fuera de juego');

// se acaba el tiempo
q.siguiente();
assert.equal(q.nivel, 1);
q.avanzar(NIVELES[1].tiempo + 1);
assert.equal(q.estado, 'perdido');

// después del último nivel termina
q.nivel = NIVELES.length - 1;
assert.equal(q.siguiente(), false);
assert.equal(q.estado, 'terminado');
// las cartas suman favoritos y alcanzan para la meta de cada nivel
NIVELES.forEach((n, i) => assert.ok(favoritosHasta(i).length >= n.meta, `nivel ${i + 1}: favoritos suficientes`));
assert.equal(new Set(favoritosHasta(2)).size, favoritosHasta(2).length, 'sin favoritos repetidos');
console.log('juego ok');
