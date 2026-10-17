import * as THREE from 'three';
import { Partida, NIVELES } from './juego.js';
import { CATALOGO, cargarModelos, crearOfrenda, crearAltar, crearReticula } from './escena.js';
import { initAudio, sfx, iniciarMusica, detenerMusica, vibrar } from './audio.js';

const DEMO = new URLSearchParams(location.search).has('demo');
const FLOTANTES = 7;          // ofrendas flotando a la vez
const VIDA_OFRENDA = 12;      // segundos antes de cambiar por otra

const $ = id => document.getElementById(id);
const ui = {
  inicio: $('inicio'), soporte: $('soporte'), hud: $('hud'), mensaje: $('mensaje'), panel: $('panel'), salir: $('salir'),
  nivel: $('h-nivel'), tiempo: $('h-tiempo'), puntos: $('h-puntos'), progreso: $('h-progreso'), combo: $('h-combo'),
  pTitulo: $('p-titulo'), pEstrellas: $('p-estrellas'), pTexto: $('p-texto'), pBoton: $('p-boton'),
};

// ---------- three.js ----------
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.xr.enabled = true;
document.body.prepend(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.01, 30);
scene.add(new THREE.HemisphereLight(0xffffff, 0x664466, 2));
const sol = new THREE.DirectionalLight(0xffffff, 1.4);
sol.position.set(0.5, 2, 1);
scene.add(sol);

const reticula = crearReticula();
scene.add(reticula);

// raíz del juego: se ancla donde el usuario colocó el altar
const raiz = new THREE.Group();
raiz.visible = false;
scene.add(raiz);

// ---------- estado ----------
let fase = 'inicio'; // inicio | escaneo | colocar | jugando | panel
let partida = null;
let altar = null;
let flotantes = [];
let volando = [];
let particulas = [];
let hitTestSource = null;
let ultimoHit = null;
let ancla = null;
let estadoPrevio = null;
const reloj = new THREE.Clock();
const raycaster = new THREE.Raycaster();

// ---------- mensajes ----------
let timerMensaje = null;
function mensaje(html, clase = '', ms = 0) {
  ui.mensaje.className = clase;
  ui.mensaje.innerHTML = html;
  clearTimeout(timerMensaje);
  if (ms) timerMensaje = setTimeout(() => ui.mensaje.classList.add('oculto'), ms);
}

// ---------- flujo del juego ----------
function prepararNivel() {
  for (const f of flotantes) raiz.remove(f.obj);
  for (const v of volando) raiz.remove(v.obj);
  flotantes = [];
  volando = [];
  if (altar) raiz.remove(altar);
  const n = partida.config;
  altar = crearAltar(n.pisos, n.meta);
  raiz.add(altar);
  for (let i = 0; i < FLOTANTES; i++) agregarFlotante(i / FLOTANTES * Math.PI * 2);
  estadoPrevio = 'jugando';
  fase = 'jugando';
  ui.panel.classList.add('oculto');
  ui.hud.classList.remove('oculto');
  mensaje(`<b>${n.nombre}</b>${n.significado}. Coloca ${n.meta} ofrendas.`, '', 3500);
  actualizarHUD();
}

function agregarFlotante(ang) {
  const correctas = CATALOGO.filter(c => c.correcta);
  const intrusos = CATALOGO.filter(c => !c.correcta);
  const lista = Math.random() < partida.config.probCorrecta ? correctas : intrusos;
  const tipo = lista[Math.floor(Math.random() * lista.length)];
  const obj = crearOfrenda(tipo);
  const f = {
    obj, tipo,
    ang: ang ?? Math.random() * Math.PI * 2,
    radio: 0.55 + Math.random() * 0.3,
    altura: 0.15 + Math.random() * 0.55,
    vel: (Math.random() < 0.5 ? -1 : 1) * (0.12 + Math.random() * 0.12),
    fase: Math.random() * 6,
    vida: VIDA_OFRENDA * (0.6 + Math.random() * 0.4),
    escala: 0,
  };
  obj.scale.setScalar(0.001);
  raiz.add(obj);
  flotantes.push(f);
}

