import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Medidas en metros (escala real en RA).
const ALTO_ALTAR = 0.5;
const TAM_OFRENDA = 0.09;

const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.7, ...extra });
const malla = (geo, color, extra) => new THREE.Mesh(geo, mat(color, extra));

// ---------- ofrendas procedurales (respaldo si no hay GLB) ----------
function cempasuchil() {
  const g = new THREE.Group();
  for (let i = 0; i < 18; i++) {
    const p = malla(new THREE.SphereGeometry(0.3, 8, 6), i % 2 ? 0xff7a00 : 0xffb800);
    const a = i * 2.4, r = 0.15 + (i % 3) * 0.12;
    p.position.set(Math.cos(a) * r, 0.75 + (i % 3) * 0.08, Math.sin(a) * r);
    p.scale.set(1, 0.6, 1);
    g.add(p);
  }
  const tallo = malla(new THREE.CylinderGeometry(0.05, 0.05, 0.7), 0x3a9d23);
  tallo.position.y = 0.35;
  g.add(tallo);
  return g;
}

function pan() {
  const g = new THREE.Group();
  const cuerpo = malla(new THREE.SphereGeometry(0.5, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), 0xd99a4e);
  cuerpo.scale.y = 0.75;
  const carita = malla(new THREE.CircleGeometry(0.16, 16), 0xf4d9a8); // pan oaxaqueño con carita
  carita.position.set(0, 0.25, 0.43);
  carita.rotation.x = -0.5;
  g.add(cuerpo, carita);
  return g;
}

function veladora() {
  const g = new THREE.Group();
  const vaso = malla(new THREE.CylinderGeometry(0.22, 0.2, 0.7, 16), 0xe6007e, { transparent: true, opacity: 0.85 });
  vaso.position.y = 0.35;
  const flama = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8).scale(1, 2, 1), new THREE.MeshBasicMaterial({ color: 0xffc000 }));
  flama.position.y = 0.85;
  g.add(vaso, flama);
  g.userData.flama = flama;
  return g;
}

function calavera() {
  const g = new THREE.Group();
  const craneo = malla(new THREE.SphereGeometry(0.4, 20, 14), 0xfaf6ee);
  craneo.position.y = 0.45;
  g.add(craneo);
  for (const x of [-0.15, 0.15]) {
    const ojo = malla(new THREE.SphereGeometry(0.11, 12, 8), x < 0 ? 0xe6007e : 0x00b3a6);
    ojo.position.set(x, 0.5, 0.32);
    g.add(ojo);
  }
  const nariz = malla(new THREE.ConeGeometry(0.06, 0.1, 3), 0x7b2cbf);
  nariz.position.set(0, 0.38, 0.38);
  nariz.rotation.x = Math.PI;
  g.add(nariz);
  return g;
}

function vaso(color, opacidad) {
  const g = new THREE.Group();
  const v = malla(new THREE.CylinderGeometry(0.25, 0.2, 0.6, 16), color, { transparent: true, opacity: opacidad });
  v.position.y = 0.3;
  g.add(v);
  return g;
}

function sal() {
  const g = new THREE.Group();
  const plato = malla(new THREE.CylinderGeometry(0.4, 0.3, 0.08, 20), 0x2d6cdf);
  const monton = malla(new THREE.ConeGeometry(0.25, 0.3, 16), 0xffffff);
  monton.position.y = 0.2;
  g.add(plato, monton);
  return g;
}

function copal() {
  const g = new THREE.Group();
  const sahumerio = malla(new THREE.CylinderGeometry(0.3, 0.15, 0.35, 16), 0x9c4a1a);
  sahumerio.position.y = 0.3;
  const base = malla(new THREE.CylinderGeometry(0.08, 0.15, 0.15, 12), 0x9c4a1a);
  g.add(sahumerio, base);
  for (let i = 0; i < 4; i++) {
    const humo = malla(new THREE.SphereGeometry(0.12 + i * 0.03, 8, 6), 0xeeeeee, { transparent: true, opacity: 0.5 });
    humo.position.set(Math.sin(i) * 0.08, 0.55 + i * 0.15, 0);
    g.add(humo);
  }
  return g;
}

