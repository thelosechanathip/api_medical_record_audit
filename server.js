const app = require("./src/app");
const db_b = require("./src/config/db_b"); // นำเข้าไฟล์เชื่อมต่อฐานข้อมูล
const db_m = require("./src/config/db_m"); // นำเข้าไฟล์เชื่อมต่อฐานข้อมูล
const PORT = process.env.PORT || 3715;

// ฟังก์ชันทดสอบการเชื่อมต่อฐานข้อมูล
async function testDatabaseBackofficeConnection() {
  try {
    await db_b.query("SELECT 1"); // ทดสอบ query ง่ายๆ
    // console.log("Database backoffice connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1); // หยุดการทำงานของเซิร์ฟเวอร์หากไม่สามารถเชื่อมต่อฐานข้อมูลได้
  }
}

// ฟังก์ชันทดสอบการเชื่อมต่อฐานข้อมูล
async function testDatabaseMedicalRecordAuditConnection(retries = 3, delay = 1000) {
  let connection;
  for (let i = 0; i < retries; i++) {
    try {
      connection = await db_m.getConnection();
      await connection.query("SELECT 1");
      console.log("Database medical record audit connected successfully");
      return; // สำเร็จแล้ว ออกจากฟังก์ชัน
    } catch (error) {
      if (error.message.includes("Too many connections") && i < retries - 1) {
        console.warn(`Attempt ${i + 1} failed. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      console.error("Error connecting to the database:", error.message);
      process.exit(1);
    } finally {
      if (connection) connection.release();
    }
  }
}

// ทดสอบการเชื่อมต่อฐานข้อมูลก่อนเริ่มเซิร์ฟเวอร์
testDatabaseBackofficeConnection().then(() => {
  testDatabaseMedicalRecordAuditConnection().then(() => {
      app.listen(PORT, async () => {
          // await db_m.query(
          //   `
          //     UPDATE auth_tokens
          //     SET 
          //       is_active = ?
          //   `,[false]
          // );
          console.log(`Server is running on port ${PORT}`);
      });
  });
});