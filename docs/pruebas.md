# Documentación de Pruebas Funcionales

Pruebas mínimas de la guía PF-05 (Actividad 6): API REST, reglas de negocio, permisos e integración interfaz–API–base de datos. Se ejecutaron de forma manual, con la interfaz web y con solicitudes HTTP (`curl`, equivalentes en Postman).

**Cómo reproducirlas:** preparar la base de datos con `schema.sql` y `seed.sql`, levantar el backend y el frontend (ver README, sección 5) y usar los usuarios de prueba (`reportante@admin.com`, `tecnico@admin.com` y `coordinador@admin.com`, contraseña `123456`). Los comandos y las respuestas de las pruebas de API están en [../evidencias/pruebas_api.md](../evidencias/pruebas_api.md). Las capturas de la interfaz están en [../evidencias/](../evidencias/).

## Resumen

| # | Prueba | Requisito | Método y HTTP | Estado |
|---|---|---|---|---|
| 1 | Registro de un reporte válido | CA-01 / RF-02 | `POST /api/reportes` → 201 | Aprobada |
| 2 | Registro con datos faltantes o inválidos | CA-01 / RF-02 | `POST /api/reportes` → 500 (sin crear registros) | Aprobada |
| 3 | Consulta de reportes y de sus datos | CA-01, CA-06 / RF-03, RF-09 | `GET /api/reportes` → 200 | Aprobada |
| 4 | Consulta de un reporte inexistente | Manejo de errores | `PATCH /api/reportes/99999/estado` → 404 | Aprobada |
| 5 | Evaluación válida de un reporte | CA-02 / RF-04 | `PATCH /api/reportes/:id/estado` → 200 | Aprobada |
| 6 | Transición de estado no permitida | CA-02 / RF-10, RN-02 | `PATCH /api/reportes/:id/estado` → 400 | Aprobada |
| 7 | Asignación de un responsable | CA-03 / RF-05 | `PATCH /api/reportes/:id/asignar` → 200 | Aprobada |
| 8 | Gestión por un usuario no autorizado | CA-02, CA-03 / RF-11, RN-04 | Interfaz: dashboard por rol | Aprobada |
| 9 | Registro de una intervención | CA-04 / RF-07 | `POST /api/intervenciones` → 201 | Aprobada |
| 10 | Cierre de un reporte y consulta del resultado | CA-05 / RF-08 | `PATCH /api/reportes/:id/estado` → 200 | Aprobada |
| 11 | Consulta de información consolidada | CA-06 / RF-09 | `GET /api/reportes` → 200 | Aprobada |
| 12 | Integración interfaz–API–base de datos | CA-01 a CA-06 | Flujo completo desde la interfaz | Aprobada |

## Detalle de las pruebas

### Prueba 1. Registro de un reporte de falla válido
- **Requisito:** CA-01 / RF-02.
- **Condiciones iniciales:** base de datos con `seed.sql`; sesión iniciada como Reportante.
- **Pasos:** en el dashboard del reportante escribir la descripción, indicar el ID del espacio y pulsar "Enviar Reporte".
- **Datos de entrada:** `{ "descripcion": "Falla en la iluminación del Aula 101", "espacio_id": 1, "reportante_id": 1 }`.
- **Método y HTTP:** `POST /api/reportes` → **201**.
- **Resultado esperado:** reporte asociado a un espacio y persistido.
- **Resultado obtenido:** el reporte se crea en estado `Reportado` y aparece en la tabla "Mis Reportes".
- **Estado:** Aprobada.
- **Evidencia:** [prueba1_crear_reporte.png](../evidencias/prueba1_crear_reporte.png) y [pruebas_api.md](../evidencias/pruebas_api.md) (prueba 1).

### Prueba 2. Registro con datos obligatorios faltantes o inválidos
- **Requisito:** CA-01 / RF-02.
- **Condiciones iniciales:** sesión iniciada como Reportante.
- **Pasos:** (a) en la interfaz, enviar el formulario con la descripción vacía; (b) por HTTP, enviar la solicitud sin descripción y con un espacio inexistente.
- **Datos de entrada:** `{ "espacio_id": 1, "reportante_id": 1 }` y `{ "descripcion": "x", "espacio_id": 999, "reportante_id": 1 }`.
- **Método y HTTP:** `POST /api/reportes` → **500** con el mensaje `Error al crear reporte`.
- **Resultado esperado:** entrada rechazada sin crear registros inválidos.
- **Resultado obtenido:** la interfaz muestra una alerta y no envía el formulario. Si la solicitud llega a la API sin descripción o con un espacio inexistente, la base de datos la rechaza (restricción `NOT NULL` y llave foránea), la API responde con un mensaje genérico y no se crea ningún registro.
- **Estado:** Aprobada.
- **Evidencia:** [pruebas_api.md](../evidencias/pruebas_api.md) (pruebas 2a y 2b) y la validación en `DashboardReportante.jsx`.

