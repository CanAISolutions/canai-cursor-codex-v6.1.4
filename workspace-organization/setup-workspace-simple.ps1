# Simple Workspace Organization Setup Script
Write-Host "Setting up CanAI Workspace Organization..." -ForegroundColor Green

# Create main directories
$dirs = @(
    "workspace-organization\01-foundation\supabase\schema",
    "workspace-organization\01-foundation\airtable\schemas", 
    "workspace-organization\02-orchestration\make-com\integration",
    "workspace-organization\03-emotional-intelligence\sparksplit\visualization",
    "workspace-organization\05-monitoring\sacred-metrics\validation",
    "workspace-organization\prompts\stage-prompts"
)

foreach ($dir in $dirs) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "Created: $dir" -ForegroundColor Green
    }
}

# Copy critical files
if (Test-Path "MASTER-IMPLEMENTATION-PLAN-V6.1.4-COMPLETE.md") {
    Copy-Item "MASTER-IMPLEMENTATION-PLAN-V6.1.4-COMPLETE.md" "workspace-organization\01-foundation\" -Force
    Write-Host "Moved: MASTER-IMPLEMENTATION-PLAN-V6.1.4-COMPLETE.md" -ForegroundColor Green
}

if (Test-Path "docs\verification-hub\verification-evidence\integration-tests\Make.com-Bulletproof-Implementation-Plan-v6.0.markdown") {
    Copy-Item "docs\verification-hub\verification-evidence\integration-tests\Make.com-Bulletproof-Implementation-Plan-v6.0.markdown" "workspace-organization\02-orchestration\make-com\integration\" -Force
    Write-Host "Moved: Make.com-Bulletproof-Implementation-Plan-v6.0.markdown" -ForegroundColor Green
}

Write-Host "Workspace organization setup complete!" -ForegroundColor Green 