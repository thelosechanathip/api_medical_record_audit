const express = require("express");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const morgan = require("morgan");
const cors = require("cors");
const { readdirSync } = require("fs");
const fs = require("fs");
const path = require("path");
require('dotenv').config();

const app = express();

// Middleware
app.use(morgan("dev")); // ใช้แสดงข้อมูลของ API ว่ามีการวิ่งของข้อมูลอะไรบ้าง
app.use(express.json()); // ทำให้สามารถอ่านข้อมูลไฟล์ JSON ได้
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Router
const routesPath = path.join(__dirname, "routes"); // กำหนดเส้นทางไปยังโฟลเดอร์ routes

const BASE_PATH = process.env.BASE_PATH;

if (fs.existsSync(routesPath)) {
    readdirSync(routesPath).map((routeFile) => {
        app.use(`/${BASE_PATH}`, require(`${routesPath}/${routeFile}`));
    });
} else {
  console.error(`Routes folder not found at path: ${routesPath}`);
}

module.exports = app;