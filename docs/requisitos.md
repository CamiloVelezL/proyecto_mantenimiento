# Requisitos del sistema

Proyecto Final 05 - Gestión de mantenimiento de instalaciones.

## 1. Contexto y alcance

La organización necesita mantener la trazabilidad del mantenimiento correctivo de sus instalaciones: desde que alguien reporta una falla hasta que se evalúa, se asigna a un técnico, se interviene y se cierra. El sistema es una aplicación web con interfaz, API REST y base de datos relacional, pensada para tres actores.

**Incluido en el alcance:** inicio de sesión, registro de fallas por espacio, evaluación, asignación de técnico, registro de intervenciones, cierre y consulta de reportes por rol.

**Fuera del alcance (aprobado por el docente):** notificaciones, inventarios, recuperación de contraseña, rol de administrador, autorregistro de usuarios y reapertura de reportes cerrados.

## 2. Registro de la entrevista

La entrevista se realizó por el chat de Teams con el docente Juan Carlos Morales Guerra, en el rol de representante de la organización (17 y 18 de noviembre de 2026). Las preguntas confirmaron las decisiones de actores, acceso y alcance que el equipo había tomado.

| # | Pregunta | Respuesta del docente | Acuerdo o efecto en los requisitos |
|---|----------|-----------------------|------------------------------------|
| 1 | ¿Los tres actores (quien reporta, mantenimiento y coordinación) son los que necesita, o prefiere un rol adicional de administrador? | "los tres actores están bien" | El sistema mantiene tres roles y no incluye administrador (RF-01, RF-11) |
| 2 | Solo entran usuarios con correo y contraseña creados por el equipo; una persona externa no puede registrarse. ¿Es así como lo quería o cualquier persona de la organización debería poder registrarse? | "no hay problema" | No hay autorregistro; las cuentas las crea el equipo (RF-01) |
| 3 | Un reporte cerrado no se puede reabrir; si queda un fallo se abre un reporte nuevo. ¿Está bien o prefiere permitir reabrirlo? | "así está bien" | `Cerrado` es un estado final (RF-08, RF-10, RN-03) |
| 4 | Dejamos fuera notificaciones, inventarios y recuperación de contraseña. ¿Está de acuerdo con ese límite? | "El alcance está bien, entre más básico más fácil para ustedes entenderlo y explicarlo" | Esas funciones quedan fuera del alcance (sección 1) |

## 3. Actores

| Actor | Rol en el sistema | Necesidad |
|-------|-------------------|-----------|
| Reportante | `Reportante` | Informar una falla en un espacio y saber en qué estado va |
| Personal de mantenimiento | `Mantenimiento` | Ver los reportes que le asignaron y registrar lo que hace |
| Coordinación | `Coordinacion` | Revisar todos los reportes, evaluarlos, asignar un técnico y cerrarlos |

## 4. Procesos y reglas de negocio

Proceso: **Reportado → En Evaluación → Asignado → En Proceso → Cerrado**.

| ID | Regla |
|----|-------|
| RN-01 | Un reporte siempre está asociado a un espacio y a quien lo reportó |
| RN-02 | El estado solo avanza al siguiente de la lista; no se puede saltar un estado |
| RN-03 | Un reporte cerrado no cambia más; si queda un fallo se crea un reporte nuevo |
| RN-04 | Solo Coordinación evalúa, asigna y cierra |
| RN-05 | Solo el personal de mantenimiento registra intervenciones, y la primera pasa el reporte a `En Proceso` |
| RN-06 | Cada reporte tiene un único técnico responsable |
| RN-07 | Cada rol ve únicamente las acciones y los reportes que le corresponden |

## 5. Requisitos funcionales

Prioridad: Alta = indispensable para el proceso; Media = apoya el proceso.

