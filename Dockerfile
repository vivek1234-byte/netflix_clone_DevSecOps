#stage 1 for building reat app
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG TMDB_V3_API_KEY
ENV VITE_TMDB_API_KEY=$TMDB_V3_API_KEY
RUN npm run build
#stage 2 for serving through nginx
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]