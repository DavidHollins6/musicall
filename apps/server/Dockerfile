# ---------- BASE IMAGE FOR PRUNING ----------
FROM node:22-slim AS base
WORKDIR /repo
COPY . .

RUN npm install -g turbo

# ---------- PRUNE WORKSPACE ----------
FROM base AS pruner
RUN turbo prune --scope=server --docker

# ---------- INSTALL DEPENDENCIES ----------
FROM node:22-slim AS installer
WORKDIR /repo

COPY --from=pruner /repo/out/json/ ./
COPY --from=pruner /repo/out/full/ ./

RUN npm install

# Build server (if using TypeScript)
RUN npm run build --workspace=server || echo "No build step"

# ---------- RUNTIME ----------
FROM node:22-slim AS runner
WORKDIR /app

# Copy the built application
COPY --from=installer /repo/apps/server/dist/ ./dist/
COPY --from=installer /repo/apps/server/package.json ./package.json

# Copy node_modules from the installer stage
COPY --from=installer /repo/node_modules/ ./node_modules/

ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/index.js"]
