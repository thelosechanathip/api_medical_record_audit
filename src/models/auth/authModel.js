const db_b = require('../../config/db_b');
const db_m = require('../../config/db_m');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const moment = require('moment');

// ตรวจสอบ Username บน Database = Medical Record Audit ใน Table = users
exports.checkUsernameData = async(username) => {
    try {
        const [result] = await db_m.query('SELECT id FROM users WHERE username = ?', [username]);
        return result.length > 0;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check username data");
    }
}

// ตรวจสอบ Password บน Database = Medical Record Audit ใน Table = users
exports.checkPasswordData = async(data) => {
    try {
        const { username, password } = data;
        const [result] = await db_m.query('SELECT password FROM users WHERE username = ? LIMIT 1', [username]);
        const hashedPassword = result[0].password
        const isMath = await bcrypt.compare(password, hashedPassword);
        return isMath;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check password data");
    }
}

// Fetch Data User บน Database = backoffice ใน Table = users
exports.fetchOneUserData = async (username) => {
    try {
        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        const sql_1 = `
            SELECT
                id,
                email,
                fullname
            FROM users
            WHERE username = ?
            LIMIT 1
        `;
        const [result_1] = await db_m.query(sql_1, [username]);

        const endTime_1 = Date.now(); // เวลาสิ้นสุดหลังการ Query
        const durationInMinutes_1 = ((endTime_1 - startTime_1) / 1000 / 60).toFixed(4); // รวมเวลาเริ่มต้นและสิ้นสุดของการ Query เพื่อมาว่าใช้เวลาในการ Query เท่าไหร่?
        const executedSQL_1 = db_m.format(sql_1, [username]).replace(/\s+/g, ' ').trim(); // ลบช่องว่างหน้า-หลัง

        const [typeSqlIdResult] = await db_m.query(`SELECT id FROM type_sqls WHERE type_sql_name = 'SELECT'`);
        const doing_what = 'เข้าสู่ระบบ Medical Record Audit';

        const insertLogQuery = `
            INSERT INTO log_login_logout (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
            VALUES(?, ?, ?, ?, ?, ?)
        `;

        await db_m.query(insertLogQuery, [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, result_1[0].fullname, result_1[0].fullname]);

        return result_1;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetch user data");
    }
}

// Check { national_id } บน Database = backoffice ใน Table = users
exports.checkNationalIdBackOffice = async (national_id) => {
    try {
        const [rows] = await db_b.query(
            `SELECT id FROM hrd_person WHERE HR_CID = ? LIMIT 1`, 
            [national_id]
        );

        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        console.error("Database error:", err.message);
        throw new Error("Failed to check user data");
    }
};

// Check { national_id } บน Database = medical_record_audit ใน Table = users
exports.checkNationalIdMedicalRecordAudit = async (national_id) => {
    try {
        const [checkNationalIdResult] = await db_m.query('SELECT id FROM users WHERE national_id = ?', [national_id]);
        if(checkNationalIdResult.length === 0)  return false;

        const [fetchDataFirst] = await db_b.query(
            `
                SELECT 
                    u.password,
                    hpr.HR_PREFIX_NAME AS prefix_name,
                    u.name AS fullname,
                    u.status,
                    hpo.HR_POSITION_NAME AS position,
                    hdss.HR_DEPARTMENT_SUB_SUB_NAME AS department_subsub
                FROM users AS u
                INNER JOIN hrd_person AS hp ON u.PERSON_ID = hp.id
                INNER JOIN hrd_prefix AS hpr ON hp.HR_PREFIX_ID = hpr.HR_PREFIX_ID
                INNER JOIN hrd_position AS hpo ON hp.HR_POSITION_ID = hpo.HR_POSITION_ID
                INNER JOIN hrd_department AS hd ON hp.HR_DEPARTMENT_ID = hd.HR_DEPARTMENT_ID
                INNER JOIN hrd_department_sub AS hds ON hp.HR_DEPARTMENT_SUB_ID = hds.HR_DEPARTMENT_SUB_ID
                INNER JOIN hrd_department_sub_sub AS hdss ON hds.HR_DEPARTMENT_SUB_ID = hdss.HR_DEPARTMENT_SUB_ID
                WHERE hp.HR_CID = ?
                LIMIT 1 
            `,
            [national_id]
        );

        try {
            const [updateDataResult] = await db_m.query(
                `
                    UPDATE users
                    SET
                        password = ?,
                        prefix = ?,
                        fullname = ?,
                        national_id = ?,
                        position = ?,
                        department = ?,
                        status = ?
                    WHERE id = ?
                `,
                [
                    fetchDataFirst[0].password,
                    fetchDataFirst[0].prefix_name,
                    fetchDataFirst[0].fullname,
                    national_id,
                    fetchDataFirst[0].position,
                    fetchDataFirst[0].department_subsub,
                    fetchDataFirst[0].status,
                    checkNationalIdResult[0].id
                ]
            );
            if(updateDataResult.affectedRows > 0) return true;
        } catch (err) {
            console.error("Error updating data:", err.message);
        }
    } catch (err) {
        console.error("Database error:", err.message);
        throw new Error("Failed to check national id data");
    }
}

