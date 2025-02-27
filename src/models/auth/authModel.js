const db_b = require('../../config/db_b');
const db_m = require('../../config/db_m');
const bcrypt = require('bcryptjs');

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
                email
            FROM users
            WHERE username = ?
            LIMIT 1
        `;
        const [result_1] = await db_m.query(sql_1, [username]);

        const endTime_1 = Date.now(); // เวลาสิ้นสุดหลังการ Query
        const durationInMinutes_1 = ((endTime_1 - startTime_1) / 1000 / 60).toFixed(4); // รวมเวลาเริ่มต้นและสิ้นสุดของการ Query เพื่อมาว่าใช้เวลาในการ Query เท่าไหร่?
        
        const [typeSqlIdResult] = await db_m.query(`SELECT id FROM type_sqls WHERE type_sql_name = 'SELECT'`);
        const doing_what = 'เข้าสู่ระบบ Medical Record Audit';

        const insertLogQuery = `
            INSERT INTO log_login_logout (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
            VALUES(?, ?, ?, ?, ?, ?)
        `;

        await db_m.query(insertLogQuery, [typeSqlIdResult[0].id, doing_what, sql_1, durationInMinutes_1, username, username]);

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
        const [result] = await db_m.query('SELECT fullname, position, department FROM users WHERE id = ?', [id]);
        return result;
    } catch (err) {
        console.error("Database error:", err.message);
        throw new Error("Failed to fetch user data");
    }
}

// Check User id ของ id ที่ส่งมา
exports.checkUserId = async (id) => {
    try {
        const [result] = await db_m.query('SELECT id FROM users WHERE id = ?', [id]);
        return result.length > 0;
    } catch (err) {
        console.error("Database error:", err.message);
        throw new Error("Failed to check user id data");
    }
}

// ลบข้อมูล
exports.removeUser = async (id) => {
    try {
        // ลบข้อมูลจากตาราง users
        const [deleteResult] = await db_m.query('DELETE FROM users WHERE id = ?', [id]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult.affectedRows > 0) {
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

// เพิ่มข้อมูลไปยัง log_login_logout เมื่อมีการ Logout ออกจากระบบ
exports.addLogLogout = async (id) => {
    try {
        const [userDataResult] = await db_m.query('SELECT username FROM users WHERE id = ?', [id]);
        
        const [addLogLogoutResult] = await db_m.query(
            `
                INSERT INTO log_login_logout (doing_what, created_by, updated_by)
                VALUES(?, ?, ?)
            `,
            ['Logout( ออกจากระบบ )', userDataResult[0].username, userDataResult[0].username]
        );

        return addLogLogoutResult.affectedRows > 0;
    } catch (err) {
        console.error("Database error:", err.message);
        throw new Error("Failed to add Log Logout data");
    }
}