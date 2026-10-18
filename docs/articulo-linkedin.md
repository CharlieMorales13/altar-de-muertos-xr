# Armé un altar de muertos en mi sala… con realidad aumentada 🕯️🌼

*Borrador para LinkedIn (≈430 palabras). Agrega el video o GIF y cambia los enlaces antes de publicar.*

---

En Oaxaca, el Día de Muertos se vive armando la ofrenda en casa. Para la cuarta y última actividad de Realidad Virtual y Aumentada quise llevar eso a un videojuego de RA **sin marcadores**: el teléfono entiende tu espacio, pones un altar sobre tu piso o tu mesa y lo llenas de ofrendas.

🎯 **Objetivo**
Proponer y desarrollar un juego de RA que detecte superficies, ancle objetos virtuales y permita interactuar con ellos, con música, lógica de juego, retroalimentación y gamificación.

🕹️ **La propuesta: Altar de Muertos XR**
1. Mueves el teléfono hasta que detecta una superficie.
2. Tocas para colocar el altar.
3. Alrededor flotan ofrendas: cempasúchil, veladoras, pan de muerto, copal, sal, agua, mole… y también intrusos como una calabaza de Halloween o una pizza.
4. Tocas las correctas y vuelan a su lugar en el altar, mostrando qué significan.

Son tres niveles: el altar de 2 pisos (cielo y tierra), el de 3 (con el inframundo) y el de 7 (los siete pasos hacia el descanso), cada uno con menos tiempo y más intrusos.

🏆 **Gamificación**
Puntos, combos de hasta x5, bono por tiempo, estrellas por rapidez y un altar que crece frente a ti. Cada acción tiene respuesta visual, sonora y háptica, y de fondo suena *Dios nunca muere*, el vals de Macedonio Alcalá que todo oaxaqueño reconoce, en guitarra.

🛠️ **Herramientas**
WebXR (hit-test, anchors y DOM overlay), three.js, Web Audio API y Vibration API, más modelos CC BY 4.0 de Sketchfab (la mesa del altar, el pan de muerto y las veladoras) que adapté en Blender: a la mesa le quité las ofrendas que traía para que el jugador las ponga y la llevé a escala real. Todo corre en Chrome para Android, sin instalar nada.

🧩 **Retos**
- **Detección de superficies:** en una mesa blanca lisa no encuentra nada. Agregué una pantalla de "mueve el teléfono" y una recomendación de superficies con textura.
- **Estabilidad:** uso anclas de WebXR para que el altar no "camine" cuando el sistema reajusta el mapa, con respaldo si el dispositivo no las soporta.
- **Tocar objetos pequeños en 3D:** cada ofrenda tiene una zona de toque invisible más grande que el objeto, y los botones del HUD no cuentan como toques en la escena.
- **Batería y temperatura:** la RA calienta el teléfono, así que las partidas duran de 2 a 3 minutos.
- **iPhone:** WebXR no funciona en Safari, así que el juego lo detecta y ofrece un modo demo.

✅ **Resultado**
Un juego corto, educativo y muy oaxaqueño que se abre desde el navegador. Con esto cierro las cuatro actividades del curso, todas dedicadas a la cultura de Oaxaca: un Tiliche corredor, un filtro de alebrije, una calavera de cempasúchil y este altar.

🎥 [video / GIF aquí]
💻 Repositorio: https://github.com/CharlieMorales13/altar-de-muertos-xr
🔗 Pruébalo (Chrome Android): https://altar-de-muertos-xr.carlos-gomez-dev13.workers.dev/

#RealidadAumentada #WebXR #threejs #DíaDeMuertos #Oaxaca #GameDev #Gamificación
