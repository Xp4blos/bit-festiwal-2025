# Stage 1: Build the app
FROM node:20-alpine AS build

# Set the key as a build argument
ARG VITE_GEMINI_API_KEY

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production=false
COPY . .

# Use the build argument as an environment variable for the build command
# This ensures Vite embeds the value into the JS bundle
RUN VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY npm run build

# Stage 2: Serve the app
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["nginx", "-g", "daemon off;"]