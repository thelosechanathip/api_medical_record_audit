// การนำเข้าโมดูลที่จำเป็นสำหรับการทำงานของแอปพลิเคชัน
const express = require("express");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const morgan = require("morgan");
const cors = require("cors");
const schedule = require('node-schedule');
const { readdirSync } = require("fs");
const moment = require('moment');
const fs = require("fs");
const path = require("path");
const { authAdminDoc } = require('./middleware/auth/authAdmin');
const { msg } = require('../src/utils/message');
const db_m = require('./config/db_m');
require('dotenv').config();

// สร้าง instance ของ Express application
const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

// โหลด apiReference แบบ dynamic import
app.get('/avenger/spiderman/ironmane/hulk/thor/cap/:text', authAdminDoc, async (req, res, next) => {
  const { apiReference } = await import('@scalar/express-api-reference');
  apiReference({
    theme: 'deepSpace',
    spec: {
      url: '/api/docs/swagger/' + process.env.PARAMS_DOC,
    },
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  })(req, res, next);
});

app.get('/api/docs/swagger/:text', authAdminDoc, async(req, res) => {
  res.sendFile(__dirname + '/swagger.json');
});

// กำหนดตัวแปรสำหรับจัดการเส้นทางของ routes
const routesRootPath = path.join(__dirname, "routes");
const BASE_PATH = process.env.BASE_PATH || "api";

if (fs.existsSync(routesRootPath)) {
  readdirSync(routesRootPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .forEach((dirent) => {
      const folderPath = path.join(routesRootPath, dirent.name);
      readdirSync(folderPath)
        .filter((file) => file.endsWith('.js'))
        .forEach((routeFile) => {
          console.log(`Loading route: ${folderPath}/${routeFile}`);
          app.use(`/${BASE_PATH}/${dirent.name}`, require(`${folderPath}/${routeFile}`));
        });
    });
} else {
  console.error(`Routes folder not found at path: ${routesRootPath}`);
}

// Function ในการตรวจสอบ expires_at บน Table token_blacklist
async function checkBlackListTokensExpired() {
  try {
    const [fetchAllBlackListTokensResult] = await db_m.query('SELECT token, expires_at FROM token_blacklist');
    if (fetchAllBlackListTokensResult.length === 0) {
      console.log('BlackListTokenErrors : No tokens found in database');
    }

    for(const blackListTokens of fetchAllBlackListTokensResult) {
      const expiresAtIso = blackListTokens.expires_at;
      const expiresAt = moment(expiresAtIso).format('YYYY-MM-DD HH:mm:ss');

      const date = new Date();
      const dateNow = moment(date).format('YYYY-MM-DD HH:mm:ss');
      if(dateNow === expiresAt || dateNow > expiresAt) {
        const sql_1 = `DELETE FROM token_blacklist WHERE token = ?`;
        const [deleteResult_1] = await db_m.query(sql_1, [blackListTokens.token]);

        if (deleteResult_1.affectedRows > 0) {
          // หาค่า MAX(id) จากตาราง token_blacklist เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
          const [maxIdResult] = await db_m.query('SELECT MAX(id) AS maxId FROM token_blacklist');
          const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

          // รีเซ็ตค่า AUTO_INCREMENT
          await db_m.query('ALTER TABLE token_blacklist AUTO_INCREMENT = ?', [nextAutoIncrement]);
          console.log('Remove Token BlackListTokens ที่หมดเวลาเสร็จสิ้น!!');
        }
      }
    }
  } catch (error) {
    console.error("Error checkBlackListTokensExpired: ", error.message);
    process.exit(1);
  }
}

// Function ในการตรวจสอบ is_active, expires_at บน Table auth_tokens
async function checkAuthTokensExpired() {
  try {
      const [fetchAllAuthTokensResult] = await db_m.query('SELECT token, expires_at, is_active FROM auth_tokens');
      if (fetchAllAuthTokensResult.length === 0) {
          console.log('AuthTokenErrors : No tokens found in database');
      }

      for(const authTokens of fetchAllAuthTokensResult) {
        // if(authTokens.is_active === 0) {
          
        // }
        const expiresAtIso = authTokens.expires_at;
        const expiresAt = moment(expiresAtIso).format('YYYY-MM-DD HH:mm:ss');

        const date = new Date();
        const dateNow = moment(date).format('YYYY-MM-DD HH:mm:ss');
        
        if(dateNow === expiresAt || dateNow > expiresAt) {
          const sql_1 = `DELETE FROM auth_tokens WHERE token = ?`;
          const [deleteResult_1] = await db_m.query(sql_1, [authTokens.token]);

          if (deleteResult_1.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง auth_tokens เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db_m.query('SELECT MAX(id) AS maxId FROM auth_tokens');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db_m.query('ALTER TABLE auth_tokens AUTO_INCREMENT = ?', [nextAutoIncrement]);
            console.log('Remove Token AuthTokens ที่หมดเวลาเสร็จสิ้น!!');
          }
        }
      }     
  } catch (error) {
      console.error("Error checkAuthTokensExpired: ", error.message);
      process.exit(1);
  }
}

// เริ่มการตรวจสอบ
function startBlacklistScheduler() {
  // เรียกครั้งแรก
  checkAuthTokensExpired();
  checkBlackListTokensExpired();

  // ตั้งตารางทุก 1 นาที
  schedule.scheduleJob('0 * * * *', async () => {
      console.log('Scheduled blacklist update starting...');
      await checkAuthTokensExpired();
      await checkBlackListTokensExpired();
  });
}

startBlacklistScheduler();

app.use('*', (req, res) => {
  if (req.accepts('html')) {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  } else {
    msg(res, 404, "404 Not found!!!!");
  }
});

module.exports = app;