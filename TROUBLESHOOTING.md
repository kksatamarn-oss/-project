# 🔧 แก้ไขปัญหา "Failed to fetch"

## ปัญหา: เกิดข้อผิดพลาด "Failed to fetch" เมื่อเข้าสู่ระบบ

### สาเหตุ
1. **Backend Services ยังไม่ได้รัน** - ยังไม่มี API endpoints ให้เรียก
2. **CORS Error** - Frontend ไม่สามารถเรียก Backend ได้
3. **Port ไม่ถูกต้อง** - Services รันที่ Port ผิด
4. **Database ไม่ได้รัน** - PostgreSQL ไม่ได้รัน

---

## ✅ วิธีแก้ไข

### 1. ตรวจสอบว่า Backend Services รันอยู่หรือไม่

**ตรวจสอบ Services:**
```bash
# ตรวจสอบว่า Services รันอยู่
# Eureka Server: http://localhost:8761
# API Gateway: http://localhost:8080
# User Service: http://localhost:8081
# Book Service: http://localhost:8082
# Borrowing Service: http://localhost:8083
```

### 2. รัน Services ตามลำดับ

**ขั้นตอนที่ 1: รัน PostgreSQL และ Kafka**
```bash
docker-compose up -d
```

**ขั้นตอนที่ 2: รัน Eureka Server**
```bash
cd eureka-server
mvn spring-boot:run
```
รอให้ Eureka Server รันเสร็จก่อน (ประมาณ 30 วินาที)

**ขั้นตอนที่ 3: รัน Services อื่นๆ (ใน Terminal แยกกัน)**

**Terminal 1 - User Service:**
```bash
cd user-service
mvn spring-boot:run
```

**Terminal 2 - Book Service:**
```bash
cd book-service
mvn spring-boot:run
```

**Terminal 3 - Borrowing Service:**
```bash
cd borrowing-service
mvn spring-boot:run
```

**Terminal 4 - API Gateway:**
```bash
cd api-gateway
mvn spring-boot:run
```

### 3. ตรวจสอบ CORS Configuration

ตรวจสอบว่า `api-gateway/src/main/resources/application.yml` มี CORS configuration:
```yaml
spring:
  cloud:
    gateway:
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOrigins: "*"
            allowedMethods:
              - GET
              - POST
              - PUT
              - DELETE
              - OPTIONS
            allowedHeaders: "*"
```

### 4. ทดสอบ API โดยตรง

**ทดสอบ Register:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

**ทดสอบ Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### 5. ตรวจสอบ Browser Console

เปิด Browser Developer Tools (F12) และดู Console:
- ดู Error Messages
- ตรวจสอบ Network Tab ว่า Request ไปที่ URL ไหน
- ดู Response Status Code

---

## 🐛 ปัญหาที่พบบ่อย

### 1. "Connection refused"
**สาเหตุ:** Services ยังไม่ได้รัน  
**แก้ไข:** รัน Services ทั้งหมดก่อน

### 2. "CORS policy: No 'Access-Control-Allow-Origin'"
**สาเหตุ:** CORS ไม่ได้ configure  
**แก้ไข:** ตรวจสอบ CORS configuration ใน API Gateway

### 3. "404 Not Found"
**สาเหตุ:** API endpoint ไม่ถูกต้อง  
**แก้ไข:** ตรวจสอบว่า Controller มี `@RequestMapping` ถูกต้อง

### 4. "500 Internal Server Error"
**สาเหตุ:** Database connection error หรือ Code error  
**แก้ไข:** ตรวจสอบ Logs ของ Service ที่เกิด error

### 5. "Database connection error"
**สาเหตุ:** PostgreSQL ไม่ได้รัน  
**แก้ไข:** รัน `docker-compose up -d` หรือรัน PostgreSQL แบบปกติ

---

## 📝 Checklist

ก่อนทดสอบ Frontend ตรวจสอบว่า:

- [ ] PostgreSQL รันอยู่ (docker-compose up -d)
- [ ] Kafka รันอยู่ (docker-compose up -d)
- [ ] Eureka Server รันอยู่ (http://localhost:8761)
- [ ] User Service รันอยู่ (http://localhost:8081)
- [ ] Book Service รันอยู่ (http://localhost:8082)
- [ ] Borrowing Service รันอยู่ (http://localhost:8083)
- [ ] API Gateway รันอยู่ (http://localhost:8080)
- [ ] Services ลงทะเบียนใน Eureka แล้ว
- [ ] Database tables ถูกสร้างแล้ว (ตรวจสอบ Logs)

---

## 🔍 Debug Tips

1. **ดู Logs ของแต่ละ Service** - ดู error messages
2. **ทดสอบ API ด้วย Postman หรือ curl** - แยกปัญหา Frontend/Backend
3. **ตรวจสอบ Eureka Dashboard** - ดูว่า Services ลงทะเบียนแล้วหรือยัง
4. **ตรวจสอบ Database** - เชื่อมต่อ PostgreSQL และดู tables

---

## 📞 ต้องการความช่วยเหลือเพิ่มเติม?

หากยังแก้ไขไม่ได้:
1. ตรวจสอบ Logs ของ Services
2. ดู Browser Console Error
3. ทดสอบ API ด้วย Postman/curl
4. ตรวจสอบ Network Tab ใน Browser

