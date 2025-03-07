const {
    fetchReviewStatusData,
    checkReviewStatusName,
    checkReviewStatusDescription,
    checkPatientServicesId,
    addReviewStatusData,
    checkIdReviewStatusData,
    updateReviewStatusData,
    removeReviewStatusData
} = require('../../models/setting/reviewStatusModel');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล ReviewStatus (ตารางเก็บสถานะการตรวจสอบ)
exports.getAllDataReviewStatus = async (req, res) => {
    try {
        const { fullname } = req.user[0];
        const fetchReviewStatusDataResult = await fetchReviewStatusData(fullname);
        if (!Array.isArray(fetchReviewStatusDataResult) || fetchReviewStatusDataResult.length === 0) {
            return msg(res, 404, { message: "No data found" });
        }
        return msg(res, 200, { data: fetchReviewStatusDataResult });
    } catch (error) {
        console.error("Error fetch data:", error.message);
        return msg(res, 500, { message: "Internal Server Error" });
    }
}

// ใช้สำหรับเพิ่มข้อมูล ReviewStatus (ตารางเก็บสถานะการตรวจสอบ)
exports.addDataReviewStatus = async (req, res) => {
    try {
        const { review_status_name, review_status_description, patient_services_id } = req.body;
        const { fullname } = req.user[0];

        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!review_status_name || !review_status_description || !patient_services_id) {
            return msg(res, 400, { message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        // Check ว่ามี review_status_name ซ้ำในระบบหรือไม่
        const checkReviewStatusNameResult = await checkReviewStatusName(review_status_name, fullname);
        if(checkReviewStatusNameResult) return msg(res, 409, { message: 'พบข้อมูล review_status_name ซ้ำในระบบกรุณาตรวจสอบข้อมูล!!' });

        // Check ว่ามี review_status_description ซ้ำในระบบหรือไม่
        const checkReviewStatusDescriptionResult = await checkReviewStatusDescription(review_status_description, fullname);
        if(checkReviewStatusDescriptionResult) return msg(res, 409, { message: 'พบข้อมูล review_status_description ซ้ำในระบบกรุณาตรวจสอบข้อมูล!!' });

        const checkPatientServicesIdResult = await checkPatientServicesId(patient_services_id, fullname);
        if(!checkPatientServicesIdResult) return msg(res, 404, { message: 'ไม่มีข้อมูลใน patient_services กรุณาเพิ่มข้อมูลก่อน!!' });

        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addReviewStatusDataResult = await addReviewStatusData(req.body, fullname);
        if (addReviewStatusDataResult) {
            return msg(res, 200, { message: 'บันทึกข้อมูลเสร็จสิ้น!' });
        } else {
            return msg(res, 400, { message: 'บันทึกข้อมูลไม่สำเร็จ!' });
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, { message: err.message }); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล ReviewStatus (ตารางเก็บสถานะการตรวจสอบ)
exports.updateDataReviewStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullname } = req.user[0];
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdReviewStatusDataResult = await checkIdReviewStatusData(id, fullname);
        if (!checkIdReviewStatusDataResult) return msg(res, 404, { message: 'ไม่มี (id ตารางเก็บสถานะการตรวจสอบ) อยู่ในระบบ!' });

        const { review_status_name, review_status_description, patient_services_id } = req.body;

        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!review_status_name || !review_status_description || !patient_services_id) {
            return msg(res, 400, { message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        // Check ว่ามี review_status_name ซ้ำในระบบหรือไม่
        const checkReviewStatusNameResult = await checkReviewStatusName(review_status_name, fullname);
        if(checkReviewStatusNameResult) return msg(res, 409, { message: 'พบข้อมูล review_status_name ซ้ำในระบบกรุณาตรวจสอบข้อมูล!!' });

        // Check ว่ามี review_status_description ซ้ำในระบบหรือไม่
        const checkReviewStatusDescriptionResult = await checkReviewStatusDescription(review_status_description, fullname);
        if(checkReviewStatusDescriptionResult) return msg(res, 409, { message: 'พบข้อมูล review_status_description ซ้ำในระบบกรุณาตรวจสอบข้อมูล!!' });

        const checkPatientServicesIdResult = await checkPatientServicesId(patient_services_id, fullname);
        if(!checkPatientServicesIdResult) return msg(res, 404, { message: 'ไม่มีข้อมูลใน patient_services กรุณาเพิ่มข้อมูลก่อน!!' });

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updateReviewStatusDataResult = await updateReviewStatusData(id, req.body, fullname);
        if (updateReviewStatusDataResult) {
            return msg(res, 200, { message: 'อัพเดทข้อมูลเสร็จสิ้น!' });
        } else {
            return msg(res, 400, { message: 'อัพเดทข้อมูลไม่สำเร็จ!' });
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, { message: err.message }); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
}

// ใช้สำหรับลบข้อมูล ReviewStatus (ตารางเก็บสถานะการตรวจสอบ)
exports.removeDataReviewStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullname } = req.user[0];
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdReviewStatusDataResult = await checkIdReviewStatusData(id, fullname);
        if (!checkIdReviewStatusDataResult) {
            return msg(res, 404, { message: 'ไม่มี (id ตารางเก็บสถานะการตรวจสอบ) อยู่ในระบบ!' });
        }

        const removeReviewStatusDataResult = await removeReviewStatusData(id, fullname);
        if (removeReviewStatusDataResult) {
            return msg(res, 200, { message: 'ลบข้อมูลเสร็จสิ้น!' });
        } else {
            return msg(res, 400, { message: 'ลบข้อมูลไม่สำเร็จ!' });
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, { message: err });
    }
}