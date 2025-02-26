// การนำเข้าโมดูลที่จำเป็นสำหรับการทำงานของแอปพลิเคชัน
const express = require("express"); // นำเข้า Express.js เพื่อสร้างเซิร์ฟเวอร์และจัดการ HTTP requests
const swaggerUi = require('swagger-ui-express'); // นำเข้า Swagger UI เพื่อแสดงเอกสาร API แบบโต้ตอบได้
const swaggerDocument = require('./swagger.json'); // นำเข้าไฟล์ JSON ที่กำหนดโครงสร้างของ Swagger API
const morgan = require("morgan"); // นำเข้า Morgan เพื่อบันทึก log ของ HTTP requests
const cors = require("cors"); // นำเข้า CORS เพื่ออนุญาตให้มีการร้องขอข้ามโดเมน (cross-origin requests)
const { readdirSync } = require("fs"); // นำเข้า readdirSync จากโมดูล fs เพื่ออ่านไฟล์ในโฟลเดอร์แบบ synchronously
const fs = require("fs"); // นำเข้าโมดูล fs (File System) เพื่อจัดการไฟล์และโฟลเดอร์
const path = require("path"); // นำเข้าโมดูล path เพื่อจัดการเส้นทางไฟล์และโฟลเดอร์
const { apiReference } = require("@scalar/express-api-reference");
require('dotenv').config(); // นำเข้าและตั้งค่า dotenv เพื่อโหลดตัวแปร環境จากไฟล์ .env

// สร้าง instance ของ Express application
const app = express();

// Middleware: ฟังก์ชันที่ทำงานก่อนที่ request จะถึง route handler
app.use(morgan("dev")); 
// ใช้ Morgan ในโหมด "dev" เพื่อบันทึก log ของ request ในรูปแบบที่อ่านง่าย 
// เช่น "GET /api/auth 200 5.123 ms - 50" แสดงเมธอด, เส้นทาง, สถานะ, เวลา, และขนาด response

app.use(express.json()); 
// Middleware เพื่อแปลงข้อมูล request body ที่เป็น JSON ให้อยู่ในรูปแบบ JavaScript object 
// ทำให้สามารถเข้าถึงข้อมูลจาก req.body ได้
app.use(cors());

app.get(
  '/',
  apiReference({
    theme: 'deepSpace',
    spec: {
      url: '/api/docs/swagger',
    },
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  })
);
  
app.get('/api/docs/swagger', (req, res) => {
res.sendFile(__dirname + '/swagger.json');
});
// ตั้งค่า Swagger UI ให้ทำงานที่เส้นทาง /api-docs 
// swaggerUi.serve เริ่มต้น UI และ swaggerUi.setup(swaggerDocument) โหลดข้อมูล API จาก swagger.json

// กำหนดตัวแปรสำหรับจัดการเส้นทางของ routes
const routesRootPath = path.join(__dirname, "routes"); 
// สร้างเส้นทางไปยังโฟลเดอร์ "routes" โดยใช้ __dirname (ตำแหน่งของไฟล์นี้) 
// เช่น ถ้าไฟล์นี้อยู่ที่ D:\project\src\app.js ตัวแปรนี้จะเป็น D:\project\src\routes

const BASE_PATH = process.env.BASE_PATH || "api"; 
// กำหนด BASE_PATH จากตัวแปร環境ใน .env ถ้าไม่มีจะใช้ค่าเริ่มต้นเป็น "api" 
// เช่น ถ้า BASE_PATH=api เส้นทางทั้งหมดจะเริ่มด้วย /api

// ตรวจสอบและโหลด routes จากโฟลเดอร์ routes
if (fs.existsSync(routesRootPath)) { 
    // ตรวจสอบว่าโฟลเดอร์ routesRootPath มีอยู่จริงหรือไม่
    readdirSync(routesRootPath, { withFileTypes: true }) 
        // อ่านรายการไฟล์และโฟลเดอร์ใน routesRootPath แบบ synchronously 
        // { withFileTypes: true } ทำให้ได้ข้อมูลประเภท (file หรือ directory)
        .filter((dirent) => dirent.isDirectory()) 
        // กรองเฉพาะรายการที่เป็นโฟลเดอร์ (เช่น auth, todolist)
        .forEach((dirent) => { 
            // วนลูปผ่านโฟลเดอร์ที่พบ (เช่น dirent.name = "auth")
            const folderPath = path.join(routesRootPath, dirent.name); 
            // สร้างเส้นทางเต็มไปยังโฟลเดอร์ย่อย 
            // เช่น D:\project\src\routes\auth
            readdirSync(folderPath) 
                // อ่านไฟล์ทั้งหมดในโฟลเดอร์ย่อย (เช่น authRoutes.js)
                .filter((file) => file.endsWith('.js')) 
                // กรองเฉพาะไฟล์ที่ลงท้ายด้วย .js 
                .forEach((routeFile) => { 
                    // วนลูปผ่านไฟล์ .js ที่พบ (เช่น routeFile = "authRoutes.js")
                    console.log(`Loading route: ${folderPath}/${routeFile}`); 
                    // แสดง log เพื่อยืนยันว่าไฟล์ถูกโหลด 
                    // เช่น "Loading route: D:\project\src\routes\auth/authRoutes.js"
                    app.use(`/${BASE_PATH}/${dirent.name}`, require(`${folderPath}/${routeFile}`)); 
                    // กำหนดให้ Express ใช้ไฟล์ route นี้ 
                    // เช่น app.use("/api/auth", require("D:\project\src\routes\auth/authRoutes.js"))
                    // เส้นทางในไฟล์ route จะถูก prepend ด้วย /api/auth
                });
        });
} else {
    console.error(`Routes folder not found at path: ${routesRootPath}`); 
    // ถ้าโฟลเดอร์ routes ไม่มีอยู่ แสดงข้อผิดพลาดใน console
}

// ส่งออก app เพื่อให้สามารถนำไปใช้ในไฟล์อื่น (เช่น server.js)
module.exports = app;