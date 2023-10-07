FROM oven/bun:1.0.4-alpine
WORKDIR /srv

COPY package.json bun.lockb .env ./
RUN bun install
COPY . .

EXPOSE 3006

ENTRYPOINT [ "bun", "startprod" ]
