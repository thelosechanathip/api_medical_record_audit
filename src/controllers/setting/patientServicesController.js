const {
    fetchPatientServicesData,
    checkPatientServicesNameEnglishData,
    checkPatientServicesNameThaiData,
    addPatientServicesData,
    checkIdPatientServicesData,
    updatePatientServicesData,
    removePatientServicesData
} = require('../../models/setting/patientServicesModel');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล PatientServices (ตารางเก็บคำระบุกลุ่มคนไข้)
exports.getAllDataPatientServices = async (req, res) => {
    try {
        const { fullname } = req.user[0];
        const fetchPatientServicesDataResult = await fetchPatientServicesData(fullname);
        if (!Array.isArray(fetchPatientServicesDataResult) || fetchPatientServicesDataResult.length === 0) {
            return msg(res, 404, { message: "No data found" });
        }
        return msg(res, 200, { data: fetchPatientServicesDataResult });
    } catch (error) {
        console.error("Error fetch data:", error.message);
        return msg(res, 500, { message: "Internal Server Error" });
    }
}

// ใช้สำหรับเพิ่มข้อมูล PatientServices (ตารางเก็บคำระบุกลุ่มคนไข้)
exports.addDataPatientServices = async (req, res) => {
    try {
        const { patient_services_name_english, patient_services_name_thai } = req.body;
        const { fullname } = req.user[0];

        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!patient_services_name_english || !patient_services_name_thai) {
            return msg(res, 400, { message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        // Check patient_services_name_english ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkPatientServicesNameEnglishDataResult = await checkPatientServicesNameEnglishData(patient_services_name_english);
        if (checkPatientServicesNameEnglishDataResult) {
            return msg(res, 400, { message: 'มี PatientServices (ตารางเก็บคำระบุกลุ่มคนไข้ ชื่ออังกฤษ) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!' });
        }
        
        // Check patient_services_name_thai ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkPatientServicesNameThaiDataResult = await checkPatientServicesNameThaiData(patient_services_name_thai);
        if (checkPatientServicesNameThaiDataResult) {
            return msg(res, 400, { message: 'มี PatientServices (ตารางเก็บคำระบุกลุ่มคนไข้ ชื่อไทย) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!' });
        }

        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addPatientServicesDataResult = await addPatientServicesData(req.body, fullname);
        if (addPatientServicesDataResult) {
            return msg(res, 200, { message: 'บันทึกข้อมูลเสร็จสิ้น!' });
        } else {
            return msg(res, 400, { message: 'บันทึกข้อมูลไม่สำเร็จ!' });
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, { message: err.message }); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล PatientServices (ตารางเก็บคำระบุกลุ่มคนไข้)
exports.updateDataPatientServices = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdPatientServicesDataResult = await checkIdPatientServicesData(id);
        if (!checkIdPatientServicesDataResult) {
            return msg(res, 404, { message: 'ไม่มี (ตารางเก็บคำระบุกลุ่มคนไข้) อยู่ในระบบ!' });
        }

        const { patient_services_name_english, patient_services_name_thai } = req.body;
        const { fullname } = req.user[0];

        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!patient_services_name_english || !patient_services_name_thai) {
            return msg(res, 400, { message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        // Check patient_services_name_english ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkPatientServicesNameEnglishDataResult = await checkPatientServicesNameEnglishData(patient_services_name_english);
        if (checkPatientServicesNameEnglishDataResult) {
            return msg(res, 400, { message: 'มี PatientServices (ตารางเก็บคำระบุกลุ่มคนไข้ ชื่ออังกฤษ) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!' });
        }
        
        // Check patient_services_name_thai ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkPatientServicesNameThaiDataResult = await checkPatientServicesNameThaiData(patient_services_name_thai);
        if (checkPatientServicesNameThaiDataResult) {
            return msg(res, 400, { message: 'มี PatientServices (ตารางเก็บคำระบุกลุ่มคนไข้ ชื่อไทย) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!' });
        }

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updatePatientServicesDataResult = await updatePatientServicesData(id, req.body, fullname);
        if (updatePatientServicesDataResult) {
            return msg(res, 200, { message: 'อัพเดทข้อมูลเสร็จสิ้น!' });
        } else {
            return msg(res, 400, { message: 'อัพเดทข้อมูลไม่สำเร็จ!' });
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, { message: err.message }); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับลบข้อมูล PatientServices( ตารางเก็บคำระบุกลุ่มคนไข้ )
exports.removeDataPatientServices = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullname } = req.user[0];
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdPatientServicesDataResult = await checkIdPatientServicesData(id);
        if (!checkIdPatientServicesDataResult) {
            return msg(res, 404, { message: 'ไม่มี (ตารางเก็บคำระบุกลุ่มคนไข้) อยู่ในระบบ!' });
        }

        const removePatientServicesDataResult = await removePatientServicesData(id, fullname);
        if (removePatientServicesDataResult) {
            return msg(res, 200, { message: 'ลบข้อมูลเสร็จสิ้น!' });
        } else {
            return msg(res, 400, { message: 'ลบข้อมูลไม่สำเร็จ!' });
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, { message: err });
    }
}