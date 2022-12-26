FROM node:18.12.1

WORKDIR /src

COPY . /app

RUN npm i && node cmd.js serve

EXPOSE 3000
CMD npm run start:prod