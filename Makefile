.DEFAULT_GOAL := docker

npm:
	cd api
	npm start

docker:
	cd website
	npm run build
	cd ..
	docker-compose build
	docker-compose up

build:
	cd website
	npm run build