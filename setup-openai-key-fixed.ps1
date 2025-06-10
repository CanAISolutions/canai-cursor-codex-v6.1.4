Write-Host "🔑 OpenAI API Key Setup for AI Blueprint Test" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

# Check if OpenAI API key is already set
if ($env:OPENAI_API_KEY) {
    Write-Host "✅ OpenAI API Key is already set" -ForegroundColor Green
    Write-Host "🔍 Key prefix: $($env:OPENAI_API_KEY.Substring(0, 7))..." -ForegroundColor Yellow
} else {
    Write-Host "❌ OpenAI API Key is not set" -ForegroundColor Red
    Write-Host ""
    Write-Host "📝 Please set your OpenAI API key:" -ForegroundColor Yellow
    Write-Host "   1. Get your API key from: https://platform.openai.com/api-keys" -ForegroundColor White
    Write-Host "   2. Copy your API key (starts with 'sk-proj-')" -ForegroundColor White
    Write-Host "   3. Run this command with your actual key:" -ForegroundColor White
    Write-Host ""
    Write-Host "   `$env:OPENAI_API_KEY=`"sk-proj-YOUR_ACTUAL_KEY_HERE`"" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   Then run this script again: .\setup-openai-key-fixed.ps1" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "🚀 Running AI Blueprint Production Test..." -ForegroundColor Green
Write-Host ""

# Run the test
node test-ai-blueprint-production-api.js

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 Test completed successfully!" -ForegroundColor Green
    Write-Host "✅ Your OpenAI integration is working properly" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Test failed. Check the output above for details." -ForegroundColor Red
} 