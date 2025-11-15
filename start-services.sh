#!/bin/bash

echo "========================================"
echo " LEARN IS LIFE - Starting Services"
echo "========================================"
echo ""

echo "[1/6] Starting Docker Services (PostgreSQL, Kafka)..."
docker-compose up -d
sleep 5

echo "[2/6] Starting Eureka Server..."
cd eureka-server
mvn spring-boot:run &
EUREKA_PID=$!
cd ..
echo "Waiting for Eureka Server to start..."
sleep 30

echo "[3/6] Starting User Service..."
cd user-service
mvn spring-boot:run &
USER_PID=$!
cd ..
sleep 10

echo "[4/6] Starting Book Service..."
cd book-service
mvn spring-boot:run &
BOOK_PID=$!
cd ..
sleep 10

echo "[5/6] Starting Borrowing Service..."
cd borrowing-service
mvn spring-boot:run &
BORROWING_PID=$!
cd ..
sleep 10

echo "[6/6] Starting API Gateway..."
cd api-gateway
mvn spring-boot:run &
GATEWAY_PID=$!
cd ..
sleep 10

echo ""
echo "========================================"
echo " All Services Started!"
echo "========================================"
echo ""
echo "Services URLs:"
echo "  - Eureka Dashboard: http://localhost:8761"
echo "  - API Gateway: http://localhost:8080"
echo "  - User Service: http://localhost:8081"
echo "  - Book Service: http://localhost:8082"
echo "  - Borrowing Service: http://localhost:8083"
echo ""
echo "Please wait 1-2 minutes for all services to fully start."
echo "Then open frontend/index.html in your browser."
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap "kill $EUREKA_PID $USER_PID $BOOK_PID $BORROWING_PID $GATEWAY_PID; docker-compose down; exit" INT
wait

