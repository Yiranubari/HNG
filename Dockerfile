# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app

# Only copy package files to leverage Docker layer caching
COPY package*.json ./

# Install production deps without deprecated production config
# Ensure NPM_CONFIG_PRODUCTION is not set by environment
ENV NPM_CONFIG_PRODUCTION=
RUN npm ci --omit=dev

# Copy the rest of the source code
COPY . .

# Railway sets PORT; our app reads PORT or defaults to 5000
EXPOSE 5000

CMD ["node", "server.js"]
