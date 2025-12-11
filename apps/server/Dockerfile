FROM node:22-alpine AS base
RUN apk update
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
 
# ---
FROM base AS prepare
# Replace <your-major-version> with the major version installed in your repository. For example:
RUN npm install -g turbo@^2
COPY . .
# Add lockfile and package.json's of isolated subworkspace
# Generate a partial monorepo with a pruned lockfile for a target workspace.
# Assuming "web" is the name entered in the project's package.json: { name: "web" }
RUN turbo prune server --docker
 
# ---
FROM base AS builder
# First install the dependencies (as they change less often)
COPY --from=prepare /app/out/json/ .
RUN npm install
# Build the project
COPY --from=prepare /app/out/full/ .

 
RUN npm run turbo build
 
# ---
FROM base AS runner
# Don't run production as root for security reasons
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Accept build arguments from GitHub Actions
ARG CLERK_SECRET_KEY
ARG FIREBASE_PROJECT_ID
ARG FIREBASE_CLIENT_EMAIL
ARG FIREBASE_PRIVATE_KEY
# Add more ARG instructions for each environment variable you need

# Copy files with proper ownership before switching user
COPY --from=builder --chown=nodejs:nodejs /app/apps/server/dist ./
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/packages ./packages

USER nodejs

ENV NODE_ENV=production
ENV PORT=3000

ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY
ENV FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID
ENV FIREBASE_CLIENT_EMAIL=$FIREBASE_CLIENT_EMAIL
ENV FIREBASE_PRIVATE_KEY=$FIREBASE_PRIVATE_KEY
# Add more ENV instructions for each variable

EXPOSE 3000

RUN ls -la
 
CMD node index.js