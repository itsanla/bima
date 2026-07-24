FROM node:20-slim

# Install build tools karena kita memakai better-sqlite3
RUN apt-get update && apt-get install -y python3 build-essential && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependency info
COPY package*.json ./

# Install dependencies (hanya production)
RUN npm install --production

# Copy seluruh source code backend
COPY . .

# Expose port (opsional di docker-compose, tapi baik untuk dokumentasi)
EXPOSE 3100

# Jalankan aplikasi
CMD ["node", "src/index.js"]
