FROM node:16-alpine as development

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

RUN npm run build

FROM node:16-alpine as prod

WORKDIR /usr/src/app

COPY package*.json .

COPY yarn.lock .

RUN yarn install --only=production

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/index.js"]