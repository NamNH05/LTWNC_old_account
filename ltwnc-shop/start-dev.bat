@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

REM Lấy đường dẫn thư mục hiện tại
set "PROJECT_DIR=%~dp0"

echo.
echo ============================================
echo   Khởi động dự án LTWNC Shop
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

echo.
echo 🚀 Khởi động Backend...
echo.

REM Mở cửa sổ mới cho Backend
start "LTWNC Backend" cmd /k "cd /d "%PROJECT_DIR%backend" && npm run dev"

timeout /t 3 /nobreak

echo.
echo 🚀 Khởi động Frontend...
echo.

REM Mở cửa sổ mới cho Frontend
start "LTWNC Frontend" cmd /k "cd /d "%PROJECT_DIR%frontend" && npm run dev"

echo.
echo ============================================
echo ✅ Khởi động thành công!
echo.
echo 📍 Backend:  http://localhost:8080
echo 📍 Frontend: http://localhost:5173 (hoặc 5174 nếu 5173 đang sử dụng)
echo.
echo ✋ Đóng cửa sổ này để dừng quá trình khởi động
echo ============================================
echo.

pause
