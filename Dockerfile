FROM node

WORKDIR /app

RUN npm install -g -D typescript

COPY package.json ./

RUN npm install

COPY . .

RUN tsc

CMD [ "npm", "start" ]