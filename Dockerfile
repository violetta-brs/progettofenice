# Dockerfile
FROM node:20-alpine

ENV WORKDIR=/workspace

RUN apk add --no-cache git bash
RUN npm install -g firebase-tools

WORKDIR ${WORKDIR}

COPY deploy.sh /deploy.sh
RUN chmod +x /deploy.sh

ENTRYPOINT ["/deploy.sh"]