function tocarOfrenda(f) {
  const puntos = partida.tocar(f.tipo.correcta);
  if (puntos === null) return;
  flotantes.splice(flotantes.indexOf(f), 1);
  if (f.tipo.correcta) {
    const slot = altar.userData.slots[partida.colocadas - 1] ?? altar.userData.slots.at(-1);
    f.obj.remove(f.obj.children.find(c => c.isSprite)); // ya no necesita etiqueta
    volando.push({ obj: f.obj, desde: f.obj.position.clone(), hasta: slot.pos.clone(), t: 0 });
    sfx('acierto');
    vibrar(30);
    chispas(f.obj.position, [0xffb800, 0xff7a00, 0xffffff]);
    mensaje(`<b>${f.tipo.nombre} +${puntos}</b>${f.tipo.dato}`, 'bien', 3000);
  } else {
    raiz.remove(f.obj);
    sfx('error');
    vibrar([80, 50, 80]);
    chispas(f.obj.position, [0xe0203a, 0x333333]);
    document.body.classList.remove('flash-rojo');
    void document.body.offsetWidth;
    document.body.classList.add('flash-rojo');
    mensaje(`<b>¡Intruso! ${puntos}</b>${f.tipo.nombre}: ${f.tipo.dato}`, 'mal', 3000);
  }
  agregarFlotante();
  actualizarHUD();
}

function revisarFinDeNivel() {
  if (partida.estado === estadoPrevio) return;
  estadoPrevio = partida.estado;
  if (partida.estado === 'ganado') {
    fase = 'panel';
    sfx('nivel');
    vibrar([40, 40, 40, 40, 120]);
    for (let i = 0; i < 6; i++) chispas(new THREE.Vector3(0, 0.6, 0), [0xff7a00, 0xffb800, 0xe6007e, 0x7b2cbf]);
    const ultimo = partida.nivel === NIVELES.length - 1;
    mostrarPanel(
      ultimo ? '¡Ofrenda completa!' : '¡Altar listo!',
      '⭐'.repeat(partida.estrellas[partida.nivel]) + '☆'.repeat(3 - partida.estrellas[partida.nivel]),
      ultimo
        ? `Las almas encontraron el camino. Puntaje final: <b>${partida.puntos}</b> · ${partida.estrellas.reduce((a, b) => a + b, 0)} de 9 estrellas.`
        : `Puntaje: <b>${partida.puntos}</b>. Sigue: ${NIVELES[partida.nivel + 1].nombre}.`,
      ultimo ? 'Jugar de nuevo' : 'Siguiente nivel',
      () => {
        if (partida.siguiente()) prepararNivel();
        else { partida = new Partida(); prepararNivel(); }
      },
    );
  } else if (partida.estado === 'perdido') {
    fase = 'panel';
    sfx('perder');
    vibrar(300);
    mostrarPanel('Se apagaron las velas', '☆☆☆', `Colocaste ${partida.colocadas} de ${partida.config.meta} ofrendas. ¡Inténtalo otra vez!`, 'Reintentar', () => {
      partida.iniciarNivel();
      prepararNivel();
    });
  }
}

function mostrarPanel(titulo, estrellas, texto, boton, accion) {
  ui.pTitulo.textContent = titulo;
  ui.pEstrellas.textContent = estrellas;
  ui.pTexto.innerHTML = texto;
  ui.pBoton.textContent = boton;
  ui.pBoton.onclick = () => { sfx('clic'); accion(); };
  ui.panel.classList.remove('oculto');
}

function actualizarHUD() {
  const n = partida.config;
  ui.nivel.textContent = `Nivel ${partida.nivel + 1}/3`;
  ui.tiempo.textContent = `⏱ ${Math.ceil(partida.restante)}`;
  ui.tiempo.classList.toggle('urgente', partida.restante <= 10 && partida.estado === 'jugando');
  ui.puntos.textContent = `${partida.puntos} pts`;
  ui.progreso.style.width = `${(partida.colocadas / n.meta) * 100}%`;
  ui.combo.textContent = partida.combo > 1 ? `Combo x${partida.combo}` : '';
}

// ---------- partículas ----------
function chispas(origen, colores) {
  for (let i = 0; i < 24; i++) {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(0.015, 0.01), new THREE.MeshBasicMaterial({ color: colores[i % colores.length], side: THREE.DoubleSide }));
    p.position.copy(origen);
    p.userData = { v: new THREE.Vector3((Math.random() - 0.5) * 0.8, Math.random() * 0.8, (Math.random() - 0.5) * 0.8), vida: 1.2 };
    raiz.add(p);
    particulas.push(p);
  }
}

