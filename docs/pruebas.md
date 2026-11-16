# Documentación de Pruebas Funcionales 

A continuación se documentan las pruebas mínimas exigidas, demostrando el correcto funcionamiento del sistema y la integración de la interfaz, la API y la base de datos.

| # | Prueba Mínima                                         | Evidencia Esperada                                     | Resultado Obtenido                                                               | Estado      | Captura |
|---|---                                                    |---                                                     |---                                                                               |---          |---      |
| 1 | Registro de un reporte de falla válido                | Reporte asociado a un espacio y persistido             | El reporte #3 se creó correctamente y apareció en la tabla.                      | ✅ Aprobada | [prueba1_crear_reporte.png](../evidencias/prueba1_crear_reporte.png) |
| 2 | Registro con datos obligatorios faltantes o inválidos | Entrada rechazada sin crear registros inválidos        | El sistema muestra una alerta y bloquea el envío si la descripción está vacía.   | ✅ Aprobada | (Ver validación en el código de `DashboardReportante.jsx`) |
| 3 | Consulta de reportes y detalle de un reporte          | Datos reales recuperados mediante la API               | La tabla de "Todos los Reportes" carga los datos de la BD en tiempo real.        | ✅ Aprobada | [prueba2_evaluar.png](../evidencias/prueba2_evaluar.png) |
| 4 | Consulta de un reporte inexistente                    | Respuesta HTTP de error controlada                     | El backend responde con 404 y el frontend maneja el error sin romperse.          | ✅ Aprobada | (Verificado en Postman/consola) |
| 5 | Evaluación y actualización válida de un reporte       | Estado o decisión de atención registrado correctamente | El coordinador cambia el estado de "Reportado" a "En Evaluación".                | ✅ Aprobada | [prueba3_en_evaluacion.png](../evidencias/prueba3_en_evaluacion.png) |
| 6 | Intento de transición de estado no permitida          | Operación rechazada según reglas aprobadas             | El backend bloquea saltar de "Reportado" a "Cerrado" (error 400).                | ✅ Aprobada | (Ver reglas en `reportes.routes.js`) |
| 7 | Asignación de un responsable autorizado               | Asignación persistida y visible                        | El coordinador asigna el reporte al técnico real y el estado pasa a "Asignado".  | ✅ Aprobada | [prueba4_asignar.png](../evidencias/prueba4_asignar.png) |
| 8 | Intento de gestión por un usuario no autorizado       | Operación impedida sin alterar la información          | El Reportante no ve botones de asignación ni evaluación.                         | ✅ Aprobada | (Diseño de permisos por rol en `App.jsx`) |
| 9 | Registro de una intervención válida                   | Actuación asociada al reporte y almacenada             | El técnico registra la intervención y el reporte pasa a "En Proceso".            | ✅ Aprobada | [prueba5_intervenir.png](../evidencias/prueba5_intervenir.png) |
| 10 | Cierre de un reporte y consulta de su resultado      | Cierre conservado junto con el historial               | El coordinador cierra el reporte y queda en estado "Cerrado" (solo lectura).     | ✅ Aprobada | [prueba7_cerrar.png](../evidencias/prueba7_cerrar.png) |
| 11 | Consulta de información consolidada                  | Cantidades y filtros coherentes con datos almacenados  | El coordinador ve todos los reportes del sistema con sus estados reales.         | ✅ Aprobada | [prueba6_enproceso.png](../evidencias/prueba6_enproceso.png) |
| 12 | Integración interfaz–API–base de datos               | Flujo completo demostrado                              | Las 7 capturas demuestran el flujo completo de principio a fin.                  | ✅ Aprobada | (Secuencia completa de imágenes) |

## Notas Adicionales
*   Las pruebas se realizaron utilizando los tres usuarios de prueba definidos en el `README.md`.
*   Se verificó que las transiciones de estado cumplen estrictamente con las reglas de negocio (no se puede cerrar un reporte sin pasar por "En Proceso").
*   La autenticación se validó usando bcrypt y tokens de sesión simulados (localStorage).