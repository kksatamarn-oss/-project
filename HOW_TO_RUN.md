# 🚀 วิธีรันระบบ LEARN IS LIFE

## ⚡ วิธีรันแบบเร็ว (แนะนำ)

### Windows:
```bash
# ดับเบิลคลิกไฟล์ start-services.bat
# หรือรันใน Command Prompt:
start-services.bat
```

### Linux/Mac:
```bash
chmod +x start-services.sh
./start-services.sh
```

---

## 📋 วิธีรันแบบทีละขั้นตอน

### 1. เริ่มต้น Infrastructure

**รัน PostgreSQL และ Kafka:**
```bash
docker-compose up -d
```

ตรวจสอบว่า Docker containers รันอยู่:
```bash
docker ps
```

### 2. รัน Eureka Server (Service Discovery)

เปิด Terminal/PowerShell ใหม่:
```bash
cd eureka-server
mvn spring-boot:run
```

**รอประมาณ 30 วินาที** ให้ Eureka Server พร้อม (จะเห็น "Started EurekaServerApplication")

ตรวจสอบ: เปิดเบราว์เซอร์ไปที่ `http://localhost:8761`

### 3. รัน Services (ใน Terminal แยกกัน)

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

### 4. ตรวจสอบสถานะ Services

เปิดไฟล์ `check-services.html` ในเบราว์เซอร์เพื่อตรวจสอบว่า Services ทั้งหมดรันอยู่

หรือตรวจสอบด้วยตนเอง:
- Eureka Dashboard: `http://localhost:8761` - ควรเห็น Services ทั้งหมด
- API Gateway: `http://localhost:8080`

### 5. เปิด Frontend

**วิธีที่ 1: เปิดไฟล์โดยตรง**
- เปิดไฟล์ `frontend/index.html` ด้วย Web Browser

**วิธีที่ 2: ใช้ HTTP Server**
```bash
cd frontend
python -m http.server 3000
# หรือ
npx http-server -p 3000
```

จากนั้นเปิดเบราว์เซอร์ไปที่: `http://localhost:3000`

---

## 🔍 ตรวจสอบปัญหา

### ตรวจสอบว่า Services รันอยู่:

1. **Eureka Dashboard** (`http://localhost:8761`)
   - ควรเห็น Services: `user-service`, `book-service`, `borrowing-service`, `api-gateway`

2. **ทดสอบ API Gateway:**
```bash
curl http://localhost:8080/api/auth/register
```

3. **ตรวจสอบ Logs:**
   - ดู Terminal ของแต่ละ Service
   - ตรวจสอบ Error Messages

### ปัญหาที่พบบ่อย:

#### 1. "Connection refused" หรือ "Failed to fetch"
**สาเหตุ:** Services ยังไม่ได้รัน  
**แก้ไข:** 
- ใช้ `start-services.bat` (Windows) หรือ `start-services.sh` (Linux/Mac)
- หรือรัน Services ทีละตัวตามขั้นตอนด้านบน

#### 2. "Service not found in Eureka"
**สาเหตุ:** Eureka Server ยังไม่พร้อม หรือ Service ไม่ได้ลงทะเบียน  
**แก้ไข:**
- รอให้ Eureka Server รันเสร็จก่อน (30 วินาที)
- ตรวจสอบว่า Service มี `@EnableEurekaClient`

#### 3. "Database connection error"
**สาเหตุ:** PostgreSQL ไม่ได้รัน  
**แก้ไข:**
```bash
docker-compose up -d
# หรือ
docker ps  # ตรวจสอบว่า postgres containers รันอยู่
```

#### 4. "Port already in use"
**สาเหตุ:** Port ถูกใช้งานแล้ว  
**แก้ไข:**
- ตรวจสอบว่า Port 8080, 8081, 8082, 8083, 8761 ไม่ถูกใช้งาน
- เปลี่ยน Port ใน `application.yml` ถ้าจำเป็น

---

## 📝 Checklist ก่อนใช้งาน

- [ ] Docker รันอยู่ (`docker ps`)
- [ ] PostgreSQL และ Kafka containers รันอยู่
- [ ] Eureka Server รันอยู่ (`http://localhost:8761`)
- [ ] User Service รันอยู่
- [ ] Book Service รันอยู่
- [ ] Borrowing Service รันอยู่
- [ ] API Gateway รันอยู่ (`http://localhost:8080`)
- [ ] Services ลงทะเบียนใน Eureka แล้ว
- [ ] Frontend เปิดอยู่

---

## 🛑 หยุด Services

### Windows:
- ปิด Terminal windows ทั้งหมด
- หรือกด `Ctrl+C` ในแต่ละ Terminal

### Linux/Mac:
```bash
# หยุด Docker
docker-compose down

# หยุด Services (ถ้ารันด้วย script)
# กด Ctrl+C
```

---

## 💡 Tips

1. **รัน Services ตามลำดับ:** Eureka → Services → Gateway
2. **รอให้ Services พร้อม:** ใช้ `check-services.html` เพื่อตรวจสอบ
3. **ตรวจสอบ Logs:** ดู Error Messages ใน Terminal
4. **ใช้ Eureka Dashboard:** ตรวจสอบว่า Services ลงทะเบียนแล้ว

---

## 📞 ต้องการความช่วยเหลือ?

1. เปิด `check-services.html` เพื่อตรวจสอบสถานะ
2. ดู Logs ใน Terminal ของแต่ละ Service
3. ตรวจสอบ Eureka Dashboard (`http://localhost:8761`)
4. อ่าน `TROUBLESHOOTING.md` สำหรับรายละเอียดเพิ่มเติม

