const express = require('express');
const router = express.Router();
const { authAdminSetting } = require('../../middleware/auth/authAdmin');
const { removeDataLog } = require('../../controllers/log/logController');

router.delete('/clearLog', authAdminSetting, removeDataLog)

module.exports = router;