### Prueba 3. Consulta de reportes y de sus datos
- **Requisito:** CA-01, CA-06 / RF-03, RF-09.
- **Condiciones iniciales:** existen reportes en la base de datos.
- **Pasos:** iniciar sesión como Coordinación y abrir "Todos los Reportes"; consultar `GET /api/reportes`.
- **Datos de entrada:** ninguno.
- **Método y HTTP:** `GET /api/reportes` → **200**.
- **Resultado esperado:** datos reales recuperados mediante la API.
- **Resultado obtenido:** la API devuelve cada reporte con sus datos (identificador, descripción, estado, fecha, espacio, reportante y responsable) y la tabla muestra la información guardada en la base de datos.
- **Estado:** Aprobada.
- **Evidencia:** [prueba2_evaluar.png](../evidencias/prueba2_evaluar.png) y [pruebas_api.md](../evidencias/pruebas_api.md) (prueba 3).

### Prueba 4. Consulta de un reporte inexistente
- **Requisito:** manejo de errores (transversal).
- **Condiciones iniciales:** no existe un reporte con id 99999.
- **Pasos:** enviar la solicitud de cambio de estado sobre ese id.
- **Datos de entrada:** `{ "nuevo_estado": "En Evaluacion" }`.
- **Método y HTTP:** `PATCH /api/reportes/99999/estado` → **404**.
- **Resultado esperado:** respuesta HTTP de error controlada.
- **Resultado obtenido:** `{ "error": "Reporte no encontrado" }`; no se modifica ningún dato y la interfaz no se rompe.
- **Estado:** Aprobada.
- **Evidencia:** [pruebas_api.md](../evidencias/pruebas_api.md) (prueba 4).

### Prueba 5. Evaluación y actualización válida de un reporte
- **Requisito:** CA-02 / RF-04.
- **Condiciones iniciales:** un reporte en estado `Reportado`; sesión como Coordinación.
- **Pasos:** pulsar "Evaluar" en el reporte.
- **Datos de entrada:** `{ "nuevo_estado": "En Evaluacion" }`.
- **Método y HTTP:** `PATCH /api/reportes/:id/estado` → **200**.
- **Resultado esperado:** estado o decisión de atención registrado correctamente.
- **Resultado obtenido:** el reporte pasa de `Reportado` a `En Evaluacion` y el cambio queda guardado.
- **Estado:** Aprobada.
- **Evidencia:** [prueba3_enevaluar.png](../evidencias/prueba3_enevaluar.png) y [pruebas_api.md](../evidencias/pruebas_api.md) (prueba 5).

### Prueba 6. Intento de transición de estado no permitida
- **Requisito:** CA-02 / RF-10, RN-02.
- **Condiciones iniciales:** un reporte en estado `Reportado`.
- **Pasos:** solicitar directamente el estado `Cerrado`.
- **Datos de entrada:** `{ "nuevo_estado": "Cerrado" }`.
- **Método y HTTP:** `PATCH /api/reportes/:id/estado` → **400**.
- **Resultado esperado:** operación rechazada según las reglas aprobadas.
- **Resultado obtenido:** `{ "error": "Transición no permitida de \"Reportado\" a \"Cerrado\"" }`; el estado no cambia.
- **Estado:** Aprobada.
- **Evidencia:** [pruebas_api.md](../evidencias/pruebas_api.md) (prueba 6) y la tabla de transiciones en `reportes.routes.js`.

### Prueba 7. Asignación de un responsable autorizado
- **Requisito:** CA-03 / RF-05.
- **Condiciones iniciales:** un reporte `En Evaluacion`; sesión como Coordinación.
- **Pasos:** elegir un técnico en el selector "Asignar Técnico...".
- **Datos de entrada:** `{ "asignado_id": 2 }`.
- **Método y HTTP:** `PATCH /api/reportes/:id/asignar` → **200**.
- **Resultado esperado:** asignación persistida y visible.
- **Resultado obtenido:** el reporte queda `Asignado` con el técnico elegido y aparece en el dashboard del técnico.
- **Estado:** Aprobada.
- **Evidencia:** [prueba4_asignar.png](../evidencias/prueba4_asignar.png).

