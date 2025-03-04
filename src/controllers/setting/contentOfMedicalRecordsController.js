const {
    fetchContentOfMedicalRecordsData,
    checkContentOfMedicalRecordName,
    checkPatientServicesId,
    addContentOfMedicalRecordData,
    checkIdContentOfMedicalRecordData,
    updateContentOfMedicalRecordData,
    removeContentOfMedicalRecordData
} = require('../../models/setting/contentOfMedicalRecordsModel');
const { msg } = require('../../utils/message');
const { isEnglishOnly, isBoolean } = require('../../utils/allCheck');

// ใช้สำหรับดึงข้อมูล ContentOfMedicalRecords (ตารางเก็บเนื้อหาเวชระเบียน)
exports.getAllDataContentOfMedicalRecords = async (req, res) => {
    try {
        const { fullname } = req.user[0];
        const fetchContentOfMedicalRecordsDataResult = await fetchContentOfMedicalRecordsData(fullname);
        if (!Array.isArray(fetchContentOfMedicalRecordsDataResult) || fetchContentOfMedicalRecordsDataResult.length === 0) {
            return msg(res, 404, { message: "No data found" });
        }
        return msg(res, 200, { data: fetchContentOfMedicalRecordsDataResult });
    } catch (error) {
        console.error("Error fetch data:", error.message);
        return msg(res, 500, { message: "Internal Server Error" });
    }
}

// ใช้สำหรับเพิ่มข้อมูล ContentOfMedicalRecords (ตารางเก็บเนื้อหาเวชระเบียน)
exports.addDataContentOfMedicalRecords = async (req, res) => {
    try {
        const { content_of_medical_record_name, na_type, points_deducted_type, patient_services_id } = req.body;
        const { fullname } = req.user[0];

        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!content_of_medical_record_name || !na_type || !points_deducted_type || !patient_services_id) {
            return msg(res, 400, { message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        const isEnglishOnlyResult = await isEnglishOnly(content_of_medical_record_name);
        if(!isEnglishOnlyResult) return msg(res, 400, { message: 'กรุณากรอกเป็นภาษาอังกฤษเท่านั้น!' });

        const isBooleanNaResult = await isBoolean(na_type);
        if(!isBooleanNaResult) return msg(res, 400, { message: 'na_type ต้องกรอกเป็น Boolean เท่านั้น!' });
        
        const isBooleanPoinstDeductedResult = await isBoolean(points_deducted_type);
        if(!isBooleanPoinstDeductedResult) return msg(res, 400, { message: 'points_deducted_type ต้องกรอกเป็น Boolean เท่านั้น!' });

        // Check ว่ามี content_of_medical_record_name ซ้ำในระบบหรือไม่
        const checkContentOfMedicalRecordNameResult = await checkContentOfMedicalRecordName(content_of_medical_record_name, fullname);
        if(checkContentOfMedicalRecordNameResult) return msg(res, 409, { message: 'พบข้อมูลซ้ำในระบบกรุณาตรวจสอบข้อมูล!!' });

        const checkPatientServicesIdResult = await checkPatientServicesId(patient_services_id, fullname);
        if(!checkPatientServicesIdResult) return msg(res, 404, { message: 'ไม่มีข้อมูลใน patient_services กรุณาเพิ่มข้อมูลก่อน!!' });

        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addContentOfMedicalRecordDataResult = await addContentOfMedicalRecordData(req.body, fullname);
        if (addContentOfMedicalRecordDataResult) {
            return msg(res, 200, { message: 'บันทึกข้อมูลเสร็จสิ้น!' });
        } else {
            return msg(res, 400, { message: 'บันทึกข้อมูลไม่สำเร็จ!' });
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, { message: err.message }); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};