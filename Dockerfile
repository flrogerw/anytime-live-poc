FROM node:12-alpine
RUN apk add --no-cache --virtual .build-deps-full postgresql-client bash

WORKDIR /usr/app

COPY ./src  src/
COPY ./public  public/
COPY ./package.json .
COPY ./package-lock.json .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]

