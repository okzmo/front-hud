FROM node:20-alpine

RUN npm install -g pnpm@9.3.0

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN pnpm build

EXPOSE 3000
CMD ["node", "build"]
