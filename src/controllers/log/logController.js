const { clearLog, fetchDataLogContentOfMedicalRecordsAll } = require('../../models/log/logModel');
const { msg } = require('../../utils/message');

exports.removeDataLog = async(req, res) => {
    try {
        const clearLogData = await clearLog();
        if(clearLogData) return msg(res, 200, { message: "Clear log successfully!!" });
    } catch (error) {
        console.error("Error removeDataLog:", error.message);
        return msg(res, 500, { message: "Internal Server Error" });
    }
}

exports.fetchDataLogContentOfMedicalRecords = async(req, res) => {
    try {
        const fetchDataLogContentOfMedicalRecordsAllResult = await fetchDataLogContentOfMedicalRecordsAll();
        if (!Array.isArray(fetchDataLogContentOfMedicalRecordsAllResult) || fetchDataLogContentOfMedicalRecordsAllResult.length === 0) {
            return msg(res, 404, { message: "No data found!" });
        }
        return msg(res, 200, { data: fetchDataLogContentOfMedicalRecordsAllResult });
    } catch (error) {
        console.error("Error fetchDataLogContentOfMedicalRecords:", error.message);
        return msg(res, 500, { message: "Internal Server Error" });
    }
}