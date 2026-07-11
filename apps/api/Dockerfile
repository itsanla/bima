FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json* ./
# Install only production dependencies
RUN npm install --omit=dev

# Copy Prisma schema and generate client (or copy from builder)
COPY --from=builder /app/prisma ./prisma
RUN npx prisma generate

# Copy built files
COPY --from=builder /app/dist ./dist

# Start server
CMD ["npm", "start"]
