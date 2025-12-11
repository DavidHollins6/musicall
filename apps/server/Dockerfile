# ---------- BASE IMAGE FOR PRUNING ----------
FROM node:18-slim AS base
WORKDIR /repo
COPY . .

RUN npm install -g turbo

# ---------- PRUNE WORKSPACE ----------
FROM base AS pruner
RUN turbo prune --scope=server --docker

# ---------- INSTALL DEPENDENCIES ----------
FROM node:18-slim AS installer
WORKDIR /repo

COPY --from=pruner /repo/out/json/ ./
COPY --from=pruner /repo/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /repo/out/full/ ./

RUN npm install

# Build server if you have TS
RUN npm run build --workspace=@musicall/server || echo "No build step"

# ---------- RUNTIME ----------
FROM node:18-slim AS runner
WORKDIR /app

COPY --from=installer /repo/apps/server/ ./

ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/index.js"]
