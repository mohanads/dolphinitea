FROM oven/bun:1.2.4
WORKDIR /app
COPY public public
COPY src src
COPY bun.lock ./
COPY lingui.config.js ./
COPY package.json ./
COPY tsconfig.json ./
RUN bun install
CMD ["bun", "run", "server:start"]
