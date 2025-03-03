const {
    checkUsernameData,
    checkPasswordData,
    fetchOneUserData,
    checkNationalIdBackOffice,
    checkNationalIdMedicalRecordAudit,
    addDataUser,
    fetchOneUser,
    checkUserId,
    removeUser,
    addLogLogout
} = require("../../models/auth/authModel");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { msg } = require("../../utils/message");
require("dotenv").config();
const CryptoJS = require("crypto-js");
const nodemailer = require("nodemailer");
const NodeCache = require("node-cache");
const otpCache = new NodeCache({ stdTTL: 300 }); // รหัส OTP หมดอายุใน 5 นาที (300 วินาที)
const { statusOtp } = require('../../utils/statusOtp');

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
            statusOtp.valid = true;
            statusOtp.tokenValid = token;
            return msg(res, 200, { message: "Login successfully!" });
        } else {
            return msg(res, 400, { message: "OTP ไม่ถูกต้อง" });
        }
    } catch (error) {
        console.error("Error verify OTP:", error.message);
        return msg(res, 500, { message: "Internal Server Error" });
    }
};

// Function ยืนยันตัวตนด้วย Token
exports.authVerifyToken = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return msg(res, 401, { message: 'Token ไม่ถูกต้องหรือไม่มี Token ส่งมา!' });

    const token = authHeader.split(' ')[1];
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) return msg(res, 400, { message: 'Token ไม่ถูกต้องกรุณาตรวจสอบ!' });

        const fetchOneUserResult = await fetchOneUser(decoded.userId);
        if (!Array.isArray(fetchOneUserResult) || fetchOneUserResult.length === 0) {
            return msg(res, 404, { message: "No data found" });
        }
        return msg(res, 200, { data: fetchOneUserResult[0] });
    } catch (error) {
        console.error("Error verify OTP:", error.message);
        return msg(res, 500, { message: "Internal Server Errors" });
    }
}

// Function สำหรับ Remove User ออกจาก Database => medical_record_audit
exports.authRemoveUser = async(req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { password } = req.body;
        const hashedPassword = req.user[0].password;
        const userId = req.user[0].id;
        const { fullname } = req.user[0];

        if(id === userId) return msg(res, 400, { message: "ไม่สามารถลบ User ตัวเราเองในขณะที่อยู่ในระบบได้!" });

        const checkUserIdResult = await checkUserId(id, fullname);
        if(!checkUserIdResult) return msg(res, 400, { message: "ไม่มี User นี้ในระบบกรุณาตรวจสอบ!!" });

        const isMath = await bcrypt.compare(password, hashedPassword);
        if(isMath === false) return msg(res, 400, "คุณไม่มีสิทธิ์ในการลบข้อมูล!");

        const removeUserResult = await removeUser(id, fullname);
        if(removeUserResult) {
            return msg(res, 200, { message: 'ลบข้อมูลเสร็จสิ้น!' });
        } else {
            return msg(res, 400, { message: 'ลบข้อมูลไม่สำเร็จ!' });
        }
    } catch(err) {
        console.error(err.message);
        return msg(res, 500, 'Internel server errors');
    }
}

// Function สำหรับการ Logout ออกจากระบบ
exports.authLogout = async (req, res) => {
    try {
        const { fullname } = req.user[0];
        const addLogLogoutResult = await addLogLogout(fullname);

        if(!addLogLogoutResult) return msg(res, 400, "เกิดข้อผิดพลาดระหว่างการทำงานกรุณาติดต่อ Admin ของระบบ!");

        if(statusOtp.valid != true) {
            return msg(res, 200, { message: "Logout successfully!" });
        } else {
            statusOtp.valid = false;
            statusOtp.tokenValid = '';
            return msg(res, 200, { message: "Logout successfully!" });
        }
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return msg(res, 401, 'TokenExpiredError!');
        } else if (err.name === 'JsonWebTokenError') {
            return msg(res, 401, 'JsonWebTokenError!');
        }
        console.error('Error verifying token:', err);
        return msg(res, 500, 'Internal Server Error');
    }
}