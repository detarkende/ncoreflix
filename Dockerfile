FROM node:18.16-alpine AS runtime

ARG TRANSMISSION_USERNAME
ARG TRANSMISSION_PASSWORD
ARG TRANSMISSION_DOWNLOAD_DIR
ARG INTERNAL_TRANSMISSION_PORT
ARG PORT
ARG TRANSMISSION_PEER_PORT
ARG DOCKER_NODE_ENV
ARG DOCKER_WORKDIR

ENV NODE_ENV "${DOCKER_NODE_ENV}"

# Set the working directory
WORKDIR "${DOCKER_WORKDIR}"

RUN apk add bash
RUN npm install -g zx

# RUN transmission-daemon --config-dir /transmission
COPY transmission-settings.json /transmission/settings.json
COPY --chown=node:node change-json.mjs ${DOCKER_WORKDIR}/change-json.mjs
RUN ./change-json.mjs /transmission/settings.json rpc-username "$TRANSMISSION_USERNAME"
RUN ./change-json.mjs /transmission/settings.json rpc-password "$TRANSMISSION_PASSWORD"
RUN ./change-json.mjs /transmission/settings.json download-dir "$TRANSMISSION_DOWNLOAD_DIR"
RUN ./change-json.mjs /transmission/settings.json rpc-port "$INTERNAL_TRANSMISSION_PORT"
RUN ./change-json.mjs /transmission/settings.json script-torrent-done-filename "$DOCKER_WORKDIR/torrent-done.mjs"

# Install transmission torrent client and any other dependencies needed by your app
ENV TRANSMISSION_HOME=/transmission
RUN apk add transmission-daemon

RUN apk add ffmpeg

# Install
COPY package*.json ./
RUN --mount=type=cache,target=/.npm \
    npm set cache /.npm && \
    npm install

EXPOSE ${PORT}
EXPOSE ${INTERNAL_TRANSMISSION_PORT}
EXPOSE ${TRANSMISSION_PEER_PORT}
EXPOSE ${TRANSMISSION_PEER_PORT}/udp
