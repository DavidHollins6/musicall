# ---------- BASE IMAGE FOR PRUNING ----------
FROM node:22-slim AS base
WORKDIR /repo
COPY . .

RUN npm install -g turbo

# ---------- PRUNE WORKSPACE ----------
FROM base AS pruner
RUN turbo prune --scope=web --docker

# ---------- INSTALL DEPENDENCIES ----------
FROM node:22-slim AS installer
WORKDIR /repo

# Copy pruned JSON files
COPY --from=pruner /repo/out/json/ ./
# Copy minified workspace
COPY --from=pruner /repo/out/full/ ./

# Install dependencies (npm)
RUN npm install

# Build Remix (update workspace name if needed)
RUN npm run build --workspace=web

# ---------- RUNTIME ----------
FROM node:22-slim AS runner
WORKDIR /app

# Copy the built application
COPY --from=installer /repo/apps/web/build/ ./build/
COPY --from=installer /repo/apps/web/package.json ./package.json
COPY --from=installer /repo/apps/web/public/ ./public/

# Copy node_modules from the installer stage
COPY --from=installer /repo/node_modules/ ./node_modules/

ENV PORT=5173
EXPOSE 5173

CMD ["npm", "run", "start"]
