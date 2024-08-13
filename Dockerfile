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

# Define arguments for build time
ARG ANTON
ARG WEBFORMS_TOKEN
ARG NOTION_TOKEN
ARG NOTION_MEMBERS_ID
ARG NOTION_PROJECTS_ID
ARG NOTION_TEAMS_ID
ARG NOTION_HOMEPAGE_ID


# Set build-time environment variables
ENV ANTON=${ANTON}
ENV WEBFORMS_TOKEN=${WEBFORMS_TOKEN}
ENV NOTION_TOKEN=${NOTION_TOKEN}
ENV NOTION_MEMBERS_ID=${NOTION_MEMBERS_ID}
ENV NOTION_PROJECTS_ID=${NOTION_PROJECTS_ID}
ENV NOTION_TEAMS_ID=${NOTION_TEAMS_ID}
ENV NOTION_HOMEPAGE_ID=${NOTION_HOMEPAGE_ID}



# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY --link package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

# Copy application code
COPY --link . .

# Build application
RUN yarn run build

# Remove development dependencies
RUN yarn install --production=true

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app/dist /app/dist
# Copy node modules
COPY --from=build /app/node_modules /app/node_modules

# Start the server by default, this can be overwritten at runtime
CMD [ "node", "/app/dist/server/entry.mjs" ]