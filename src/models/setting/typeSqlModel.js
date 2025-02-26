const db_m = require('../../config/db_m');

// ฟังก์ชันสำหรับดึงข้อมูล Table type_sqls จากฐานข้อมูล
exports.fetchTypeSqlData = async() => {
    try {
        const [result] = await db_m.query('SELECT * FROM type_sqls');
        return result;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetch type sql data");
    }
}

// Check ว่ามี TypeSqlName บน Table type_sqls หรือไม่?
exports.checkTypeSqlNameData = async(type_sql_name) => {
    try {
        const [result] = await db_m.query('SELECT type_sql_name FROM type_sqls WHERE type_sql_name = ?', [type_sql_name]);
        return result.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check type sql name data");
    }
}

// เพิ่มข้อมูลไปยัง Table type_sqls
exports.addTypeSqlData = async(data) => {
    try {
        const { type_sql_name, created_by, updated_by } = data;
        const [result] = await db_m.query(
            `
                INSERT INTO type_sqls (type_sql_name, created_by, updated_by)
                VALUES (?, ?, ?)
            `,
            [type_sql_name, created_by, updated_by]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการเพิ่มข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to add type sql data");
    }
}

// Check ว่ามี ID นี้อยู่ใน Table type_sqls หรือไม่?
exports.checkIdTypeSqlData = async (id) => {
    try {
        const [result] = await db_m.query(`SELECT id FROM type_sqls WHERE id = ?`, [id]);
        return result.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("ไม่มีข้อมูลในระบบกรุณาตรวจสอบข้อมูล");
    }
};

// อัพเดทข้อมูลไปยัง Table type_sqls
exports.updateTypeSqlData = async (id, data) => {
    try {
        const { type_sql_name, updated_by } = data;
        const [result] = await db_m.query(
            `
                UPDATE type_sqls 
                SET 
                    type_sql_name = ?,
                    updated_by = ?
                WHERE id = ?
            `,
            [type_sql_name, updated_by, id]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการอัพเดทข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to update type sql data");
    }
};

// ลบข้อมูลบน Table type_sqls
exports.removeTypeSqlData = async (id) => {
    try {
        // ลบข้อมูลจากตาราง type_sqls
        const [deleteResult] = await db_m.query('DELETE FROM type_sqls WHERE id = ?', [id]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง type_sqls เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db_m.query('SELECT MAX(id) AS maxId FROM type_sqls');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db_m.query('ALTER TABLE type_sqls AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removing type sql data:', err.message);
        throw new Error('Failed to remove type sql data');
    }
};