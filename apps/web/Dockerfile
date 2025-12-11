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

# Install dependencies for better caching
RUN apt-get update && apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Copy pruned JSON files
COPY --from=pruner /repo/out/json/ ./
# Copy minified workspace
COPY --from=pruner /repo/out/full/ ./

# Install dependencies (npm)
RUN npm ci

# Build Remix (update workspace name if needed)
RUN npm run build --workspace=web

# ---------- RUNTIME ----------
FROM node:22-slim AS runner
WORKDIR /app

# Create non-root user for security
RUN groupadd --gid 1001 --system nodejs && \
    useradd --uid 1001 --system --gid nodejs --shell /bin/bash nodejs

# Copy the built application with correct ownership
COPY --from=installer --chown=nodejs:nodejs /repo/apps/web/build/ ./build/
COPY --from=installer --chown=nodejs:nodejs /repo/apps/web/public/ ./public/
COPY --from=installer --chown=nodejs:nodejs /repo/apps/web/package.json ./package.json

# Copy all node_modules including monorepo packages
COPY --from=installer --chown=nodejs:nodejs /repo/node_modules/ ./node_modules/

# Copy monorepo packages that are needed at runtime
COPY --from=installer --chown=nodejs:nodejs /repo/packages/ ./packages/

# Switch to non-root user
USER nodejs

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Use exec form for better signal handling
CMD ["npm", "start"]
