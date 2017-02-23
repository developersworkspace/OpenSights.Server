FROM node:6.9.4

RUN npm install pm2 -g

WORKDIR ./OpenSights.Server/api

COPY ./dist ./

RUN npm install

CMD ["pm2-docker", "./app.js"]