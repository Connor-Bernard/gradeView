-include .env
.DEFAULT_GOAL := docker
CONFIRM ?= $(shell bash -c 'read -p "Are you sure you want to push to production? (y/n)" confirm; echo $$confirm')

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
