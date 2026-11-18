# Matriz de trazabilidad

Proyecto Final 05 - Gestión de mantenimiento de instalaciones.

Relaciona cada condición obligatoria (CA-01 a CA-06) con el requisito que la cubre (ver [requisitos.md](requisitos.md)), el componente que la implementa, el pull request y la prueba de [pruebas.md](pruebas.md) que la verifica.

## 1. Matriz principal

| Condición | Requisito aprobado | Implementación (ruta/componente) | Pull request | Prueba |
|---|---|---|---|---|
| CA-01 | RF-02 Registrar una falla con su espacio. RF-03 Consultar los reportes propios | `POST /api/reportes` y `GET /api/reportes` (`reportes.routes.js`); `DashboardReportante.jsx`; tablas `reportes` y `espacios` | #__ | Pruebas 1, 2 y 3 |
| CA-02 | RF-04 Evaluar un reporte. RF-10 Controlar las transiciones de estado | `PATCH /api/reportes/:id/estado` con la regla de transiciones (`reportes.routes.js`); botón Evaluar en `DashboardCoordinacion.jsx` | #__ | Pruebas 4, 5 y 6 |
| CA-03 | RF-05 Asignar un técnico. RF-06 Consultar los reportes asignados | `PATCH /api/reportes/:id/asignar` y `GET /api/auth/tecnicos`; columna `reportes.asignado_id`; selector de técnico en `DashboardCoordinacion.jsx`; `DashboardMantenimiento.jsx` | #__ | Prueba 7 |
| CA-04 | RF-07 Registrar intervenciones vinculadas al reporte | `POST /api/intervenciones` (`intervenciones.routes.js`); tabla `intervenciones` con `reporte_id` y `tecnico_id`; formulario en `DashboardMantenimiento.jsx` | #__ | Prueba 9 |
| CA-05 | RF-08 Cerrar la atención y conservar el estado final. RF-10 Un reporte cerrado es final | `PATCH /api/reportes/:id/estado` con `Cerrado`; botón Cerrar en `DashboardCoordinacion.jsx`; el reporte cerrado queda en solo lectura | #__ | Prueba 10 |
| CA-06 | RF-09 Consultar todos los reportes con su estado | `GET /api/reportes`; tabla "Todos los Reportes" en `DashboardCoordinacion.jsx` | #__ | Prueba 11 |

## 2. Requisitos transversales

| Requisito | Implementación | Pull request | Prueba |
|---|---|---|---|
| RF-01 Iniciar sesión con cuentas creadas por el equipo. RNF-01 Contraseñas cifradas | `POST /api/auth/login` y `POST /api/auth/register` con bcrypt (`auth.routes.js`); `Login.jsx`; `seed.sql` | #__ | Prueba 12 |
| RF-11 Cada rol ve solo lo que le corresponde. RN-07 | `DashboardRouter` en `App.jsx` y un dashboard por rol | #__ | Prueba 8 |
| RNF-02 Consistencia de los datos | Llaves foráneas y restricciones `CHECK` en `schema.sql` | #__ | Pruebas 1, 5, 7 y 9 |
| RNF-05 Reproducibilidad | `README.md`, `.env.example`, `database/schema.sql`, `database/seed.sql` | #__ | Prueba 12 |
| Integración interfaz–API–base de datos | Flujo completo reporte, evaluación, asignación, intervención y cierre | #__ | Prueba 12 |

## 3. Cómo leer la matriz

- Las pruebas se numeran como en `docs/pruebas.md` (pruebas mínimas 1 a 12).
- Los números de pull request (#__) se completan con los del repositorio.
- Las decisiones confirmadas con el docente (actores, acceso, cierre sin reapertura y alcance) están en la sección 2 de `requisitos.md`.
