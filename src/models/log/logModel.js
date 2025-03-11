const db_m = require('../../config/db_m');

exports.clearLog = async () => {
    try {
        // ลบข้อมูลจากตาราง log_content_of_medical_records
        const [removeLogContentOfMedicalRecordsResult] = await db_m.query('DELETE FROM log_content_of_medical_records');
        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (removeLogContentOfMedicalRecordsResult.affectedRows > 0) await db_m.query('ALTER TABLE log_content_of_medical_records AUTO_INCREMENT = 1');
        
        // ลบข้อมูลจากตาราง log_login_logout
        const [removeLogLoginLogoutResult] = await db_m.query('DELETE FROM log_login_logout');
        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (removeLogLoginLogoutResult.affectedRows > 0) await db_m.query('ALTER TABLE log_login_logout AUTO_INCREMENT = 1');
        
        // ลบข้อมูลจากตาราง log_overall_finding
        const [removeLogOverallFindingResult] = await db_m.query('DELETE FROM log_overall_finding');
        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (removeLogOverallFindingResult.affectedRows > 0) await db_m.query('ALTER TABLE log_overall_finding AUTO_INCREMENT = 1');
        
        // ลบข้อมูลจากตาราง log_patients
        const [removeLogPatientsResult] = await db_m.query('DELETE FROM log_patients');
        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (removeLogPatientsResult.affectedRows > 0) await db_m.query('ALTER TABLE log_patients AUTO_INCREMENT = 1');
        
        // ลบข้อมูลจากตาราง log_review_status
        const [removeLogReviewStatusResult] = await db_m.query('DELETE FROM log_review_status');
        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (removeLogReviewStatusResult.affectedRows > 0) await db_m.query('ALTER TABLE log_review_status AUTO_INCREMENT = 1');

        // ลบข้อมูลจากตาราง log_review_status
        const [removeLogPatientServicesResult] = await db_m.query('DELETE FROM log_patient_services');
        // ตรวจสอบว่ามีข้อมูลถูกลบหรือไม่
        if (removeLogPatientServicesResult.affectedRows > 0) await db_m.query('ALTER TABLE log_patient_services AUTO_INCREMENT = 1');

        return true; // หากไม่มีข้อมูลถูกลบ
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to clear log data");
    }
}

exports.fetchDataLogContentOfMedicalRecordsAll = async () => {
    try {
        const [result] = await db_m.query('SELECT * FROM log_content_of_medical_records');
        return result;
    } catch (err) {
        console.error(err.message);
        throw new Error("Failed to fetchDataLogContentOfMedicalRecordsAll");
    }
}