// ---------- actualización por cuadro ----------
function actualizar(dt, t) {
  for (let i = particulas.length - 1; i >= 0; i--) {
    const p = particulas[i];
    p.userData.v.y -= 1.5 * dt;
    p.position.addScaledVector(p.userData.v, dt);
    p.rotation.x += 6 * dt;
    if ((p.userData.vida -= dt) <= 0) {
      raiz.remove(p);
      p.geometry.dispose();
      p.material.dispose();
      particulas.splice(i, 1);
    }
  }
  if (fase !== 'jugando' && fase !== 'panel') return;

  if (fase === 'jugando') {
    partida.avanzar(dt);
    actualizarHUD();
    revisarFinDeNivel();
  }

  // ofrendas que orbitan alrededor del altar
  for (let i = flotantes.length - 1; i >= 0; i--) {
    const f = flotantes[i];
    f.ang += f.vel * dt;
    f.vida -= dt;
    f.escala = f.vida < 0.5 ? Math.max(0, f.vida * 2) : Math.min(1, f.escala + dt * 2);
    f.obj.scale.setScalar(Math.max(0.001, f.escala));
    f.obj.position.set(Math.cos(f.ang) * f.radio, f.altura + Math.sin(t * 2 + f.fase) * 0.03, Math.sin(f.ang) * f.radio);
    f.obj.rotation.y += dt * 0.8;
    if (f.obj.userData.flama) f.obj.userData.flama.scale.y = 2 + Math.sin(t * 20 + f.fase) * 0.3;
    if (f.vida <= 0) {
      raiz.remove(f.obj);
      flotantes.splice(i, 1);
      if (fase === 'jugando') agregarFlotante();
    }
  }

  // ofrendas correctas volando a su lugar en el altar
  for (let i = volando.length - 1; i >= 0; i--) {
    const v = volando[i];
    v.t = Math.min(1, v.t + dt * 1.6);
    const e = v.t * v.t * (3 - 2 * v.t);
    v.obj.position.lerpVectors(v.desde, v.hasta, e);
    v.obj.position.y += Math.sin(e * Math.PI) * 0.15; // pequeño arco
    v.obj.rotation.y = 0;
    v.obj.scale.setScalar(1 - 0.3 * e);
    if (v.t === 1) {
      sfx('colocar');
      volando.splice(i, 1);
    }
  }
}

// ---------- toques ----------
function tocarConRayo() {
  const zonas = flotantes.map(f => f.obj.userData.zona);
  const hit = raycaster.intersectObjects(zonas, false)[0];
  if (!hit) return;
  tocarOfrenda(flotantes.find(f => f.obj.userData.zona === hit.object));
}

function colocarAltar(matriz) {
  raiz.matrix.copy(matriz);
  raiz.matrix.decompose(raiz.position, raiz.quaternion, raiz.scale);
  // gira el altar para que mire hacia el usuario
  const cam = new THREE.Vector3().setFromMatrixPosition(renderer.xr.isPresenting ? renderer.xr.getCamera().matrixWorld : camera.matrixWorld);
  raiz.rotation.set(0, Math.atan2(cam.x - raiz.position.x, cam.z - raiz.position.z), 0);
  raiz.updateMatrix();
  raiz.visible = true;
  reticula.visible = false;
  sfx('colocar');
  vibrar(50);
  iniciarMusica();
  partida = new Partida();
  prepararNivel();
}