function foto() {
  const g = new THREE.Group();
  const marco = malla(new THREE.BoxGeometry(0.6, 0.75, 0.06), 0x6b3e1f);
  marco.position.y = 0.4;
  const imagen = malla(new THREE.PlaneGeometry(0.45, 0.6), 0xbfa98a);
  imagen.position.set(0, 0.4, 0.035);
  g.add(marco, imagen);
  return g;
}

function papelPicado() {
  const g = new THREE.Group();
  [0xe6007e, 0xff7a00, 0x7b2cbf, 0x00b3a6].forEach((c, i) => {
    const hoja = malla(new THREE.PlaneGeometry(0.28, 0.35), c, { side: THREE.DoubleSide });
    hoja.position.set(-0.45 + i * 0.3, 0.5, 0);
    g.add(hoja);
  });
  return g;
}

function cazuela(color) {
  const g = new THREE.Group();
  const olla = malla(new THREE.CylinderGeometry(0.45, 0.3, 0.3, 20), 0x8a3b1a);
  olla.position.y = 0.15;
  const guiso = malla(new THREE.CircleGeometry(0.42, 20), color);
  guiso.rotation.x = -Math.PI / 2;
  guiso.position.y = 0.3;
  g.add(olla, guiso);
  return g;
}

// distractores
function calabazaHalloween() {
  const g = new THREE.Group();
  const c = malla(new THREE.SphereGeometry(0.45, 16, 12), 0xff6a00);
  c.scale.y = 0.8;
  c.position.y = 0.38;
  g.add(c);
  for (const x of [-0.15, 0.15]) {
    const ojo = malla(new THREE.ConeGeometry(0.08, 0.1, 3), 0x111111);
    ojo.position.set(x, 0.45, 0.4);
    ojo.rotation.x = Math.PI / 2;
    g.add(ojo);
  }
  return g;
}

function celular() {
  const g = new THREE.Group();
  const c = malla(new THREE.BoxGeometry(0.4, 0.8, 0.06), 0x222222);
  c.position.y = 0.4;
  const pantalla = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.68), new THREE.MeshBasicMaterial({ color: 0x3fa9ff }));
  pantalla.position.set(0, 0.4, 0.031);
  g.add(c, pantalla);
  return g;
}

function pizza() {
  const g = new THREE.Group();
  const reb = malla(new THREE.CylinderGeometry(0.5, 0.5, 0.06, 3, 1, false, 0, Math.PI / 2.5), 0xf2c14e);
  reb.position.y = 0.1;
  g.add(reb);
  for (let i = 0; i < 3; i++) {
    const pep = malla(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 10), 0xc0392b);
    pep.position.set(0.12 + i * 0.08, 0.14, 0.1 + (i % 2) * 0.06);
    g.add(pep);
  }
  return g;
}

function balon() {
  const g = new THREE.Group();
  const b = malla(new THREE.IcosahedronGeometry(0.4, 1), 0xffffff, { flatShading: true });
  b.position.y = 0.4;
  g.add(b);
  return g;
}

function hamburguesa() {
  const g = new THREE.Group();
  [[0xd99a4e, 0.12], [0x5a2d0c, 0.1], [0x3a9d23, 0.04], [0xffd23f, 0.04], [0xd99a4e, 0.14]].reduce((y, [c, h]) => {
    const capa = malla(new THREE.CylinderGeometry(0.4, 0.4, h, 20), c);
    capa.position.y = y + h / 2;
    g.add(capa);
    return y + h;
  }, 0);
  return g;
}

