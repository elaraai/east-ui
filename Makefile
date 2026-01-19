.PHONY: install build test lint dev clean extension extension-install set-east-version set-e3-api-server-version set-e3-api-client-version set-east-node-std-version version-prerelease version-patch version-minor version-major

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
	rm -rf ./packages/east-ui-showcase/node_modules/.vite && . ${NVM_DIR}/nvm.sh && nvm use && npm run dev

# Build and package the VSCode extension
extension:
	. ${NVM_DIR}/nvm.sh && nvm use && cd packages/east-ui-extension && npm run build && npm run package

# Package and install the VSCode extension
extension-install: extension
	code --install-extension packages/east-ui-extension/*.vsix

# Clean build artifacts
clean:
	rm -rf packages/*/dist packages/*/node_modules node_modules packages/east-ui-extension/*.vsix


# Update @elaraai/east version across all packages
# Usage: make set-east-version VERSION=0.0.1-beta.1
set-east-version:
ifndef VERSION
	$(error VERSION is required. Usage: make set-east-version VERSION=0.0.1-beta.1)
endif
	@echo "Updating @elaraai/east to version $(VERSION)..."
	@find . -name "package.json" -exec sed -i 's/"@elaraai\/east": "[^"]*"/"@elaraai\/east": "^$(VERSION)"/g' {} \;
	@echo "Done. Run 'npm install' to update dependencies."

# Update @elaraai/e3-api-server version
# Usage: make set-e3-api-server-version VERSION=0.0.2-beta.1
set-e3-api-server-version:
ifndef VERSION
	$(error VERSION is required. Usage: make set-e3-api-server-version VERSION=0.0.2-beta.1)
endif
	@echo "Updating @elaraai/e3-api-server to version $(VERSION)..."
	@find . -name "package.json" -exec sed -i 's/"@elaraai\/e3-api-server": "[^"]*"/"@elaraai\/e3-api-server": "^$(VERSION)"/g' {} \;
	@echo "Done. Run 'npm install' to update dependencies."

# Update @elaraai/e3-api-client version
# Usage: make set-e3-api-client-version VERSION=0.0.2-beta.1
set-e3-api-client-version:
ifndef VERSION
	$(error VERSION is required. Usage: make set-e3-api-client-version VERSION=0.0.2-beta.1)
endif
	@echo "Updating @elaraai/e3-api-client to version $(VERSION)..."
	@find . -name "package.json" -exec sed -i 's/"@elaraai\/e3-api-client": "[^"]*"/"@elaraai\/e3-api-client": "^$(VERSION)"/g' {} \;
	@echo "Done. Run 'npm install' to update dependencies."

# Update @elaraai/east-node-std version
# Usage: make set-east-node-std-version VERSION=0.0.1-beta.19
set-east-node-std-version:
ifndef VERSION
	$(error VERSION is required. Usage: make set-east-node-std-version VERSION=0.0.1-beta.19)
endif
	@echo "Updating @elaraai/east-node-std to version $(VERSION)..."
	@find . -name "package.json" -exec sed -i 's/"@elaraai\/east-node-std": "[^"]*"/"@elaraai\/east-node-std": "^$(VERSION)"/g' {} \;
	@echo "Done. Run 'npm install' to update dependencies."

# Bump all package versions
version-prerelease:
	. ${NVM_DIR}/nvm.sh && nvm use && npm run version:all:prerelease

version-patch:
	. ${NVM_DIR}/nvm.sh && nvm use && npm run version:all:patch

version-minor:
	. ${NVM_DIR}/nvm.sh && nvm use && npm run version:all:minor

version-major:
	. ${NVM_DIR}/nvm.sh && nvm use && npm run version:all:major

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
