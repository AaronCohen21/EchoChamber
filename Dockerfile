FROM node:18
WORKDIR /app
COPY package.json .
COPY client/package.json ./client/
COPY server/package.json ./server/
COPY yarn.lock .
RUN yarn install
COPY . .
EXPOSE 1738
RUN yarn react:build
CMD [ "yarn", "deploy" ]