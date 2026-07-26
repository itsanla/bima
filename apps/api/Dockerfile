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

# Skema disamakan dengan basis data setiap kali container hidup. Perubahan yang
# aditif (menambah tabel atau kolom) diterapkan sendiri, sedangkan perubahan
# yang bisa menghilangkan data akan ditolak prisma dan container gagal start.
# Gagal dengan berisik lebih baik daripada data hilang diam diam.
CMD ["sh", "-c", "npx prisma db push --skip-generate && npm start"]
