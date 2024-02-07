FROM node:19.5-alpine3.16
WORKDIR /website
ENV PATH="./node_modules/.bin:$PATH"
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]