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
exports.getAllDataContentOfMedicalRecord = async (req, res) => {
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
exports.addDataContentOfMedicalRecord = async (req, res) => {
    try {
        const { 
            content_of_medical_record_name, 
            na_type,
            missing_type,
            no_type,
            criterion_number_1_type, 
            criterion_number_2_type, 
            criterion_number_3_type, 
            criterion_number_4_type, 
            criterion_number_5_type, 
            criterion_number_6_type, 
            criterion_number_7_type, 
            criterion_number_8_type, 
            criterion_number_9_type, 
            points_deducted_type, 
            patient_services_id
        } = req.body;
        const { fullname } = req.user[0];

        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!content_of_medical_record_name || !patient_services_id) {
            return msg(res, 400, { message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        const isEnglishOnlyResult = await isEnglishOnly(content_of_medical_record_name);
        if(!isEnglishOnlyResult) return msg(res, 400, { message: 'กรุณากรอกเป็นภาษาอังกฤษเท่านั้น!' });

        const isBooleanNaTypeResult = await isBoolean(na_type);
        if(!isBooleanNaTypeResult) return msg(res, 400, { message: 'na_type ต้องกรอกเป็น Boolean เท่านั้น!' });
        
        const isBooleanMissingTypeResult = await isBoolean(missing_type);
        if(!isBooleanMissingTypeResult) return msg(res, 400, { message: 'missing_type ต้องกรอกเป็น Boolean เท่านั้น!' });
        
        const isBooleanNoTypeResult = await isBoolean(no_type);
        if(!isBooleanNoTypeResult) return msg(res, 400, { message: 'no_type ต้องกรอกเป็น Boolean เท่านั้น!' });
        
        const isBooleanCriterionNumber1TypeResult = await isBoolean(criterion_number_1_type);
        if(!isBooleanCriterionNumber1TypeResult) return msg(res, 400, { message: 'criterion_number_1_type ต้องกรอกเป็น Boolean เท่านั้น!' });
        
        const isBooleanCriterionNumber2TypeResult = await isBoolean(criterion_number_2_type);
        if(!isBooleanCriterionNumber2TypeResult) return msg(res, 400, { message: 'criterion_number_2_type ต้องกรอกเป็น Boolean เท่านั้น!' });

        const isBooleanCriterionNumber3TypeResult = await isBoolean(criterion_number_3_type);
        if(!isBooleanCriterionNumber3TypeResult) return msg(res, 400, { message: 'criterion_number_3_type ต้องกรอกเป็น Boolean เท่านั้น!' });

        const isBooleanCriterionNumber4TypeResult = await isBoolean(criterion_number_4_type);
        if(!isBooleanCriterionNumber4TypeResult) return msg(res, 400, { message: 'criterion_number_4_type ต้องกรอกเป็น Boolean เท่านั้น!' });

        const isBooleanCriterionNumber5TypeResult = await isBoolean(criterion_number_5_type);
        if(!isBooleanCriterionNumber5TypeResult) return msg(res, 400, { message: 'criterion_number_5_type ต้องกรอกเป็น Boolean เท่านั้น!' });

        const isBooleanCriterionNumber6TypeResult = await isBoolean(criterion_number_6_type);
        if(!isBooleanCriterionNumber6TypeResult) return msg(res, 400, { message: 'criterion_number_6_type ต้องกรอกเป็น Boolean เท่านั้น!' });

        const isBooleanCriterionNumber7TypeResult = await isBoolean(criterion_number_7_type);
        if(!isBooleanCriterionNumber7TypeResult) return msg(res, 400, { message: 'criterion_number_7_type ต้องกรอกเป็น Boolean เท่านั้น!' });

        const isBooleanCriterionNumber8TypeResult = await isBoolean(criterion_number_8_type);
        if(!isBooleanCriterionNumber8TypeResult) return msg(res, 400, { message: 'criterion_number_8_type ต้องกรอกเป็น Boolean เท่านั้น!' });

        const isBooleanCriterionNumber9TypeResult = await isBoolean(criterion_number_9_type);
        if(!isBooleanCriterionNumber9TypeResult) return msg(res, 400, { message: 'criterion_number_9_type ต้องกรอกเป็น Boolean เท่านั้น!' });
        
        const isBooleanPoinstDeductedTypeResult = await isBoolean(points_deducted_type);
        if(!isBooleanPoinstDeductedTypeResult) return msg(res, 400, { message: 'points_deducted_type ต้องกรอกเป็น Boolean เท่านั้น!' });

        // Check ว่ามี content_of_medical_record_name ซ้ำในระบบหรือไม่
        const checkContentOfMedicalRecordNameResult = await checkContentOfMedicalRecordName(content_of_medical_record_name, fullname);
        if(checkContentOfMedicalRecordNameResult) return msg(res, 409, { message: 'พบข้อมูล content_of_medical_record_name ซ้ำในระบบกรุณาตรวจสอบข้อมูล!!' });

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

// ใช้สำหรับอัพเดทข้อมูล ContentOfMedicalRecords (ตารางเก็บเนื้อหาเวชระเบียน)
exports.updateDataContentOfMedicalRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullname } = req.user[0];
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdContentOfMedicalRecordDataResult = await checkIdContentOfMedicalRecordData(id, fullname);
        if (!checkIdContentOfMedicalRecordDataResult) return msg(res, 404, { message: 'ไม่มี (id ตารางเก็บเนื้อหาเวชระเบียน) อยู่ในระบบ!' });

        const { 
            content_of_medical_record_name, 
            na_type,
            missing_type,
            no_type,
            criterion_number_1_type, 
            criterion_number_2_type, 
            criterion_number_3_type, 
            criterion_number_4_type, 
            criterion_number_5_type, 
            criterion_number_6_type, 
            criterion_number_7_type, 
            criterion_number_8_type, 
            criterion_number_9_type, 
            points_deducted_type,
            patient_services_id
        } = req.body;
        
        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!content_of_medical_record_name || !patient_services_id) {
            return msg(res, 400, { message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        const isEnglishOnlyResult = await isEnglishOnly(content_of_medical_record_name);
        if(!isEnglishOnlyResult) return msg(res, 400, { message: 'กรุณากรอกเป็นภาษาอังกฤษเท่านั้น!' });

        const isBooleanNaTypeResult = await isBoolean(na_type);
        if(!isBooleanNaTypeResult) return msg(res, 400, { message: 'na_type ต้องกรอกเป็น Boolean เท่านั้น!' });

        const isBooleanMissingTypeResult = await isBoolean(missing_type);
        if(!isBooleanMissingTypeResult) return msg(res, 400, { message: 'missing_type ต้องกรอกเป็น Boolean เท่านั้น!' });

        const isBooleanNoTypeResult = await isBoolean(no_type);
        if(!isBooleanNoTypeResult) return msg(res, 400, { message: 'no_type ต้องกรอกเป็น Boolean เท่านั้น!' });

        const isBooleanCriterionNumber1TypeResult = await isBoolean(criterion_number_1_type);
        if(!isBooleanCriterionNumber1TypeResult) return msg(res, 400, { message: 'criterion_number_1_type ต้องกรอกเป็น Boolean เท่านั้น!' });

        const isBooleanCriterionNumber2TypeResult = await isBoolean(criterion_number_2_type);
        if(!isBooleanCriterionNumber2TypeResult) return msg(res, 400, { message: 'criterion_number_2_type ต้องกรอกเป็น Boolean เท่านั้น!' });

        const isBooleanCriterionNumber3TypeResult = await isBoolean(criterion_number_3_type);
        if(!isBooleanCriterionNumber3TypeResult) return msg(res, 400, { message: 'criterion_number_3_type ต้องกรอกเป็น Boolean เท่านั้น!' });

        const isBooleanCriterionNumber4TypeResult = await isBoolean(criterion_number_4_type);
        if(!isBooleanCriterionNumber4TypeResult) return msg(res, 400, { message: 'criterion_number_4_type ต้องกรอกเป็น Boolean เท่านั้น!' });

        const isBooleanCriterionNumber5TypeResult = await isBoolean(criterion_number_5_type);
        if(!isBooleanCriterionNumber5TypeResult) return msg(res, 400, { message: 'criterion_number_5_type ต้องกรอกเป็น Boolean เท่านั้น!' });

        const isBooleanCriterionNumber6TypeResult = await isBoolean(criterion_number_6_type);
        if(!isBooleanCriterionNumber6TypeResult) return msg(res, 400, { message: 'criterion_number_6_type ต้องกรอกเป็น Boolean เท่านั้น!' });

        const isBooleanCriterionNumber7TypeResult = await isBoolean(criterion_number_7_type);
        if(!isBooleanCriterionNumber7TypeResult) return msg(res, 400, { message: 'criterion_number_7_type ต้องกรอกเป็น Boolean เท่านั้น!' });

        const isBooleanCriterionNumber8TypeResult = await isBoolean(criterion_number_8_type);
        if(!isBooleanCriterionNumber8TypeResult) return msg(res, 400, { message: 'criterion_number_8_type ต้องกรอกเป็น Boolean เท่านั้น!' });

        const isBooleanCriterionNumber9TypeResult = await isBoolean(criterion_number_9_type);
        if(!isBooleanCriterionNumber9TypeResult) return msg(res, 400, { message: 'criterion_number_9_type ต้องกรอกเป็น Boolean เท่านั้น!' });

        const isBooleanPoinstDeductedTypeResult = await isBoolean(points_deducted_type);
        if(!isBooleanPoinstDeductedTypeResult) return msg(res, 400, { message: 'points_deducted_type ต้องกรอกเป็น Boolean เท่านั้น!' });

        // Check ว่ามี content_of_medical_record_name ซ้ำในระบบหรือไม่
        const checkContentOfMedicalRecordNameResult = await checkContentOfMedicalRecordName(content_of_medical_record_name, fullname);
        if(checkContentOfMedicalRecordNameResult) return msg(res, 409, { message: 'พบข้อมูล content_of_medical_record_name ซ้ำในระบบกรุณาตรวจสอบข้อมูล!!' });

        const checkPatientServicesIdResult = await checkPatientServicesId(patient_services_id, fullname);
        if(!checkPatientServicesIdResult) return msg(res, 404, { message: 'ไม่มีข้อมูลใน patient_services กรุณาเพิ่มข้อมูลก่อน!!' });

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updateContentOfMedicalRecordDataResult = await updateContentOfMedicalRecordData(id, req.body, fullname);
        if (updateContentOfMedicalRecordDataResult) {
            return msg(res, 200, { message: 'อัพเดทข้อมูลเสร็จสิ้น!' });
        } else {
            return msg(res, 400, { message: 'อัพเดทข้อมูลไม่สำเร็จ!' });
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, { message: err.message }); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับลบข้อมูล ContentOfMedicalRecords( ตารางเก็บเนื้อหาเวชระเบียน )
exports.removeDataContentOfMedicalRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullname } = req.user[0];
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdContentOfMedicalRecordDataResult = await checkIdContentOfMedicalRecordData(id, fullname);
        if (!checkIdContentOfMedicalRecordDataResult) {
            return msg(res, 404, { message: 'ไม่มี (id ตารางเก็บเนื้อหาเวชระเบียน) อยู่ในระบบ!' });
        }

        const removeContentOfMedicalRecordDataResult = await removeContentOfMedicalRecordData(id, fullname);
        if (removeContentOfMedicalRecordDataResult) {
            return msg(res, 200, { message: 'ลบข้อมูลเสร็จสิ้น!' });
        } else {
            return msg(res, 400, { message: 'ลบข้อมูลไม่สำเร็จ!' });
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, { message: err });
    }
}