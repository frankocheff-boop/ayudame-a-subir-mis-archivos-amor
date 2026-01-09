# Villa Manager - Backend Skeleton

Este repositorio contiene un esqueleto backend recomendado para Villa Manager:
- Node.js + Express
- JWT (access + refresh tokens)
- Postgres (pg)
- Socket.io para sincronización en tiempo real
- Ejemplos de endpoints para auth y reservations

Pasos rápidos:
1. Copia `.env.example` a `.env` y configura variables.
2. Crea la BD en Postgres y ejecuta `db/init.sql`.
3. Instala dependencias:
   npm install
4. Levanta en desarrollo:
   npm run dev
5. Endpoints:
   - POST /api/auth/register
   - POST /api/auth/login
   - POST /api/auth/refresh
   - POST /api/auth/logout
   - GET /api/reservations
   - POST /api/reservations
   - PUT /api/reservations/:id
   - DELETE /api/reservations/:id

Socket.io:
- Conéctate al servidor Socket.io (mismo host/puerto)
- Eventos útiles: join_reservation_room, leave_reservation_room, reservation_updated

Siguientes pasos recomendados:
- Añadir validación (Joi / express-validator)
- Implementar migraciones (db-migrate / Prisma / Sequelize)
- Tests e integración continua
- Endpoints para users, itineraries, shopping lists
- Mejor manejo de refresh tokens (hashed tokens) y revoque por usuario
