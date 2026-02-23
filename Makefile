.PHONY: install update build test lint dev clean extension extension-install version-prerelease version-patch version-minor version-major

# Use nvm locally, skip in CI where node is already on PATH
ifdef NVM_DIR
NVM := . ${NVM_DIR}/nvm.sh && nvm use &&
endif

# Install all workspace dependencies
install:
	$(NVM) npm ci

# Update @elaraai dependencies (including transitive)
update:
	$(NVM) npm update @elaraai/east @elaraai/east-node-std @elaraai/e3-api-client @elaraai/e3-api-server @elaraai/e3-types @elaraai/e3-core @elaraai/e3

# Build all packages (in dependency order)
build:
	$(NVM) npm run build

# Run tests for all packages
test:
	$(NVM) npm run test

# Run linting for all packages
lint:
	$(NVM) npm run lint

# Run the showcase dev server
dev:
	rm -rf ./packages/east-ui-showcase/node_modules/.vite && $(NVM) npm run dev

# Build and package the VSCode extension
extension:
	$(NVM) cd packages/east-ui-extension && npm run build && npm run package

# Package and install the VSCode extension
extension-install: extension
	code --install-extension packages/east-ui-extension/*.vsix

# Clean build artifacts
clean:
	rm -rf packages/*/dist packages/*/node_modules node_modules packages/east-ui-extension/*.vsix


# Bump all package versions
version-prerelease:
	$(NVM) npm run version:all:prerelease

version-patch:
	$(NVM) npm run version:all:patch

version-minor:
	$(NVM) npm run version:all:minor

version-major:
	$(NVM) npm run version:all:major

# Link local east package for development/testing
# Usage: make link-local-east EAST_PATH=../east
link-local-east:
ifndef EAST_PATH
	$(error EAST_PATH is required. Usage: make link-local-east EAST_PATH=../east)
endif
	@echo "Linking local east from $(EAST_PATH)..."
	cd $(EAST_PATH) && npm link
	npm link @elaraai/east
	@echo ""
	@echo "Now using LOCAL east from $(EAST_PATH). Remember to 'make unlink-local-east' when done!"

# Unlink local east and restore npm version
unlink-local-east:
	@echo "Restoring npm version of east..."
	npm install @elaraai/east
	@echo ""
	@echo "Now using NPM east."
