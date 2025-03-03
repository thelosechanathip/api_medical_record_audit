const {
    fetchTypeSqlData,
    checkTypeSqlNameData,
    addTypeSqlData,
    checkIdTypeSqlData,
    updateTypeSqlData,
    removeTypeSqlData
} = require('../../models/setting/typeSqlModel');
const { msg } = require('../../utils/message');

// ใช้สำหรับดึงข้อมูล TypeSql (ตารางเก็บประเภทของการดำเนินการ SQL)
exports.getAllDataTypeSql = async(req, res) => {
    try {
        const fetchTypeSqlDataResult = await fetchTypeSqlData();
        if (!Array.isArray(fetchTypeSqlDataResult) || fetchTypeSqlDataResult.length === 0) {
            return msg(res, 404, { message: "No data found" });
        }
        return msg(res, 200, { data: fetchTypeSqlDataResult });
    } catch (error) {
        console.error("Error fetch data:", error.message);
        return msg(res, 500, { message: "Internal Server Error" });
    }
}

// ใช้สำหรับเพิ่มข้อมูล TypeSql (ตารางเก็บประเภทของการดำเนินการ SQL)
exports.addDataTypeSql = async (req, res) => {
    try {
        const { type_sql_name, created_by, updated_by } = req.body;

        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!type_sql_name || !created_by || !updated_by) {
            return msg(res, 400, { message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        // Check type_sql_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkTypeSqlNameDataResult = await checkTypeSqlNameData(type_sql_name);
        if (checkTypeSqlNameDataResult) {
            return msg(res, 400, { message: 'มี TypeSql (ตารางเก็บประเภทของการดำเนินการ SQL) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!' });
        }

        // เพิ่มข้อมูลลงในฐานข้อมูล
        const addTypeSqlDataResult = await addTypeSqlData(req.body);
        if (addTypeSqlDataResult) {
            return msg(res, 200, { message: 'บันทึกข้อมูลเสร็จสิ้น!' });
        } else {
            return msg(res, 400, { message: 'บันทึกข้อมูลไม่สำเร็จ!' });
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, { message: err.message }); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับอัพเดทข้อมูล TypeSql (ตารางเก็บประเภทของการดำเนินการ SQL)
exports.updateDataTypeSql = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdTypeSqlDataResult = await checkIdTypeSqlData(id);
        if (!checkIdTypeSqlDataResult) {
            return msg(res, 404, { message: 'ไม่มี (ตารางเก็บประเภทของการดำเนินการ SQL) อยู่ในระบบ!' });
        }

        const { type_sql_name, updated_by } = req.body;

        // Check ว่ามีการกรอกข้อมูลเข้ามาหรือไม่?
        if (!type_sql_name || !updated_by) {
            return msg(res, 400, { message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        // Check type_sql_name ว่ามีข้อมูลอยู่แล้วในระบบหรือไม่?
        const checkTypeSqlNameDataResult = await checkTypeSqlNameData(type_sql_name);
        if (checkTypeSqlNameDataResult) {
            return msg(res, 400, { message: 'มี TypeSql (ตารางเก็บประเภทของการดำเนินการ SQL) อยู่ในระบบแล้ว ไม่อนุญาตให้บันทึกข้อมูลซ้ำ!' });
        }

        // อัพเดทข้อมูลลงในฐานข้อมูล
        const updateTypeSqlDataResult = await updateTypeSqlData(id, req.body);
        if (updateTypeSqlDataResult) {
            return msg(res, 200, { message: 'อัพเดทข้อมูลเสร็จสิ้น!' });
        } else {
            return msg(res, 400, { message: 'อัพเดทข้อมูลไม่สำเร็จ!' });
        }
    } catch (err) {
        console.error(err.message);
        return msg(res, 500, { message: err.message }); // ส่งเฉพาะข้อความข้อผิดพลาด
    }
};

// ใช้สำหรับลบข้อมูล TypeSql( ตารางเก็บประเภทของการดำเนินการ SQL )
exports.removeDataTypeSql = async (req, res) => {
    try {
        const { id } = req.params;
        // Check ว่ามี ID นี้อยู่ในระบบหรือไม่?
        const checkIdTypeSqlDataResult = await checkIdTypeSqlData(id);
        if (!checkIdTypeSqlDataResult) {
            return msg(res, 404, { message: 'ไม่มี (ตารางเก็บประเภทของการดำเนินการ SQL) อยู่ในระบบ!' });
        }

        const removeTypeSqlDataResult = await removeTypeSqlData(id, req.body);
        if (removeTypeSqlDataResult) {
            return msg(res, 200, { message: 'ลบข้อมูลเสร็จสิ้น!' });
        } else {
            return msg(res, 400, { message: 'ลบข้อมูลไม่สำเร็จ!' });
        }
    }catch(err) {
        console.log(err);
        return msg(res, 500, { message: err });
    }
}