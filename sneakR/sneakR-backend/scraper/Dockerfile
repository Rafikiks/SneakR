FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY scraper.js ./

CMD ["node", "scraper.js"]