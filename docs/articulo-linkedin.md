# Armé un altar de muertos en mi sala… con realidad aumentada 🕯️🌼

*Borrador para LinkedIn (≈480 palabras). Agrega el video o GIF antes de publicar.*

---

En Oaxaca, el Día de Muertos se vive armando la ofrenda en casa. Para la cuarta y última actividad de Realidad Virtual y Aumentada llevé eso a un videojuego de RA **sin marcadores**: el teléfono entiende tu espacio, pones un altar sobre tu piso o tu mesa y lo llenas de ofrendas.

🎯 **Objetivo**
Un juego de RA que detecte superficies, ancle objetos virtuales y permita interactuar con ellos, con música, lógica de juego, retroalimentación y gamificación.

🕹️ **La propuesta: el altar del abuelito**
Mateo quiere armar el altar de su abuelito Chucho y te escribe cartas con lo que más le gustaba: su foto, el mole negro de la abuelita, su mezcal de los domingos y hasta los Takis Fuego que le robaba aunque le picaban.
1. Mueves el teléfono hasta que detecta una superficie y tocas para colocar el altar.
2. Lees la carta de Mateo, escrita a mano.
3. Alrededor flotan ofrendas e intrusos, como una calabaza de Halloween o una pizza.
4. Tocas una ofrenda: la mano en pantalla se cierra, la ofrenda vuela hacia ti y luego a su lugar en el altar, y la carta se va palomeando.

Son tres cartas y tres niveles: el altar de 2 pisos, el de 3 y el de 7.

🏆 **Gamificación**
Puntos, combos de hasta x5, bono por tiempo, estrellas por rapidez y un altar que crece frente a ti. Cada acción responde con imagen, sonido y vibración. De fondo suena *Dios nunca muere*, el vals de Macedonio Alcalá, en el arreglo para guitarra de Carlos Rios.

🛠️ **Herramientas**
WebXR (hit-test, anchors y DOM overlay), three.js, Web Audio y Vibration API, y modelos CC BY 4.0 de Sketchfab (mesa del altar, pan de muerto, veladoras, mezcal y Takis) que adapté en Blender: a la mesa le quité las ofrendas que traía y la llevé a escala real. Corre en Chrome para Android, sin instalar nada.

🧩 **Retos**
- **Detectar superficies:** en una mesa blanca lisa no encuentra nada, así que agregué una pantalla de "mueve el teléfono" con recomendaciones.
- **Estabilidad:** las anclas de WebXR evitan que el altar "camine" cuando el sistema reajusta el mapa.
- **"Tomarlo con la mano":** los teléfonos no rastrean las manos en WebXR, así que el toque cierra una mano en pantalla y la ofrenda pasa frente a la cámara.
- **Objetos pequeños:** cada ofrenda tiene una zona de toque invisible más grande que ella.
- **iPhone:** Safari no tiene WebXR, así que el juego lo detecta y ofrece un modo demo.

✅ **Resultado**
Un juego corto, educativo y muy oaxaqueño. Con él cierro las cuatro actividades del curso, todas dedicadas a Oaxaca: un Diablo de Juxtlahuaca corredor, un filtro de zorro de fiesta, una calavera de cempasúchil y este altar.

🎥 [video / GIF aquí]
💻 Repositorio: https://github.com/CharlieMorales13/altar-de-muertos-xr
🔗 Pruébalo (Chrome Android): https://altar-de-muertos-xr.carlos-gomez-dev13.workers.dev/

🎵 Música: *Dios nunca muere* (Macedonio Alcalá, dominio público), arreglo y grabación de Carlos Rios, usado con crédito y con fines educativos.

#RealidadAumentada #WebXR #threejs #DíaDeMuertos #Oaxaca #Gamificación
