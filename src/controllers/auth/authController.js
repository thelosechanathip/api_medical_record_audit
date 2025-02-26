
const {
    checkUsernameData,
    checkPasswordData,
    fetchOneUserData,
    checkNationalIdBackOffice,
    checkNationalIdMedicalRecordAudit,
    addDataUser
} = require("../../models/auth/authModel");
const jwt = require("jsonwebtoken");
const { msg } = require("../../utils/message");
require("dotenv").config();
const CryptoJS = require("crypto-js");
const nodemailer = require("nodemailer");
const NodeCache = require("node-cache");
const otpCache = new NodeCache({ stdTTL: 300 }); // รหัส OTP หมดอายุใน 5 นาที (300 วินาที)

// ฟังก์ชันสร้างรหัส OTP (เฉพาะตัวเลข)
const generateOtp = (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // สร้างตัวเลข 6 หลัก
    otpCache.set(email, otp);
    return otp;
};

// ฟังก์ชันส่งอีเมล
const sendEmail = async (email, otpCode) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",  // สามารถใช้บริการอีเมล์อื่นได้
        auth: {
            user: process.env.EMAIL,  // ใช้อีเมล์ที่ใช้ส่ง (ต้องตั้งค่าใน .env)
            pass: process.env.EMAIL_PASSWORD,  // รหัสผ่านของอีเมล์ (ต้องตั้งค่าใน .env)
        },
    });
    const mailOptions = {
        from: process.env.EMAIL,  // ส่งจากอีเมล์
        to: email,  // อีเมล์ปลายทาง
        subject: "OTP สำหรับเข้าสู่ระบบ",  // หัวข้ออีเมล์
        text: `รหัส OTP สำหรับเข้าสู่ระบบของคุณคือ: ${otpCode} รหัสจะหมดอายุภายใน 5 นาที.`,  // เนื้อหาของอีเมล์
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

// ฟังก์ชั่น generate User
exports.authRegister = async (req, res) => {
    try {
        const bytes = CryptoJS.AES.decrypt(req.body.national_id, process.env.SECRET_KEY);
        const national_id = bytes.toString(CryptoJS.enc.Utf8);

        // ตรวจสอบเลขบัตรประชาชนที่ส่งเข้ามาก่อนว่ามีการสร้างข้อมูลในระบบ BackOffice หรือยัง หรือได้เป็นเจ้าหน้าที่ในโรงพยาบาลหรือไม่
        const checkNationalIdBackOfficeResult = await checkNationalIdBackOffice(national_id);
        if (checkNationalIdBackOfficeResult === false) return msg(res, 400, { message: 'กรุณาตรวจสอบเลขบัตรประชาชนเพราะไม่มีข้อมูลในระบบ BackOffice' });

        // ตรวจสอบว่าเคยมีข้อมูลในระบบแล้วหรือยัง
        const checkNationalIdMedicalRecordAuditResult = await checkNationalIdMedicalRecordAudit(national_id);
        if (checkNationalIdMedicalRecordAuditResult === true) return msg(res, 200, { message: 'Update ข้อมูลเป็นปัจจุบันเสร็จสิ้น!!' });

        // บันทึกข้อมูลลง Database
        await addDataUser(national_id);
        return msg(res, 200, { message: 'Generate users successfully!!' });
    } catch (error) {
        console.error("Error register data:", error.message);
        return msg(res, 500, { message: "Internal Server Error" });
    }
};

// ฟังก์ชันล็อกอิน
exports.authLogin = async (req, res) => {
    try {
        const { username } = req.body;
        // ตรวจสอบว่า username มีอยู่ในระบบหรือไม่
        const checkUsernameDataResult = await checkUsernameData(username);
        if (!checkUsernameDataResult) return msg(res, 404, { message: "ไม่มี Username ในระบบ!" });
            
        // ตรวจสอบว่ารหัสผ่านถูกต้องหรือไม่
        const checkPasswordDataResult = await checkPasswordData(req.body);
        if (checkPasswordDataResult === false) return msg(res, 401, { message: "รหัสผ่านไม่ถูกต้องกรุณาตรวจสอบรหัสแล้วกรอกใหม่!" });
            
        // ดึงข้อมูลผู้ใช้หลังจากตรวจสอบผ่านแล้ว
        const fetchOneUserDataResult = await fetchOneUserData(username);
        if (fetchOneUserDataResult) {
            const userId = fetchOneUserDataResult[0].id;
            const email = fetchOneUserDataResult[0].email; // ดึง email จากฐานข้อมูล
            if (!email) return msg(res, 400, { message: "ไม่มี Email ในระบบ!" });

            const token = await jwt.sign(
                { userId, email, expiresIn: "1h" }, // เพิ่ม email ลงไปใน payload ของ token
                process.env.SECRET_KEY, { expiresIn: "1h" }
            );            

            // สร้างและส่ง OTP ไปยัง Email
            const otpCode = generateOtp(email);  // เปลี่ยนจาก chatId เป็น email
            await sendEmail(email, otpCode); // ส่ง OTP ไปยังอีเมล์
            if (token) {
                try {
                    return msg(res, 200, { 
                        token,
                        email: email 
                    }); // ส่ง OTP กลับไปยัง FrontEnd ด้วย
                } catch (err) {
                    console.error("Error token:", err.message);
                    return msg(res, 500, { message: "Internal Server Error" });
                }
            }
        }
    } catch (error) {
        console.error("Error login data:", error.message);
        return msg(res, 500, { message: "Internal Server Error" });
    }
};

// ฟังก์ชันยืนยัน OTP
exports.authVerifyOtp = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return msg(res, 401, { message: 'ไม่มี Token ถูกส่งมา' });
    const token = authHeader.split(' ')[1];
    
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) return msg(res, 500, { message: false });

        const { otpCode } = req.body;
        // ตรวจสอบว่า decoded.email มีค่าหรือไม่

        const email = decoded.email; // ดึง email จาก decoded
        if (!email) return msg(res, 401, { message: 'ไม่มี Email ใน Token' });
        // ตรวจสอบ OTP ที่กรอกเข้ามาว่าถูกต้องหรือไม่

        const cachedOtp = otpCache.get(email); // ใช้ email จาก decoded
        if (!cachedOtp) return msg(res, 400, { message: "OTP หมดอายุหรือไม่ถูกต้อง" });
        
        if (cachedOtp === otpCode) {
            // OTP ถูกต้อง, อาจจะทำการสร้าง JWT หรือทำงานต่อ
            return msg(res, 200, { message: "Login successfully!" });
        } else {
            return msg(res, 400, { message: "OTP ไม่ถูกต้อง" });
        }
    } catch (error) {
        console.error("Error verify OTP:", error.message);
        return msg(res, 500, { message: "Internal Server Error" });
    }
};
