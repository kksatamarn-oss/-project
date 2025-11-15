# ข้อมูลทดสอบระบบ LEARN IS LIFE

## 🔐 บัญชีผู้ใช้ทดสอบ (Test Accounts)

### บัญชีผู้ใช้ทั่วไป (User Accounts)

| ชื่อผู้ใช้ (Username) | รหัสผ่าน (Password) | อีเมล (Email) | บทบาท (Role) |
|---------------------|-------------------|--------------|--------------|
| `testuser` | `password123` | testuser@example.com | USER |
| `student1` | `student123` | student1@example.com | USER |
| `student2` | `student123` | student2@example.com | USER |
| `reader` | `reader123` | reader@example.com | USER |

### บัญชีผู้ดูแลระบบ (Admin Accounts)

| ชื่อผู้ใช้ (Username) | รหัสผ่าน (Password) | อีเมล (Email) | บทบาท (Role) |
|---------------------|-------------------|--------------|--------------|
| `admin` | `admin123` | admin@learnislife.com | ADMIN |
| `librarian` | `librarian123` | librarian@learnislife.com | ADMIN |

---

## 📚 ข้อมูลหนังสือทดสอบ (Test Books)

| Book ID | ชื่อหนังสือ | ผู้แต่ง | หมวดหมู่ | ISBN | สถานะ |
|---------|------------|--------|---------|------|-------|
| 1 | Java Programming | John Doe | Programming | 978-1234567890 | AVAILABLE |
| 2 | Spring Boot Guide | Jane Smith | Programming | 978-1234567891 | AVAILABLE |
| 3 | Database Design | Bob Johnson | Computer Science | 978-1234567892 | AVAILABLE |
| 4 | Microservices Architecture | Alice Brown | Software Engineering | 978-1234567893 | BORROWED |
| 5 | Clean Code | Robert Martin | Programming | 978-1234567894 | AVAILABLE |

---

## 🗄️ ข้อมูลฐานข้อมูล (Database Information)

### PostgreSQL Connection

**User Service Database:**
- Database: `learnislife_user`
- Username: `postgres`
- Password: `password`
- Port: `5432`

**Book Service Database:**
- Database: `learnislife_book`
- Username: `postgres`
- Password: `password`
- Port: `5432`

**Borrowing Service Database:**
- Database: `learnislife_borrowing`
- Username: `postgres`
- Password: `password`
- Port: `5432`

---

## 🌐 API Endpoints สำหรับทดสอบ

### Base URL
```
http://localhost:8080/api
```

### ตัวอย่างการใช้งาน

#### 1. สมัครสมาชิก
```bash
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "testuser@example.com",
  "password": "password123"
}
```

#### 2. เข้าสู่ระบบ
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

#### 3. ค้นหาหนังสือ
```bash
GET http://localhost:8080/api/books?title=Java
Authorization: Bearer <JWT_TOKEN>
```

#### 4. ยืมหนังสือ
```bash
POST http://localhost:8080/api/borrowings
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "bookId": 1
}
```

---

## ⚠️ หมายเหตุสำคัญ

1. **ข้อมูลเหล่านี้เป็นข้อมูลทดสอบเท่านั้น** - ควรเปลี่ยนรหัสผ่านเมื่อใช้งานจริง
2. **ต้องสร้าง Backend Services ก่อน** - ข้อมูลเหล่านี้จะใช้งานได้เมื่อระบบ Backend พร้อมแล้ว
3. **ฐานข้อมูลจะถูกสร้างอัตโนมัติ** - เมื่อรัน Services ด้วย `ddl-auto: update`
4. **ข้อมูลทดสอบจะถูกสร้างอัตโนมัติ** - เมื่อมี Data Initializer หรือ Seed Data

---

## 🚀 ขั้นตอนการใช้งาน

1. **รัน Docker Compose** (สำหรับ PostgreSQL และ Kafka)
   ```bash
   docker-compose up -d
   ```

2. **รัน Eureka Server**
   ```bash
   cd eureka-server
   mvn spring-boot:run
   ```

3. **รัน Services ทั้งหมด** (User, Book, Borrowing, Notification, Gateway)

4. **เปิด Frontend**
   - เปิดไฟล์ `frontend/index.html`
   - หรือใช้ HTTP Server

5. **ทดสอบด้วยบัญชีทดสอบ**
   - ใช้ชื่อผู้ใช้และรหัสผ่านจากตารางด้านบน

---

## 📝 การสร้างข้อมูลทดสอบอัตโนมัติ

เมื่อ Backend Services พร้อมแล้ว สามารถสร้างข้อมูลทดสอบได้โดย:

1. **ใช้ Data Initializer** - สร้างไฟล์ `DataInitializer.java` ในแต่ละ Service
2. **ใช้ SQL Scripts** - สร้างไฟล์ `data.sql` ใน `src/main/resources`
3. **ใช้ API** - สมัครสมาชิกและเพิ่มข้อมูลผ่าน API

---

**อัปเดตล่าสุด:** 2024

