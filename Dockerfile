#FROM node:16-alpine as builder
FROM oven/bun as builder
WORKDIR /src
COPY package.json ./
# COPY yarn.lock ./
COPY bun.lockb ./

# RUN npm install
# RUN yarn install --frozen-lockfile
RUN bun install --frozen-lockfile
#RUN bun install -g yarn
COPY . .

ENV NODE_ENV=production
ARG ENV_DEPLOY=staging
# RUN bun run build
# RUN npm run build
RUN bun run build:$ENV_DEPLOY
# RUN npm run build:$ENV_DEPLOY
# RUN yarn run build:$ENV_DEPLOY
# RUN npm prune --production

FROM oven/bun AS production
#FROM node:16-alpine as production
ENV NODE_ENV=production
ARG ENV_DEPLOY=staging
WORKDIR /app
COPY --from=builder /src/package*.json ./
COPY --from=builder /src/next.config.js ./
COPY --from=builder /src/.next/standalone ./
COPY --from=builder /src/.next/static ./.next/static
COPY --from=builder /src/public ./public
# COPY --from=builder /app/server.js ./
# RUN npm install next@10.0.7 express@4.17.2 lru-cache@6.0.0 compression@1.7.4

# CMD ["node", "server.js"]
CMD ["bun", "server.js"]
# RUN bun run start:$ENV_DEPLOY
# CMD ["npx", "dotenv", "-e", "./env/.env.${ENV_DEPLOY}", "bun", "run", "start"]
