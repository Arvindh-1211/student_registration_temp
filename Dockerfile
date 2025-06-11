# Stage 1: Build the React app
FROM node:18-alpine AS builder

WORKDIR /app

# COPY ./frontend/package*.json ./
COPY ./frontend/ .
RUN npm install

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx

# Copy the build output to Nginx's public directory
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom Nginx config (optional)
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
