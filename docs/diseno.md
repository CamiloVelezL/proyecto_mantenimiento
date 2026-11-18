# Diseño de la aplicación y los servicios web

Proyecto Final 05 - Gestión de mantenimiento de instalaciones.

## 1. Arquitectura

El sistema usa una arquitectura cliente-servidor de tres capas. Cada capa se ejecuta por separado y solo se comunica con la siguiente.

```mermaid
flowchart LR
    U[Usuario en el navegador] --> F[Frontend<br/>React + Vite + Axios<br/>localhost:5173]
    F -- HTTP / JSON --> B[API REST<br/>Node.js + Express<br/>localhost:3000]
    B -- SQL (pg) --> D[(PostgreSQL<br/>mantenimiento_db)]
```

| Capa | Tecnología | Responsabilidad |
|------|------------|-----------------|
| Interfaz | React, Vite, Axios, React Router | Mostrar pantallas por rol, enviar formularios y consumir la API |
| Servicios | Node.js, Express, bcryptjs, cors | Exponer la API REST, aplicar reglas de negocio y cifrar contraseñas |
| Información | PostgreSQL | Guardar usuarios, espacios, reportes e intervenciones |

Estructura de carpetas:

- `frontend/src/pages`: `Login`, `DashboardReportante`, `DashboardMantenimiento`, `DashboardCoordinacion`.
- `frontend/src/services/api.js`: cliente Axios con la dirección base de la API.
- `backend/src/routes`: `auth.routes.js`, `reportes.routes.js`, `intervenciones.routes.js`.
- `backend/src/db/pool.js`: conexión a PostgreSQL con variables de entorno.
- `database/schema.sql` y `database/seed.sql`: estructura y datos de prueba.

## 2. Actores y responsabilidades

| Actor | Rol en el sistema | Qué hace |
|-------|-------------------|----------|
| Reportante | `Reportante` | Registra fallas y consulta sus propios reportes |
| Personal de mantenimiento | `Mantenimiento` | Consulta los reportes que le asignaron y registra intervenciones |
| Coordinación | `Coordinacion` | Consulta todos los reportes, los evalúa, asigna técnico y cierra |

## 3. Modelo de datos

```mermaid
erDiagram
    USUARIOS ||--o{ REPORTES : "reporta (reportante_id)"
    USUARIOS ||--o{ REPORTES : "atiende (asignado_id)"
    ESPACIOS ||--o{ REPORTES : "ubica"
    REPORTES ||--o{ INTERVENCIONES : "tiene"
    USUARIOS ||--o{ INTERVENCIONES : "registra (tecnico_id)"

    USUARIOS {
        int id PK
        varchar nombre
        varchar email UK
        varchar password_hash
        varchar rol "Reportante | Mantenimiento | Coordinacion"
        timestamp created_at
    }
    ESPACIOS {
        int id PK
        varchar nombre
        varchar ubicacion
    }
    REPORTES {
        int id PK
        text descripcion
        varchar estado "Reportado | En Evaluacion | Asignado | En Proceso | Cerrado"
        timestamp fecha_creacion
        int espacio_id FK
        int reportante_id FK
        int asignado_id FK
    }
    INTERVENCIONES {
        int id PK
        text descripcion
        timestamp fecha
        int reporte_id FK
        int tecnico_id FK
    }
```

Restricciones en la base de datos:

- `usuarios.email` es único y `usuarios.rol` solo admite los tres valores del modelo.
- `reportes.estado` solo admite los cinco estados y por defecto es `Reportado`.
- Si se elimina un reporte, se eliminan sus intervenciones (`ON DELETE CASCADE`).
- Si se elimina el usuario asignado, `asignado_id` queda en `NULL`.

## 4. Ciclo de vida de un reporte

```mermaid
stateDiagram-v2
    [*] --> Reportado: Reportante crea el reporte
    Reportado --> EnEvaluacion: Coordinación evalúa
    EnEvaluacion --> Asignado: Coordinación asigna técnico
    Asignado --> EnProceso: Técnico registra intervención
    EnProceso --> Cerrado: Coordinación cierra
    Cerrado --> [*]
```