// บันทึกข้อมูล
exports.addDataUser = async (national_id) => {
    try {
        const [fetchDataFirst] = await db_b.query(
            `
                SELECT 
                    u.email,
                    u.username,
                    u.password,
                    hpr.HR_PREFIX_NAME AS prefix_name,
                    u.name AS fullname,
                    u.status,
                    hpo.HR_POSITION_NAME AS position,
                    hdss.HR_DEPARTMENT_SUB_SUB_NAME AS department_subsub
                FROM users AS u
                INNER JOIN hrd_person AS hp ON u.PERSON_ID = hp.id
                INNER JOIN hrd_prefix AS hpr ON hp.HR_PREFIX_ID = hpr.HR_PREFIX_ID
                INNER JOIN hrd_position AS hpo ON hp.HR_POSITION_ID = hpo.HR_POSITION_ID
                INNER JOIN hrd_department AS hd ON hp.HR_DEPARTMENT_ID = hd.HR_DEPARTMENT_ID
                INNER JOIN hrd_department_sub AS hds ON hp.HR_DEPARTMENT_SUB_ID = hds.HR_DEPARTMENT_SUB_ID
                INNER JOIN hrd_department_sub_sub AS hdss ON hds.HR_DEPARTMENT_SUB_ID = hdss.HR_DEPARTMENT_SUB_ID
                WHERE hp.HR_CID = ?
                LIMIT 1 
            `,
            [national_id]
        );

        const [addDataResult] = await db_m.query(
            `
                INSERT INTO users(
                    username,
                    email,
                    password,
                    prefix,
                    fullname,
                    national_id,
                    position,
                    department,
                    status
                ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                fetchDataFirst[0].username,
                fetchDataFirst[0].email,
                fetchDataFirst[0].password,
                fetchDataFirst[0].prefix_name,
                fetchDataFirst[0].fullname,
                national_id,
                fetchDataFirst[0].position,
                fetchDataFirst[0].department_subsub,
                fetchDataFirst[0].status
            ]
        );
        return addDataResult.affectedRows > 0;
    } catch (err) {
        console.error("Database error:", err.message);
        throw new Error("Failed to add user data");
    }
}

// ดึงข้อมูลแค่ 1 record
exports.fetchOneUser = async (id) => {
    try {
        const sql_1 = 'SELECT fullname, position, department,status FROM users WHERE id = ?';
        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        const [result_1] = await db_m.query(sql_1, [id]);
        const endTime_1 = Date.now(); // เวลาสิ้นสุดหลังการ Query
        const durationInMinutes_1 = ((endTime_1 - startTime_1) / 1000 / 60).toFixed(4); // รวมเวลาเริ่มต้นและสิ้นสุดของการ Query เพื่อมาว่าใช้เวลาในการ Query เท่าไหร่?
        
        const executedSQL_1 = db_m.format(sql_1).replace(/\s+/g, ' ').trim(); // ลบช่องว่างหน้า-หลัง
        const [typeSqlIdResult] = await db_m.query(`SELECT id FROM type_sqls WHERE type_sql_name = 'SELECT'`);
        const doing_what = 'Verify Token';

        await db_m.query(
            `
                INSERT INTO log_login_logout (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                VALUES(?, ?, ?, ?, ?, ?)
            `,
            [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, result_1[0].fullname, result_1[0].fullname]
        );
        return result_1;
    } catch (err) {
        console.error("Database error:", err.message);
        throw new Error("Failed to fetch user data");
    }
}

// Function สำหรับบันทึกข้อมูล Token ไปยัง Table auth_tokens
exports.addAuthToken = async (token) => {
    try {
        const dataToken = await jwt.verify(token, process.env.SECRET_KEY);
        const exp = moment.unix(dataToken.exp).format('YYYY-MM-DD HH:mm:ss');
        
        const sql_1 = `
            INSERT INTO auth_tokens(token, user_id, expires_at) VALUES(?, ?, ?)
        `;
        const [addAuthTokenResult] = await db_m.query(sql_1, [token, dataToken.userId, exp]);

        return addAuthTokenResult.affectedRows > 0;
    } catch (err) {
        console.error("Database error:", err.message);
        throw new Error("Failed to addAuthToken");
    }
} 

// Function สำหรับแก้ไขข้อมูล otp_verified ไปยัง Table auth_tokens
exports.changeVerified = async (token) => {
    try {
        const dataToken = await jwt.verify(token, process.env.SECRET_KEY);

        const sql_1 = `
            UPDATE auth_tokens
            SET
                otp_verified = ?
            WHERE token = ?
        `;
        const [updateOtpVerifiedResult] = await db_m.query(sql_1, [true, token]);
    } catch (err) {
        console.error("Database error:", err.message);
        throw new Error("Failed to changeVerified");
    }
}

// Function สำหรับดึงข้อมูล Field otp_verified && is_active บน Table auth_tokens
exports.checkOtpVerifiedIsActive = async (token) => {
    try {
        const [result] = await db_m.query('SELECT otp_verified, is_active FROM auth_tokens WHERE token = ?', [token]);
        return result;
    } catch (err) {
        console.error("Database error:", err.message);
        throw new Error("Failed to checkOtpVerifiedIsActive");
    }
}

// Check User id ของ id ที่ส่งมา
exports.checkUserId = async (id, fullname) => {
    try {
        const sql_1 = 'SELECT id FROM users WHERE id = ?';
        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        const [result_1] = await db_m.query(sql_1, [id]);
        const endTime_1 = Date.now(); // เวลาสิ้นสุดหลังการ Query
        const durationInMinutes_1 = ((endTime_1 - startTime_1) / 1000 / 60).toFixed(4); // รวมเวลาเริ่มต้นและสิ้นสุดของการ Query เพื่อมาว่าใช้เวลาในการ Query เท่าไหร่?
        
        const executedSQL_1 = db_m.format(sql_1, [id]).replace(/\s+/g, ' ').trim(); // ลบช่องว่างหน้า-หลัง
        const [typeSqlIdResult] = await db_m.query(`SELECT id FROM type_sqls WHERE type_sql_name = 'SELECT'`);
        const doing_what = 'checkUserId';

        await db_m.query(
            `
                INSERT INTO log_login_logout (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                VALUES(?, ?, ?, ?, ?, ?)
            `,
            [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, fullname, fullname]
        );
        return result_1.length > 0;
    } catch (err) {
        console.error("Database error:", err.message);
        throw new Error("Failed to check user id data");
    }
}

// ลบข้อมูล
exports.removeUser = async (id, fullname) => {
    try {
        const sql_1 = 'DELETE FROM users WHERE id = ?';
        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        // ลบข้อมูลจากตาราง users
        const [deleteResult_1] = await db_m.query(sql_1, [id]);
        const endTime_1 = Date.now(); // เวลาสิ้นสุดหลังการ Query
        const durationInMinutes_1 = ((endTime_1 - startTime_1) / 1000 / 60).toFixed(4); // รวมเวลาเริ่มต้นและสิ้นสุดของการ Query เพื่อมาว่าใช้เวลาในการ Query เท่าไหร่?
        
        const executedSQL_1 = db_m.format(sql_1, [id]).replace(/\s+/g, ' ').trim(); // ลบช่องว่างหน้า-หลัง
        const [typeSqlIdResult_1] = await db_m.query(`SELECT id FROM type_sqls WHERE type_sql_name = 'DELETE'`);
        const doing_what_1 = 'removeUser';

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult_1.affectedRows > 0) {
            await db_m.query(
                `
                    INSERT INTO log_patient_services (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                    VALUES(?, ?, ?, ?, ?, ?)
                `,
                [typeSqlIdResult_1[0].id, doing_what_1, executedSQL_1, durationInMinutes_1, fullname, fullname]
            );

            // หาค่า MAX(id) จากตาราง users เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db_m.query('SELECT MAX(id) AS maxId FROM users');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db_m.query('ALTER TABLE users AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error("Database error:", err.message);
        throw new Error("Failed to delete user data");
    }
}

// Function ในการเพิ่มข้อมูล Token ไปยัง Table token_blacklist และอัพเดท field is_active ของ Taable auth_tokens
exports.addBlackListToken = async (data, fullname) => {
    try {
        const sql_1 = 'INSERT INTO token_blacklist(token, expires_at) VALUES(?, ?)';
        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        const exp = moment.unix(data.expires_at).format('YYYY-MM-DD HH:mm:ss');
        const [addTokenBlackListResult] = await db_m.query(sql_1, [data.token, exp]);
        const endTime_1 = Date.now(); // เวลาสิ้นสุดหลังการ Query
        const durationInMinutes_1 = ((endTime_1 - startTime_1) / 1000 / 60).toFixed(4); // รวมเวลาเริ่มต้นและสิ้นสุดของการ Query เพื่อมาว่าใช้เวลาในการ Query เท่าไหร่?
        
        const executedSQL_1 = db_m.format(sql_1, [data.token, data.expires_at]).replace(/\s+/g, ' ').trim(); // ลบช่องว่างหน้า-หลัง
        if(addTokenBlackListResult.affectedRows > 0) {
            const [typeSqlIdResult_1] = await db_m.query(`SELECT id FROM type_sqls WHERE type_sql_name = 'INSERT'`);
            const doing_what_1 = 'บันทึกข้อมูล Token Blacklist';

            await db_m.query(
                `
                    INSERT INTO log_login_logout (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                    VALUES(?, ?, ?, ?, ?, ?)
                `,
                [typeSqlIdResult_1[0].id, doing_what_1, executedSQL_1, durationInMinutes_1, fullname, fullname]
            );

            const sql_2 = `UPDATE auth_tokens SET is_active = ?`;
            const startTime_2 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
            const [updateAuthTokensResult] = await db_m.query(sql_2, [false]);
            const endTime_2 = Date.now(); // เวลาสิ้นสุดหลังการ Query
            const durationInMinutes_2 = ((endTime_2 - startTime_2) / 1000 / 60).toFixed(4); // รวมเวลาเริ่มต้นและสิ้นสุดของการ Query เพื่อมาว่าใช้เวลาในการ Query เท่าไหร่?
            
            const executedSQL_2 = db_m.format(sql_2, [false]).replace(/\s+/g, ' ').trim(); // ลบช่องว่างหน้า-หลัง
            if(updateAuthTokensResult.affectedRows > 0) {
                const [typeSqlIdResult_2] = await db_m.query(`SELECT id FROM type_sqls WHERE type_sql_name = 'UPDATE'`);
                const doing_what_2 = 'อัพเดทข้อมูล Auth Tokens';

                await db_m.query(
                    `
                        INSERT INTO log_login_logout (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                        VALUES(?, ?, ?, ?, ?, ?)
                    `,
                    [typeSqlIdResult_2[0].id, doing_what_2, executedSQL_2, durationInMinutes_2, fullname, fullname]
                );
                return true;
            }
        }
        return false;
    } catch (err) {
        console.error("Database error:", err.message);
        throw new Error("Failed to addBlackListToken");
    }
}

// เพิ่มข้อมูลไปยัง log_login_logout เมื่อมีการ Logout ออกจากระบบ
exports.addLogLogout = async (fullname) => {
    try {
        
        const [addLogLogoutResult] = await db_m.query(
            `
                INSERT INTO log_login_logout (doing_what, created_by, updated_by)
                VALUES(?, ?, ?)
            `,
            ['Logout( ออกจากระบบ )', fullname, fullname]
        );

        return addLogLogoutResult.affectedRows > 0;
    } catch (err) {
        console.error("Database error:", err.message);
        throw new Error("Failed to add Log Logout data");
    }
}