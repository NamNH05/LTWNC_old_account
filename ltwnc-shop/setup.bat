@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

REM Lấy đường dẫn thư mục hiện tại
set "PROJECT_DIR=%~dp0"

echo.
echo ============================================
echo   Chuẩn bị dự án LTWNC Shop
echo ============================================
echo.

REM Kiểm tra Node.js đã cài đặt chưa
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Lỗi: Node.js chưa được cài đặt!
    echo Vui lòng cài đặt Node.js từ https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js: 
node --version

REM Cài đặt dependencies Backend
echo.
echo 📦 Cài đặt Backend dependencies...
cd /d "%PROJECT_DIR%backend"
call npm install
if errorlevel 1 (
    echo ❌ Lỗi cài đặt Backend dependencies!
    pause
    exit /b 1
)

echo ✓ Backend dependencies cài đặt thành công

REM Cài đặt dependencies Frontend
echo.
echo 📦 Cài đặt Frontend dependencies...
cd /d "%PROJECT_DIR%frontend"
call npm install
if errorlevel 1 (
    echo ❌ Lỗi cài đặt Frontend dependencies!
    pause
    exit /b 1
)

echo ✓ Frontend dependencies cài đặt thành công

REM Chạy database migration
echo.
echo 🗄️ Chạy database migration...
cd /d "%PROJECT_DIR%backend"
call npx prisma migrate deploy >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Cảnh báo: Không thể chạy migration (Database có thể chưa kết nối)
) else (
    echo ✓ Database migration thành công
)

REM Chạy database seed
echo.
echo 🌱 Seed dữ liệu ban đầu...
call npm run seed >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Cảnh báo: Không thể seed dữ liệu (Database có thể chưa kết nối)
) else (
    echo ✓ Seed dữ liệu thành công
)

echo.
echo ============================================
echo ✅ Chuẩn bị xong! Bây giờ bạn có thể chạy:
echo.
echo   start-dev.bat  - Khởi động dev server
echo.
echo ============================================
echo.

pause
