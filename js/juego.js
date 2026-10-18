// Reglas, niveles y puntaje del juego (sin dependencias de three.js para poder probarlo).

// Cada nivel empieza con una carta de Mateo para su abuelito Chucho. Lo correcto
// en un nivel es lo que pide esa carta y las anteriores; lo demás es intruso.
export const NIVELES = [
  {
    nombre: 'Altar de 2 niveles', significado: 'El cielo y la tierra', pisos: 2, meta: 6, tiempo: 50, probCorrecta: 0.7,
    favoritos: ['foto', 'cempasuchil', 'veladora', 'agua', 'sal', 'pan'],
    carta: 'Abuelito Chucho: mi mamá dice que en estos días vienes de visita. Para que no te pierdas te voy a poner tu <b>foto</b>, flores de <b>cempasúchil</b> y una <b>veladora</b>. También un <b>vaso de agua</b> porque llegas con sed del camino, <b>sal</b> y <b>pan de muerto</b>.',
  },
  {
    nombre: 'Altar de 3 niveles', significado: 'Cielo, tierra e inframundo', pisos: 3, meta: 8, tiempo: 55, probCorrecta: 0.62,
    favoritos: ['mole', 'chocolate', 'calavera', 'copal'],
    carta: '¿Te acuerdas del <b>mole negro</b> de la abuelita? Te lo voy a poner con el <b>chocolate de agua</b> que me hacías en las mañanas, una <b>calavera de azúcar</b> con tu nombre y <b>copal</b>, como el que prendías en la iglesia.',
  },
  {
    nombre: 'Altar de 7 niveles', significado: 'Los siete pasos hacia el descanso eterno', pisos: 7, meta: 10, tiempo: 60, probCorrecta: 0.55,
    favoritos: ['mezcal', 'takis', 'papel'],
    carta: 'Y no se me olvida: tu <b>mezcal</b> de los domingos, los <b>Takis Fuego</b> que me robabas aunque te picaban, y <b>papel picado</b> de colores para que haya fiesta. Te extraño mucho. Tu nieto, Mateo.',
  },
];

// Lo que vale en el nivel n: los favoritos de su carta y de las anteriores.
export const favoritosHasta = n => NIVELES.slice(0, n + 1).flatMap(x => x.favoritos);

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
