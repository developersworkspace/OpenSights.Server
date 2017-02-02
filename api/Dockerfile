FROM node:6.9.4
WORKDIR ./OpenSights.Server/api
COPY ./dist ./
RUN npm install
CMD ["node", "./app.js"]