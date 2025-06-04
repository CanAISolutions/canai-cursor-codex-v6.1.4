# Set Supabase environment variables
$env:SUPABASE_URL = "https://ezdpmpwnqnizbveamicd.supabase.co"
$env:SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6ZHBtcHducW5pemJ2ZWFtaWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTUxMTgsImV4cCI6MjA2NDI5MTExOH0.dMxDgYAhINZTJhK7qGMNecZEIKAS_B2HSGWv9e5d088"

Write-Host "Starting Day 3 Testing Infrastructure Verification..."
Write-Host "URL: $env:SUPABASE_URL"

# Run Day 3 testing infrastructure script
node "workspace-organization/02-orchestration/make-com/supabase-dev/verification/scripts/day3-testing-infrastructure.js" 