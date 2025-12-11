# ---------- BASE IMAGE FOR PRUNING ----------
FROM node:18-slim AS base
WORKDIR /repo
COPY . .

RUN npm install -g turbo

# ---------- PRUNE WORKSPACE ----------
FROM base AS pruner
RUN turbo prune --scope=web --docker

# ---------- INSTALL DEPENDENCIES ----------
FROM node:18-slim AS installer
WORKDIR /repo

# Copy pruned JSON files
COPY --from=pruner /repo/out/json/ ./
# Copy minified workspace
COPY --from=pruner /repo/out/full/ ./

# Install dependencies (npm)
RUN npm install

# Build Remix (update workspace name if needed)
RUN npm run build --workspace=@musicall/web

# ---------- RUNTIME ----------
FROM node:18-slim AS runner
WORKDIR /app

# Copy application runtime files
COPY --from=installer /repo/apps/web/ ./

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "run", "start"]
