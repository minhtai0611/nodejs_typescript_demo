FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run tsc-build

CMD ["node", "./dist/app.js"]

EXPOSE 3000 