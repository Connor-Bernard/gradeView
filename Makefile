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
	@clear
	@cd website && npm run build
	@docker compose build
	@docker compose up -dV

logs:
	@echo "ensure your stack is running to view logs:"
	@echo
	@docker ps
	@echo
	@docker compose logs -f

clean-containers:
	@docker compose down
	@for container in `docker ps -aq` ; do \
		echo "\nRemoving container $${container} \n========================================== " ; \
		docker rm -f $${container} || exit 1 ; \
	done

clean-images:
	@for image in `docker images -aq` ; do \
		echo "Removing image $${image} \n==========================================\n " ; \
		/usr/local/bin/docker rmi -f $${image} || exit 1 ; \
	done

clean: clean-containers clean-images
	docker system prune
