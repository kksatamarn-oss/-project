@echo off
echo ========================================
echo  LEARN IS LIFE - Starting Services
echo ========================================
echo.

echo [1/6] Starting Docker Services (PostgreSQL, Kafka)...
start "Docker Services" cmd /k "docker-compose up"
timeout /t 5 /nobreak >nul

echo [2/6] Starting Eureka Server...
start "Eureka Server" cmd /k "cd eureka-server && mvn spring-boot:run"
echo Waiting for Eureka Server to start...
timeout /t 30 /nobreak >nul

echo [3/6] Starting User Service...
start "User Service" cmd /k "cd user-service && mvn spring-boot:run"
timeout /t 10 /nobreak >nul

echo [4/6] Starting Book Service...
start "Book Service" cmd /k "cd book-service && mvn spring-boot:run"
timeout /t 10 /nobreak >nul

echo [5/6] Starting Borrowing Service...
start "Borrowing Service" cmd /k "cd borrowing-service && mvn spring-boot:run"
timeout /t 10 /nobreak >nul

echo [6/6] Starting API Gateway...
start "API Gateway" cmd /k "cd api-gateway && mvn spring-boot:run"
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo  All Services Started!
echo ========================================
echo.
echo Services URLs:
echo   - Eureka Dashboard: http://localhost:8761
echo   - API Gateway: http://localhost:8080
echo   - User Service: http://localhost:8081
echo   - Book Service: http://localhost:8082
echo   - Borrowing Service: http://localhost:8083
echo.
echo Please wait 1-2 minutes for all services to fully start.
echo Then open frontend/index.html in your browser.
echo.
pause

