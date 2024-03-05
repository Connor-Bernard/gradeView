-include .env
.DEFAULT_GOAL := docker

init:
	clear
	cd website && npm install
	cd api && npm install
	cd website/server && npm install

npm:
	clear
	cd api && npm run server

docker:
	clear
	cd website && npm run build
	docker-compose build
	docker-compose up || true
