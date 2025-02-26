const { clearLog } = require('../../models/log/logModel');
const { msg } = require('../../utils/message');

exports.removeDataLog = async(req, res) => {
    try {
        const clearLogData = await clearLog();
        if(clearLogData) return msg(res, 200, { message: "Clear log successfully!!" });
    } catch(err) {
        console.log(err);
        return msg(res, 500, { message: err });
    }
}