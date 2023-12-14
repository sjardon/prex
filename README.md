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

## Decisiones tomadas:
1. Autenticación: Se eligió la autenticación por medio de Bearer Token, implementado por medio de Passport en NestJs debido a la seguridad y facilidad que brindan.
2. Para validar el usuario en cada endpoint se utilizaron decoradores que encapsulan la implenetación del resto del proceso de ruteo.
3. Para el manejo de los archivos en S3 se implementó un adaptador, que nos permite abstraer el servicio de cloud que estamos utilizando por detras.
4. El nivel de acceso a los archivos se desarrolló en un servicio separado del manejo de archivos en sí. Por un lado, se concidera un componente diferente por su entidad propia, por el otro, nos permite encapsular la lógica de compartir archivos con mayor flexibilidad.

## Diagrama de Arquitectura:
![image](https://github.com/sjardon/prex/assets/71879650/6ea1bdcc-a751-44eb-873a-998d00201812)

## Diagrama de Entidad-Relación:
![image](https://github.com/sjardon/prex/assets/71879650/a60d7fe6-7c7a-44cd-82c7-e6b07dbe7999)

## Postman Collection:
Pueden ver la coleccion en el siguiente link: https://www.postman.com/sjardon/workspace/prex-challenge/collection/12192016-a0ee4471-034d-4bcd-b3cd-bab9f9374737
