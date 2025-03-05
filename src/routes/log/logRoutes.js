const express = require('express');
const router = express.Router();
const { authAdminSetting } = require('../../middleware/auth/authAdmin');
const { removeDataLog, fetchDataLogContentOfMedicalRecords } = require('../../controllers/log/logController');

router.delete('/clearLog', authAdminSetting, removeDataLog)
router.get('/fetchDataLogContentOfMedicalRecords', authAdminSetting, fetchDataLogContentOfMedicalRecords)

module.exports = router;