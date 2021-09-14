## Running Container
Copy .env-example-docker ke .env pada root folder
Untuk first Run ganti ENVIRONMENT pada .env ke 'build'
Jalankan "docker-compose up node"
setelah itu ubah ENVIRONMENT pada .env ke 'development'
Jalankan "docker-compose up"

## Database
Buka adminer
Create database "community-platform"
Jalankan "docker exec -it community_platform_node npx sequelize-cli db:migrate" untuk migrasi DB

