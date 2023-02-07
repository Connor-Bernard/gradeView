FROM node:19.5-alpine3.16
WORKDIR /website
ENV PATH="./node_modules/.bin:$PATH"
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=3000
EXPOSE 3000
ENV HTTP_PROXY="http://127.0.0.1/"
CMD ["npm", "run", "react"]