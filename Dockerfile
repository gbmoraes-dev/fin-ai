FROM oven/bun:canary-alpine AS base

# ---------

FROM base AS deps

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile --production

# ---------

FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 api

RUN adduser --system --uid 1001 fin-ai

RUN chown fin-ai:api .

COPY --chown=fin-ai:api . .

COPY --from=deps /app/node_modules ./node_modules

USER fin-ai

EXPOSE 3333

ENV PORT=3333

ENTRYPOINT ["bun", "run", "start"]
