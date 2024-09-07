#!/bin/bash

# Ensure the script stops if any command fails
set -e

# Build the project
npm run build

# Read the latest version from package.json
VERSION=$(node -p "require('./package.json').version")

# Read the changelog content
CHANGELOG_CONTENT=$(cat docs/CHANGELOG.md)



# Create a Git tag with changelog content
git tag -a "v${VERSION}" -m "Release ${VERSION}: ${CHANGELOG_CONTENT}"

# Publish the package
npm publish --access public
# Push the changes and tags to the remote repository
# Create a Git commit for the release
git add .
git commit -m "chore: release version ${VERSION}"
git push origin main --tags