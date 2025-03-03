const db_m = require('../../config/db_m');

// ฟังก์ชันสำหรับดึงข้อมูล Table patient_services จากฐานข้อมูล
exports.fetchPatientServicesData = async() => {
    try {
        const [result] = await db_m.query('SELECT * FROM patient_services');
        return result;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetch patient service data");
    }
}

// Check ว่ามี PatientServicesName บน Table patient_services หรือไม่?
exports.checkPatientServicesNameData = async(patient_services_name) => {
    try {
        const [result] = await db_m.query('SELECT patient_services_name FROM patient_services WHERE patient_services_name = ?', [patient_services_name]);
        return result.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to check patient service name data");
    }
}

// เพิ่มข้อมูลไปยัง Table patient_services
exports.addPatientServicesData = async(data, fullname) => {
    try {
        const { patient_services_name } = data;

        const startTime_1 = Date.now(); // เวลาเริ่มต้นก่อนการ Query
        const sql_1 = `
            INSERT INTO patient_services (patient_services_name, created_by, updated_by)
            VALUES (?, ?, ?)
        `;

        const [result_1] = await db_m.query(sql_1, [patient_services_name, fullname, fullname]);
        const endTime_1 = Date.now(); // เวลาสิ้นสุดหลังการ Query
        const durationInMinutes_1 = ((endTime_1 - startTime_1) / 1000 / 60).toFixed(4); // รวมเวลาเริ่มต้นและสิ้นสุดของการ Query เพื่อมาว่าใช้เวลาในการ Query เท่าไหร่?
        
        const executedSQL_1 = db_m.format(sql_1, [patient_services_name, fullname, fullname]).replace(/\s+/g, ' ').trim(); // ลบช่องว่างหน้า-หลัง
        
        const [typeSqlIdResult] = await db_m.query(`SELECT id FROM type_sqls WHERE type_sql_name = 'INSERT'`);
        const doing_what = 'บันทึกข้อมูล';

        await db_m.query(
            `
                INSERT INTO log_patient_services (type_sqls_id, doing_what, sql_order, query_time, created_by, updated_by)
                VALUES(?, ?, ?, ?, ?, ?)
            `,
            [typeSqlIdResult[0].id, doing_what, executedSQL_1, durationInMinutes_1, fullname, fullname]
        );

        return result_1.affectedRows > 0; // ส่งกลับ true หากมีการเพิ่มข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to add patient service data");
    }
}

// Check ว่ามี ID นี้อยู่ใน Table patient_services หรือไม่?
exports.checkIdPatientServicesData = async (id) => {
    try {
        const [result] = await db_m.query(`SELECT id FROM patient_services WHERE id = ?`, [id]);
        return result.length > 0; // ส่งกลับ true หากพบข้อมูล, false หากไม่พบ
    } catch (err) {
        console.error(err.message);
        throw new Error("ไม่มีข้อมูลในระบบกรุณาตรวจสอบข้อมูล");
    }
};

// อัพเดทข้อมูลไปยัง Table patient_services
exports.updatePatientServicesData = async (id, data, fullname) => {
    try {
        const { patient_services_name } = data;
        const [result] = await db_m.query(
            `
                UPDATE patient_services 
                SET 
                    patient_services_name = ?,
                    updated_by = ?
                WHERE id = ?
            `,
            [patient_services_name, fullname, id]
        );
        return result.affectedRows > 0; // ส่งกลับ true หากมีการอัพเดทข้อมูล, false หากไม่มี
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to update patient service data");
    }
};

// ลบข้อมูลบน Table patient_services
exports.removePatientServicesData = async (id) => {
    try {
        // ลบข้อมูลจากตาราง patient_services
        const [deleteResult] = await db_m.query('DELETE FROM patient_services WHERE id = ?', [id]);

        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (deleteResult.affectedRows > 0) {
            // หาค่า MAX(id) จากตาราง patient_services เพื่อคำนวณค่า AUTO_INCREMENT ใหม่
            const [maxIdResult] = await db_m.query('SELECT MAX(id) AS maxId FROM patient_services');
            const nextAutoIncrement = (maxIdResult[0].maxId || 0) + 1;

            // รีเซ็ตค่า AUTO_INCREMENT
            await db_m.query('ALTER TABLE patient_services AUTO_INCREMENT = ?', [nextAutoIncrement]);

            return true; // ส่งค่ากลับเพื่อบอกว่าการลบและรีเซ็ตสำเร็จ
        }

        return false; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error('Error while removing patient service data:', err.message);
        throw new Error('Failed to remove patient service data');
    }
};