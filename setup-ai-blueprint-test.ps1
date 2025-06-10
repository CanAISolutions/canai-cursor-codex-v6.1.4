# AI Blueprint OpenAI API Test Setup Script (PowerShell)
# Based on MCP-PRODUCTION-INTEGRATION-GUIDE.md

Write-Host "🚀 AI Blueprint OpenAI API Test Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

# Check if OpenAI dependency is installed
try {
    npm list openai | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ OpenAI dependency already installed" -ForegroundColor Green
    } else {
        throw "Not installed"
    }
} catch {
    Write-Host "📦 Installing OpenAI dependency..." -ForegroundColor Yellow
    npm install openai
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ OpenAI dependency installed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install OpenAI dependency" -ForegroundColor Red
        exit 1
    }
}

# Check for OpenAI API key
$apiKey = $env:OPENAI_API_KEY
if ([string]::IsNullOrEmpty($apiKey)) {
    Write-Host ""
    Write-Host "⚠️  OPENAI_API_KEY environment variable is not set" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To set your OpenAI API key, run this command:" -ForegroundColor Cyan
    Write-Host '   $env:OPENAI_API_KEY="sk-proj-[YOUR_ACTUAL_KEY]"' -ForegroundColor White
    Write-Host ""
    Write-Host "Or set it permanently:" -ForegroundColor Cyan
    Write-Host '   [Environment]::SetEnvironmentVariable("OPENAI_API_KEY", "sk-proj-[YOUR_ACTUAL_KEY]", "User")' -ForegroundColor White
    Write-Host ""
    Write-Host "📝 Or create a .env file in the project root with:" -ForegroundColor Cyan
    Write-Host '   OPENAI_API_KEY="sk-proj-[YOUR_ACTUAL_KEY]"' -ForegroundColor White
    Write-Host ""
    Write-Host "Then run this script again." -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "✅ OPENAI_API_KEY environment variable is set" -ForegroundColor Green
    
    # Validate API key format
    if ($apiKey.StartsWith("sk-")) {
        Write-Host "✅ API key format appears valid" -ForegroundColor Green
    } else {
        Write-Host "⚠️  API key format may be invalid (should start with 'sk-')" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🧪 Setup complete! Ready to run the test." -ForegroundColor Green
Write-Host ""
Write-Host "To run the AI Blueprint OpenAI API test:" -ForegroundColor Cyan
Write-Host "  node test-ai-blueprint-production-api.js" -ForegroundColor White
Write-Host ""
Write-Host "Or to run it with additional logging:" -ForegroundColor Cyan
Write-Host "  `$env:NODE_ENV='development'; node test-ai-blueprint-production-api.js" -ForegroundColor White
Write-Host "" 