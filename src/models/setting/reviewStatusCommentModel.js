const db_m = require('../../config/db_m');

// Function สำหรับดึงข้อมูล Table review_status_comments จากฐานข้อมูล
exports.fetchReviewStatusCommentData = async (fullname) => {
    try {
        const sql_1 = `
            SELECT 
                rsm.id,
                rs.review_status_name,
                rs.review_status_description,
                rs.review_status_type,
                rsm.review_status_comment_name,
                rsm.created_at,
                rsm.created_by,
                rsm.updated_at,
                rsm.updated_by
            FROM review_status_comments AS rsm
            LEFT OUTER JOIN review_status AS rs ON rsm.review_status_id = rs.id
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
                INSERT INTO log_review_status_comments (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                VALUES(?, ?, ?, ?, ?, ?)
            `,
            [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, fullname, fullname]
        );
        return result_1;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetchReviewStatusCommentData");
    }
}

// Function สำหรับ Check ว่า review_status_comment_name มีข้อมูลซ้ำใน Database หรือไม่ ?
exports.checkReviewStatusCommentName = async (review_status_comment_name, fullname) => {
    try {
        const sql_1 = `SELECT review_status_comment_name FROM review_status_comments WHERE review_status_comment_name = ?`
        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        const [checkForReviewStatusCommentNameResult] = await db_m.query(sql_1, [review_status_comment_name]);
        const endTime_1 = Date.now(); // เวลาสิ้นสุดหลังการ Query
        const durationInMinutes_1 = ((endTime_1 - startTime_1) / 1000 / 60).toFixed(4); // รวมเวลาเริ่มต้นและสิ้นสุดของการ Query เพื่อมาว่าใช้เวลาในการ Query เท่าไหร่?
        
        const executedSQL_1 = db_m.format(sql_1, [review_status_comment_name]).replace(/\s+/g, ' ').trim(); // ลบช่องว่างหน้า-หลัง
        const [typeSqlIdResult] = await db_m.query(`SELECT id FROM type_sqls WHERE type_sql_name = 'SELECT'`);
        const doing_what = 'Check ว่า review_status_comment_name มีข้อมูลซ้ำใน Database หรือไม่';

        await db_m.query(
            `
                INSERT INTO log_review_status_comments (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                VALUES(?, ?, ?, ?, ?, ?)
            `,
            [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, fullname, fullname]
        );

        return checkForReviewStatusCommentNameResult.length > 0;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkReviewStatusCommentName");
    }
}

// Function สำหรับ Check ว่า review_status_id มีข้อมูลอยู่จริงใน Table review_status หรือไม่ ?
exports.checkReviewStatusId = async (id, fullname) => {
    try {
        const sql_1 = 'SELECT id FROM review_status WHERE id = ?';
        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        const [checkId] = await db_m.query(sql_1, [id]);
        const endTime_1 = Date.now(); // เวลาสิ้นสุดหลังการ Query
        const durationInMinutes_1 = ((endTime_1 - startTime_1) / 1000 / 60).toFixed(4); // รวมเวลาเริ่มต้นและสิ้นสุดของการ Query เพื่อมาว่าใช้เวลาในการ Query เท่าไหร่?
        
        const executedSQL_1 = db_m.format(sql_1, [id]).replace(/\s+/g, ' ').trim(); // ลบช่องว่างหน้า-หลัง
        const [typeSqlIdResult] = await db_m.query(`SELECT id FROM type_sqls WHERE type_sql_name = 'SELECT'`);
        const doing_what = 'Check ว่า review_status_id มีข้อมูลอยู่จริงใน Table review_status หรือไม่';

        await db_m.query(
            `
                INSERT INTO log_review_status_comments (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                VALUES(?, ?, ?, ?, ?, ?)
            `,
            [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, fullname, fullname]
        );

        return checkId.length > 0;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkReviewStatusId");
    }
}

// Function สำหรับ Create ข้อมูลไปยัง Table review_status_comments
exports.addReviewStatusCommentData = async (data, fullname) => {
    try {
        const { review_status_comment_name, review_status_id } = data;
        // const changeOverallFindingName = await capitalizeFirstLetter(review_status_name);
        
        const sql_1 = `
            INSERT INTO 
            review_status_comments (
                review_status_comment_name, review_status_id, created_by, updated_by
            )
            VALUES (?, ?, ?, ?)
        `;
        
        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        const [addReviewStatusCommentDataResult] = await db_m.query(
            sql_1, [review_status_comment_name, review_status_id, fullname, fullname]
        );
        const endTime_1 = Date.now(); // เวลาสิ้นสุดหลังการ Query
        const durationInMinutes_1 = ((endTime_1 - startTime_1) / 1000 / 60).toFixed(4); // รวมเวลาเริ่มต้นและสิ้นสุดของการ Query เพื่อมาว่าใช้เวลาในการ Query เท่าไหร่?
        
        const executedSQL_1 = db_m.format(
            sql_1, [review_status_comment_name, review_status_id, fullname, fullname]
        ).replace(/\s+/g, ' ').trim(); // ลบช่องว่างหน้า-หลัง
        
        const [typeSqlIdResult] = await db_m.query(`SELECT id FROM type_sqls WHERE type_sql_name = 'INSERT'`);
        const doing_what = 'บันทึกข้อมูล';

        await db_m.query(
            `
                INSERT INTO log_review_status_comments (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                VALUES (?, ?, ?, ?, ?, ?)
            `,
            [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, fullname, fullname]
        );

        return addReviewStatusCommentDataResult.affectedRows > 0;

    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to addReviewStatusCommentData");
    }
}

