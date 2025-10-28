FROM node:20-alpine AS builder
WORKDIR /app

# instalar dependencias
COPY package.json package-lock.json* ./
RUN npm install --production=false

# copiar el código y construir
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:20-alpine
WORKDIR /app

# producción: copiar solo lo necesario
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY database ./database

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["node", "dist/main.js"]
