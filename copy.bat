@echo off
REM Build React project
npm run build

REM Set Jenkins userContent folder path
set JENKINS_PATH=C:\ProgramData\Jenkins\.jenkins\userContent\translator-app

REM Remove old files if exists
if exist "%JENKINS_PATH%" rmdir /s /q "%JENKINS_PATH%"

REM Recreate folder
mkdir "%JENKINS_PATH%"

REM Copy new build files
xcopy build "%JENKINS_PATH%" /E /H /C /I

echo ✅ React build copied to Jenkins userContent
pausecd 
