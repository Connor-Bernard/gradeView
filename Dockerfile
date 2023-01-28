FROM node:19.5-alpine3.16
WORKDIR /grade-view
ENV PATH="./node_modules/.bin:$PATH"
COPY . .
RUN npm run build
RUN cd server
CMD ["npm", "start"]