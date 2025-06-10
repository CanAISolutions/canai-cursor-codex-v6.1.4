#!/bin/bash

# AI Blueprint OpenAI API Test Setup Script
# Based on MCP-PRODUCTION-INTEGRATION-GUIDE.md

echo "🚀 AI Blueprint OpenAI API Test Setup"
echo "====================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Check if OpenAI dependency is installed
if ! npm list openai &> /dev/null; then
    echo "📦 Installing OpenAI dependency..."
    npm install openai
    if [ $? -eq 0 ]; then
        echo "✅ OpenAI dependency installed successfully"
    else
        echo "❌ Failed to install OpenAI dependency"
        exit 1
    fi
else
    echo "✅ OpenAI dependency already installed"
fi

# Check for OpenAI API key
if [ -z "$OPENAI_API_KEY" ]; then
    echo ""
    echo "⚠️  OPENAI_API_KEY environment variable is not set"
    echo ""
    echo "To set your OpenAI API key, run one of these commands:"
    echo ""
    echo "🪟 Windows (PowerShell):"
    echo '   $env:OPENAI_API_KEY="sk-proj-[YOUR_ACTUAL_KEY]"'
    echo ""
    echo "🐧 Linux/Mac (Bash):"
    echo '   export OPENAI_API_KEY="sk-proj-[YOUR_ACTUAL_KEY]"'
    echo ""
    echo "📝 Or create a .env file in the project root with:"
    echo '   OPENAI_API_KEY="sk-proj-[YOUR_ACTUAL_KEY]"'
    echo ""
    echo "Then run this script again."
    exit 1
else
    echo "✅ OPENAI_API_KEY environment variable is set"
    
    # Validate API key format
    if [[ $OPENAI_API_KEY == sk-* ]]; then
        echo "✅ API key format appears valid"
    else
        echo "⚠️  API key format may be invalid (should start with 'sk-')"
    fi
fi

echo ""
echo "🧪 Setup complete! Ready to run the test."
echo ""
echo "To run the AI Blueprint OpenAI API test:"
echo "  node test-ai-blueprint-production-api.js"
echo ""
echo "Or to run it with additional logging:"
echo "  NODE_ENV=development node test-ai-blueprint-production-api.js"
echo "" 