FROM node:19.5-alpine3.16
WORKDIR /website
ENV PATH="./node_modules/.bin:$PATH"
COPY package*.json ./
RUN npm install
COPY . .
ENV REACT_APP_PROXY_SERVER="http://api:8000"
ENV PORT=8080
EXPOSE 8080
CMD ["npm", "start"]