// ---------- WebXR ----------
const controlador = renderer.xr.getController(0);
scene.add(controlador);
controlador.addEventListener('select', async () => {
  if (fase === 'colocar' && reticula.visible) {
    colocarAltar(reticula.matrix);
    // ancla opcional: mantiene el altar fijo si el sistema reajusta el mapa
    try { ancla = await ultimoHit?.createAnchor?.(); } catch { ancla = null; }
    if (ancla) raiz.matrixAutoUpdate = false;
  } else if (fase === 'jugando') {
    const m = new THREE.Matrix4().extractRotation(controlador.matrixWorld);
    raycaster.ray.origin.setFromMatrixPosition(controlador.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(m);
    tocarConRayo();
  }
});

// los botones del overlay no deben contar como toque en la escena
for (const el of [ui.panel, ui.salir]) el.addEventListener('beforexrselect', e => e.preventDefault());

async function iniciarXR() {
  const sesion = await navigator.xr.requestSession('immersive-ar', {
    requiredFeatures: ['hit-test'],
    optionalFeatures: ['dom-overlay', 'anchors'],
    domOverlay: { root: $('overlay') },
  });
  renderer.xr.setReferenceSpaceType('local');
  await renderer.xr.setSession(sesion);
  const espacioVista = await sesion.requestReferenceSpace('viewer');
  hitTestSource = await sesion.requestHitTestSource({ space: espacioVista });
  sesion.addEventListener('end', () => location.reload());

  fase = 'escaneo';
  ui.inicio.classList.add('oculto');
  ui.salir.classList.remove('oculto');
  mensaje('<span class="telefono">📱</span><b>Mueve el teléfono despacio</b>Apunta a tu piso o a una mesa con textura (evita superficies blancas o brillantes).');

  renderer.setAnimationLoop((tiempo, frame) => {
    const dt = Math.min(reloj.getDelta(), 0.1);
    if (frame) {
      const ref = renderer.xr.getReferenceSpace();
      if (fase === 'escaneo' || fase === 'colocar') {
        const hits = frame.getHitTestResults(hitTestSource);
        if (hits.length) {
          ultimoHit = hits[0];
          reticula.matrix.fromArray(hits[0].getPose(ref).transform.matrix);
          reticula.visible = true;
          if (fase === 'escaneo') {
            fase = 'colocar';
            sfx('clic');
            mensaje('<b>¡Superficie encontrada!</b>Toca la pantalla para colocar el altar.', 'bien');
          }
        } else {
          reticula.visible = false;
        }
      }
      if (ancla && frame.trackedAnchors?.has(ancla)) {
        const pose = frame.getPose(ancla.anchorSpace, ref);
        if (pose) {
          // conserva el giro hacia el usuario aplicado al colocar
          const giro = new THREE.Matrix4().makeRotationY(raiz.rotation.y);
          const pos = new THREE.Vector3().setFromMatrixPosition(new THREE.Matrix4().fromArray(pose.transform.matrix));
          raiz.matrix.copy(giro).setPosition(pos);
        }
      }
    }
    actualizar(dt, reloj.elapsedTime);
    renderer.render(scene, camera);
  });
}

// Modo demo (?demo): sin RA, para probar en la computadora y tomar capturas.
// El altar está en el origen y se toca con el mouse.
function iniciarDemo() {
  ui.inicio.classList.add('oculto');
  scene.background = new THREE.Color(0x2a1b3d);
  const piso = new THREE.GridHelper(4, 20, 0x7b2cbf, 0x4a2a6a);
  scene.add(piso);
  camera.position.set(0, 1.15, 2.1);
  camera.lookAt(0, 0.35, 0);
  colocarAltar(new THREE.Matrix4());
  renderer.domElement.addEventListener('pointerdown', e => {
    if (fase !== 'jugando') return;
    raycaster.setFromCamera(new THREE.Vector2((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1), camera);
    tocarConRayo();
  });
  window.tocarPrimera = correcta => { // pruebas automáticas
    const f = flotantes.find(x => x.tipo.correcta === correcta && x.escala > 0.5);
    if (f) tocarOfrenda(f);
    return !!f;
  };
  window.avanzar = seg => { for (let i = 0; i < seg * 30; i++) actualizar(1 / 30, reloj.elapsedTime); };
  renderer.setAnimationLoop(() => {
    actualizar(Math.min(reloj.getDelta(), 0.1), reloj.elapsedTime);
    renderer.render(scene, camera);
  });
}

addEventListener('resize', () => {
  if (renderer.xr.isPresenting) return;
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

ui.salir.addEventListener('click', () => renderer.xr.getSession()?.end());

// ---------- arranque ----------
const soportaAR = !DEMO && 'xr' in navigator && await navigator.xr.isSessionSupported('immersive-ar').catch(() => false);
if (!DEMO && !soportaAR) {
  ui.soporte.innerHTML = 'Este navegador no soporta WebXR AR. Usa <b>Chrome en Android</b> con ARCore (Servicios de Google Play para RA). ' +
    '<a href="?demo">Ver modo demo</a>';
}
const modelosListos = cargarModelos();

$('comenzar').addEventListener('click', async () => {
  await initAudio();
  sfx('clic');
  await modelosListos;
  if (DEMO) return iniciarDemo();
  if (!soportaAR) return;
  try {
    await iniciarXR();
  } catch (err) {
    console.error(err);
    ui.soporte.textContent = 'No se pudo iniciar la sesión de RA: ' + err.message;
  }
});

window.addEventListener('pagehide', detenerMusica);
