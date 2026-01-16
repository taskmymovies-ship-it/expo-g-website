docker run -d --name ice-mongo ^
  -p 27017:27017 ^
  -e MONGO_INITDB_ROOT_USERNAME=mongo ^
  -e MONGO_INITDB_ROOT_PASSWORD=secret ^
  -v ice_mongo_data:/data/db ^
  --restart unless-stopped ^
  mongo:7

docker run -d --name ice-mongo -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=mongo -e MONGO_INITDB_ROOT_PASSWORD=secret -v ice_mongo_data:/data/db --restart unless-stopped mongo:7

docker exec -it ice-mongo mongosh -u mongo -p secret --authenticationDatabase admin

docker run -d --name ice-redis -p 6379:6379 -v ice_redis_data:/data --restart unless-stopped redis:7-alpine redis-server --appendonly yes --requirepass "sanjay12"

docker exec -it ice-redis redis-cli -a sanjay12 ping

docker run -d --name ice-redis ^
  -p 6379:6379 ^
  -v ice_redis_data:/data ^
  --restart unless-stopped ^
  redis:7-alpine redis-server --appendonly yes --requirepass "sanjay12"




docker exec -it ice-mongo mongosh -u mongo -p secret --authenticationDatabase admin
docker exec -it ice-redis redis-cli -a sanjay12 ping