#!make

# .PHONY targets are not files
.EXPORT_ALL_VARIABLES:

include .env

ifeq ($(COMPOSE_PROJECT_NAME),)
	COMPOSE_PROJECT_NAME := signalwire_poc_latest
endif

# EXECUTABLES are expected in your path - install if not present
# TODO: Add jq back into EXECUTABLES and install once on Jenkins
EXECUTABLES = docker docker-compose node npm # jq
K := $(foreach exec,$(EXECUTABLES),\
	$(if $(shell which $(exec)),some string,$(error "No $(exec) in PATH)))

.PHONY: install
install: # update-docs-version
	npm i

.PHONY: lint
lint:
	npm run lint

.PHONY: lint-fix
lint-fix:
	npm run lint-fix

.PHONY: start
start:
	docker-compose up

.PHONY: stop
stop:
	docker-compose stop

.PHONY: down
down:
	docker-compose down

.PHONY: test
test: test-unit test-integration

.PHONY: test-unit
test-unit:
	npm run test-unit

.PHONY: test-integration
test-integration: down
	-docker-compose -f docker-compose-test.yaml run -e TEST=test-integration --rm api elasticsearch
	-docker-compose down

.PHONY: logs
logs:
	docker-compose logs -f

.PHONY: clean
clean: stop
	docker-compose rm -fsv
	docker volume prune -f

.PHONY: build
build: down
	docker-compose build

.PHONY: rebuild
rebuild: down
	docker-compose build --no-cache

.PHONY: squash
squash: down
	docker image build . --tag entercom/search --squash

.PHONY: nuke
nuke: down clean
	docker system prune -af

.PHONY: up server i
up: start;
server: start;
i: install;
