FROM node:20-alpine AS base

FROM base AS builder

RUN apk add --no-cache gcompat
WORKDIR /app
 
COPY package*json pnpm-lock.yaml* tsconfig.json drizzle.config.ts ./

COPY  src ./src/

RUN \
  if [ -f pnpm-lock.yaml ]; then npm i -g corepack@latest && corepack enable pnpm && pnpm i --frozen-lockfile && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json

USER hono
EXPOSE 3000

CMD ["node", "/app/dist/src/index.js"]