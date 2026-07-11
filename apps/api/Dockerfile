FROM node:22-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN pnpm run build

FROM node:22-alpine AS runner

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /app/package.json /app/pnpm-lock.yaml* ./
# Install only production dependencies
RUN pnpm install --prod

# Copy Prisma schema and generate client (or copy from builder)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
RUN npx prisma generate

# Copy built files
COPY --from=builder /app/dist ./dist

# Start server
CMD ["pnpm", "start"]
