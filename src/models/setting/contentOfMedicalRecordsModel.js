const db_m = require('../../config/db_m');
const { capitalizeFirstLetter } = require('../../utils/allCheck');

// Function สำหรับดึงข้อมูล Table content_of_medical_records จากฐานข้อมูล
exports.fetchContentOfMedicalRecordsData = async(fullname) => {
    try {
        const sql_1 = `
            SELECT 
                comr.id, 
                comr.content_of_medical_record_name,
                comr.na_type,
                comr.missing_type,
                comr.no_type,
                comr.criterion_number_1_type,
                comr.criterion_number_2_type,
                comr.criterion_number_3_type,
                comr.criterion_number_4_type,
                comr.criterion_number_5_type,
                comr.criterion_number_6_type,
                comr.criterion_number_7_type,
                comr.criterion_number_8_type,
                comr.criterion_number_9_type,
                comr.points_deducted_type,
                ps.patient_services_name_english,
                ps.patient_services_name_thai,
                comr.created_at,
                comr.created_by,
                comr.updated_at,
                comr.updated_by
            FROM content_of_medical_records AS comr
            LEFT OUTER JOIN patient_services AS ps ON comr.patient_services_id = ps.id
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
                INSERT INTO log_content_of_medical_records (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                VALUES(?, ?, ?, ?, ?, ?)
            `,
            [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, fullname, fullname]
        );
        return result_1;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetchContentOfMedicalRecordsData");
    }
}

