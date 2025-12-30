FROM node:22

WORKDIR /app

COPY package*.json ./

COPY . .

RUN yarn install

RUN yarn build

CMD [ "yarn", "start" ]