FROM node:18.12.1

WORKDIR /src

COPY . /src

RUN npm i
RUN node cmd.js serve

EXPOSE 3000
CMD npm run start:prod

WORKDIR /view

RUN npm i

EXPOSE 80

RUN npm run build

RUN npm i -g serve

CMD serve -s build -p 80