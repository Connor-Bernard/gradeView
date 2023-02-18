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
	git update-index --assume-unchanged website/production/build
	git add website/production/build -f
	git add api/auth/service_account.json -f
	git status
	read
	if ! (git commit --allow-empty -m "Sending to production" --quiet); then git reset; git stash pop --quiet || true; exit 1; fi
	git stash pop --quiet || true
	if ! (git push $(PRODUCTION_REMOTE_NAME) -o ci.variable="PRODUCTION=true"); then git reset --hard HEAD~1; git stash pop; exit 1; fi
	echo "Website built and pushed to production."