.PHONY: install build test lint dev clean

# Install all workspace dependencies
install:
	. ${NVM_DIR}/nvm.sh && nvm use && npm ci

# Build all packages (in dependency order)
build:
	. ${NVM_DIR}/nvm.sh && nvm use && npm run build

# Run tests for all packages
test:
	. ${NVM_DIR}/nvm.sh && nvm use && npm run test

# Run linting for all packages
lint:
	. ${NVM_DIR}/nvm.sh && nvm use && npm run lint

# Run the showcase dev server
dev:
	rm -rf packages/east-ui-showcase/node_modules/.vite
	. ${NVM_DIR}/nvm.sh && nvm use && npm run dev

# Clean build artifacts
clean:
	rm -rf packages/*/dist packages/*/node_modules node_modules