Regla de negocio: el estado solo avanza al siguiente de la lista y un reporte `Cerrado` no admite más cambios. El servidor lo valida en `PATCH /api/reportes/:id/estado` y responde 400 si la transición no está permitida.

## 5. Especificación de la API REST

Dirección base: `http://localhost:3000`. Todas las peticiones y respuestas usan JSON.

| Método | Ruta | Descripción | Condición | Códigos de respuesta |
|--------|------|-------------|-----------|----------------------|
| POST | `/api/auth/register` | Registra un usuario con la contraseña cifrada | Apoyo | 201, 500 |
| POST | `/api/auth/login` | Inicia sesión y devuelve los datos públicos del usuario | Apoyo | 200, 401, 500 |
| GET | `/api/auth/tecnicos` | Lista los usuarios con rol `Mantenimiento` | CA-03 | 200, 500 |
| POST | `/api/reportes` | Crea un reporte en estado `Reportado` | CA-01 | 201, 500 |
| GET | `/api/reportes` | Lista todos los reportes, del más reciente al más antiguo | CA-06 | 200, 500 |
| PATCH | `/api/reportes/:id/estado` | Cambia el estado si la transición es válida | CA-02, CA-05 | 200, 400, 404, 500 |
| PATCH | `/api/reportes/:id/asignar` | Asigna un técnico y deja el reporte en `Asignado` | CA-03 | 200, 500 |
| POST | `/api/intervenciones` | Registra una intervención y pasa el reporte a `En Proceso` | CA-04 | 201, 500 |

Los errores de formato o de servidor devuelven un cuerpo `{ "error": "mensaje" }` sin datos internos. El código 500 se usa cuando la base de datos rechaza la operación.

### POST /api/auth/login

Entrada:

```json
{ "email": "coordinador@admin.com", "password": "123456" }
```

Respuestas:

- 200: `{ "mensaje": "Login exitoso", "usuario": { "id": 3, "nombre": "...", "email": "...", "rol": "Coordinacion" } }`
- 401: `{ "error": "Credenciales inválidas" }`

### POST /api/reportes

Entrada:

```json
{ "descripcion": "Falla en la iluminación del Aula 101", "espacio_id": 1, "reportante_id": 1 }
```

Respuestas:

- 201: el reporte creado, con `estado` igual a `Reportado`.
- 500: `{ "error": "Error al crear reporte" }`

### PATCH /api/reportes/:id/estado

Entrada:

```json
{ "nuevo_estado": "En Evaluacion" }
```

Respuestas:

- 200: el reporte actualizado.
- 400: `{ "error": "Transición no permitida de \"Reportado\" a \"Cerrado\"" }`
- 404: `{ "error": "Reporte no encontrado" }`

### PATCH /api/reportes/:id/asignar

Entrada:

```json
{ "asignado_id": 2 }
```

Respuesta 200: el reporte con `asignado_id` igual a 2 y `estado` igual a `Asignado`.

### POST /api/intervenciones

Entrada:

```json
{ "descripcion": "Se cambió la lámpara", "reporte_id": 1, "tecnico_id": 2 }
```

Respuesta 201: la intervención creada. El reporte pasa a `En Proceso`.

## 6. Recorridos de los actores

Recorrido completo de un reporte, desde que se registra hasta que se cierra:

```mermaid
sequenceDiagram
    actor R as Reportante
    actor C as Coordinación
    actor T as Mantenimiento
    participant S as Sistema (API + BD)

    R->>S: Registra falla (descripción y espacio)
    S-->>R: Reporte en estado "Reportado"
    C->>S: Consulta todos los reportes
    C->>S: Evalúa el reporte
    S-->>C: Estado "En Evaluación"
    C->>S: Asigna un técnico
    S-->>C: Estado "Asignado"
    T->>S: Consulta sus reportes asignados
    T->>S: Registra una intervención
    S-->>T: Estado "En Proceso"
    C->>S: Cierra el reporte
    S-->>C: Estado "Cerrado"
    R->>S: Consulta el estado de su reporte
```

Recorrido de cada actor:

