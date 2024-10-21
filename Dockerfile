# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=21.6.2
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Astro"

# Astro app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"
ARG YARN_VERSION=1.22.19
RUN npm install -g yarn@$YARN_VERSION --force

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules and for Prisma (including OpenSSL and libvips)
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential \
    node-gyp \
    pkg-config \
    python-is-python3 \
    openssl \
    libvips-dev

# Install node modules
COPY --link package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

# Copy application code
COPY --link . .

# Generate Prisma client and run migrations
RUN npx prisma generate && \
    npx prisma migrate deploy

# Build application
RUN yarn run build

# Remove development dependencies to keep the final image small
RUN yarn install --production=true

# Final stage for app image
FROM base

# Install dependencies required at runtime
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    openssl \
    libvips-dev

# Copy built application
COPY --from=build /app/dist /app/dist

# Copy node modules
COPY --from=build /app/node_modules /app/node_modules

# Copy Prisma client
COPY --from=build /app/prisma /app/prisma


# Start the server by default, this can be overwritten at runtime
CMD [ "node", "/app/dist/server/entry.mjs" ]
