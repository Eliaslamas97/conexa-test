# Backend Conexa Test - StarWars API

URL de Despliegue: https://conexa-test-production.up.railway.app/docs#/

## Descripción del Proyecto

El objetivo de este proyecto es construir un backend que tome información de la API pública de Star Wars y que sea utilizada en pos de crear una nueva aplicación de gestión de películas y series. El backend está desarrollado en Nest.js.

## Requisitos

- Node.js
- PostgreSQL
- Nest.Js
- Typescript

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/Eliaslamas97/conexa-test.git
   cd tuproyecto
   ```
2. Instala las dependencias:

   ```bash
    npm install
   ```

3. Configura la base de datos:
    - Copia el archivo .env.example a .env y completa la configuración de la base de datos.

## Uso Local

1. Configuracion del Servidor

    - Asegúrate de que la base de datos esté configurada y ejecutándose.
    - Asegúrate de que la configuración en el archivo .env sea correcta.

2. Ejecución

   ```bash
    npm run start:dev
   ```

3. Ejecución de pruebas

   ```bash
    npm test
   ```

## Endpoints

1. Endpoints de Autenticación
    - `POST /auth/register`: Registro de usuario.
    - `POST /auth/sign-in`: Inicio de sesión.

2. Endpoints 
    - USER
       - `PATCH /user/modify-role`: Modificar role del usuario. 
         - roles existentes: `[
           {
           "id": 0,
           "name": "user"
           },
           {
           "id": 1,
           "name": "admin"
           }
           ]`
   - ROLE
     - `GET /role`: Listado de roles.*
   
    - MOVIE
      - `GET /movie`: Listado de peliculas.*
      - `GET /movie/:id`: Detalle de una pelicula.*
      - `POST /movie`: Crear una pelicula.*
      - `PATCH /movie/:id`: Modificar una pelicula.*
      - `DELETE /movie/:id`: Eliminar una pelicula.*

3. Schedule: En el módulo de `movie` existe un cronjob que se ejecuta todos los días a las 2am para sincronizar películas de la API con la base de datos.

 *Nota: incluir en headers:
      `Authorization: Bearer valid-token`