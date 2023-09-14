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
	cd api && npm start

docker:
	clear
	cd website && npm run build
	docker-compose build
	docker-compose up || true

deployFromCurrentBranch:
	clear
	if [ "$(CONFIRM)" != "y" ]; then echo "Aborting."; exit 1; fi
	git stash
	cd website && npm run build
	git add website/production/build -f
	if ! (git commit --allow-empty -m "Sending to production" --quiet); then git reset; git stash pop --quiet || true; exit 1; fi
	if ! (git push $(PRODUCTION_REMOTE_NAME) -o ci.variable="PRODUCTION=true"); then git reset --hard $(shell git rev-parse --abbrev-ref HEAD)~1; git stash pop --quiet || true; exit 1; fi
	git stash pop --quiet || true
	echo "Website successfully built and pushed to production."

deployFromMain:
	clear
	if [ "$(CONFIRM)" != "y" ]; then echo "Aborting."; exit 1; fi
	git stash
	if ! (git checkout -b production); then if(! git checkout production && git reset main --hard); then git checkout main; git stash pop --quiet || true; exit 1; fi; fi;
	cd website && npm run build
	git add website/production/build -f
	if ! (git commit --allow-empty -m "Sending to production" --quiet); then git reset; git checkout main; git stash pop --quiet || true; exit 2; fi
	if ! (git push $(PRODUCTION_REMOTE_NAME) -o ci.variable="PRODUCTION=true"); then git reset --hard main~1; git checkout main; git stash pop --quiet || true; exit 3; fi
	git checkout main;
	git reset main~1;
	git stash pop --quiet || true
	echo "Website successfully built and pushed to production."