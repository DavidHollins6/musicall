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
RUN turbo prune web --docker
 
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
ARG CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ARG CLERK_SIGN_IN_URL
ARG CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
ARG CLERK_SIGN_UP_FALLBACK_REDIRECT_URL
ARG API_URL
# Add more ARG instructions for each environment variable you need

# Copy files with proper ownership before switching user
COPY --from=builder --chown=nodejs:nodejs /app/apps/web/build ./
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/packages ./packages

USER nodejs

ENV NODE_ENV=production

ENV CLERK_PUBLISHABLE_KEY=$CLERK_PUBLISHABLE_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY
ENV CLERK_SIGN_IN_URL=$CLERK_SIGN_IN_URL
ENV CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=$CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
ENV CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=$CLERK_SIGN_UP_FALLBACK_REDIRECT_URL
ENV API_URL=$API_URL
# Add more ENV instructions for each variable

EXPOSE 5173

CMD node server/index.js