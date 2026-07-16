FROM node:20-alpine AS build

WORKDIR /app

COPY apps/web/package.json ./package.json
COPY apps/web/tsconfig.json ./tsconfig.json
COPY apps/web/tsconfig.app.json ./tsconfig.app.json
COPY apps/web/vite.config.ts ./vite.config.ts
COPY apps/web/postcss.config.js ./postcss.config.js
COPY apps/web/tailwind.config.ts ./tailwind.config.ts
COPY apps/web/index.html ./index.html
COPY apps/web/src ./src

RUN npm install
RUN npm run build

FROM nginx:1.27-alpine

COPY infra/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

