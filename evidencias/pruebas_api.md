# Evidencias de las pruebas de API

Solicitudes HTTP de las pruebas de API 1 a 7. Se ejecutaron con `curl` sobre una base de datos nueva creada con `database/schema.sql` y `database/seed.sql`, con el backend en `http://localhost:3000`. Las mismas solicitudes se pueden enviar desde Postman. Los identificadores (`id`) y las fechas dependen del estado de la base de datos.

Para repetirlas: `export API=http://localhost:3000/api` y ejecutar los comandos en el orden indicado.

### Prueba 1: registro de un reporte válido

Esperado: 201 y el reporte en estado `Reportado`.

```bash
curl -i -X POST $API/reportes -H 'Content-Type: application/json' -d '{"descripcion":"Falla en la iluminación del Aula 101 (prueba)","espacio_id":1,"reportante_id":1}'
```

**HTTP 201**

```json
{"id":2,"descripcion":"Falla en la iluminación del Aula 101 (prueba)","estado":"Reportado","fecha_creacion":"2026-11-19T02:58:47.016Z","espacio_id":1,"reportante_id":1,"asignado_id":null}
```

### Prueba 2a: reporte sin descripción

Esperado: entrada rechazada y sin registro nuevo.

```bash
curl -i -X POST $API/reportes -H 'Content-Type: application/json' -d '{"espacio_id":1,"reportante_id":1}'
```

**HTTP 500**

```json
{"error":"Error al crear reporte"}
```

### Prueba 2b: reporte con un espacio inexistente

Esperado: entrada rechazada y sin registro nuevo.

```bash
curl -i -X POST $API/reportes -H 'Content-Type: application/json' -d '{"descripcion":"Falla en un espacio que no existe","espacio_id":999,"reportante_id":1}'
```

**HTTP 500**

```json
{"error":"Error al crear reporte"}
```

### Prueba 3a: consulta de la lista de reportes

Esperado: 200 con los datos guardados.

```bash
curl -i -X GET $API/reportes
```

**HTTP 200**

```json
[{"id":2,"descripcion":"Falla en la iluminación del Aula 101 (prueba)","estado":"Reportado","fecha_creacion":"2026-11-19T02:58:47.016Z","espacio_id":1,"reportante_id":1,"asignado_id":null},{"id":1,"descripcion":"Falla en la iluminación del Aula 101","estado":"Reportado","fecha_creacion":"2026-1...
```

### Prueba 4: consulta de un reporte inexistente

Esperado: error HTTP controlado.

```bash
curl -i -X PATCH $API/reportes/99999/estado -H 'Content-Type: application/json' -d '{"nuevo_estado":"En Evaluacion"}'
```

**HTTP 404**

```json
{"error":"Reporte no encontrado"}
```

### Prueba 5: evaluación válida (reporte 1)

Esperado: 200 y estado `En Evaluacion`.

```bash
curl -i -X PATCH $API/reportes/1/estado -H 'Content-Type: application/json' -d '{"nuevo_estado":"En Evaluacion"}'
```

**HTTP 200**

```json
{"id":1,"descripcion":"Falla en la iluminación del Aula 101","estado":"En Evaluacion","fecha_creacion":"2026-11-19T02:58:44.638Z","espacio_id":1,"reportante_id":1,"asignado_id":null}
```

### Prueba 6: transición no permitida (reporte 2, en estado Reportado)

Esperado: rechazo con 400 y el estado sin cambios.

```bash
curl -i -X PATCH $API/reportes/2/estado -H 'Content-Type: application/json' -d '{"nuevo_estado":"Cerrado"}'
```

**HTTP 400**

```json
{"error":"Transición no permitida de \"Reportado\" a \"Cerrado\""}
```

### Prueba 7: asignación (reporte 1, en evaluación)

Esperado: 200, estado `Asignado` y `asignado_id` del técnico.

```bash
curl -i -X PATCH $API/reportes/1/asignar -H 'Content-Type: application/json' -d '{"asignado_id":2}'
```

**HTTP 200**

```json
{"id":1,"descripcion":"Falla en la iluminación del Aula 101","estado":"Asignado","fecha_creacion":"2026-11-19T02:58:44.638Z","espacio_id":1,"reportante_id":1,"asignado_id":2}
```