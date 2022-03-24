FROM node:12-alpine
RUN apk add --no-cache --virtual .build-deps-full postgresql-client bash

WORKDIR /usr/app

COPY ./database  database/
COPY ./src  src/
COPY server.js .
COPY ./package.json .
COPY ./package-lock.json .

COPY ./entrypoint.sh .
RUN chmod +x entrypoint.sh

RUN npm install

EXPOSE 5000

ENTRYPOINT [ "./entrypoint.sh" ]

