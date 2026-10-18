# Altar de Muertos XR

Videojuego de **realidad aumentada sin marcadores** con historia: **Mateo** quiere armar el altar de su abuelito Chucho y te escribe cartas con lo que más le gustaba. El teléfono detecta tu piso o tu mesa, colocas ahí un **altar de muertos oaxaqueño** a escala real y las ofrendas flotan alrededor: tómalas con tu mano (tocándolas) y súbelas al altar. Lo que no está en la carta no va.

> Actividad 4 · Realidad Virtual y Aumentada · 2026

**Pruébalo:** https://altar-de-muertos-xr.carlos-gomez-dev13.workers.dev/ · **Modo demo en PC:** https://altar-de-muertos-xr.carlos-gomez-dev13.workers.dev/?demo

| Inicio | Partida | Nivel completado |
|---|---|---|
| ![Inicio](docs/capturas/inicio.png) | ![Juego](docs/capturas/juego.png) | ![Nivel](docs/capturas/nivel.png) |

## Propuesta

El Día de Muertos en Oaxaca se vive armando la ofrenda en casa. El juego lleva esa tradición a tu propio espacio y enseña qué lleva un altar y por qué: cada ofrenda correcta muestra su significado.

## Cómo se juega

1. **Escanea:** aparece la indicación "mueve el teléfono despacio" mientras WebXR busca superficies. Cuando encuentra una, aparece un círculo sobre el piso o la mesa.
2. **Coloca:** toca para anclar el altar: una mesa con mantel y papel picado, y encima los escalones. Se orienta solo hacia ti.
3. **Lee la carta de Mateo:** cada nivel empieza con una carta escrita a mano (papel rayado y letra de niño) con lo que le gustaba a su abuelito. El reloj no corre mientras la lees y con 📜 la vuelves a abrir.
4. **Toma las ofrendas:** alrededor del altar orbitan ofrendas con su nombre. Al tocar una, la mano en pantalla se cierra, la ofrenda vuela hacia ti, como si la tomaras, y de ahí a su lugar en el altar.
   - **Correctas:** lo que pide la carta del nivel y las anteriores. Cada cosa cuenta una sola vez; arriba se ve la lista de la carta y se va palomeando.
   - **Intrusos:** calabaza de Halloween, celular, pizza, balón y hamburguesa. Se deshacen en tu mano, restan puntos y aparece lo que diría Mateo.
5. **Completa el altar** antes de que se acabe el tiempo.

### Las cartas

| Carta | Lo que pide Mateo |
|---|---|
| 1 | Foto del abuelito, cempasúchil, veladora, vaso de agua, sal y pan de muerto |
| 2 | Mole negro de la abuelita, chocolate de agua, calavera de azúcar con su nombre y copal |
| 3 | Su mezcal de los domingos, los Takis Fuego que le robaba aunque le picaban y papel picado |

En WebXR los teléfonos no rastrean las manos, así que "tomar con la mano" se hace tocando la ofrenda: la mano del overlay se cierra y la ofrenda pasa primero frente a la cámara antes de volar al altar.

### Niveles

| Nivel | Altar | Significado | Meta | Tiempo |
|---|---|---|---|---|
| 1 | 2 pisos | El cielo y la tierra | 6 ofrendas | 50 s |
| 2 | 3 pisos | Cielo, tierra e inframundo | 8 ofrendas | 55 s |
| 3 | 7 pisos | Los siete pasos hacia el descanso eterno | 10 ofrendas | 60 s |

En cada nivel aparecen más intrusos. Cada partida dura de 2 a 3 minutos, para cuidar la batería y la temperatura del teléfono.

## Gamificación y retroalimentación

| Elemento | Detalle |
|---|---|
| Puntos | +100 por acierto con combo hasta x5, −50 por intruso, +10 por cada segundo que sobre |
| Progresión | 3 niveles con altares cada vez más altos y más intrusos |
| Tiempo | Cuenta regresiva; parpadea en rojo en los últimos 10 s |
| Recompensas | 1 a 3 ⭐ por nivel según la rapidez (máximo 9) y el altar que se llena |
| Visual | Chispas de colores, la ofrenda vuela en arco hasta su piso, destello rojo con los intrusos, barra de progreso y combo |
| Sonido | Acierto, error, ofrenda colocada, nivel ganado y nivel perdido |
| Háptica | Vibración corta al acertar, doble al fallar y larga al perder |
| Música | *Dios nunca muere*, el vals de Macedonio Alcalá que se considera el himno de Oaxaca, en guitarra y en bucle |

## Comprensión del entorno

- WebXR `immersive-ar` con **hit-test** contra los planos que detecta ARCore.
- **Anclas** (`anchors`, opcional): el altar queda fijo aunque el sistema reajuste el mapa. Si el dispositivo no las soporta, usa la pose del hit-test.
- **DOM overlay:** HUD y paneles en HTML encima de la cámara. Los botones usan `beforexrselect` para que no cuenten como toque en la escena.
- Toques en pantalla: el rayo del input transitorio de WebXR atraviesa el punto tocado. Cada ofrenda tiene una zona de toque invisible más grande que el objeto para facilitar el tiro en el teléfono.

