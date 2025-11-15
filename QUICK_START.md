# 🚀 Quick Start Guide - LEARN IS LIFE

## ข้อมูลเข้าสู่ระบบสำหรับทดสอบ

### 🔑 บัญชีทดสอบที่แนะนำ

**บัญชีผู้ใช้ทั่วไป:**
- **Username:** `testuser`
- **Password:** `password123`
- **Email:** testuser@example.com

**บัญชีผู้ดูแลระบบ:**
- **Username:** `admin`
- **Password:** `admin123`
- **Email:** admin@learnislife.com

---

## 📋 ขั้นตอนการเริ่มต้นใช้งาน

### 1. เริ่มต้น Infrastructure

```bash
# รัน PostgreSQL และ Kafka ด้วย Docker
docker-compose up -d
```

### 2. รัน Services (ใน Terminal แยกกัน)

**Terminal 1 - Eureka Server:**
```bash
cd eureka-server
mvn spring-boot:run
```

**Terminal 2 - API Gateway:**
```bash
cd api-gateway
mvn spring-boot:run
```

**Terminal 3 - User Service:**
```bash
cd user-service
mvn spring-boot:run
```

**Terminal 4 - Book Service:**
```bash
cd book-service
mvn spring-boot:run
```

**Terminal 5 - Borrowing Service:**
```bash
cd borrowing-service
mvn spring-boot:run
```

**Terminal 6 - Notification Service:**
```bash
cd notification-service
mvn spring-boot:run
```

### 3. เปิด Frontend

```bash
# วิธีที่ 1: เปิดไฟล์โดยตรง
# เปิด frontend/index.html ด้วย Web Browser

# วิธีที่ 2: ใช้ HTTP Server
cd frontend
python -m http.server 3000
# หรือ
npx http-server -p 3000
```

จากนั้นเปิดเบราว์เซอร์ไปที่: `http://localhost:3000`

### 4. ทดสอบระบบ

1. **สมัครสมาชิกใหม่** หรือ **เข้าสู่ระบบ** ด้วยบัญชีทดสอบ
2. **ค้นหาหนังสือ** ในระบบ
3. **ยืมหนังสือ** ที่ต้องการ
4. **ดูประวัติการยืม** ของคุณ

---

## 🔍 ตรวจสอบสถานะ Services

### Eureka Dashboard
```
http://localhost:8761
```

### API Gateway
```
http://localhost:8080
```

### Health Check
- User Service: `http://localhost:8081/actuator/health`
- Book Service: `http://localhost:8082/actuator/health`
- Borrowing Service: `http://localhost:8083/actuator/health`
- Notification Service: `http://localhost:8084/actuator/health`

---

## ⚠️ ปัญหาที่พบบ่อย

### 1. Port ถูกใช้งานแล้ว
- ตรวจสอบว่า Port 8080, 8081, 8082, 8083, 8084, 8761 ไม่ถูกใช้งาน
- เปลี่ยน Port ใน `application.yml` ถ้าจำเป็น

### 2. Database Connection Error
- ตรวจสอบว่า PostgreSQL รันอยู่
- ตรวจสอบ Connection String ใน `application.yml`

### 3. CORS Error
- ตรวจสอบว่า API Gateway มี CORS configuration
- ตรวจสอบ Frontend API URL

### 4. Service ไม่พบใน Eureka
- รอให้ Eureka Server รันก่อน
- ตรวจสอบว่า Service มี `@EnableEurekaClient`

---

## 📞 ติดต่อ

หากพบปัญหาหรือมีคำถาม กรุณาติดต่อทีมพัฒนา

---

**หมายเหตุ:** ข้อมูลนี้เป็นข้อมูลสำหรับการทดสอบเท่านั้น ควรเปลี่ยนรหัสผ่านและข้อมูลเมื่อใช้งานจริง

