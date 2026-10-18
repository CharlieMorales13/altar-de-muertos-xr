# Armé un altar de muertos en mi sala… con realidad aumentada 🕯️🌼

*Borrador para LinkedIn (≈430 palabras). Agrega el video o GIF y cambia los enlaces antes de publicar.*

---

En Oaxaca, el Día de Muertos se vive armando la ofrenda en casa. Para la cuarta y última actividad de Realidad Virtual y Aumentada quise llevar eso a un videojuego de RA **sin marcadores**: el teléfono entiende tu espacio, pones un altar sobre tu piso o tu mesa y lo llenas de ofrendas.

🎯 **Objetivo**
Proponer y desarrollar un juego de RA que detecte superficies, ancle objetos virtuales y permita interactuar con ellos, con música, lógica de juego, retroalimentación y gamificación.

🕹️ **La propuesta: el altar del abuelito**
Mateo, un niño, quiere armar el altar de su abuelito Chucho y te escribe cartas con lo que más le gustaba: su foto, el mole negro de la abuelita, el chocolate de agua, su mezcal de los domingos y hasta los Takis Fuego que le robaba aunque le picaban.
1. Mueves el teléfono hasta que detecta una superficie y tocas para colocar el altar.
2. Lees la carta de Mateo, escrita a mano.
3. Alrededor flotan ofrendas y también intrusos, como una calabaza de Halloween o una pizza.
4. Tocas una ofrenda: la mano en pantalla se cierra, la ofrenda vuela hacia ti y de ahí a su lugar en el altar, mientras la lista de la carta se va palomeando.

Son tres cartas y tres niveles: el altar de 2 pisos (cielo y tierra), el de 3 (con el inframundo) y el de 7 (los siete pasos hacia el descanso). La historia convierte una lista de ofrendas en algo personal: lo que va en el altar es lo que le gustaba a quien recordamos.

🏆 **Gamificación**
Puntos, combos de hasta x5, bono por tiempo, estrellas por rapidez y un altar que crece frente a ti. Cada acción tiene respuesta visual, sonora y háptica, y de fondo suena *Dios nunca muere*, el vals de Macedonio Alcalá que todo oaxaqueño reconoce, en guitarra.

🛠️ **Herramientas**
WebXR (hit-test, anchors y DOM overlay), three.js, Web Audio API y Vibration API, más modelos CC BY 4.0 de Sketchfab (la mesa del altar, el pan de muerto, las veladoras, el mezcal y los Takis) que adapté en Blender: a la mesa le quité las ofrendas que traía para que el jugador las ponga y la llevé a escala real. Todo corre en Chrome para Android, sin instalar nada.

🧩 **Retos**
- **Detección de superficies:** en una mesa blanca lisa no encuentra nada. Agregué una pantalla de "mueve el teléfono" y una recomendación de superficies con textura.
- **Estabilidad:** uso anclas de WebXR para que el altar no "camine" cuando el sistema reajusta el mapa, con respaldo si el dispositivo no las soporta.
- **"Tomarlo con la mano":** los teléfonos no rastrean las manos en WebXR, así que el toque cierra una mano en pantalla y la ofrenda pasa frente a la cámara antes de ir al altar.
- **Tocar objetos pequeños en 3D:** cada ofrenda tiene una zona de toque invisible más grande que el objeto, y los botones del HUD no cuentan como toques en la escena.
- **Batería y temperatura:** la RA calienta el teléfono, así que las partidas duran de 2 a 3 minutos.
- **iPhone:** WebXR no funciona en Safari, así que el juego lo detecta y ofrece un modo demo.

✅ **Resultado**
Un juego corto, educativo y muy oaxaqueño que se abre desde el navegador. Con esto cierro las cuatro actividades del curso, todas dedicadas a la cultura de Oaxaca: un Diablo de Juxtlahuaca corredor, un filtro de zorro de fiesta, una calavera de cempasúchil y este altar.

🎥 [video / GIF aquí]
💻 Repositorio: https://github.com/CharlieMorales13/altar-de-muertos-xr
🔗 Pruébalo (Chrome Android): https://altar-de-muertos-xr.carlos-gomez-dev13.workers.dev/

#RealidadAumentada #WebXR #threejs #DíaDeMuertos #Oaxaca #GameDev #Gamificación
