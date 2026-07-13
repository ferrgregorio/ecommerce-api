# Build da API para produção
FROM node:20-alpine AS build

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY . .
RUN npm run build

# Imagem final, mais enxuta
FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --omit=dev
RUN npx prisma generate

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]