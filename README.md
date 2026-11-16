# Proyecto Final 05 - Gestión de Mantenimiento de Instalaciones

**Asignatura:** Aplicaciones y Servicios Web
**Programa:** Tecnología en Desarrollo de Software
**Integrante:** Camilo Andres Velez Luna
**Repositorio:** https://github.com/CamiloVelezL/proyecto_mantenimiento

## 1. Información General
*   **Problema seleccionado:** Gestión de fallas y mantenimiento correctivo de instalaciones (aulas, oficinas, laboratorios).
*   **Nota de trabajo:** El proyecto se desarrolla de forma individual. Se aplicó un flujo de Git con ramas y Pull Requests para evidenciar el control de versiones.

## 2. Descripción del Sistema
*   **Problema abordado:** Centralizar los reportes de fallas que actualmente se dispersan en llamadas y correos, permitiendo hacer seguimiento desde el reporte hasta el cierre.
*   **Actores:** Reportante, Personal de Mantenimiento, Coordinación.
*   **Alcance:** Sistema web (Frontend, API REST, BD) limitado a gestión de reportes, asignaciones e intervenciones.

## 3. Requisitos y Alcance
Los requisitos detallados se encuentran en `docs/requisitos.md`. Se implementaron las 6 condiciones de aceptación obligatorias (CA-01 a CA-06).

## 4. Arquitectura, Diseño de API y Modelo de Datos
El diseño detallado se encuentra en `docs/diseno.md`. La arquitectura es Cliente-Servidor:
*   **Frontend:** React + Vite + Axios
*   **Backend:** Node.js + Express
*   **Base de Datos:** PostgreSQL

## 5. Configuración del Entorno y Ejecución

### Requisitos previos
*   Node.js instalado
*   PostgreSQL instalado y corriendo

### Pasos para ejecutar el proyecto
1.  Clonar el repositorio.
2.  **Base de Datos:** Crear una base de datos en PostgreSQL llamada `mantenimiento_db` y ejecutar los scripts `database/schema.sql` y `database/seed.sql`.
3.  **Backend:**
    ```bash
    cd backend
    npm install
    # Crear un archivo .env basado en .env.example y configurar las credenciales de DB
    npm run dev
4. **Frontend:**
    ```bash
    cd frontend
    npm install
    npm run dev

5. **Usuarios de Prueba**
El sistema cuenta con 3 roles. Para probar el flujo completo, puedes iniciar sesión con los 
siguientes usuarios (contraseña para todos: 123456):

Rol	                          Email	                Contraseña
Reportante	            reportante@admin.com	    123456
Mantenimiento	        tecnico@admin.com	        123456
Coordinación	        coordinador@admin.com	    123456

**Nota:** Si se desea crear nuevos usuarios, puede hacerlo consumiendo el endpoint POST /api/auth/register.

6. **Servicios Web Implementados**

Método	             Ruta	                     Descripción
POST	      /api/auth/register	            Registro de usuarios
POST	      /api/auth/login	                Inicio de sesión
POST	      /api/reportes	                    Crear reporte de falla
GET	          /api/reportes	                    Consultar reportes
PATCH	      /api/reportes/:id/estado	        Cambiar estado
PATCH	      /api/reportes/:id/asignar	        Asignar técnico
POST	      /api/intervenciones	            Registrar intervención técnica

7. **Pruebas de API e Integración y Evidencias**
Las pruebas funcionales y las evidencias se encuentran documentadas en docs/pruebas.md y en la carpeta evidencias/.

8. **Control de Versiones**
Se utilizó Git y GitHub. Se pueden evidenciar ramas (feature/...), commits descriptivos y Pull Requests que documentan el desarrollo,errores y sus correcciones.

9. **Conclusiones y Limitaciones**
Cumplimiento: Se cumplieron todas las condiciones del problema.

Dificultades: La principal dificultad fue la configuración inicial de PostgreSQL y la correcta aplicación de las reglas de negocio en el backend para evitar saltos de estado.

Limitaciones: No se implementó un sistema de recuperación de contraseñas ni despliegue en la nube.

