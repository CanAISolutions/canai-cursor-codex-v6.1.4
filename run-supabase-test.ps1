# Set Supabase environment variables
$env:SUPABASE_URL = "https://ezdpmpwnqnizbveamicd.supabase.co"
$env:SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6ZHBtcHducW5pemJ2ZWFtaWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTUxMTgsImV4cCI6MjA2NDI5MTExOH0.dMxDgYAhINZTJhK7qGMNecZEIKAS_B2HSGWv9e5d088"

# Run the Supabase verification script
Write-Host "Starting Supabase Connection Verification..."
Write-Host "URL: $env:SUPABASE_URL"

node "workspace-organization/02-orchestration/make-com/supabase-dev/verification/scripts/test-supabase-connection.js" 