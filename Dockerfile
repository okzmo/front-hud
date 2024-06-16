FROM node:20-alpine

RUN npm install -g pnpm@9.3.0

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ENV VITE_API_URL=http://s48ok4w.128.140.68.17.sslip.io
RUN pnpm build

EXPOSE 3000
CMD ["node", "build"]
