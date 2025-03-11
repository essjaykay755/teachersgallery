@echo off
echo Running fix-profile-visibility.sql to add is_listed column to teacher_profiles table...

REM Check if Supabase CLI is installed
where supabase >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Supabase CLI not found. Please install it first.
    echo You can run this SQL script manually in the Supabase SQL Editor.
    echo See fix-profile-visibility.sql for the SQL commands.
    pause
    exit /b 1
)

REM Get Supabase URL and Key from .env.local file
for /f "tokens=2 delims==" %%a in ('findstr "NEXT_PUBLIC_SUPABASE_URL" .env.local') do set SUPABASE_URL=%%a
for /f "tokens=2 delims==" %%a in ('findstr "SUPABASE_SERVICE_ROLE_KEY" .env.local') do set SUPABASE_KEY=%%a

REM Trim whitespace
set SUPABASE_URL=%SUPABASE_URL: =%
set SUPABASE_KEY=%SUPABASE_KEY: =%

if "%SUPABASE_URL%"=="" (
    echo Could not find NEXT_PUBLIC_SUPABASE_URL in .env.local
    echo Please run this SQL script manually in the Supabase SQL Editor.
    echo See fix-profile-visibility.sql for the SQL commands.
    pause
    exit /b 1
)

if "%SUPABASE_KEY%"=="" (
    echo Could not find SUPABASE_SERVICE_ROLE_KEY in .env.local
    echo Please run this SQL script manually in the Supabase SQL Editor.
    echo See fix-profile-visibility.sql for the SQL commands.
    pause
    exit /b 1
)

echo Running SQL script with Supabase CLI...
supabase db execute --db-url "%SUPABASE_URL%?apikey=%SUPABASE_KEY%" --file fix-profile-visibility.sql

if %ERRORLEVEL% neq 0 (
    echo Failed to run SQL script with Supabase CLI.
    echo Please run this SQL script manually in the Supabase SQL Editor.
    echo See fix-profile-visibility.sql for the SQL commands.
    pause
    exit /b 1
)

echo SQL script executed successfully!
echo The is_listed column has been added to the teacher_profiles table.
echo Please restart your Next.js application for the changes to take effect.
pause 