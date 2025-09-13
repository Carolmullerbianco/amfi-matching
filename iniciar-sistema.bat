@echo off
echo 🚀 Iniciando AmFi Matching System...
echo.

echo 📦 Instalando dependencias do backend...
cd backend
call npm install express cors
if errorlevel 1 (
    echo ❌ Erro ao instalar dependencias do backend
    pause
    exit /b 1
)

echo ✅ Dependencias instaladas!
echo.

echo 🖥️ Iniciando servidor backend...
start "AmFi Backend" cmd /k "node start-server.js"

timeout /t 3

echo 📦 Instalando dependencias do frontend...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo ❌ Erro ao instalar dependencias do frontend
    pause
    exit /b 1
)

echo ✅ Dependencias do frontend instaladas!
echo.

echo 🌐 Iniciando servidor frontend...
start "AmFi Frontend" cmd /k "npm run dev"

echo.
echo 🎉 Sistema iniciado!
echo 📱 Frontend: http://localhost:3000
echo 🔗 Backend: http://localhost:3001
echo.
echo 🔐 Credenciais:
echo Email: carolmullerbianco@gmail.com
echo Senha: 123456
echo.
pause