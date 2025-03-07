const db_m = require('../../config/db_m');

// Function สำหรับดึงข้อมูล Table review_status จากฐานข้อมูล
exports.fetchReviewStatusData = async (fullname) => {
    try {
        const sql_1 = `
            SELECT 
                rs.id,
                rs.review_status_name,
                rs.review_status_description,
                rs.review_status_type,
                ps.patient_services_name_english,
                ps.patient_services_name_thai,
                rs.created_at,
                rs.created_by,
                rs.updated_at,
                rs.updated_by
            FROM review_status AS rs
            LEFT OUTER JOIN patient_services AS ps ON rs.patient_services_id = ps.id
        `;
        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        const [result_1] = await db_m.query(sql_1);
        const endTime_1 = Date.now(); // เวลาสิ้นสุดหลังการ Query
        const durationInMinutes_1 = ((endTime_1 - startTime_1) / 1000 / 60).toFixed(4); // รวมเวลาเริ่มต้นและสิ้นสุดของการ Query เพื่อมาว่าใช้เวลาในการ Query เท่าไหร่?
        
        const executedSQL_1 = db_m.format(sql_1).replace(/\s+/g, ' ').trim(); // ลบช่องว่างหน้า-หลัง
        const [typeSqlIdResult] = await db_m.query(`SELECT id FROM type_sqls WHERE type_sql_name = 'SELECT'`);
        const doing_what = 'ค้นหาข้อมูล';

        await db_m.query(
            `
                INSERT INTO log_review_status (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                VALUES(?, ?, ?, ?, ?, ?)
            `,
            [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, fullname, fullname]
        );
        return result_1;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetchReviewStatusData");
    }
}

// Function สำหรับ Check ว่า review_status_name มีข้อมูลซ้ำใน Database หรือไม่ ?
exports.checkReviewStatusName = async (review_status_name, fullname) => {
    try {
        const sql_1 = `SELECT review_status_name FROM review_status WHERE review_status_name = ?`
        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        const [checkForReviewStatusNameResult] = await db_m.query(sql_1, [review_status_name]);
        const endTime_1 = Date.now(); // เวลาสิ้นสุดหลังการ Query
        const durationInMinutes_1 = ((endTime_1 - startTime_1) / 1000 / 60).toFixed(4); // รวมเวลาเริ่มต้นและสิ้นสุดของการ Query เพื่อมาว่าใช้เวลาในการ Query เท่าไหร่?
        
        const executedSQL_1 = db_m.format(sql_1, [review_status_name]).replace(/\s+/g, ' ').trim(); // ลบช่องว่างหน้า-หลัง
        const [typeSqlIdResult] = await db_m.query(`SELECT id FROM type_sqls WHERE type_sql_name = 'SELECT'`);
        const doing_what = 'Check ว่า review_status_name มีข้อมูลซ้ำใน Database หรือไม่';

        await db_m.query(
            `
                INSERT INTO log_review_status (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                VALUES(?, ?, ?, ?, ?, ?)
            `,
            [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, fullname, fullname]
        );

        return checkForReviewStatusNameResult.length > 0;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkReviewStatusName");
    }
}

// Function สำหรับ Check ว่า review_status_description มีข้อมูลซ้ำใน Database หรือไม่ ?
exports.checkReviewStatusDescription = async (review_status_description, fullname) => {
    try {
        const sql_1 = `SELECT review_status_description FROM review_status WHERE review_status_description = ?`
        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        const [checkForReviewStatusNameResult] = await db_m.query(sql_1, [review_status_description]);
        const endTime_1 = Date.now(); // เวลาสิ้นสุดหลังการ Query
        const durationInMinutes_1 = ((endTime_1 - startTime_1) / 1000 / 60).toFixed(4); // รวมเวลาเริ่มต้นและสิ้นสุดของการ Query เพื่อมาว่าใช้เวลาในการ Query เท่าไหร่?
        
        const executedSQL_1 = db_m.format(sql_1, [review_status_description]).replace(/\s+/g, ' ').trim(); // ลบช่องว่างหน้า-หลัง
        const [typeSqlIdResult] = await db_m.query(`SELECT id FROM type_sqls WHERE type_sql_name = 'SELECT'`);
        const doing_what = 'Check ว่า review_status_description มีข้อมูลซ้ำใน Database หรือไม่';

        await db_m.query(
            `
                INSERT INTO log_review_status (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                VALUES(?, ?, ?, ?, ?, ?)
            `,
            [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, fullname, fullname]
        );

        return checkForReviewStatusNameResult.length > 0;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkReviewStatusDescription");
    }
}

