@echo off
echo =========================================
echo TeachersGallery Avatar URL Fixer Script
echo =========================================
echo.

echo This script will repair and normalize avatar URLs in the database.
echo It fixes common issues like:
echo - Incorrect URL formatting
echo - Extra whitespace
echo - Duplicate slashes
echo - Protocol issues
echo.
set /p response=Would you like to proceed? (Y/n): 

:: Default to Yes if no response is given
if "%response%"=="" set response=Y

if /i "%response%"=="Y" (
    echo.
    echo Running avatar URL fixer...
    echo.

    :: Check if Node.js is installed
    where node >nul 2>&1
    if %errorlevel% == 0 (
        :: Run the Node.js script
        node scripts/fix-avatar-urls.js
    ) else (
        echo ❌ Node.js is not installed. Please install Node.js and try again.
        echo.
        echo Alternatively, you can run these SQL commands in your Supabase dashboard:
        echo.
        echo -- Fix whitespace in avatar URLs
        echo UPDATE profiles
        echo SET avatar_url = TRIM^(avatar_url^)
        echo WHERE avatar_url LIKE ' %%' OR avatar_url LIKE '%% ';
        echo.
        echo -- Fix bad URL formats
        echo UPDATE profiles
        echo SET avatar_url = REGEXP_REPLACE^(avatar_url, '([^:])//+', '\1/', 'g'^)
        echo WHERE avatar_url LIKE '%%//%%';
        echo.
        echo -- Convert http to https
        echo UPDATE profiles
        echo SET avatar_url = 'https' || SUBSTRING^(avatar_url FROM 5^)
        echo WHERE avatar_url LIKE 'http:%%';
    )

    echo.
    echo ✅ Avatar URL fixing process completed!
    echo.
    echo Please restart your Next.js application to apply the changes:
    echo $ npm run dev
    echo.
) else (
    echo Operation cancelled.
)

pause 