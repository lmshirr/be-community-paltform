## Running Container
- Copy .env-example-docker ke .env pada root folder
- Untuk first Run ganti ENVIRONMENT pada .env ke `build`
- Buat network pada docker dengan command
```cmd
docker network create external-node
```
- Jalankan 
```cmd 
docker-compose up node 
```
- setelah itu ubah ENVIRONMENT pada .env ke `development`
Jalankan 
```cmd 
docker-compose up
```

## Database
- Buka adminer
- Create database `community-platform`
- Jalankan migrasi db
```cmd
docker exec -it community_platform_node npx sequelize-cli db:migrate
``` 

