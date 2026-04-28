# Stage 1 — Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2 — Build the app
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# dummy only for prisma generate
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
# Generate Prisma client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Stage 3 — Run the app
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only what's needed to run
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# dummy
# ✅ Add these with dummy values for build
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV GROQ_API_KEY="dummy"
ENV NEXTAUTH_SECRET="dummy"
ENV GITHUB_CLIENT_ID="dummy"
ENV GITHUB_CLIENT_SECRET="dummy"

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]