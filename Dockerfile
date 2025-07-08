# react and express app smust be build before dockerizing
FROM node:18.17-alpine
WORKDIR /app

COPY backend/build .
COPY backend/.env .env
COPY backend/schema.graphql schema.graphql
COPY backend/package.json package.json
COPY backend/prisma backend/prisma
RUN npm install --omit:dev

CMD ["node", "server.js"]