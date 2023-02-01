FROM node:18.12.1

COPY . /src
COPY ./view /view

WORKDIR /src
RUN npm i --force
RUN node cmd.js serve
RUN npm run build
RUN npm run start:prod

WORKDIR /view
RUN npm i
RUN npm run build
RUN npm i -g serve

EXPOSE 3000 80

CMD serve -s build -p 80