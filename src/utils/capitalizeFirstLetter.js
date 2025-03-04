// Function ในการแปลงข้อมูลให้ตัวนำหน้าที่เป็นภาษาอังกฤษเป็นตัวพิมพ์ใหญ่
exports.capitalizeFirstLetter = async(string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}