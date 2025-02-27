const express = require('express');
const router = express.Router();
const { authCheckToken, authAdminSetting } = require('../../middleware/auth/authAdmin');
const { removeDataLog } = require('../../controllers/log/logController');

router.delete('/clearLog', authCheckToken, authAdminSetting, removeDataLog)

module.exports = router;