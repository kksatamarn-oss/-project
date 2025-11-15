# Frontend - LEARN IS LIFE

หน้าเว็บสำหรับระบบห้องสมุดออนไลน์ LEARN IS LIFE

## 🚀 วิธีรัน

### วิธีที่ 1: เปิดไฟล์โดยตรง
เปิดไฟล์ `index.html` ด้วย Web Browser โดยตรง

### วิธีที่ 2: ใช้ HTTP Server

**Python:**
```bash
python -m http.server 3000
```

**Node.js:**
```bash
npx http-server -p 3000
```

**PHP:**
```bash
php -S localhost:3000
```

จากนั้นเปิดเบราว์เซอร์ไปที่: `http://localhost:3000`

## ⚙️ Configuration

Frontend จะเชื่อมต่อกับ API Gateway ที่ `http://localhost:8080`

หากต้องการเปลี่ยน API URL แก้ไขในไฟล์ `app.js`:
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

## 📋 ฟีเจอร์

- ✅ สมัครสมาชิก
- ✅ เข้าสู่ระบบ
- ✅ ค้นหาหนังสือ
- ✅ ยืมหนังสือ
- ✅ ดูประวัติการยืม
- ✅ ส่งคืนหนังสือ

## 🎨 UI/UX

- Responsive Design (รองรับ Mobile และ Desktop)
- Modern UI with Gradient Background
- User-friendly Interface
- Real-time Status Updates

## 📝 หมายเหตุ

- ต้องรัน Backend Services ทั้งหมดก่อนใช้งาน Frontend
- Frontend ใช้ LocalStorage เก็บ JWT Token
- ต้องมี CORS enabled ใน API Gateway