export const CATALOGO = [
  { id: 'cempasuchil', nombre: 'Cempasúchil', correcta: true, construir: cempasuchil, dato: 'Su color y aroma guían a las almas hasta el altar.' },
  { id: 'veladora', nombre: 'Veladora', correcta: true, construir: veladora, dato: 'Su luz alumbra el camino de regreso de las almas.' },
  { id: 'pan', nombre: 'Pan de muerto', correcta: true, construir: pan, dato: 'En Oaxaca es pan de yema con carita de pasta.' },
  { id: 'calavera', nombre: 'Calavera de azúcar', correcta: true, construir: calavera, dato: 'Lleva el nombre del difunto: la muerte es parte de la vida.' },
  { id: 'agua', nombre: 'Vaso de agua', correcta: true, construir: () => vaso(0x6fc8ff, 0.6), dato: 'Calma la sed de las almas tras su largo viaje.' },
  { id: 'sal', nombre: 'Sal', correcta: true, construir: sal, dato: 'Purifica a las almas en su camino.' },
  { id: 'copal', nombre: 'Copal', correcta: true, construir: copal, dato: 'Su humo limpia el lugar y eleva las oraciones.' },
  { id: 'foto', nombre: 'Fotografía', correcta: true, construir: foto, dato: 'Indica a quién está dedicada la ofrenda.' },
  { id: 'papel', nombre: 'Papel picado', correcta: true, construir: papelPicado, dato: 'Representa el viento y la alegría de la fiesta.' },
  { id: 'mole', nombre: 'Mole negro', correcta: true, construir: () => cazuela(0x2b1308), dato: 'La comida favorita del difunto; en Oaxaca no falta el mole.' },
  { id: 'chocolate', nombre: 'Chocolate de agua', correcta: true, construir: () => vaso(0x5a2d0c, 1), dato: 'Chocolate oaxaqueño para acompañar el pan.' },
  { id: 'calabaza', nombre: 'Calabaza de Halloween', correcta: false, construir: calabazaHalloween, dato: 'Es de Halloween, no del Día de Muertos.' },
  { id: 'celular', nombre: 'Celular', correcta: false, construir: celular, dato: 'No va en la ofrenda.' },
  { id: 'pizza', nombre: 'Pizza', correcta: false, construir: pizza, dato: 'No es comida tradicional de ofrenda.' },
  { id: 'balon', nombre: 'Balón', correcta: false, construir: balon, dato: 'No va en la ofrenda.' },
  { id: 'hamburguesa', nombre: 'Hamburguesa', correcta: false, construir: hamburguesa, dato: 'No es comida tradicional de ofrenda.' },
];

// ---------- modelos GLB opcionales (Meshy) ----------
const modelosGLB = {};
export async function cargarModelos() {
  const loader = new GLTFLoader();
  await Promise.all(['cempasuchil', 'pan', 'veladora', 'calavera'].map(id => new Promise(resolve => {
    loader.load(`assets/models/${id}.glb`, gltf => { modelosGLB[id] = gltf.scene; resolve(); }, undefined, resolve);
  })));
}

function normalizar(obj, tam) {
  const box = new THREE.Box3().setFromObject(obj);
  const size = box.getSize(new THREE.Vector3());
  obj.scale.multiplyScalar(tam / Math.max(size.x, size.y, size.z));
  box.setFromObject(obj);
  obj.position.y -= box.min.y;
  const wrap = new THREE.Group();
  wrap.add(obj);
  return wrap;
}

function etiqueta(texto) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 112;
  const g = c.getContext('2d');
  g.fillStyle = 'rgba(22,12,26,0.85)';
  g.beginPath();
  g.roundRect(0, 0, 512, 112, 56);
  g.fill();
  g.fillStyle = '#fff';
  g.font = '700 52px Segoe UI, system-ui, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(texto, 256, 58);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false }));
  s.scale.set(0.16, 0.035, 1);
  s.renderOrder = 10;
  return s;
}

