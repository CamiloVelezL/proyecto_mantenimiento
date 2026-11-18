# Proyecto Final 05 - Gestión de Mantenimiento de Instalaciones

Aplicación web para gestionar reportes de fallas y mantenimiento correctivo de instalaciones: desde que se reporta una falla hasta que se evalúa, se asigna a un técnico, se interviene y se cierra.

## 1. Información General

| Campo | Detalle |
|---|---|
| **Proyecto** | Gestión de mantenimiento de instalaciones (guía PF-05) |
| **Problema seleccionado** | Gestión de fallas y mantenimiento correctivo de instalaciones (aulas, oficinas, laboratorios) |
| **Asignatura** | Aplicaciones y Servicios Web |
| **Programa** | Tecnología en Desarrollo de Software |
| **Docente** | Juan Carlos Morales Guerra |
| **Fecha** | 18 de noviembre de 2026 |
| **Repositorio** | https://github.com/CamiloVelezL/proyecto_mantenimiento |

### Integrantes y contribución

El proyecto se desarrolló **en pareja**, con ramas y pull requests en GitHub. Los aportes se pueden verificar en el historial de commits y en los PR enlazados en la sección 8.

| Integrante | Usuario de GitHub | Contribución |
|---|---|---|
| Camilo Andrés Vélez Luna | [@CamiloVelezL](https://github.com/CamiloVelezL) | Estructura inicial del repositorio y variables de entorno (PR #1); backend Express y conexión a PostgreSQL (PR #2); esquema de la base de datos y rutas de autenticación, reportes e intervenciones (PR #3); frontend React, login y enrutamiento (PR #4); dashboards por rol y reglas de transición de estado (PR #5); datos de prueba, estilos, README inicial y evidencias de las pruebas funcionales |
| Luis Carlos Marín Mayo | [@LuisKMarin](https://github.com/LuisKMarin) | `docs/diseno.md`: arquitectura, modelo de datos, especificación de la API y diagrama de secuencia (PR #6 y #7); `docs/requisitos.md`: actores, requisitos, reglas de negocio, historias de usuario y registro de entrevista (PR #8); `docs/trazabilidad.md` (PR #9); filtro y conteo por estado en el dashboard de Coordinación, README, datos de prueba, `docs/pruebas.md` y evidencias de la API (PR #10) |

## 2. Descripción del Sistema

*   **Problema abordado:** los reportes de fallas se comunican por llamadas, correos y mensajes informales, y la información queda dispersa. El sistema los centraliza y permite hacer seguimiento desde el reporte hasta el cierre.
*   **Actores:** Reportante, Personal de Mantenimiento y Coordinación.
*   **Alcance aprobado:** sistema web (frontend, API REST y base de datos) para registrar fallas por espacio, evaluarlas, asignar un técnico, registrar intervenciones y cerrar la atención. Fuera del alcance: notificaciones, inventarios, recuperación de contraseña, rol de administrador, autorregistro de usuarios y reapertura de reportes cerrados.
*   **Resumen de la solución:** una pantalla por rol. El ciclo de vida de un reporte es `Reportado → En Evaluación → Asignado → En Proceso → Cerrado`, y la API solo permite avanzar al estado siguiente.
*   **Restricciones:** las cuentas las crea el equipo (no hay autorregistro) y un reporte cerrado no se puede reabrir.
*   **Documento de requisitos:** [docs/requisitos.md](docs/requisitos.md)

## 3. Requisitos y Alcance

*   **Método para obtener la información:** entrevista con el docente, en el rol de representante de la organización, por el chat de Teams (17 y 18 de noviembre de 2026). El registro completo de preguntas y respuestas está en la sección 2 de [docs/requisitos.md](docs/requisitos.md).
*   **Decisiones confirmadas por el docente:**
    1.  Se mantienen los tres actores; no se agrega un rol de administrador.
    2.  Las cuentas las crea el equipo; no hay autorregistro.
    3.  Un reporte cerrado no se reabre; si queda un fallo se crea un reporte nuevo.
    4.  Quedan fuera notificaciones, inventarios y recuperación de contraseña.
*   **Requisitos priorizados** (detalle en `docs/requisitos.md`). Todos los requisitos funcionales tienen prioridad Alta, salvo RF-11 (Media):

| Requisito | Descripción | Condición |
|---|---|---|
| RF-02, RF-03 | Registrar una falla en un espacio y consultar los reportes propios | CA-01 |
| RF-04, RF-10 | Evaluar un reporte y controlar las transiciones de estado | CA-02 |
| RF-05, RF-06 | Asignar un técnico y consultar los reportes asignados | CA-03 |
| RF-07 | Registrar intervenciones vinculadas al reporte | CA-04 |
| RF-08 | Cerrar la atención y conservar el estado final | CA-05 |
| RF-09 | Consultar todos los reportes con su estado | CA-06 |
| RF-01, RF-11 | Iniciar sesión y mostrar a cada rol solo lo que le corresponde | Apoyo |

*   **Historias de usuario y criterios de aceptación:** HU-01 a HU-07 en la sección 7 de `docs/requisitos.md`. Las condiciones obligatorias CA-01 a CA-06 se relacionan con su implementación y sus pruebas en [docs/trazabilidad.md](docs/trazabilidad.md).

## 4. Arquitectura, Diseño de API y Modelo de Datos

Arquitectura cliente-servidor de tres capas:

```
Navegador  ->  Frontend (React + Vite + Axios, :5173)  ->  API REST (Node.js + Express, :3000)  ->  PostgreSQL (mantenimiento_db)
```

| Capa | Tecnología | Responsabilidad |
|---|---|---|
| Interfaz | React, Vite, Axios, React Router | Una pantalla por rol; envía formularios y consume la API |
| Servicios | Node.js, Express, bcryptjs, cors | Expone la API REST, aplica las reglas de transición y cifra las contraseñas |
| Información | PostgreSQL | Guarda usuarios, espacios, reportes e intervenciones |

*   **Modelo de datos:** tablas `usuarios`, `espacios`, `reportes` e `intervenciones`, con llaves foráneas y restricciones `CHECK` (diagrama entidad-relación en `docs/diseno.md`).
*   **Prototipos de interfaz:** capturas en la sección 7 de `docs/diseno.md` y en la carpeta `evidencias/`.
*   **Justificación de tecnologías, diagramas y especificación completa de la API:** [docs/diseno.md](docs/diseno.md)

## 5. Configuración del Entorno y Ejecución

### Requisitos previos
*   Node.js (versión 20 o superior) y npm
*   PostgreSQL instalado y en ejecución

### Pasos para ejecutar el proyecto

1.  **Clonar el repositorio**
    ```bash
    git clone https://github.com/CamiloVelezL/proyecto_mantenimiento.git
    cd proyecto_mantenimiento
    ```

2.  **Base de datos:** crear la base y cargar el esquema y los datos de prueba.
    ```bash
    psql -U postgres -c "CREATE DATABASE mantenimiento_db;"
    psql -U postgres -d mantenimiento_db -f database/schema.sql
    psql -U postgres -d mantenimiento_db -f database/seed.sql
    ```
    (También se pueden ejecutar los dos scripts desde pgAdmin.)

3.  **Backend:** el archivo `.env` va dentro de la carpeta `backend/`.
    ```bash
    cd backend
    npm install
    cp ../.env.example .env      # en Windows (PowerShell): copy ..\.env.example .env
    # Editar .env con el usuario y la contraseña de PostgreSQL
    npm run dev
    ```
    Variables de `.env` (ver `.env.example`): `PORT`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME`. El archivo `.env` no se sube al repositorio. La API queda en `http://localhost:3000`; para comprobar la conexión con la base de datos se puede abrir `http://localhost:3000/test-db`.

4.  **Frontend:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    La interfaz queda en `http://localhost:5173`. Si la API usa otra dirección, definir `VITE_API_URL` en `frontend/.env` (por defecto `http://localhost:3000/api`).

### Usuarios de prueba (datos ficticios)

`database/seed.sql` crea tres usuarios, uno por rol, con la contraseña **123456**:

| Rol | Correo | Contraseña |
|---|---|---|
| Reportante | `reportante@admin.com` | `123456` |
| Mantenimiento | `tecnico@admin.com` | `123456` |
| Coordinación | `coordinador@admin.com` | `123456` |

También se crean tres espacios (Aula 101, Oficina 202 y Laboratorio 3) y un reporte inicial. Se pueden crear usuarios nuevos con `POST /api/auth/register`.

## 6. Servicios Web Implementados

Dirección base: `http://localhost:3000`. Las solicitudes y respuestas usan JSON.

| Método | Ruta | Descripción | Requisito relacionado |
|---|---|---|---|
| POST | `/api/auth/register` | Registra un usuario con la contraseña cifrada | RF-01, RNF-01 |
| POST | `/api/auth/login` | Inicia sesión y devuelve los datos públicos del usuario | RF-01, RF-11 |
| GET | `/api/auth/tecnicos` | Lista los usuarios de Mantenimiento (para asignar) | RF-05 (CA-03) |
| POST | `/api/reportes` | Crea un reporte de falla en estado `Reportado` | RF-02 (CA-01) |
| GET | `/api/reportes` | Lista los reportes, del más reciente al más antiguo | RF-03, RF-06, RF-09 (CA-01, CA-03, CA-06) |
| PATCH | `/api/reportes/:id/estado` | Cambia el estado si la transición es válida (evaluar y cerrar) | RF-04, RF-08, RF-10 (CA-02, CA-05) |
| PATCH | `/api/reportes/:id/asignar` | Asigna un técnico y deja el reporte en `Asignado` | RF-05 (CA-03) |
| POST | `/api/intervenciones` | Registra una intervención y pasa el reporte a `En Proceso` | RF-07 (CA-04) |

### Ejemplos

**Iniciar sesión**: `POST /api/auth/login`

```json
{ "email": "coordinador@admin.com", "password": "123456" }
```
Respuesta `200`:
```json
{ "mensaje": "Login exitoso", "usuario": { "id": 3, "nombre": "Coordinador Uno", "email": "coordinador@admin.com", "rol": "Coordinacion" } }
```
Con credenciales incorrectas responde `401` con `{ "error": "Credenciales inválidas" }`.

**Crear un reporte**: `POST /api/reportes`

```json
{ "descripcion": "Falla en la iluminación del Aula 101", "espacio_id": 1, "reportante_id": 1 }
```
Respuesta `201`:
```json
{ "id": 2, "descripcion": "Falla en la iluminación del Aula 101", "estado": "Reportado", "fecha_creacion": "2026-11-18T16:00:00.000Z", "espacio_id": 1, "reportante_id": 1, "asignado_id": null }
```

**Evaluar un reporte**: `PATCH /api/reportes/2/estado` con `{ "nuevo_estado": "En Evaluacion" }` responde `200` con el reporte actualizado.

**Asignar un técnico**: `PATCH /api/reportes/2/asignar` con `{ "asignado_id": 2 }` responde `200`; el reporte queda en `Asignado`.

**Registrar una intervención**: `POST /api/intervenciones` con `{ "descripcion": "Se cambió la lámpara", "reporte_id": 2, "tecnico_id": 2 }` responde `201` con la intervención creada; el reporte pasa a `En Proceso`.

### Validaciones y errores

| Situación | Respuesta |
|---|---|
| Transición de estado no permitida (por ejemplo `Reportado` a `Cerrado`) | `400` `{ "error": "Transición no permitida de \"Reportado\" a \"Cerrado\"" }` |
| Reporte inexistente al cambiar el estado | `404` `{ "error": "Reporte no encontrado" }` |
| Credenciales inválidas | `401` `{ "error": "Credenciales inválidas" }` |
| Error al guardar un dato (por ejemplo, falta un campo obligatorio) | `500` con un mensaje genérico, sin detalles internos |

La descripción de la falla también se valida en la interfaz antes de enviar el formulario. La especificación completa de cada servicio está en [docs/diseno.md](docs/diseno.md).

## 7. Pruebas de API e Integración y Evidencias de Funcionamiento

Las 12 pruebas funcionales mínimas se documentan en [docs/pruebas.md](docs/pruebas.md), con requisito, condiciones iniciales, pasos, datos de entrada, método y código HTTP, resultado y evidencia. Resumen:

| # | Prueba | Requisito | Resultado |
|---|---|---|---|
| 1 | Registro de un reporte válido | CA-01 | Aprobada |
| 2 | Registro con datos faltantes o inválidos | CA-01 | Aprobada |
| 3 | Consulta de reportes y de sus datos | CA-01, CA-06 | Aprobada |
| 4 | Consulta de un reporte inexistente | Transversal (manejo de errores) | Aprobada |
| 5 | Evaluación válida de un reporte | CA-02 | Aprobada |
| 6 | Transición de estado no permitida | CA-02, CA-05 | Aprobada |
| 7 | Asignación de un responsable | CA-03 | Aprobada |
| 8 | Gestión por un usuario no autorizado | CA-02, CA-03 | Aprobada |
| 9 | Registro de una intervención | CA-04 | Aprobada |
| 10 | Cierre de un reporte y consulta del resultado | CA-05 | Aprobada |
| 11 | Consulta de información consolidada | CA-06 | Aprobada |
| 12 | Integración interfaz–API–base de datos | CA-01 a CA-06 | Aprobada |

**Cómo reproducir las pruebas**

1.  Preparar la base de datos y levantar el backend y el frontend (sección 5).
2.  Pruebas de interfaz (1, 3, 5, 7, 8, 9, 10, 11 y 12): iniciar sesión con los usuarios de prueba y seguir el flujo `Reportante → Coordinación → Mantenimiento → Coordinación`.
3.  Pruebas de API (1 a 7): ejecutar los comandos de [evidencias/pruebas_api.md](evidencias/pruebas_api.md) con `curl`, o las mismas solicitudes en Postman o en un cliente HTTP.

*   **Evidencias:** capturas del flujo completo en la carpeta [evidencias/](evidencias/) y registro de solicitudes y respuestas en `evidencias/pruebas_api.md`.
*   **Matriz de trazabilidad:** [docs/trazabilidad.md](docs/trazabilidad.md)

## 8. Control de Versiones

Se utilizó Git y GitHub con ramas `feature/...` y pull requests hacia `main`. Repositorio: https://github.com/CamiloVelezL/proyecto_mantenimiento

| PR | Rama | Contenido | Autor |
|---|---|---|---|
| [#1](https://github.com/CamiloVelezL/proyecto_mantenimiento/pull/1) | `feature/configuracion-inicial` | Estructura inicial, `.gitignore`, `.env.example` y estructura del README | Camilo |
| [#2](https://github.com/CamiloVelezL/proyecto_mantenimiento/pull/2) | `feature/backend-setup` | Servidor Express y conexión a PostgreSQL con variables de entorno | Camilo |
| [#3](https://github.com/CamiloVelezL/proyecto_mantenimiento/pull/3) | `feature/db-api-routes` | `schema.sql` y rutas de autenticación, reportes e intervenciones; login seguro con bcrypt | Camilo |
| [#4](https://github.com/CamiloVelezL/proyecto_mantenimiento/pull/4) | `feature/frontend-react` | Axios, login, enrutamiento y manejo de errores | Camilo |
| [#5](https://github.com/CamiloVelezL/proyecto_mantenimiento/pull/5) | `feature/dashboards` | Dashboards por rol y reglas de transición de estado en el backend | Camilo |
| [#6](https://github.com/CamiloVelezL/proyecto_mantenimiento/pull/6) | `feature/docs-design` | Diseño: arquitectura, modelo de datos y especificación de la API | Luis Carlos |
| [#7](https://github.com/CamiloVelezL/proyecto_mantenimiento/pull/7) | `feature/docs-design` | Corrección del diagrama de secuencia con el flujo completo | Luis Carlos |
| [#8](https://github.com/CamiloVelezL/proyecto_mantenimiento/pull/8) | `feature/docs-design` | `docs/requisitos.md` (requisitos, reglas de negocio, historias y entrevista) | Luis Carlos |
| [#9](https://github.com/CamiloVelezL/proyecto_mantenimiento/pull/9) | `feature/docs-design` | `docs/trazabilidad.md` (matriz de trazabilidad) | Luis Carlos |
| [#10](https://github.com/CamiloVelezL/proyecto_mantenimiento/pull/10) | `feature/cierre-proyecto` | Filtro y conteo por estado en Coordinación; README, `docs/pruebas.md`, `docs/trazabilidad.md`, datos de prueba y evidencias de la API | Luis Carlos |

*   **Aportes por integrante:** Camilo implementó el backend, la base de datos y el frontend (PR #1 a #5); Luis Carlos elaboró la documentación de diseño, requisitos y trazabilidad (PR #6 a #9), agregó el filtro por estado de Coordinación, completó el README, los datos de prueba y la documentación de pruebas (PR #10).
*   **Commits directos a `main`:** además de los PR, cuatro commits de Camilo del 15 de noviembre entraron directamente a `main` (`b53adb2`: conexión a PostgreSQL, datos de prueba y estilos; `9fefdaa`: README; `8cef57e`: evidencias y primera matriz; `71f30ee`: documentación adicional).
*   Los commits siguen el formato `feat:`, `fix:` y `docs:`, y describen el cambio realizado.

## 9. Conclusiones y Limitaciones

**Cumplimiento.** El flujo completo `Reportado → En Evaluación → Asignado → En Proceso → Cerrado` funciona desde la interfaz hasta la base de datos, con tres roles y las condiciones de aceptación CA-01 a CA-06. La trazabilidad de cada condición está en [docs/trazabilidad.md](docs/trazabilidad.md) y las pruebas en [docs/pruebas.md](docs/pruebas.md).

**Dificultades y soluciones.**
*   La configuración inicial de PostgreSQL y de las variables de entorno: se resolvió leyendo las credenciales desde `.env` y entregando un `.env.example` sin secretos.
*   Evitar saltos de estado: se resolvió con una tabla de transiciones permitidas validada en el backend, que responde 400 si el cambio no es válido.
*   Los usuarios de prueba no podían iniciar sesión porque el hash de `seed.sql` no correspondía a la contraseña indicada y los correos no coincidían con el README: se corrigieron ambos y se verificó el inicio de sesión de los tres roles.

**Alcance de la versión entregada.**
*   La sesión se guarda en el navegador (`localStorage`) y cada rol accede a su propio dashboard.
*   Cada reporte se trata como independiente; la coordinación decide al evaluarlo si corresponde a una falla ya registrada.
*   El cierre conserva el estado final del reporte y un reporte cerrado no se reabre; si queda un fallo se crea un reporte nuevo.
*   Quedan fuera del alcance aprobado la recuperación de contraseña, las notificaciones, los inventarios y el despliegue en la nube.