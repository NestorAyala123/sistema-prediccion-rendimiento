Despliegue con Docker Compose

Este proyecto contiene un backend (NestJS) y un frontend (React). A continuación se muestran pasos para desplegar localmente usando Docker y Docker Compose.

Requisitos:
- Docker instalado
- Docker Compose (v2 integrado en Docker Desktop)

Pasos

1) Construir y levantar los servicios

En la raíz del proyecto:

```powershell
docker compose up --build -d
```

Esto construirá las imágenes y levantará dos contenedores:
- Backend en http://localhost:4000
- Frontend (servido por nginx) en http://localhost:3000

2) Variables de entorno

El backend lee `JWT_SECRET` y `PORT` desde `./backend/.env`. Edita ese archivo para cambiar la contraseña JWT en producción.

3) Persistencia de la base de datos

El archivo sqlite se encuentra en `backend/database/academic_prediction.db`. El `docker-compose.yml` monta `./backend/database` como volumen para persistirla.

4) Verificar

Puedes ejecutar:

```powershell
# Ver logs
docker compose logs -f backend
# Comprobar health
Invoke-WebRequest -UseBasicParsing http://localhost:4000/health
```

5) Detener y eliminar

```powershell
docker compose down
```

Notas de seguridad y producción
- `synchronize: true` en TypeORM está configurado para desarrollo; cámbialo a `false` en producción y usa migraciones.
- Actualiza `JWT_SECRET` a un valor fuerte y no lo almacenes en el repositorio; usa secretos o variables de entorno del entorno de despliegue.
- Revisa las vulnerabilidades mostradas por `npm audit` y actualiza dependencias si es necesario.

Problemas comunes
- Si el contenedor del backend no arranca, revisa los logs con `docker compose logs backend`.
- Si la app frontend no muestra contenido, comprueba `docker compose logs frontend` y asegúrate de que la build fue correcta.

Si quieres, puedo:
- Crear una pipeline (GitHub Actions) para construir y publicar imágenes en Docker Hub.
- Configurar Nginx con HTTPS (Let's Encrypt) para despliegue real.
- Ajustar `synchronize` a `false` y agregar migraciones de TypeORM.
