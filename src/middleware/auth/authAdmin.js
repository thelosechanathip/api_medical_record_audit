const db_m = require('../../config/db_m');
const CryptoJS = require("crypto-js");
const { msg } = require('../../utils/message');
const jwt = require("jsonwebtoken");

// สำหรับตรวจสอบสิทธิ์การเข้าใช้งาน Document API
exports.authAdminDoc = async (req, res, next) => {
    try {
        // ตรวจสอบว่ามี text ใน params หรือไม่
        const text = req.params.text;
        if (!text) {
            return msg(res, 400, { message: "กรุณาป้อนรหัสผ่าน" });
        }

        // ถอดรหัส text
        const bytes = CryptoJS.AES.decrypt(text, process.env.SECRET_KEY_ADMIN);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

        // ตรวจสอบว่าถอดรหัสสำเร็จและมีข้อมูลหรือไม่
        if (!decryptedText) {
            return msg(res, 401, { message: "คุณไม่มีสิทธิ์เข้าใช้งานหน้านี้" });
        }

        next();

    } catch (err) {
        console.error(err.message);
        return msg(res, 401, { message: "การยืนยันตัวตนล้มเหลว กรุณาตรวจสอบข้อมูลที่เข้ารหัส" });
    }
};

// สำหรับตรวจสอบสิทธิ์การเข้าใช้งานด้วยสิทธิ์ ADMIN
exports.authAdminSetting = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return msg(res, 401, { message: 'ไม่มี Token ถูกส่งมา' });

    const token = authHeader.split(' ')[1];
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) return msg(res, 500, { message: false });

        const [fetchOneStatusUserResult] = await db_m.query('SELECT password, status FROM users WHERE id = ? LIMIT 1', [decoded.userId]);
        if(fetchOneStatusUserResult[0].status != "ADMIN") return msg(res, 400, "ไม่มีสิทธิ์ใช้งาน Function นี้!!");

        req.password = fetchOneStatusUserResult[0].password;

        next();
    } catch(err) {
        console.log(err.message);
        return msg(res, 500, 'Internal server errors');
    }
};
