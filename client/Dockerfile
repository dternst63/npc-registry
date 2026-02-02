# ---------- Build Stage ----------
FROM node:22-alpine AS builder

WORKDIR /app

# Accept build-time env vars
ARG VITE_API_BASE_URL

# Make available to Vite
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


# ---------- Production Stage ----------
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