// Function สำหรับ Check ว่า content_of_medical_record_name มีข้อมูลซ้ำใน Database หรือไม่ ?
exports.checkContentOfMedicalRecordName = async (content_of_medical_record_name, fullname) => {
    try {
        const sql_1 = `SELECT content_of_medical_record_name FROM content_of_medical_records WHERE content_of_medical_record_name = ?`
        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        const [checkForDeplicateInformationResult] = await db_m.query(sql_1, [content_of_medical_record_name]);
        const endTime_1 = Date.now(); // เวลาสิ้นสุดหลังการ Query
        const durationInMinutes_1 = ((endTime_1 - startTime_1) / 1000 / 60).toFixed(4); // รวมเวลาเริ่มต้นและสิ้นสุดของการ Query เพื่อมาว่าใช้เวลาในการ Query เท่าไหร่?
        
        const executedSQL_1 = db_m.format(sql_1, [content_of_medical_record_name]).replace(/\s+/g, ' ').trim(); // ลบช่องว่างหน้า-หลัง
        const [typeSqlIdResult] = await db_m.query(`SELECT id FROM type_sqls WHERE type_sql_name = 'SELECT'`);
        const doing_what = 'Check ว่า content_of_medical_record_name มีข้อมูลซ้ำใน Database หรือไม่';

        await db_m.query(
            `
                INSERT INTO log_content_of_medical_records (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                VALUES(?, ?, ?, ?, ?, ?)
            `,
            [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, fullname, fullname]
        );

        return checkForDeplicateInformationResult.length > 0;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkContentOfMedicalRecordName");
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
                INSERT INTO log_content_of_medical_records (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
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

// Function สำหรับ Create ข้อมูลไปยัง Table content_of_medical_records
exports.addContentOfMedicalRecordData = async (data, fullname) => {
    try {
        const { content_of_medical_record_name, na_type, points_deducted_type, patient_services_id } = data;
        const changeContentOfMedicalRecordName = await capitalizeFirstLetter(content_of_medical_record_name);
        
        const sql_1 = `
            INSERT INTO 
            content_of_medical_records (
                content_of_medical_record_name, na_type, points_deducted_type, patient_services_id, created_by, updated_by
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        const [addContentOfMedicalRecordDataResult] = await db_m.query(
            sql_1, [changeContentOfMedicalRecordName, na_type, points_deducted_type, patient_services_id, fullname, fullname]
        );
        const endTime_1 = Date.now(); // เวลาสิ้นสุดหลังการ Query
        const durationInMinutes_1 = ((endTime_1 - startTime_1) / 1000 / 60).toFixed(4); // รวมเวลาเริ่มต้นและสิ้นสุดของการ Query เพื่อมาว่าใช้เวลาในการ Query เท่าไหร่?
        
        const executedSQL_1 = db_m.format(
            sql_1, [changeContentOfMedicalRecordName, na_type, points_deducted_type, patient_services_id, fullname, fullname]
        ).replace(/\s+/g, ' ').trim(); // ลบช่องว่างหน้า-หลัง
        
        const [typeSqlIdResult] = await db_m.query(`SELECT id FROM type_sqls WHERE type_sql_name = 'INSERT'`);
        const doing_what = 'บันทึกข้อมูล';

        await db_m.query(
            `
                INSERT INTO log_content_of_medical_records (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                VALUES (?, ?, ?, ?, ?, ?)
            `,
            [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, fullname, fullname]
        );

        return addContentOfMedicalRecordDataResult.affectedRows > 0;

    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to addContentOfMedicalRecordData");
    }
}

// Function สำหรับ Check ID ว่ามีข้อมูล ID นี้อยู่ใน Table content_of_medical_records หรือไม่ ?
exports.checkIdContentOfMedicalRecordData = async(id, fullname) => {
    try {
        const sql_1 = 'SELECT id FROM content_of_medical_records WHERE id = ?';
        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        const [checkId] = await db_m.query(sql_1, [id]);
        const endTime_1 = Date.now(); // เวลาสิ้นสุดหลังการ Query
        const durationInMinutes_1 = ((endTime_1 - startTime_1) / 1000 / 60).toFixed(4); // รวมเวลาเริ่มต้นและสิ้นสุดของการ Query เพื่อมาว่าใช้เวลาในการ Query เท่าไหร่?
        
        const executedSQL_1 = db_m.format(sql_1, [id]).replace(/\s+/g, ' ').trim(); // ลบช่องว่างหน้า-หลัง
        const [typeSqlIdResult] = await db_m.query(`SELECT id FROM type_sqls WHERE type_sql_name = 'SELECT'`);
        const doing_what = 'Check ID ว่ามีข้อมูล ID นี้อยู่ใน Table content_of_medical_records หรือไม่';

        await db_m.query(
            `
                INSERT INTO log_content_of_medical_records (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                VALUES(?, ?, ?, ?, ?, ?)
            `,
            [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, fullname, fullname]
        );

        return checkId.length > 0;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to checkIdContentOfMedicalRecordData");
    }
}

// Function สำหรับ Update ข้อมูลไปยัง Table content_of_medical_records
exports.updateContentOfMedicalRecordData = async(id, data, fullname) => {
    try{
        const { content_of_medical_record_name, na_type, points_deducted_type, patient_services_id } = data;
        const changeContentOfMedicalRecordName = await capitalizeFirstLetter(content_of_medical_record_name);
        const sql_1 = `
            UPDATE content_of_medical_records 
            SET 
                content_of_medical_record_name = ?,
                na_type = ?,
                points_deducted_type = ?,
                patient_services_id = ?,
                updated_by = ?
            WHERE id = ?
        `;
        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        const [updateContentOfMedicalRecordDataResult] = await db_m.query(
            sql_1, [changeContentOfMedicalRecordName, na_type, points_deducted_type, patient_services_id, fullname, id]
        );
        const endTime_1 = Date.now(); // เวลาสิ้นสุดหลังการ Query
        const durationInMinutes_1 = ((endTime_1 - startTime_1) / 1000 / 60).toFixed(4); // รวมเวลาเริ่มต้นและสิ้นสุดของการ Query เพื่อมาว่าใช้เวลาในการ Query เท่าไหร่?
        
        const executedSQL_1 = db_m.format(
            sql_1, [changeContentOfMedicalRecordName, na_type, points_deducted_type, patient_services_id, fullname, id]
        ).replace(/\s+/g, ' ').trim(); // ลบช่องว่างหน้า-หลัง
        
        const [typeSqlIdResult] = await db_m.query(`SELECT id FROM type_sqls WHERE type_sql_name = 'UPDATE'`);
        const doing_what = 'อัพเดทข้อมูล';

        await db_m.query(
            `
                INSERT INTO log_content_of_medical_records (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                VALUES (?, ?, ?, ?, ?, ?)
            `,
            [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, fullname, fullname]
        );

        return updateContentOfMedicalRecordDataResult.affectedRows > 0;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to updateContentOfMedicalRecordData");
    }
}

// Function สำหรับ Delete ข้อมูลที่อยู่บน Table content_of_medical_records
exports.removeContentOfMedicalRecordData = async (id, fullname) => {
    try {
        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        const sql_1 = `
            DELETE FROM content_of_medical_records WHERE id = ?
        `;
        // ลบข้อมูลจากตาราง content_of_medical_records
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
                    INSERT INTO log_content_of_medical_records (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                    VALUES(?, ?, ?, ?, ?, ?)
                `,
                [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, fullname, fullname]
            );

            // หาค่า MAX(id) จากตาราง content_of_medical_records เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db_m.query('SELECT MAX(id) AS maxId FROM content_of_medical_records');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db_m.query('ALTER TABLE content_of_medical_records AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removing content of medical record data:', err.message);
        throw new Error('Failed to remove content of medical record data');
    }
};