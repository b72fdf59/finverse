FROM node:10.13.0-alpine

#ENV
ENV PORT=7001

WORKDIR usr/src/app

COPY package.json .
RUN npm install

ADD . /usr/src/app

CMD [ "npm", "start" ]
EXPOSE 7001