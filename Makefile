.PHONY: up down build logs test

up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose up --build -d

logs:
	docker compose logs -f

test:
	cd backend && python -m pytest
