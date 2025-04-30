#!/bin/bash

# 🧪 cliTestFlow.sh
# Run a local prompt test using CanAI's logic layer
# Usage: ./cliTestFlow.sh <PromptType> <input.json> [version]

TYPE=$1
INPUT_FILE=$2
VERSION=${3:-v1}

if [ -z "$TYPE" ] || [ -z "$INPUT_FILE" ]; then
  echo "❌ Usage: ./cliTestFlow.sh <PromptType> <input.json> [version]"
  exit 1
fi

echo "🔁 Testing prompt for type: $TYPE (version: $VERSION)"
echo "📄 Input file: $INPUT_FILE"

# Run the prompt via ts-node
npx ts-node ./scripts/tools/runPromptTest.ts "$TYPE" "$INPUT_FILE" "$VERSION"
