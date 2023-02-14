include .env
.DEFAULT_GOAL := docker
CONFIRM ?= $(shell bash -c 'read -p "Are you sure you want to push to production? (y/n)" confirm; echo $$confirm')

npm:
	clear
	cd api && npm start

docker:
	clear
	cd website && npm run build
	docker-compose build
	docker-compose up

production:
	clear
	if [ "$(CONFIRM)" != "y" ]; then echo "Aborting."; exit 1; fi
	git stash
	cd website && npm run build
	git add website/production/build
	git stash pop --quiet || true
	git commit -m "Build website for production" --quiet
	git push $(PRODUCTION_REMOTE_NAME)
	echo "Website built and pushed to production."