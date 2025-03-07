const {
    fetchReviewStatusCommentData,
    checkReviewStatusCommentName,
    checkReviewStatusId,
    addReviewStatusCommentData,
    checkIdReviewStatusCommentData,
    updateReviewStatusCommentData,
    removeReviewStatusCommentData
} = require('../../models/setting/reviewStatusCommentModel');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล ReviewStatusComment (ตารางเก็บข้อมูล Comment เพิ่มเติมของสถานะการตรวจสอบ)
exports.getAllDataReviewStatusComment = async (req, res) => {
    try {
        const { fullname } = req.user[0];
        const fetchReviewStatusCommentDataResult = await fetchReviewStatusCommentData(fullname);
        if (!Array.isArray(fetchReviewStatusCommentDataResult) || fetchReviewStatusCommentDataResult.length === 0) {
            return msg(res, 404, { message: "No data found" });
        }
        return msg(res, 200, { data: fetchReviewStatusCommentDataResult });
    } catch (error) {
        console.error("Error fetch data:", error.message);
        return msg(res, 500, { message: "Internal Server Error" });
    }
}

// ใช้สำหรับเพิ่มข้อมูล ReviewStatusComment (ตารางเก็บข้อมูล Comment เพิ่มเติมของสถานะการตรวจสอบ)
exports.addDataReviewStatusComment = async (req, res) => {
    try {
        const { review_status_comment_name, review_status_id } = req.body;
        const { fullname } = req.user[0];

        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!review_status_comment_name || !review_status_id) {
            return msg(res, 400, { message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        // Check ว่ามี review_status_comment_name ซ้ำในระบบหรือไม่
        const checkReviewStatusCommentNameResult = await checkReviewStatusCommentName(review_status_comment_name, fullname);
        if(checkReviewStatusCommentNameResult) return msg(res, 409, { message: 'พบข้อมูล review_status_comment_name ซ้ำในระบบกรุณาตรวจสอบข้อมูล!!' });

        const checkReviewStatusIdResult = await checkReviewStatusId(review_status_id, fullname);
        if(!checkReviewStatusIdResult) return msg(res, 404, { message: 'ไม่มีข้อมูลใน review_status กรุณาเพิ่มข้อมูลก่อน!!' });

        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addReviewStatusCommentDataResult = await addReviewStatusCommentData(req.body, fullname);
        if (addReviewStatusCommentDataResult) {
            return msg(res, 200, { message: 'บันทึกข้อมูลเสร็จสิ้น!' });
        } else {
            return msg(res, 400, { message: 'บันทึกข้อมูลไม่สำเร็จ!' });
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, { message: err.message }); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล ReviewStatusComment (ตารางเก็บข้อมูล Comment เพิ่มเติมของสถานะการตรวจสอบ)
exports.updateDataReviewStatusComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullname } = req.user[0];
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdReviewStatusCommentDataResult = await checkIdReviewStatusCommentData(id, fullname);
        if (!checkIdReviewStatusCommentDataResult) return msg(res, 404, { message: 'ไม่มี (id ตารางเก็บข้อมูล Comment เพิ่มเติมของสถานะการตรวจสอบ) อยู่ในระบบ!' });

        const { review_status_comment_name, review_status_id } = req.body;

        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!review_status_comment_name || !review_status_id) {
            return msg(res, 400, { message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        // Check ว่ามี review_status_comment_name ซ้ำในระบบหรือไม่
        const checkReviewStatusCommentNameResult = await checkReviewStatusCommentName(review_status_comment_name, fullname);
        if(checkReviewStatusCommentNameResult) return msg(res, 409, { message: 'พบข้อมูล review_status_comment_name ซ้ำในระบบกรุณาตรวจสอบข้อมูล!!' });

        const checkReviewStatusIdResult = await checkReviewStatusId(review_status_id, fullname);
        if(!checkReviewStatusIdResult) return msg(res, 404, { message: 'ไม่มีข้อมูลใน review_status กรุณาเพิ่มข้อมูลก่อน!!' });

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updateReviewStatusCommentDataResult = await updateReviewStatusCommentData(id, req.body, fullname);
        if (updateReviewStatusCommentDataResult) {
            return msg(res, 200, { message: 'อัพเดทข้อมูลเสร็จสิ้น!' });
        } else {
            return msg(res, 400, { message: 'อัพเดทข้อมูลไม่สำเร็จ!' });
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, { message: err.message }); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
}

// ใช้สำหรับลบข้อมูล ReviewStatusComment (ตารางเก็บข้อมูล Comment เพิ่มเติมของสถานะการตรวจสอบ)
exports.removeDataReviewStatusComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullname } = req.user[0];
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdReviewStatusCommentDataResult = await checkIdReviewStatusCommentData(id, fullname);
        if (!checkIdReviewStatusCommentDataResult) {
            return msg(res, 404, { message: 'ไม่มี (id ตารางเก็บข้อมูล Comment เพิ่มเติมของสถานะการตรวจสอบ) อยู่ในระบบ!' });
        }

        const removeReviewStatusCommentDataResult = await removeReviewStatusCommentData(id, fullname);
        if (removeReviewStatusCommentDataResult) {
            return msg(res, 200, { message: 'ลบข้อมูลเสร็จสิ้น!' });
        } else {
            return msg(res, 400, { message: 'ลบข้อมูลไม่สำเร็จ!' });
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, { message: err });
    }
}