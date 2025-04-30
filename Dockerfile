FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json .env ./
RUN npm install
COPY . .
RUN npm run build

# Run stage
FROM node:20-alpine
RUN adduser -D next-work
WORKDIR /run
COPY --from=build /app/.env ./.env
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
RUN chown -R next-work:next-work /run
USER next-work
EXPOSE 8099
ENTRYPOINT ["node", "dist/index.js"]