### Prueba 8. Intento de gestión por un usuario no autorizado
- **Requisito:** CA-02, CA-03 / RF-11, RN-04.
- **Condiciones iniciales:** reportes en estado `Reportado` y `En Evaluacion`.
- **Pasos:** iniciar sesión como Reportante y buscar las acciones de evaluar, asignar y cerrar; repetir con Mantenimiento.
- **Datos de entrada:** credenciales de `reportante@admin.com` y `tecnico@admin.com`.
- **Método y HTTP:** interfaz web; cada rol accede a su dashboard (`/dashboard`).
- **Resultado esperado:** operación impedida sin alterar la información.
- **Resultado obtenido:** el Reportante solo ve el formulario para reportar y sus propios reportes, y Mantenimiento solo ve sus reportes asignados y el formulario de intervención. Ninguno de los dos dispone de las acciones de evaluar, asignar o cerrar, y los reportes no se modifican.
- **Estado:** Aprobada.
- **Evidencia:** [prueba1_crear_reporte.png](../evidencias/prueba1_crear_reporte.png) y [prueba5_intervenir.png](../evidencias/prueba5_intervenir.png) (pantallas de cada rol) y el enrutamiento por rol en `App.jsx`.

### Prueba 9. Registro de una intervención válida
- **Requisito:** CA-04 / RF-07.
- **Condiciones iniciales:** un reporte `Asignado`; sesión como el técnico asignado.
- **Pasos:** pulsar "Registrar Intervención", escribir la descripción y guardar.
- **Datos de entrada:** `{ "descripcion": "Se cambió la lámpara", "reporte_id": 1, "tecnico_id": 2 }`.
- **Método y HTTP:** `POST /api/intervenciones` → **201**.
- **Resultado esperado:** actuación asociada al reporte y almacenada.
- **Resultado obtenido:** la intervención se guarda en la tabla `intervenciones` con su `reporte_id` y el reporte pasa a `En Proceso`.
- **Estado:** Aprobada.
- **Evidencia:** [prueba5_intervenir.png](../evidencias/prueba5_intervenir.png).

### Prueba 10. Cierre de un reporte y consulta de su resultado
- **Requisito:** CA-05 / RF-08.
- **Condiciones iniciales:** un reporte `En Proceso`; sesión como Coordinación.
- **Pasos:** pulsar "Cerrar".
- **Datos de entrada:** `{ "nuevo_estado": "Cerrado" }`.
- **Método y HTTP:** `PATCH /api/reportes/:id/estado` → **200**.
- **Resultado esperado:** cierre conservado junto con el historial.
- **Resultado obtenido:** el reporte queda `Cerrado`, sin acciones disponibles, y sigue consultable. Un cambio posterior sobre un reporte cerrado es rechazado con 400. El cierre conserva el estado final del reporte.
- **Estado:** Aprobada.
- **Evidencia:** [prueba7_cerrar.png](../evidencias/prueba7_cerrar.png).

### Prueba 11. Consulta de información consolidada
- **Requisito:** CA-06 / RF-09.
- **Condiciones iniciales:** reportes en distintos estados; sesión como Coordinación.
- **Pasos:** abrir "Todos los Reportes", revisar los conteos por estado y aplicar el filtro de cada estado.
- **Datos de entrada:** filtro por estado (Todos, Reportado, En Evaluacion, Asignado, En Proceso, Cerrado).
- **Método y HTTP:** `GET /api/reportes` → **200**.
- **Resultado esperado:** cantidades y filtros coherentes con los datos almacenados.
- **Resultado obtenido:** el dashboard muestra el total y la cantidad de reportes por estado; al elegir un estado, la tabla muestra solo esos reportes y su número coincide con el conteo del botón.
- **Estado:** Aprobada.
- **Evidencia:** [prueba6_enproceso.png](../evidencias/prueba6_enproceso.png).

### Prueba 12. Integración interfaz–API–base de datos
- **Requisito:** CA-01 a CA-06.
- **Condiciones iniciales:** base de datos con `seed.sql`; backend y frontend en ejecución.
- **Pasos:** Reportante registra la falla → Coordinación la evalúa → Coordinación asigna un técnico → el técnico registra la intervención → Coordinación cierra → el reporte aparece `Cerrado`.
- **Datos de entrada:** los de las pruebas 1, 5, 7, 9 y 10.
- **Método y HTTP:** 201, 200, 200, 201 y 200, en ese orden.
- **Resultado esperado:** flujo completo de reporte, asignación, intervención y cierre demostrado.
- **Resultado obtenido:** el reporte recorre todos los estados y cada cambio queda guardado en PostgreSQL.
- **Estado:** Aprobada.
- **Evidencia:** secuencia de capturas `prueba1` a `prueba7` en [evidencias/](../evidencias/).