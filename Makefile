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
	git add website/production/build -f
	git add api/auth/service_account.json -f
	if ! (git commit -m "Build website for production" --quiet); then git reset; git stash pop --quiet || true; exit 1; fi
	git push $(PRODUCTION_REMOTE_NAME)
	echo "Website built and pushed to production."