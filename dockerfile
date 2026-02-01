FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .

EXPOSE 8000

CMD ["bun", "--env-file=.env", "run", "start"]

