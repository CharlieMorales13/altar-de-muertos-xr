// Reglas, niveles y puntaje del juego (sin dependencias de three.js para poder probarlo).

export const NIVELES = [
  { nombre: 'Altar de 2 niveles', significado: 'El cielo y la tierra', pisos: 2, meta: 6, tiempo: 50, probCorrecta: 0.7 },
  { nombre: 'Altar de 3 niveles', significado: 'Cielo, tierra e inframundo', pisos: 3, meta: 8, tiempo: 55, probCorrecta: 0.62 },
  { nombre: 'Altar de 7 niveles', significado: 'Los siete pasos hacia el descanso eterno', pisos: 7, meta: 10, tiempo: 60, probCorrecta: 0.55 },
];

export const PUNTOS_ACIERTO = 100;
export const PUNTOS_ERROR = -50;
export const COMBO_MAX = 5;
export const BONO_SEGUNDO = 10;

export class Partida {
  constructor() {
    this.nivel = 0;
    this.puntos = 0;
    this.estrellas = [];
    this.iniciarNivel();
  }

  get config() { return NIVELES[this.nivel]; }

  iniciarNivel() {
    this.colocadas = 0;
    this.combo = 1;
    this.restante = this.config.tiempo;
    this.estado = 'jugando'; // jugando | ganado | perdido | terminado
  }

  // Devuelve los puntos obtenidos por el toque (o null si no se está jugando).
  tocar(esCorrecta) {
    if (this.estado !== 'jugando') return null;
    if (!esCorrecta) {
      this.puntos = Math.max(0, this.puntos + PUNTOS_ERROR);
      this.combo = 1;
      return PUNTOS_ERROR;
    }
    const ganados = PUNTOS_ACIERTO * this.combo;
    this.puntos += ganados;
    this.combo = Math.min(this.combo + 1, COMBO_MAX);
    this.colocadas++;
    if (this.colocadas >= this.config.meta) {
      this.estado = 'ganado';
      this.estrellas[this.nivel] = this.estrellasNivel();
      this.puntos += Math.ceil(this.restante) * BONO_SEGUNDO;
    }
    return ganados;
  }

  avanzar(dt) {
    if (this.estado !== 'jugando') return;
    this.restante = Math.max(0, this.restante - dt);
    if (this.restante === 0) this.estado = 'perdido';
  }

  estrellasNivel() {
    const frac = this.restante / this.config.tiempo;
    return frac >= 0.5 ? 3 : frac >= 0.25 ? 2 : 1;
  }

  // Pasa al siguiente nivel; devuelve false si ya no hay más.
  siguiente() {
    if (this.nivel >= NIVELES.length - 1) {
      this.estado = 'terminado';
      return false;
    }
    this.nivel++;
    this.iniciarNivel();
    return true;
  }
}
