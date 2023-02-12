FROM node:19.5-alpine3.16
WORKDIR /website
ENV PATH="./node_modules/.bin:$PATH"
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENV REACT_APP_PROXY_SERVER="http://api:8000"
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "run", "startCurrentBuild"]