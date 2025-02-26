# API สำหรับการตรวจสอบเวชระเบียนทางการแพทย์

API นี้ใช้สำหรับบันทึกข้อมูลในส่วนของแบบประเมินคุณภาพการบันทึกเวชระเบียนผู้ป่วย

## การติดตั้ง (Installation)

1. โคลนรีโพซิทอรี:
   ```bash
   git clone https://github.com/thelosechanathip/api_medical_record_audit.git
   ```

2. เข้าไปยังไดเรกทอรีของโปรเจกต์:
   ```bash
   cd api_medical_record_audit
   ```

3. ติดตั้งแพ็กเกจที่จำเป็น:
   ```bash
   npm install
   ```

## โครงสร้างไฟล์ (File Structure)

```
/medical_record_audit
|-- src/
|   |-- config/          # ไฟล์กำหนดค่าต่างๆ เช่น การเชื่อมต่อฐานข้อมูล
|   |-- controllers/     # โค้ดสำหรับจัดการลอจิกของแอปพลิเคชัน
|   |-- middleware/      # มิดเดิลแวร์สำหรับการตรวจสอบและจัดการคำขอ
|   |-- models/          # โมเดลข้อมูลและการเชื่อมต่อกับฐานข้อมูล
|   |-- routes/          # เส้นทาง API
|   |-- utils/           # ยูทิลิตี้ฟังก์ชันต่างๆ
|-- ecosystem.config.js  # ไฟล์กำหนดค่าสำหรับ PM2
|-- package-lock.json
|-- package.json
|-- README.md
|-- server.js           # จุดเริ่มต้นแอปพลิเคชัน
```

## การใช้งาน (Usage)

1. เริ่มการทำงานของเซิร์ฟเวอร์:
   ```bash
   npm start
   ```

2. สำหรับการพัฒนา (Development mode):
   ```bash
   npm run dev
   ```

3. สำหรับการใช้งานบน Production ด้วย PM2:
   ```bash
   pm2 start ecosystem.config.js
   ```

## API Endpoints

### การตรวจสอบเวชระเบียน

- **GET /api/audits** - ดึงข้อมูลการตรวจสอบทั้งหมด
- **GET /api/audits/:id** - ดึงข้อมูลการตรวจสอบตาม ID
- **POST /api/audits** - สร้างการตรวจสอบใหม่
- **PUT /api/audits/:id** - อัปเดตข้อมูลการตรวจสอบที่มีอยู่
- **DELETE /api/audits/:id** - ลบข้อมูลการตรวจสอบ

### ผู้ใช้งาน

- **GET /api/users** - ดึงข้อมูลผู้ใช้งานทั้งหมด
- **POST /api/auth/login** - เข้าสู่ระบบ
- **POST /api/auth/register** - ลงทะเบียนผู้ใช้งานใหม่

## การกำหนดค่า (Configuration)

สร้างไฟล์ `.env` ในไดเรกทอรีหลักและกำหนดค่าต่อไปนี้:

```
DB_HOST=localhost
DB_USER=username
DB_PASSWORD=password
DB_NAME=medical_record_audit
PORT=3000
JWT_SECRET=your_jwt_secret_key
```

## ความต้องการของระบบ (Requirements)

- Node.js (v14.x หรือใหม่กว่า)
- MySQL (v5.7 หรือใหม่กว่า)
- PM2 (สำหรับ production)

## การสนับสนุน (Support)

หากพบปัญหาหรือต้องการความช่วยเหลือ กรุณาเปิด Issue ใน GitHub repository

## ใบอนุญาต (License)

ลิขสิทธิ์ © 2025 - API Medical Record Audit