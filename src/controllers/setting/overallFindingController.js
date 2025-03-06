const {
    fetchOverallFindingData,
    checkOverallFindingName,
    checkPatientServicesId,
    addOverallFindingData,
    checkIdOverallFindingData,
    updateOverallFindingData,
    removeOverallFindingData
} = require('../../models/setting/overallFindingModel');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล OverallFinding (ตารางเก็บการค้นพบโดยรวม)
exports.getAllDataOverallFinding = async (req, res) => {
    try {
        const { fullname } = req.user[0];
        const fetchOverallFindingDataResult = await fetchOverallFindingData(fullname);
        if (!Array.isArray(fetchOverallFindingDataResult) || fetchOverallFindingDataResult.length === 0) {
            return msg(res, 404, { message: "No data found" });
        }
        return msg(res, 200, { data: fetchOverallFindingDataResult });
    } catch (error) {
        console.error("Error fetch data:", error.message);
        return msg(res, 500, { message: "Internal Server Error" });
    }
}

// ใช้สำหรับเพิ่มข้อมูล OverallFinding (ตารางเก็บการค้นพบโดยรวม)
exports.addDataOverallFinding = async (req, res) => {
    try {
        const { overall_finding_name, patient_services_id } = req.body;
        const { fullname } = req.user[0];

        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!overall_finding_name || !patient_services_id) {
            return msg(res, 400, { message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        // Check ว่ามี overall_finding_name ซ้ำในระบบหรือไม่
        const checkOverallFindingNameResult = await checkOverallFindingName(overall_finding_name, fullname);
        if(checkOverallFindingNameResult) return msg(res, 409, { message: 'พบข้อมูล overall_finding_name ซ้ำในระบบกรุณาตรวจสอบข้อมูล!!' });

        const checkPatientServicesIdResult = await checkPatientServicesId(patient_services_id, fullname);
        if(!checkPatientServicesIdResult) return msg(res, 404, { message: 'ไม่มีข้อมูลใน patient_services กรุณาเพิ่มข้อมูลก่อน!!' });

        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addOverallFindingDataResult = await addOverallFindingData(req.body, fullname);
        if (addOverallFindingDataResult) {
            return msg(res, 200, { message: 'บันทึกข้อมูลเสร็จสิ้น!' });
        } else {
            return msg(res, 400, { message: 'บันทึกข้อมูลไม่สำเร็จ!' });
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, { message: err.message }); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล OverallFinding (ตารางเก็บการค้นพบโดยรวม)
exports.updateDataOverallFinding = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullname } = req.user[0];
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdOverallFindingDataResult = await checkIdOverallFindingData(id, fullname);
        if (!checkIdOverallFindingDataResult) return msg(res, 404, { message: 'ไม่มี (id ตารางเก็บการค้นพบโดยรวม) อยู่ในระบบ!' });

        const { overall_finding_name, patient_services_id } = req.body;

        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!overall_finding_name || !patient_services_id) {
            return msg(res, 400, { message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        // Check ว่ามี overall_finding_name ซ้ำในระบบหรือไม่
        const checkOverallFindingNameResult = await checkOverallFindingName(overall_finding_name, fullname);
        if(checkOverallFindingNameResult) return msg(res, 409, { message: 'พบข้อมูล overall_finding_name ซ้ำในระบบกรุณาตรวจสอบข้อมูล!!' });

        const checkPatientServicesIdResult = await checkPatientServicesId(patient_services_id, fullname);
        if(!checkPatientServicesIdResult) return msg(res, 404, { message: 'ไม่มีข้อมูลใน patient_services กรุณาเพิ่มข้อมูลก่อน!!' });

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updateOverallFindingDataResult = await updateOverallFindingData(id, req.body, fullname);
        if (updateOverallFindingDataResult) {
            return msg(res, 200, { message: 'อัพเดทข้อมูลเสร็จสิ้น!' });
        } else {
            return msg(res, 400, { message: 'อัพเดทข้อมูลไม่สำเร็จ!' });
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, { message: err.message }); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
}

// ใช้สำหรับลบข้อมูล OverallFinding (ตารางเก็บการค้นพบโดยรวม)
exports.removeDataOverallFinding = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullname } = req.user[0];
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdOverallFindingDataResult = await checkIdOverallFindingData(id, fullname);
        if (!checkIdOverallFindingDataResult) {
            return msg(res, 404, { message: 'ไม่มี (id ตารางเก็บการค้นพบโดยรวม) อยู่ในระบบ!' });
        }

        const removeOverallFindingDataResult = await removeOverallFindingData(id, fullname);
        if (removeOverallFindingDataResult) {
            return msg(res, 200, { message: 'ลบข้อมูลเสร็จสิ้น!' });
        } else {
            return msg(res, 400, { message: 'ลบข้อมูลไม่สำเร็จ!' });
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, { message: err });
    }
}