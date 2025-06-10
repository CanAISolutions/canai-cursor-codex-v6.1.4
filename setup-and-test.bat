@echo off
echo.
echo OpenAI API Key Setup and Test
echo =============================
echo.

REM Check if OpenAI API key is set
if "%OPENAI_API_KEY%"=="" (
    echo [ERROR] OpenAI API Key is not set
    echo.
    echo Please set your OpenAI API key by running:
    echo   set OPENAI_API_KEY=sk-proj-YOUR_ACTUAL_KEY_HERE
    echo.
    echo Or for permanent setting:
    echo   setx OPENAI_API_KEY "sk-proj-YOUR_ACTUAL_KEY_HERE"
    echo.
    echo Get your API key from: https://platform.openai.com/api-keys
    echo.
    pause
    exit /b 1
)

echo [SUCCESS] OpenAI API Key is set
echo Key prefix: %OPENAI_API_KEY:~0,7%...
echo.

echo Running AI Blueprint Production Test...
echo.

REM Run the test
node test-ai-blueprint-production-api.js

if %errorlevel% equ 0 (
    echo.
    echo [SUCCESS] Test completed successfully!
    echo Your OpenAI integration is working properly
) else (
    echo.
    echo [ERROR] Test failed. Check the output above for details.
)

echo.
pause 