// Function สำหรับ Check ว่า patient_services_id มีข้อมูลอยู่จริงใน Table patient_services หรือไม่ ?
exports.checkPatientServicesId = async (id, fullname) => {
    try {
        const sql_1 = 'SELECT id FROM patient_services WHERE id = ?';
        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        const [checkId] = await db_m.query(sql_1, [id]);
        const endTime_1 = Date.now(); // เวลาสิ้นสุดหลังการ Query
        const durationInMinutes_1 = ((endTime_1 - startTime_1) / 1000 / 60).toFixed(4); // รวมเวลาเริ่มต้นและสิ้นสุดของการ Query เพื่อมาว่าใช้เวลาในการ Query เท่าไหร่?
        
        const executedSQL_1 = db_m.format(sql_1, [id]).replace(/\s+/g, ' ').trim(); // ลบช่องว่างหน้า-หลัง
        const [typeSqlIdResult] = await db_m.query(`SELECT id FROM type_sqls WHERE type_sql_name = 'SELECT'`);
        const doing_what = 'Check ว่า patient_services_id มีข้อมูลอยู่จริงใน Table patient_services หรือไม่';

        await db_m.query(
            `
                INSERT INTO log_review_status (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                VALUES(?, ?, ?, ?, ?, ?)
            `,
            [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, fullname, fullname]
        );

        return checkId.length > 0;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkPatientServicesId");
    }
}

