:: TODO: if pem file is found, update the package instead of deleting it.
echo off
cls

set chrome="%UserProfile%\AppData\Local\Google\Chrome\Application\chrome.exe"
if not exist %chrome% goto chrome_not_installed

set crx="%cd%\smoothgestures.crx"
if exist %crx% (set /a doesCrxExist"=1") else (set /a doesCrxExist="0")
set pem="%cd%\smoothgestures.pem"
if exist %pem% (set /a doesPemExist"=1") else (set /a doesPemExist="0")

set /a doesAnyFileExist="%doesCrxExist%|%doesPemExist%"
rem if %doesAnyFileExist% == 1 (goto ask_deleting_files)
if %doesAnyFileExist% == 1 (goto delete_existing_files)
goto package

:exit
exit /b

:chrome_not_installed
echo Chrome is not installed or installed at an unexpected location.
pause
goto exit

:ask_deleting_files
echo CRX or PEM file is found.
set message="Do you want to replace the file?"
choice /m "%message%"
if %errorlevel% equ 1 (goto delete_existing_files) else (goto exit)

:delete_existing_files
echo Deleting files...
del %crx%
del %pem%
goto package

:package
echo Packaging...
%chrome% --pack-extension=%cd%\smoothgestures
goto exit