## Herramientas

- WebXR Device API (hit-test, anchors, dom-overlay).
- three.js 0.160.
- Web Audio API para los efectos, `<audio>` para la música y Vibration API.
- Modelos 3D de Sketchfab con licencia CC BY 4.0 (mesa del altar, pan de muerto, veladoras, mezcal y Takis), adaptados en Blender 5.2 con `modelos/preparar_modelos.py`: a la mesa se le quitan las ofrendas que traía, se lleva a escala real (62 cm de ancho, 47 cm de alto) y se reducen mallas y texturas.
- Las demás ofrendas son procedurales con primitivas de three.js. Cualquier ofrenda se puede sustituir dejando un GLB con su `id` en `assets/models/` (por ejemplo `copal.glb`).

Para regenerar los modelos, con los GLB originales descargados de Sketchfab en una carpeta:

```bash
blender --background --python modelos/preparar_modelos.py -- <carpeta>
```

## Requisitos

- **Android con Chrome** y Servicios de Google Play para RA (ARCore). WebXR AR **no funciona en iPhone**. En navegadores sin soporte se muestra un aviso y un enlace al modo demo.
- HTTPS (o `localhost`).
- Superficie con textura y buena luz. Evita mesas blancas lisas o brillantes.

## Instalación y uso

```bash
git clone https://github.com/CharlieMorales13/altar-de-muertos-xr.git && cd altar-de-muertos-xr
npx serve .
```

- Publica la carpeta en **Vercel** o **Cloudflare Pages** (estático, sin build) y abre la URL en Chrome para Android.
- `index.html?demo`: el juego sin RA, con el altar en una cuadrícula y toques con el mouse.
- Prueba de reglas y puntaje: `node js/juego.test.mjs`.

## Estructura

```
index.html         overlay: inicio, HUD, mensajes y paneles
css/styles.css
js/main.js         sesión WebXR, hit-test, anclas, toques, bucle y flujo de niveles
js/juego.js        niveles, puntaje, combo, tiempo y estrellas (sin three.js)
js/escena.js       altar escalonado, catálogo de ofrendas, retícula
js/audio.js        música y efectos sintetizados
assets/models/     mesa.glb, pan.glb, veladora.glb, mezcal.glb, takis.glb
assets/audio/      musica.mp3
modelos/           script de Blender que prepara los modelos
```

## Créditos y licencias

| Recurso | Autor / fuente | Licencia |
|---|---|---|
| Código, diseño del juego y modelos procedurales | Carlos Antonio Gómez Morales | MIT (ver `LICENSE`) |
| Efectos de sonido | Sintetizados en código, autoría propia | MIT |
| Música: *Dios nunca muere* (arreglo para guitarras, piano y cuerdas) | Composición de Macedonio Alcalá (1868), dominio público. Arreglo y grabación de [Carlos Rios](https://www.youtube.com/results?search_query=Dios+Nunca+Muere+Guitarra+Carlos+Rios) (YouTube, 2016) | Todos los derechos del autor; se usa con fines educativos y con crédito |
| [Altar de Día de Muertos](https://sketchfab.com/3d-models/altar-de-dia-de-muertos-4feeb88e7948441c9d9034e32af2e2be) (solo mesa, mantel y papel picado) | [AORV](https://sketchfab.com/aorv) | CC BY 4.0 |
| [Pan de muerto](https://sketchfab.com/3d-models/pan-de-muerto-fcd63f39aa3a45fc98e7e4ef7193a929) | [gatoperdido](https://sketchfab.com/gatoperdido) | CC BY 4.0 |
| [Candles Asset Pack](https://sketchfab.com/3d-models/candles-asset-pack-56a68205dae649a388c6e3ba04145a9e) | [Em Marshall](https://sketchfab.com/emarshall) | CC BY 4.0 |
| [Malaespina Mezcal bottle](https://sketchfab.com/3d-models/malaespina-mezcal-bottle-8c5ae788601b4e83931da9e4e28d8baf) | [santibanezjuan](https://sketchfab.com/santibanezjuan) | CC BY 4.0 |
| [Takis Fuego - México](https://sketchfab.com/3d-models/takis-fuego-mexico-7426e5fa188344668ec3b9dbab348bae) | [Luiss Maker](https://sketchfab.com/thelunesshow0202) | CC BY 4.0 |
| Tipografía Gochi Hand (carta de Mateo) | Huerta Tipográfica, Google Fonts | SIL OFL 1.1 |
| three.js | three.js authors | MIT |

El significado de cada ofrenda se basa en la tradición oaxaqueña del Día de Muertos.
