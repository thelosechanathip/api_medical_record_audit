// การนำเข้าโมดูลที่จำเป็นสำหรับการทำงานของแอปพลิเคชัน
const express = require("express");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const morgan = require("morgan");
const cors = require("cors");
const { readdirSync } = require("fs");
const fs = require("fs");
const path = require("path");
const { authAdmin } = require('../src/middleware/auth/authAdmin');
require('dotenv').config();

// สร้าง instance ของ Express application
const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

// app.get('/test', authAdmin, (req, res) => {
//   return res.status(200).json({ message: 'Welcome to test!!' });
// });

// โหลด apiReference แบบ dynamic import
app.get('/', async (req, res, next) => {
  const { apiReference } = await import('@scalar/express-api-reference');
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
  })(req, res, next);
});

app.get('/api/docs/swagger', (req, res) => {
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

module.exports = app;