export function crearOfrenda(tipo, conEtiqueta = true) {
  const g = new THREE.Group();
  const modelo = modelosGLB[tipo.id] ? normalizar(modelosGLB[tipo.id].clone(), TAM_OFRENDA) : tipo.construir();
  if (!modelosGLB[tipo.id]) modelo.scale.setScalar(TAM_OFRENDA);
  g.add(modelo);
  if (conEtiqueta) {
    const e = etiqueta(tipo.nombre);
    e.position.y = TAM_OFRENDA * 1.35;
    g.add(e);
  }
  // esfera invisible más grande que el objeto: facilita tocarlo en el teléfono
  const zona = new THREE.Mesh(new THREE.SphereGeometry(TAM_OFRENDA * 0.9, 8, 6), new THREE.MeshBasicMaterial({ visible: false }));
  zona.position.y = TAM_OFRENDA * 0.5;
  g.add(zona);
  g.userData = { tipo, zona, flama: modelo.userData.flama };
  return g;
}

// ---------- altar escalonado ----------
export function crearAltar(pisos, meta) {
  const g = new THREE.Group();
  const altoPiso = ALTO_ALTAR / pisos;
  const telas = [0x7b2cbf, 0xf7f2e8, 0xe6007e];
  const slots = [];
  const porPiso = Math.ceil(meta / pisos);
  for (let i = 0; i < pisos; i++) {
    const t = pisos === 1 ? 0 : i / (pisos - 1);
    const ancho = 0.6 - 0.32 * t;
    const fondo = 0.5 - 0.36 * t;
    const piso = malla(new THREE.BoxGeometry(ancho, altoPiso, fondo), telas[i % telas.length]);
    piso.position.set(0, altoPiso * (i + 0.5), -(0.5 - fondo) / 2);
    g.add(piso);
    // orilla de papel picado en el frente de cada piso
    const orilla = malla(new THREE.PlaneGeometry(ancho, altoPiso * 0.3), [0xff7a00, 0x00b3a6, 0xffb800][i % 3], { side: THREE.DoubleSide });
    orilla.position.set(0, altoPiso * (i + 0.85), fondo / 2 - (0.5 - fondo) / 2 + 0.002);
    g.add(orilla);
    // lugares para las ofrendas, al frente de cada piso (de arriba hacia abajo)
    const frente = fondo / 2 - (0.5 - fondo) / 2 - 0.035;
    for (let k = 0; k < porPiso; k++) {
      const x = (k - (porPiso - 1) / 2) * (ancho / porPiso);
      slots.push({ piso: pisos - 1 - i, pos: new THREE.Vector3(x, altoPiso * (i + 1), frente) });
    }
  }
  slots.sort((a, b) => a.piso - b.piso); // primero el piso de arriba

  // arco de carrizo con cempasúchil, típico de los altares oaxaqueños
  const arco = new THREE.Group();
  const curva = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.012, 8, 32, Math.PI), mat(0x6b8e23));
  arco.add(curva);
  for (let k = 0; k <= 14; k++) {
    const a = (k / 14) * Math.PI;
    const flor = malla(new THREE.SphereGeometry(0.03, 8, 6), k % 2 ? 0xff7a00 : 0xffb800);
    flor.position.set(Math.cos(a) * 0.3, Math.sin(a) * 0.3, 0);
    arco.add(flor);
  }
  arco.position.set(0, ALTO_ALTAR, -0.2);
  g.add(arco);
  g.userData.slots = slots;
  return g;
}

export function crearReticula() {
  const r = new THREE.Mesh(
    new THREE.RingGeometry(0.08, 0.1, 32).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: 0xffb800 }),
  );
  const centro = new THREE.Mesh(new THREE.CircleGeometry(0.02, 16).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xe6007e }));
  r.add(centro);
  r.matrixAutoUpdate = false;
  r.visible = false;
  return r;
}
