# ---------- BASE IMAGE FOR PRUNING ----------
FROM node:18-slim AS base
WORKDIR /repo
COPY . .

# Install turbo globally
RUN npm install -g turbo

# ---------- PRUNE WORKSPACE ----------
FROM base AS pruner
RUN turbo prune --scope=web --docker

# ---------- INSTALL DEPENDENCIES ----------
FROM node:18-slim AS installer
WORKDIR /repo

# Copy pruned files
COPY --from=pruner /repo/out/json/ ./
COPY --from=pruner /repo/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /repo/out/full/ ./

# Install dependencies
RUN npm install

# Build Remix app
RUN npm run build --workspace=@musicall/web

# ---------- RUNTIME IMAGE ----------
FROM node:18-slim AS runner
WORKDIR /app

# Copy the built app
COPY --from=installer /repo/apps/web/ ./

# Cloud Run expects the server to listen on PORT
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "run", "start"]
