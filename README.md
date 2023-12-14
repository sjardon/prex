# Prex challenge

Repositorio para el ejercicio de Prex. Espero que disfruten la revisión!

## Introducción

El stack que utilizé para resolver el challenge fue:

1. NodeJs sobre NestJs para desarrollar el servicio.
2. Postgress como DB.
3. Docker para desplegar los contenedores.
4. Docker Compose para desarrollo local.

## Ejecutar en entorno local

El proyecto puede ejecutarse en el entorno local con Docker Compose. Para eso:

1. `cp .env.example .env`
2. Configurar las variables dentro de `.env` de segun sea necesario el entorno local, a exepción de `APP_ENV=local`
3. `docker compose up`

## Ejecutar los tests en entorno local:

1. `cp .env.example .env`
2. Configurar las variables dentro de `.env` de segun sea necesario el entorno local, a exepción de `APP_ENV=local`
3. `docker compose up db`
4. `npm install`
5. `npm run test`
