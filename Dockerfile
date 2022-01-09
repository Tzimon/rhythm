FROM node

WORKDIR /app

RUN npm install -g -D typescript
RUN npm install -g -D ts-node

COPY package.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]