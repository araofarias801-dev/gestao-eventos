# Stage 1: Build Angular
FROM node:20-alpine AS build
WORKDIR /app
RUN npm config set strict-ssl false
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN ./node_modules/.bin/ng build --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
