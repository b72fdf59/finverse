FROM node:current-alpine

WORKDIR usr/app

COPY package*.json .
RUN npm install && npm cache clean --force

COPY . /usr/app

EXPOSE 7001
CMD [ "npm", "start" ]