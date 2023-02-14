include .env
.DEFAULT_GOAL := docker

npm:
	cd api && npm start

docker:
	cd website && npm run build
	docker-compose build
	docker-compose up

production:
	git stash
	cd website && npm run build
	git add website/production/build
	git stash pop --quiet
	git commit -m "Build website for production" --quiet
	git push $(PRODUCTION_REMOTE_NAME)