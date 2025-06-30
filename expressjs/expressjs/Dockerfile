# Use official Node.js LTS image as build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Production image, copy only necessary files
FROM node:22-alpine

WORKDIR /app

# Copy only built files and node_modules from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Set environment variables (optional)
ENV NODE_ENV=production

# Expose the port your app listens on
EXPOSE 3000

# Start the app (adjust path if needed)
CMD ["node", "dist/index.js"]
