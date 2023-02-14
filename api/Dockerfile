FROM node:19.5-alpine3.16
WORKDIR /api
ENV PATH="./node_modules/.bin:$PATH"
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=8000
EXPOSE 8000
CMD ["npm", "run", "server"]