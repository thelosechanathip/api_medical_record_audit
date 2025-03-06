const db_m = require('../../config/db_m');

// Function สำหรับดึงข้อมูล Table overall_finding จากฐานข้อมูล
exports.fetchOverallFindingData = async (fullname) => {
    try {
        const sql_1 = `
            SELECT 
                of.id,
                of.overall_finding_name,
                ps.patient_services_name_english,
                ps.patient_services_name_thai,
                of.created_at,
                of.created_by,
                of.updated_at,
                of.updated_by
            FROM overall_finding AS of
            LEFT OUTER JOIN patient_services AS ps ON of.patient_services_id = ps.id
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
                INSERT INTO log_overall_finding (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                VALUES(?, ?, ?, ?, ?, ?)
            `,
            [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, fullname, fullname]
        );
        return result_1;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetchOverallFindingData");
    }
}

// Function สำหรับ Check ว่า overall_finding_name มีข้อมูลซ้ำใน Database หรือไม่ ?
exports.checkOverallFindingName = async (overall_finding_name, fullname) => {
    try {
        const sql_1 = `SELECT overall_finding_name FROM overall_finding WHERE overall_finding_name = ?`
        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        const [checkForOverallFindingNameResult] = await db_m.query(sql_1, [overall_finding_name]);
        const endTime_1 = Date.now(); // เวลาสิ้นสุดหลังการ Query
        const durationInMinutes_1 = ((endTime_1 - startTime_1) / 1000 / 60).toFixed(4); // รวมเวลาเริ่มต้นและสิ้นสุดของการ Query เพื่อมาว่าใช้เวลาในการ Query เท่าไหร่?
        
        const executedSQL_1 = db_m.format(sql_1, [overall_finding_name]).replace(/\s+/g, ' ').trim(); // ลบช่องว่างหน้า-หลัง
        const [typeSqlIdResult] = await db_m.query(`SELECT id FROM type_sqls WHERE type_sql_name = 'SELECT'`);
        const doing_what = 'Check ว่า overall_finding_name มีข้อมูลซ้ำใน Database หรือไม่';

        await db_m.query(
            `
                INSERT INTO log_overall_finding (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                VALUES(?, ?, ?, ?, ?, ?)
            `,
            [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, fullname, fullname]
        );

        return checkForOverallFindingNameResult.length > 0;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkOverallFindingName");
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
                INSERT INTO log_overall_finding (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
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

// Function สำหรับ Create ข้อมูลไปยัง Table overall_finding
exports.addOverallFindingData = async (data, fullname) => {
    try {
        const { overall_finding_name, patient_services_id } = data;
        // const changeOverallFindingName = await capitalizeFirstLetter(overall_finding_name);
        
        const sql_1 = `
            INSERT INTO 
            overall_finding (
                overall_finding_name, patient_services_id, created_by, updated_by
            )
            VALUES (?, ?, ?, ?)
        `;
        
        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        const [addOverallFindingDataResult] = await db_m.query(
            sql_1, [overall_finding_name, patient_services_id, fullname, fullname]
        );
        const endTime_1 = Date.now(); // เวลาสิ้นสุดหลังการ Query
        const durationInMinutes_1 = ((endTime_1 - startTime_1) / 1000 / 60).toFixed(4); // รวมเวลาเริ่มต้นและสิ้นสุดของการ Query เพื่อมาว่าใช้เวลาในการ Query เท่าไหร่?
        
        const executedSQL_1 = db_m.format(
            sql_1, [overall_finding_name, patient_services_id, fullname, fullname]
        ).replace(/\s+/g, ' ').trim(); // ลบช่องว่างหน้า-หลัง
        
        const [typeSqlIdResult] = await db_m.query(`SELECT id FROM type_sqls WHERE type_sql_name = 'INSERT'`);
        const doing_what = 'บันทึกข้อมูล';

        await db_m.query(
            `
                INSERT INTO log_overall_finding (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                VALUES (?, ?, ?, ?, ?, ?)
            `,
            [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, fullname, fullname]
        );

        return addOverallFindingDataResult.affectedRows > 0;

    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to addOverallFindingData");
    }
}

// Function สำหรับ Check ID ว่ามีข้อมูล ID นี้อยู่ใน Table overall_finding หรือไม่ ?
exports.checkIdOverallFindingData = async(id, fullname) => {
    try {
        const sql_1 = 'SELECT id FROM overall_finding WHERE id = ?';
        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        const [checkId] = await db_m.query(sql_1, [id]);
        const endTime_1 = Date.now(); // เวลาสิ้นสุดหลังการ Query
        const durationInMinutes_1 = ((endTime_1 - startTime_1) / 1000 / 60).toFixed(4); // รวมเวลาเริ่มต้นและสิ้นสุดของการ Query เพื่อมาว่าใช้เวลาในการ Query เท่าไหร่?
        
        const executedSQL_1 = db_m.format(sql_1, [id]).replace(/\s+/g, ' ').trim(); // ลบช่องว่างหน้า-หลัง
        const [typeSqlIdResult] = await db_m.query(`SELECT id FROM type_sqls WHERE type_sql_name = 'SELECT'`);
        const doing_what = 'Check ID ว่ามีข้อมูล ID นี้อยู่ใน Table overall_finding หรือไม่';

        await db_m.query(
            `
                INSERT INTO log_overall_finding (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                VALUES(?, ?, ?, ?, ?, ?)
            `,
            [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, fullname, fullname]
        );

        return checkId.length > 0;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkIdOverallFindingData");
    }
}

// Function สำหรับ Update ข้อมูลไปยัง Table overall_finding
exports.updateOverallFindingData = async(id, data, fullname) => {
    try{
        const { overall_finding_name, patient_services_id } = data;

        const sql_1 = `
            UPDATE overall_finding 
            SET 
                overall_finding_name = ?,
                patient_services_id = ?,
                updated_by = ?
            WHERE id = ?
        `;
        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        const [updateOverallFindingDataResult] = await db_m.query(
            sql_1, [overall_finding_name, patient_services_id, fullname, id]
        );
        const endTime_1 = Date.now(); // เวลาสิ้นสุดหลังการ Query
        const durationInMinutes_1 = ((endTime_1 - startTime_1) / 1000 / 60).toFixed(4); // รวมเวลาเริ่มต้นและสิ้นสุดของการ Query เพื่อมาว่าใช้เวลาในการ Query เท่าไหร่?
        
        const executedSQL_1 = db_m.format(
            sql_1, [overall_finding_name, patient_services_id, fullname, id]
        ).replace(/\s+/g, ' ').trim(); // ลบช่องว่างหน้า-หลัง
        
        const [typeSqlIdResult] = await db_m.query(`SELECT id FROM type_sqls WHERE type_sql_name = 'UPDATE'`);
        const doing_what = 'อัพเดทข้อมูล';

        await db_m.query(
            `
                INSERT INTO log_overall_finding (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                VALUES (?, ?, ?, ?, ?, ?)
            `,
            [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, fullname, fullname]
        );

        return updateOverallFindingDataResult.affectedRows > 0;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to updateContentOfMedicalRecordData");
    }
}

// Function สำหรับ Delete ข้อมูลที่อยู่บน Table overall_finding
exports.removeOverallFindingData = async (id, fullname) => {
    try {
        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        const sql_1 = `
            DELETE FROM overall_finding WHERE id = ?
        `;
        // ลบข้อมูลจากตาราง overall_finding
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
                    INSERT INTO log_overall_finding (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                    VALUES(?, ?, ?, ?, ?, ?)
                `,
                [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, fullname, fullname]
            );

            // หาค่า MAX(id) จากตาราง overall_finding เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db_m.query('SELECT MAX(id) AS maxId FROM overall_finding');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db_m.query('ALTER TABLE overall_finding AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removing removeOverallFindingData:', err.message);
        throw new Error('Failed to remove removeOverallFindingData');
    }
}