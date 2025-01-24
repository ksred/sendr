.PHONY: help dev build install db-up db-down db-restart db-reset db-migrate db-seed db-studio clean

# Colors
COLOR_RESET = \033[0m
COLOR_BOLD = \033[1m
COLOR_BLUE = \033[34m
COLOR_CYAN = \033[36m
COLOR_GREEN = \033[32m

help: ## Show this help message
	@echo '${COLOR_BOLD}Usage:${COLOR_RESET}'
	@echo '  make ${COLOR_CYAN}<target>${COLOR_RESET}'
	@echo ''
	@echo '${COLOR_BOLD}Targets:${COLOR_RESET}'
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*?##/ { printf "  ${COLOR_CYAN}%-15s${COLOR_RESET} %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

install: ## Install dependencies
	@echo "${COLOR_BLUE}Installing dependencies...${COLOR_RESET}"
	npm install

dev: ## Start development server
	@echo "${COLOR_BLUE}Starting development server...${COLOR_RESET}"
	npm run dev

build: ## Build the application
	@echo "${COLOR_BLUE}Building the application...${COLOR_RESET}"
	npm run build

db-up: ## Start database containers
	@echo "${COLOR_BLUE}Starting database containers...${COLOR_RESET}"
	docker-compose up -d

db-down: ## Stop database containers
	@echo "${COLOR_BLUE}Stopping database containers...${COLOR_RESET}"
	docker-compose down

db-restart: db-down db-up ## Restart database containers

db-reset: ## Reset the database (WARNING: This will delete all data)
	@echo "${COLOR_BLUE}Resetting database...${COLOR_RESET}"
	docker-compose down -v
	docker-compose up -d
	sleep 5
	npm run prisma db push
	npm run db:seed

db-migrate: ## Run database migrations
	@echo "${COLOR_BLUE}Running database migrations...${COLOR_RESET}"
	npm run prisma db push

db-seed: ## Seed the database with initial data
	@echo "${COLOR_BLUE}Seeding database...${COLOR_RESET}"
	npm run db:seed

db-studio: ## Open Prisma Studio
	@echo "${COLOR_BLUE}Opening Prisma Studio...${COLOR_RESET}"
	npx prisma studio

lint: ## Run linter
	@echo "${COLOR_BLUE}Running linter...${COLOR_RESET}"
	npm run lint

lint-fix: ## Fix linting issues
	@echo "${COLOR_BLUE}Fixing linting issues...${COLOR_RESET}"
	npm run lint -- --fix

type-check: ## Run TypeScript type checking
	@echo "${COLOR_BLUE}Running type checking...${COLOR_RESET}"
	npm run type-check

clean: ## Clean build artifacts and node_modules
	@echo "${COLOR_BLUE}Cleaning project...${COLOR_RESET}"
	rm -rf .next
	rm -rf node_modules
	rm -rf build

# Default target
.DEFAULT_GOAL := help
