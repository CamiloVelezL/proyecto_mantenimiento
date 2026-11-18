# Matriz de trazabilidad

Proyecto Final 05 - Gestión de mantenimiento de instalaciones.

Relaciona cada condición obligatoria (CA-01 a CA-06) con el requisito que la cubre (ver [requisitos.md](requisitos.md)), el componente que la implementa, el pull request que lo integró y la prueba de [pruebas.md](pruebas.md) que la verifica.

## 1. Matriz principal

| Condición | Requisito aprobado | Implementación (ruta/componente) | Pull request | Prueba |
|---|---|---|---|---|
| CA-01 | RF-02 Registrar una falla con su espacio. RF-03 Consultar los reportes propios | `POST /api/reportes` y `GET /api/reportes` (`reportes.routes.js`); `DashboardReportante.jsx`; tablas `reportes` y `espacios` | #3 (API y esquema), #5 (dashboard del reportante) | Pruebas 1, 2 y 3 |
| CA-02 | RF-04 Evaluar un reporte. RF-10 Controlar las transiciones de estado | `PATCH /api/reportes/:id/estado` con la regla de transiciones (`reportes.routes.js`); botón Evaluar en `DashboardCoordinacion.jsx` | #3 (endpoint), #5 (regla de transiciones y botón) | Pruebas 5, 6 y 8 |
| CA-03 | RF-05 Asignar un técnico. RF-06 Consultar los reportes asignados | `PATCH /api/reportes/:id/asignar` y `GET /api/auth/tecnicos`; columna `reportes.asignado_id`; selector de técnico en `DashboardCoordinacion.jsx`; `DashboardMantenimiento.jsx` | #3 (API y esquema), #5 (dashboards) | Pruebas 7 y 8 |
| CA-04 | RF-07 Registrar intervenciones vinculadas al reporte | `POST /api/intervenciones` (`intervenciones.routes.js`); tabla `intervenciones` con `reporte_id` y `tecnico_id`; formulario en `DashboardMantenimiento.jsx` | #3 (API y esquema), #5 (formulario) | Prueba 9 |
| CA-05 | RF-08 Cerrar la atención y conservar el estado final. RF-10 Un reporte cerrado es final | `PATCH /api/reportes/:id/estado` con `Cerrado`; botón Cerrar en `DashboardCoordinacion.jsx`; el reporte cerrado queda en solo lectura | #5 | Prueba 10 |
| CA-06 | RF-09 Consultar todos los reportes con su estado | `GET /api/reportes`; tabla "Todos los Reportes" con filtro y conteo por estado en `DashboardCoordinacion.jsx` | #3 (API), #5 (tabla), #10 (filtro y conteo por estado) | Prueba 11 |

## 2. Requisitos transversales

| Requisito | Implementación | Pull request | Prueba |
|---|---|---|---|
| RF-01 Iniciar sesión con cuentas creadas por el equipo. RNF-01 Contraseñas cifradas | `POST /api/auth/login` y `POST /api/auth/register` con bcrypt (`auth.routes.js`); `Login.jsx`; `seed.sql` | #3 (API con bcrypt), #4 (login y enrutamiento) | Prueba 12 |
| RF-11 Cada rol ve solo lo que le corresponde. RN-07 | `DashboardRouter` en `App.jsx` y un dashboard por rol | #5 | Prueba 8 |
| RNF-02 Consistencia de los datos | Llaves foráneas y restricciones `CHECK` en `schema.sql` | #3 | Pruebas 1, 5, 7 y 9 |
| RNF-05 Reproducibilidad | `README.md`, `.env.example`, `database/schema.sql`, `database/seed.sql` | #1 (`.env.example`, `.gitignore`), #2 (backend), #3 (esquema); #10 (`seed.sql` y README) | Prueba 12 |
| Integración interfaz–API–base de datos | Flujo completo reporte, evaluación, asignación, intervención y cierre | #3, #4 y #5 | Prueba 12 |

## 3. Pull requests del repositorio

| PR | Rama | Contenido | Autor |
|---|---|---|---|
| #1 | `feature/configuracion-inicial` | Estructura inicial, `.gitignore`, `.env.example` y estructura del README | Camilo |
| #2 | `feature/backend-setup` | Servidor Express y conexión a PostgreSQL | Camilo |
| #3 | `feature/db-api-routes` | `schema.sql` y rutas de autenticación, reportes e intervenciones | Camilo |
| #4 | `feature/frontend-react` | Axios, login y enrutamiento | Camilo |
| #5 | `feature/dashboards` | Dashboards por rol y reglas de transición de estado | Camilo |
| #6 | `feature/docs-design` | `docs/diseno.md`: arquitectura, modelo de datos y especificación de la API | Luis Carlos |
| #7 | `feature/docs-design` | `docs/diseno.md`: diagrama de secuencia con el flujo completo | Luis Carlos |
| #8 | `feature/docs-design` | `docs/requisitos.md` | Luis Carlos |
| #9 | `feature/docs-design` | `docs/trazabilidad.md` | Luis Carlos |
| #10 | `feature/cierre-proyecto` | Filtro y conteo por estado en Coordinación; README, `docs/pruebas.md`, `docs/trazabilidad.md`, datos de prueba y evidencias de la API | Luis Carlos |

Los commits `b53adb2` (conexión a PostgreSQL, datos de prueba y estilos), `9fefdaa` (README), `8cef57e` (evidencias) y `71f30ee` (documentación) se subieron directamente a `main` el 15 de noviembre de 2026.

## 4. Cómo leer la matriz

- Las pruebas se numeran como en [pruebas.md](pruebas.md), que sigue las 12 pruebas mínimas de la guía. La prueba 4 (reporte inexistente) es transversal y no se asocia a una sola condición.
- Los números de pull request (`#N`) son los que GitHub asignó a cada PR del repositorio; se pueden abrir en `https://github.com/CamiloVelezL/proyecto_mantenimiento/pull/N`.
- Las decisiones confirmadas con el docente (actores, acceso, cierre sin reapertura y alcance) están en la sección 2 de [requisitos.md](requisitos.md).