.DEFAULT_GOAL := node

node:
	npm start

docker:
	docker-compose up

build:
	npm run build