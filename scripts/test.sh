#!/bin/bash

# Exit on error
set -e

# Function to print a message and execute a command
run_test() {
  local name="$1"
  local cmd="$2"
  echo "Running $name..."
  eval "$cmd"
  echo "$name completed."
}

run_test "Unit Tests"

# Run specific unit tests
run_test "Console Unit Tests" "npm run test:unit:Console"
run_test "File Unit Tests" "npm run test:unit:File"

# Run integration tests
run_test "Integration Tests" "npm run test:integration"

# Run end-to-end tests
run_test "End-to-End Tests" "npm run test:e2e"

echo "All tests completed."
