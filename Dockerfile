# Builder
FROM node:12 AS builder

WORKDIR /app/ui

ADD ui ./
RUN yarn
RUN NODE_ENV=production npm run build

# App
FROM node:12

WORKDIR /app
VOLUME /app/api/data

ADD api api
ADD Caddyfile ./
COPY --from=builder /app/ui/dist ./static

RUN curl https://getcaddy.com | bash -s personal

WORKDIR /app/api
RUN yarn

WORKDIR /app

RUN echo 'cd api\n\
yarn serve &\n\
cd ..\n\
caddy -conf Caddyfile\n' >> start.sh

EXPOSE 8080

CMD bash start.sh