// Function สำหรับ Create ข้อมูลไปยัง Table review_status
exports.addReviewStatusData = async (data, fullname) => {
    try {
        const { review_status_name, review_status_description, review_status_type, patient_services_id } = data;
        // const changeOverallFindingName = await capitalizeFirstLetter(review_status_name);
        
        const sql_1 = `
            INSERT INTO 
            review_status (
                review_status_name, review_status_description, review_status_type, patient_services_id, created_by, updated_by
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        const [addReviewStatusDataResult] = await db_m.query(
            sql_1, [review_status_name, review_status_description, review_status_type, patient_services_id, fullname, fullname]
        );
        const endTime_1 = Date.now(); // เวลาสิ้นสุดหลังการ Query
        const durationInMinutes_1 = ((endTime_1 - startTime_1) / 1000 / 60).toFixed(4); // รวมเวลาเริ่มต้นและสิ้นสุดของการ Query เพื่อมาว่าใช้เวลาในการ Query เท่าไหร่?
        
        const executedSQL_1 = db_m.format(
            sql_1, [review_status_name, review_status_description, review_status_type, patient_services_id, fullname, fullname]
        ).replace(/\s+/g, ' ').trim(); // ลบช่องว่างหน้า-หลัง
        
        const [typeSqlIdResult] = await db_m.query(`SELECT id FROM type_sqls WHERE type_sql_name = 'INSERT'`);
        const doing_what = 'บันทึกข้อมูล';

        await db_m.query(
            `
                INSERT INTO log_review_status (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                VALUES (?, ?, ?, ?, ?, ?)
            `,
            [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, fullname, fullname]
        );

        return addReviewStatusDataResult.affectedRows > 0;

    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to addReviewStatusData");
    }
}

// Function สำหรับ Check ID ว่ามีข้อมูล ID นี้อยู่ใน Table review_status หรือไม่ ?
exports.checkIdReviewStatusData = async(id, fullname) => {
    try {
        const sql_1 = 'SELECT id FROM review_status WHERE id = ?';
        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        const [checkId] = await db_m.query(sql_1, [id]);
        const endTime_1 = Date.now(); // เวลาสิ้นสุดหลังการ Query
        const durationInMinutes_1 = ((endTime_1 - startTime_1) / 1000 / 60).toFixed(4); // รวมเวลาเริ่มต้นและสิ้นสุดของการ Query เพื่อมาว่าใช้เวลาในการ Query เท่าไหร่?
        
        const executedSQL_1 = db_m.format(sql_1, [id]).replace(/\s+/g, ' ').trim(); // ลบช่องว่างหน้า-หลัง
        const [typeSqlIdResult] = await db_m.query(`SELECT id FROM type_sqls WHERE type_sql_name = 'SELECT'`);
        const doing_what = 'Check ID ว่ามีข้อมูล ID นี้อยู่ใน Table review_status หรือไม่';

        await db_m.query(
            `
                INSERT INTO log_review_status (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                VALUES(?, ?, ?, ?, ?, ?)
            `,
            [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, fullname, fullname]
        );

        return checkId.length > 0;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkIdReviewStatusData");
    }
}

// Function สำหรับ Update ข้อมูลไปยัง Table review_status
exports.updateReviewStatusData = async(id, data, fullname) => {
    try{
        const { review_status_name, review_status_description, review_status_type, patient_services_id } = data;

        const sql_1 = `
            UPDATE review_status 
            SET 
                review_status_name = ?,
                review_status_description = ?,
                review_status_type = ?,
                patient_services_id = ?,
                updated_by = ?
            WHERE id = ?
        `;
        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        const [updateReviewStatusDataResult] = await db_m.query(
            sql_1, [review_status_name, review_status_description, review_status_type, patient_services_id, fullname, id]
        );
        const endTime_1 = Date.now(); // เวลาสิ้นสุดหลังการ Query
        const durationInMinutes_1 = ((endTime_1 - startTime_1) / 1000 / 60).toFixed(4); // รวมเวลาเริ่มต้นและสิ้นสุดของการ Query เพื่อมาว่าใช้เวลาในการ Query เท่าไหร่?
        
        const executedSQL_1 = db_m.format(
            sql_1, [review_status_name, review_status_description, review_status_type, patient_services_id, fullname, id]
        ).replace(/\s+/g, ' ').trim(); // ลบช่องว่างหน้า-หลัง
        
        const [typeSqlIdResult] = await db_m.query(`SELECT id FROM type_sqls WHERE type_sql_name = 'UPDATE'`);
        const doing_what = 'อัพเดทข้อมูล';

        await db_m.query(
            `
                INSERT INTO log_review_status (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                VALUES (?, ?, ?, ?, ?, ?)
            `,
            [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, fullname, fullname]
        );

        return updateReviewStatusDataResult.affectedRows > 0;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to updateReviewStatusData");
    }
}

// Function สำหรับ Delete ข้อมูลที่อยู่บน Table review_status
exports.removeReviewStatusData = async (id, fullname) => {
    try {
        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        const sql_1 = `
            DELETE FROM review_status WHERE id = ?
        `;
        // ลบข้อมูลจากตาราง review_status
        const [deleteResult_1] = await db_m.query(sql_1, [id]);
        const endTime_1 = Date.now(); // เวลาสิ้นสุดหลังการ Query
        const durationInMinutes_1 = ((endTime_1 - startTime_1) / 1000 / 60).toFixed(4); // รวมเวลาเริ่มต้นและสิ้นสุดของการ Query เพื่อมาว่าใช้เวลาในการ Query เท่าไหร่?
        
        const executedSQL_1 = db_m.format(sql_1, [id]).replace(/\s+/g, ' ').trim(); // ลบช่องว่างหน้า-หลัง

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult_1.affectedRows > 0) {
            const [typeSqlIdResult] = await db_m.query(`SELECT id FROM type_sqls WHERE type_sql_name = 'DELETE'`);
            const doing_what = 'ลบข้อมูล';

            await db_m.query(
                `
                    INSERT INTO log_review_status (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                    VALUES(?, ?, ?, ?, ?, ?)
                `,
                [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, fullname, fullname]
            );

            // หาค่า MAX(id) จากตาราง review_status เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db_m.query('SELECT MAX(id) AS maxId FROM review_status');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db_m.query('ALTER TABLE review_status AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removing removeReviewStatusData:', err.message);
        throw new Error('Failed to remove removeReviewStatusData');
    }
} 