| ID | Requisito | Condición | Prioridad |
|----|-----------|-----------|-----------|
| RF-01 | Iniciar sesión con correo y contraseña de una cuenta creada por el equipo | Apoyo | Alta |
| RF-02 | Registrar una falla con su descripción y el espacio donde ocurre | CA-01 | Alta |
| RF-03 | Consultar los reportes propios con su estado y fecha | CA-01 | Alta |
| RF-04 | Evaluar un reporte recibido (de `Reportado` a `En Evaluacion`) | CA-02 | Alta |
| RF-05 | Asignar un técnico a un reporte evaluado y conservar la asignación | CA-03 | Alta |
| RF-06 | Consultar los reportes asignados a un técnico | CA-03, CA-04 | Alta |
| RF-07 | Registrar intervenciones vinculadas a un reporte | CA-04 | Alta |
| RF-08 | Cerrar la atención de un reporte y conservar su estado final | CA-05 | Alta |
| RF-09 | Consultar todos los reportes con su estado desde Coordinación | CA-06 | Alta |
| RF-10 | Controlar las transiciones de estado permitidas | CA-02, CA-05 | Alta |
| RF-11 | Mostrar a cada rol solo las pantallas y acciones que le corresponden | Todas | Media |

## 6. Requisitos no funcionales

| ID | Requisito |
|----|-----------|
| RNF-01 | Las contraseñas se guardan cifradas (bcrypt) y nunca se devuelven |
| RNF-02 | La información se guarda en PostgreSQL con llaves foráneas y restricciones que mantienen su consistencia |
| RNF-03 | La interfaz es sencilla, con una pantalla por rol, y muestra mensajes cuando una operación no se puede realizar |
| RNF-04 | La API REST usa JSON y códigos HTTP coherentes (201, 400, 401, 404, 500) |
| RNF-05 | El proyecto se puede reproducir con el README, `.env.example`, `schema.sql` y `seed.sql`, sin credenciales reales |

## 7. Historias de usuario y criterios de aceptación

| ID | Historia | Criterios de aceptación | Requisitos |
|----|----------|-------------------------|------------|
| HU-01 | Como reportante, quiero registrar una falla en un espacio para que se atienda | Con descripción y espacio, el reporte se guarda en estado `Reportado` y aparece en mi lista. Sin descripción, no se envía | RF-02, RF-03 |
| HU-02 | Como coordinador, quiero evaluar los reportes nuevos para decidir su atención | Un reporte `Reportado` pasa a `En Evaluacion`; no se puede cerrar directamente | RF-04, RF-10 |
| HU-03 | Como coordinador, quiero asignar un técnico a un reporte evaluado para que alguien lo atienda | El reporte queda `Asignado` con el técnico elegido y la asignación persiste | RF-05 |
| HU-04 | Como técnico, quiero ver mis reportes asignados y registrar mis intervenciones | Veo solo mis reportes; al registrar una intervención, queda vinculada al reporte y este pasa a `En Proceso` | RF-06, RF-07 |
| HU-05 | Como coordinador, quiero cerrar un reporte atendido para dar por terminada la atención | El reporte `En Proceso` pasa a `Cerrado` y no admite más cambios | RF-08, RF-10 |
| HU-06 | Como coordinador, quiero ver todos los reportes con su estado para hacer seguimiento | La tabla muestra todos los reportes guardados con su estado actual | RF-09 |
| HU-07 | Como usuario, quiero entrar con mi cuenta para ver solo lo que me corresponde | Con credenciales correctas entro a la pantalla de mi rol; con credenciales incorrectas se muestra un error | RF-01, RF-11 |

## 8. Supuestos del equipo

- Cada reporte se trata como independiente: no hay un mecanismo automático que detecte reportes repetidos y la coordinación decide al evaluarlos.
- Los datos mínimos de un reporte son la descripción, el espacio y quien lo reporta; la fecha y el estado los asigna el sistema.
- Para cerrar un reporte basta con que esté `En Proceso`; el cierre conserva el estado final del reporte.
- Los espacios y los usuarios de prueba se cargan desde `seed.sql`.

## 9. Aprobación

El docente confirmó los actores, el acceso por cuentas creadas por el equipo, la imposibilidad de reabrir reportes cerrados y el alcance (sección 2). El resto de la especificación se presenta al docente para su revisión.