// Function สำหรับ Check ID ว่ามีข้อมูล ID นี้อยู่ใน Table review_status_comments หรือไม่ ?
exports.checkIdReviewStatusCommentData = async(id, fullname) => {
    try {
        const sql_1 = 'SELECT id FROM review_status_comments WHERE id = ?';
        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        const [checkId] = await db_m.query(sql_1, [id]);
        const endTime_1 = Date.now(); // เวลาสิ้นสุดหลังการ Query
        const durationInMinutes_1 = ((endTime_1 - startTime_1) / 1000 / 60).toFixed(4); // รวมเวลาเริ่มต้นและสิ้นสุดของการ Query เพื่อมาว่าใช้เวลาในการ Query เท่าไหร่?
        
        const executedSQL_1 = db_m.format(sql_1, [id]).replace(/\s+/g, ' ').trim(); // ลบช่องว่างหน้า-หลัง
        const [typeSqlIdResult] = await db_m.query(`SELECT id FROM type_sqls WHERE type_sql_name = 'SELECT'`);
        const doing_what = 'Check ID ว่ามีข้อมูล ID นี้อยู่ใน Table review_status_comments หรือไม่';

        await db_m.query(
            `
                INSERT INTO log_review_status_comments (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                VALUES(?, ?, ?, ?, ?, ?)
            `,
            [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, fullname, fullname]
        );

        return checkId.length > 0;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkIdReviewStatusCommentData");
    }
} 

// Function สำหรับ Update ข้อมูลไปยัง Table review_status_comments
exports.updateReviewStatusCommentData = async(id, data, fullname) => {
    try{
        const { review_status_comment_name, review_status_id } = data;

        const sql_1 = `
            UPDATE review_status_comments 
            SET 
                review_status_comment_name = ?,
                review_status_id = ?,
                updated_by = ?
            WHERE id = ?
        `;
        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        const [updateReviewStatusCommentDataResult] = await db_m.query(
            sql_1, [review_status_comment_name, review_status_id, fullname, id]
        );
        const endTime_1 = Date.now(); // เวลาสิ้นสุดหลังการ Query
        const durationInMinutes_1 = ((endTime_1 - startTime_1) / 1000 / 60).toFixed(4); // รวมเวลาเริ่มต้นและสิ้นสุดของการ Query เพื่อมาว่าใช้เวลาในการ Query เท่าไหร่?
        
        const executedSQL_1 = db_m.format(
            sql_1, [review_status_comment_name, review_status_id, fullname, id]
        ).replace(/\s+/g, ' ').trim(); // ลบช่องว่างหน้า-หลัง
        
        const [typeSqlIdResult] = await db_m.query(`SELECT id FROM type_sqls WHERE type_sql_name = 'UPDATE'`);
        const doing_what = 'อัพเดทข้อมูล';

        await db_m.query(
            `
                INSERT INTO log_review_status_comments (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                VALUES (?, ?, ?, ?, ?, ?)
            `,
            [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, fullname, fullname]
        );

        return updateReviewStatusCommentDataResult.affectedRows > 0;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to updateReviewStatusCommentData");
    }
}

// Function สำหรับ Delete ข้อมูลที่อยู่บน Table review_status_comments
exports.removeReviewStatusCommentData = async (id, fullname) => {
    try {
        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        const sql_1 = `
            DELETE FROM review_status_comments WHERE id = ?
        `;
        // ลบข้อมูลจากตาราง review_status_comments
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
                    INSERT INTO log_review_status_comments (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                    VALUES(?, ?, ?, ?, ?, ?)
                `,
                [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, fullname, fullname]
            );

            // หาค่า MAX(id) จากตาราง review_status_comments เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db_m.query('SELECT MAX(id) AS maxId FROM review_status_comments');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db_m.query('ALTER TABLE review_status_comments AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removing removeReviewStatusCommentData:', err.message);
        throw new Error('Failed to remove removeReviewStatusCommentData');
    }
}