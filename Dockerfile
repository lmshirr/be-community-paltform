FROM node:14.15.1-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 5000

CMD [ "node", "app/server.js" ]
