"""Prepara los modelos CC BY 4.0 de Sketchfab para el juego.

Uso:
    blender --background --python modelos/preparar_modelos.py -- <carpeta_descargas>

<carpeta_descargas> debe tener los GLB originales de Sketchfab:
    altar_de_dia_de_muertos.glb   "Altar de Día de Muertos" de AORV
    pan_de_muerto.glb             "Pan de muerto" de gatoperdido
    candles_asset_pack.glb        "Candles Asset Pack" de Em Marshall

Genera en assets/models/ (texturas de 512 px en JPEG):
    mesa.glb       solo la mesa, el mantel y el papel picado del altar, sin las
                   ofrendas (esas las pone el jugador), en metros, con el
                   centro de la mesa en el origen y el frente hacia +Z de glTF.
    pan.glb        pan de muerto reducido.
    veladora.glb   grupo de veladoras reducido.
"""
import os
import sys

import bpy
from mathutils import Vector

ORIGEN = sys.argv[sys.argv.index("--") + 1]
AQUI = os.path.dirname(os.path.abspath(__file__))
SALIDA = os.path.join(os.path.dirname(AQUI), "assets", "models")
os.makedirs(SALIDA, exist_ok=True)

ANCHO_MESA = 0.62  # m; los escalones del juego miden 0.6 x 0.5 m


def importar(nombre):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=os.path.join(ORIGEN, nombre))
    return [o for o in bpy.data.objects if o.type == "MESH"]


def caja(objs):
    ws = [o.matrix_world @ Vector(c) for o in objs for c in o.bound_box]
    return Vector([min(v[i] for v in ws) for i in range(3)]), Vector([max(v[i] for v in ws) for i in range(3)])


def unir_y_reducir(objs, caras):
    """Une las mallas en una, aplica transformaciones y la reduce a ~caras."""
    bpy.ops.object.select_all(action="DESELECT")
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.parent_clear(type="CLEAR_KEEP_TRANSFORM")
    if len(objs) > 1:
        bpy.ops.object.join()
    o = bpy.context.view_layer.objects.active
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    total = len(o.data.polygons)
    if total > caras:
        d = o.modifiers.new("reducir", "DECIMATE")
        d.ratio = caras / total
        bpy.ops.object.modifier_apply(modifier="reducir")
    for e in [x for x in bpy.data.objects if x.type == "EMPTY"]:
        bpy.data.objects.remove(e)
    return o


def a_medida(o, centro_xy, piso_z, escala):
    """Mueve el centro a (0, 0, piso) y escala alrededor del origen."""
    for v in o.data.vertices:
        v.co = Vector(((v.co.x - centro_xy.x) * escala, (v.co.y - centro_xy.y) * escala, (v.co.z - piso_z) * escala))
    o.data.update()


def exportar(nombre):
    for img in bpy.data.images:
        if img.size[0] > 512:
            img.scale(512, 512)
    ruta = os.path.join(SALIDA, nombre)
    bpy.ops.export_scene.gltf(filepath=ruta, export_format="GLB", export_image_format="JPEG",
                              export_jpeg_quality=85, export_animations=False, export_yup=True)
    print("OK", nombre, os.path.getsize(ruta) // 1024, "KB")


# ---------------------------------------------------------------- mesa del altar
objs = importar("altar_de_dia_de_muertos.glb")
patas = [o for o in objs if o.data.materials and o.data.materials[0].name == "mesa"]
mn, mx = caja(patas)
tope = mx.z
# todo lo que empieza sobre la mesa es ofrenda: se quita
for o in objs:
    if caja([o])[0].z > tope - 0.05:
        bpy.data.objects.remove(o)
mesa = unir_y_reducir([o for o in bpy.data.objects if o.type == "MESH"], 8000)
a_medida(mesa, (mn + mx) / 2, mn.z, ANCHO_MESA / (mx.x - mn.x))
print("ALTO_MESA", round((tope - mn.z) * ANCHO_MESA / (mx.x - mn.x), 3))
exportar("mesa.glb")

# ---------------------------------------------------------------- pan de muerto
o = unir_y_reducir(importar("pan_de_muerto.glb"), 6000)
mn, mx = caja([o])
a_medida(o, (mn + mx) / 2, mn.z, 1)
exportar("pan.glb")

# ---------------------------------------------------------------- veladoras
o = unir_y_reducir(importar("candles_asset_pack.glb"), 6000)
mn, mx = caja([o])
a_medida(o, (mn + mx) / 2, mn.z, 1)
exportar("veladora.glb")
