.PHONY: install build test lint dev clean extension extension-install set-east-version version-prerelease version-patch version-minor version-major

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

# Bump all package versions
version-prerelease:
	. ${NVM_DIR}/nvm.sh && nvm use && npm run version:all:prerelease

version-patch:
	. ${NVM_DIR}/nvm.sh && nvm use && npm run version:all:patch

version-minor:
	. ${NVM_DIR}/nvm.sh && nvm use && npm run version:all:minor

version-major:
	. ${NVM_DIR}/nvm.sh && nvm use && npm run version:all:major
