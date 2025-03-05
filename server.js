const app = require("./src/app");
const db_b = require("./src/config/db_b"); // นำเข้าไฟล์เชื่อมต่อฐานข้อมูล
const db_m = require("./src/config/db_m"); // นำเข้าไฟล์เชื่อมต่อฐานข้อมูล
const PORT = process.env.PORT || 3715;

// ฟังก์ชันทดสอบการเชื่อมต่อฐานข้อมูล
async function testDatabaseBackofficeConnection() {
  try {
    await db_b.query("SELECT 1"); // ทดสอบ query ง่ายๆ
    console.log("Database backoffice connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1); // หยุดการทำงานของเซิร์ฟเวอร์หากไม่สามารถเชื่อมต่อฐานข้อมูลได้
  }
}

// ฟังก์ชันทดสอบการเชื่อมต่อฐานข้อมูล
async function testDatabaseMedicalRecordAuditConnection() {
  try {
    await db_m.query("SELECT 1"); // ทดสอบ query ง่ายๆ
    console.log("Database medical record audit connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1); // หยุดการทำงานของเซิร์ฟเวอร์หากไม่สามารถเชื่อมต่อฐานข้อมูลได้
  }
}

// ทดสอบการเชื่อมต่อฐานข้อมูลก่อนเริ่มเซิร์ฟเวอร์
testDatabaseBackofficeConnection().then(() => {
  testDatabaseMedicalRecordAuditConnection().then(() => {
      app.listen(PORT, async () => {
          await db_m.query(
            `
              UPDATE auth_tokens
              SET 
                otp_verified = ?,
                is_active = ?
            `,[false, false]
          );
          console.log(`Server is running on port ${PORT}`);
      });
  });
});