| Actor | Pasos principales |
|-------|-------------------|
| Reportante | Inicia sesión, completa el formulario de nueva falla y consulta el estado de sus reportes |
| Coordinación | Inicia sesión, revisa todos los reportes, evalúa los nuevos, asigna un técnico a los evaluados y cierra los que están en proceso |
| Mantenimiento | Inicia sesión, revisa los reportes que le asignaron y registra las intervenciones que realiza |

## 7. Prototipos de interfaz

El sistema tiene cuatro pantallas. Al iniciar sesión, la ruta `/dashboard` muestra la pantalla que corresponde al rol guardado en la sesión. Si no hay sesión, redirige a `/`.

| Pantalla | Ruta | Contenido |
|----------|------|-----------|
| Inicio de sesión | `/` | Correo y contraseña |
| Reportante | `/dashboard` | Formulario de nueva falla (descripción y espacio) y tabla "Mis Reportes" con estado y fecha |
| Mantenimiento | `/dashboard` | Tabla "Mis Reportes Asignados" y botón para registrar intervención |
| Coordinación | `/dashboard` | Tabla "Todos los Reportes" con botones Evaluar y Cerrar, y selector de técnico para asignar |

Los botones de cada acción solo aparecen cuando el estado del reporte lo permite. Por ejemplo, `Cerrar` solo se muestra en reportes `En Proceso`.

**Reportante: registrar falla y consultar reportes**

![Pantalla del reportante](../evidencias/prueba1_crear_reporte.png)

**Coordinación: evaluar y gestionar reportes**

![Pantalla de coordinación](../evidencias/prueba2_evaluar.png)

**Mantenimiento: registrar intervenciones**

![Pantalla de mantenimiento](../evidencias/prueba5_intervenir.png)

## 8. Permisos por actor

| Acción | Reportante | Mantenimiento | Coordinación |
|--------|:----------:|:-------------:|:------------:|
| Registrar una falla | Sí | No | No |
| Ver sus propios reportes | Sí | No | Sí |
| Ver los reportes asignados a él | No | Sí | Sí |
| Ver todos los reportes | No | No | Sí |
| Evaluar un reporte | No | No | Sí |
| Asignar un técnico | No | No | Sí |
| Registrar una intervención | No | Sí | No |
| Cerrar un reporte | No | No | Sí |

## 9. Validaciones y reglas de negocio

| Regla | Dónde se aplica |
|-------|-----------------|
| La contraseña se guarda cifrada con bcrypt y nunca se devuelve | Servidor |
| El estado solo avanza en el orden definido y `Cerrado` es final | Servidor (400) |
| Un reporte inexistente al cambiar estado devuelve 404 | Servidor |
| La descripción del reporte es obligatoria | Interfaz y base de datos (`NOT NULL`) |
| Cada rol ve solo sus acciones y los reportes que le corresponden | Interfaz |
| Un reporte siempre pertenece a un espacio y a un reportante | Base de datos (llaves foráneas) |

## 10. Decisiones técnicas y requisitos relacionados

| Decisión | Justificación | Condición relacionada |
|----------|---------------|-----------------------|
| Arquitectura cliente-servidor en tres capas | Separa la interfaz, las reglas de negocio y los datos, y permite probar la API sin la interfaz | Todas |
| React + Vite en el frontend | Permite construir una pantalla por rol y reutilizar componentes | CA-01 a CA-06 |
| Node.js + Express en el backend | Expone la API REST con poco código y usa el mismo lenguaje que el frontend | CA-01 a CA-06 |
| PostgreSQL como base de datos | Base relacional con llaves foráneas y restricciones `CHECK` para conservar la consistencia | CA-01, CA-03, CA-04, CA-05 |
| Estados controlados con una regla de transición en el servidor | Evita saltos de estado y garantiza el orden del proceso | CA-02, CA-05 |
| Asignación guardada en `reportes.asignado_id` | Mantiene un único responsable por reporte y permite consultarlo | CA-03 |
| Intervenciones en una tabla aparte, ligada al reporte | Conserva el historial de actuaciones de cada reporte | CA-04 |
| Contraseñas cifradas con bcrypt | Nunca se guardan ni se devuelven en texto plano | Seguridad |
| Variables de entorno en `.env`, con `.env.example` sin secretos | Mantiene las credenciales fuera del repositorio | Seguridad |
